import datetime
import json

from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone

from api import models, utils
from auth2.utils import add_time_zone, get_current_time
from gamifyAPI.settings import TIME_ZONE
from api.models import QuestDifficulty


# Create your views here.
def add_quest(request):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        title = data.get('title')
        description = data.get('description')
        if title is None or description is None:
            return JsonResponse({'error': "Missing fields"}, status=400)
        difficulty = data.get('difficulty')
        if difficulty is None:
            return JsonResponse({'error': "Missing fields"}, status=400)
        datetime_start = data.get('datetime_start')
        datetime_end = data.get('datetime_end')
        if datetime_start is None or datetime_end is None:
            return JsonResponse({'error': "Missing fields"}, status=400)
        max_winners = data.get('max_winners')
        if max_winners is None:
            return JsonResponse({'error': "Missing fields"}, status=400)
        if max_winners < 1:
            return JsonResponse({'error': "Wrong max_winners"}, status=400)
        tokens = data.get('tokens')
        if tokens is None:
            return JsonResponse({'error': "Missing fields"}, status=400)
        if tokens < 1:
            return JsonResponse({'error': "Wrong tokens"}, status=400)

        if user.is_employee:
            remaining_tokens = user.employee.tokens
            quests = [quest for quest in models.Quest.objects.filter(author=user)]
            tokens_quests_proposed = sum(quest.tokens*quest.max_winners for quest in quests)
            tokens_already_paid = 0
            for quest in quests:  # quests proposed by user
                nr_solvers_quest = models.SolvedQuest.objects.filter(employee__id=user.employee.id).count()
                tokens_already_paid += quest.tokens * nr_solvers_quest
            remaining_tokens -= tokens_quests_proposed
            remaining_tokens += tokens_already_paid
            if tokens * max_winners > remaining_tokens:
                return JsonResponse({'error': "Not enough tokens"}, status=420)

        try:
            models.Quest.objects.create(
                author=user,
                title=title,
                description=description,
                difficulty=difficulty,
                datetime_start=datetime_start,
                datetime_end=datetime_end,
                max_winners=max_winners,
                tokens=tokens)
        except Exception as e:
            print(e)
            return JsonResponse({'error': "Error creating quest"}, status=500)
        return JsonResponse({'status': 'ok'}, status=201)
    return JsonResponse({'error': "Wrong HTTP method"}, status=405)

# Later TODO: check if the remaining tokens are greater
#  than the intem purchased in the shop

def quest(request, id):
    if request.method == 'DELETE':  # TODO: returneaza banii
        try: quest = models.Quest.objects.get(id=id)
        except: return JsonResponse({'error': "Quest not found"}, status=404)
        if not request.user.is_CEO or request.user != quest.author:
            return JsonResponse({'error': "User not authorized"}, status=401)

        # returnez banii autorului
        author = quest.author
        solvers = models.SolvedQuest.objects.filter(quest__id=quest.id)
        if not author.is_CEO:
            author.employee.tokens += quest.tokens * solvers.count()
            author.employee.save()
        solvers.delete()

        # delete the quest
        try: quest.delete()
        except: return JsonResponse({'error': "Error deleting quest"}, status=500)
        return JsonResponse({'status': 'ok'}, status=200)
    elif request.method == 'GET':
        try: quest = models.Quest.objects.get(id=id)
        except: return JsonResponse({'error': "Quest not found"}, status=404)
        data = quest.serialize()
        solvers = models.SolvedQuest.objects.filter(quest__id=quest.id)
        data['no_of_winners'] = solvers.count()
        if not request.user.is_CEO:
            # data['solved'] = False
            # for solved_quest in solvers:
            #     if solved_quest.employee.user.id == request.user.id:
            #         data['solved'] = True
            #         break
            data['solved'] = True
            try: solvers.get(employee__user__id=request.user.id)
            except: data['solved'] = False
        return JsonResponse(data, status=200)
    elif request.method == 'POST':
        quest_id = request.POST['quest_id']
        quest = models.Quest.objects.get(id=quest_id)
        author = quest.author
        employee = request.user.employee

        # checks
        if request.user.is_CEO:
            return JsonResponse({'error': 'CEO can not attend quests'}, status=403)
        if quest.author.id == request.user.id:
            return JsonResponse({'error': 'Can not attend to own quest'}, status=403)
        if timezone.now() > quest.datetime_end:
            return JsonResponse({'error': 'Attended too late'}, status=403)
        if not author.is_CEO and author.employee.tokens < quest.tokens:
            print("TOKEN ERROR")
            return JsonResponse({'error': 'Insufficient tokens'}, status=500)
        solvers = models.SolvedQuest.objects.filter(quest__id=quest.id)
        if solvers.count() >= quest.max_winners:
            return JsonResponse({'error': 'Max number of winners reached!'}, status=400)
        if solvers.filter(employee__id=request.user.employee.id).count() > 0:
            return JsonResponse({'error': 'Quest already solved!'}, status=401)

        # update tokens of author and winner
        if not author.is_CEO:
            author.employee.tokens -= quest.tokens
            author.employee.save()
        employee.tokens += quest.tokens
        employee.save()

        # create solved quest object
        try: solved_quest=models.SolvedQuest.objects.create(quest=quest, employee=employee)
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': "Can not create solved quest"}, status=401)

        # update badges
        utils.update_badges(employee)

        # save proofs
        for image_name in request.FILES:
            image = request.FILES[image_name]
            try: models.Image.objects.create(solved_quest=solved_quest, image=image)
            except Exception as ex:
                print(ex)
                return JsonResponse({'error': "Can not save image "+image_name}, status=401)
        return JsonResponse({'status': 'ok'}, status=201)
    return JsonResponse({'error': "Wrong HTTP method"}, status=405)


def get_quests(request):
    if request.method != 'GET':
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)
    quests = []
    for quest in models.Quest.objects.all():
        data = quest.serialize()
        solvers = models.SolvedQuest.objects.filter(quest__id=quest.id)
        data['no_of_winners'] = solvers.count()
        data['solved'] = True
        try: solvers.get(employee__user__id=request.user.id)
        except: data['solved'] = False
        quests.append(data)
    return JsonResponse(quests, safe=False, status=200)


def get_quest_solvers(request, id: int):
    if request.method != 'GET':
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)
    solvers = models.SolvedQuest.objects.filter(quest__id=id).order_by('date_solved')
    solvers = [solver.employee.user.serialize() for solver in solvers]
    return JsonResponse(solvers, safe=False, status=200)


def leaderboard(request):  # all employees in the order of points
    rez = []
    for employee in models.Employee.objects.all():
        points = utils.employee_points(employee)
        data = {'employee': employee.user.serialize(), 'points': points}
        rez.append(data)
    rez.sort(key=lambda x: x['points'], reverse=True)
    return JsonResponse(rez, safe=False, status=200)


def reward(request, id):
    if request.method == 'POST':
        if not request.user.is_CEO:
            return JsonResponse({'error', "Unauthorized"}, status=403)
        try: employee = models.OwnUser.objects.get(id=id).employee
        except: return JsonResponse({'error': "The employee does not exist"})
        tokens = json.loads(request.body).get('tokens')

        employee.tokens += tokens
        try: employee.save()
        except: return JsonResponse({'error': "Tokens can not be added"}, status=500)

        return JsonResponse({'status': 'ok'}, status=201)
    return JsonResponse({'error', 'Wrong HTTP method'}, status=405)


def get_tokens(request, type: int):
    if request.method == "GET":
        if request.user.is_CEO:
            return JsonResponse({'error': 'CEO does not need to calculate tokens'}, status=403)
        employee = request.user.employee
        fixed_amount = int(request.GET['fixed_amount'])
        percentage = int(request.GET['percentage'])
        if type == 0:  # Salary increase
            req = models.SalaryIncreaseRequest(
                user=request.user,
                fixed_amount=fixed_amount,
                percentage=percentage
            )
            return JsonResponse({'tokens': req.tokens}, status=200)
        return JsonResponse({'error': 'Wrong request type'}, status=400)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)