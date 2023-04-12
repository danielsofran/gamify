import datetime
import json

from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone

from api import models, utils, settings
from auth2.utils import add_time_zone, get_current_time
from gamifyAPI.settings import TIME_ZONE
from api.models import QuestDifficulty


# Create your views here.
def add_quest(request):
    """
    add a quest
    :param request: 
    :return:
    :status 201: ok, created
    :status 400: validation error
    :status 420: not enough tokens
    :status 500: server error
    :status 405: wrong HTTP method, POST expected
    """
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
            # remaining_tokens = user.employee.tokens
            # quests = [quest for quest in models.Quest.objects.filter(author=user)]
            # tokens_quests_proposed = sum(quest.tokens*quest.max_winners for quest in quests)
            # tokens_already_paid = 0
            # for quest in quests:  # quests proposed by user
            #     nr_solvers_quest = models.SolvedQuest.objects.filter(employee__id=user.employee.id).count()
            #     tokens_already_paid += quest.tokens * nr_solvers_quest
            # remaining_tokens -= tokens_quests_proposed
            # remaining_tokens += tokens_already_paid
            # if tokens * max_winners > remaining_tokens:
            if utils.remaining_tokens(user.employee) < tokens * max_winners:
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


def quest(request, id):
    """
    method GET: get quest details
    method DELETE: delete quest, and return tokens to author
    method POST: solve quest
    :param request: 
    :param id: the quest id
    :return: or error, or quest details, respectively
    :status 200: ok, quest details
    :status 201: ok, solved quest
    :status 204: ok, deleted
    :status 401: user not authorized / quest already solved
    :status 404: quest not found
    :status 405: wrong HTTP method
    :status 403: CEO can not attend quests
    :status 500: server error
    """
    if request.method == 'DELETE':
        try: quest = models.Quest.objects.get(id=id)
        except: return JsonResponse({'error': "Quest not found"}, status=404)
        if not request.user.is_CEO and request.user.id != quest.author.id:
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
        return JsonResponse({'status': 'ok'}, status=204)
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
    elif request.method == 'POST':  # solve quest
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
        if author.is_employee and author.employee.tokens < quest.tokens:
            print("TOKEN ERROR")
            return JsonResponse({'error': 'Insufficient tokens'}, status=500)
        solvers = models.SolvedQuest.objects.filter(quest__id=quest.id)
        if solvers.count() >= quest.max_winners:
            return JsonResponse({'error': 'Max number of winners reached!'}, status=400)
        if solvers.filter(employee__id=request.user.employee.id).count() > 0:
            return JsonResponse({'error': 'Quest already solved!'}, status=401)

        # update tokens of author and winner
        if author.is_employee:
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
    """
    method GET: get all quests
    :param request: 
    :return: an array of serialized quests
    :status 200: ok
    :status 405: wrong HTTP method
    """
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
    """
    method GET: get all solvers of a quest
    :param request: 
    :param id: the id of the quest
    :return: an array of serialized users, sorted by date solved
    :status 200: ok
    :status 405: wrong HTTP method
    """
    if request.method != 'GET':
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)
    solvers = models.SolvedQuest.objects.filter(quest__id=id).order_by('datetime_solved')
    solvers = [solver.employee.user.serialize() for solver in solvers]
    return JsonResponse(solvers, safe=False, status=200)


def leaderboard(request):  # all employees in the order of points
    """
    method GET: get all employees sorted by points of all quests solved
    :param request: 
    :return: an array of serialized users, sorted by points
    :status 200: ok
    """
    rez = []
    for employee in models.Employee.objects.all():
        points = utils.employee_points(employee)
        data = {'employee': employee.user.serialize(), 'points': points}
        rez.append(data)
    rez.sort(key=lambda x: x['points'], reverse=True)
    return JsonResponse(rez, safe=False, status=200)


def reward(request, id):
    """
    method POST: reward an employee with tokens
    :param request: 
    :param id: the id of the employee
    :return:
    :status 201: ok, tokens added
    :status 403: unauthorized, only CEO can reward
    :status 405: wrong HTTP method
    :status 500: internal server error
    """
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
    """
    method GET: get the number of tokens that will be rewarded for a request that has not been made yet
    :param request: 
    :param type: the type of the request, can be SALARY_INCREASE(0) or FREE_DAYS(1) or CAREER_DEVELOPMENT(2)
    :return: the number of tokens
    :status 200: ok
    :status 400: type or fields are not valid
    :status 403: unauthorized, only employees can calculate tokens
    :status 405: wrong HTTP method

    """
    if request.method == "GET":
        if request.user.is_CEO:
            return JsonResponse({'error': 'CEO does not need to calculate tokens'}, status=403)
        if type == models.RewardType.SALARY_INCREASE:
            fixed_amount = int(request.GET['fixed_amount'])
            percentage = int(request.GET['percentage'])
            req = models.SalaryIncreaseRequest(
                user=request.user,
                fixed_amount=fixed_amount,
                percentage=percentage
            )
            return JsonResponse({'tokens': req.tokens}, status=200)
        elif type == models.RewardType.FREE_DAYS:
            datetime_start = str(request.GET['datetime_free_days_start'])
            datetime_end = str(request.GET['datetime_free_days_end'])
            try:
                datetime_start = datetime.datetime.fromisoformat(datetime_start)
                datetime_end = datetime.datetime.fromisoformat(datetime_end)
            except Exception as ex:
                print(ex)
                return JsonResponse({'error': 'Wrong dates'}, status=400)
            if datetime_start.date() > datetime_end.date():
                return JsonResponse({'error': 'Wrong date order'}, status=400)
            req = models.FreeDaysRequest(
                user=request.user,
                date_free_days_start=datetime_start,
                date_free_days_end=datetime_end,
            )
            return JsonResponse({'tokens': req.tokens}, status=200)
        elif type == models.RewardType.CAREER_DEVELOPMENT:
            try: position = models.EmployeePosition(int(request.GET['position']))
            except Exception as ex:
                print(ex)
                return JsonResponse({'error': 'Wrong position'}, status=400)
            req = models.CareerDevelopmentRequest(
                user=request.user,
                position_requested=position
            )
            return JsonResponse({'tokens': req.tokens}, status=200)
        return JsonResponse({'error': 'Wrong request type'}, status=400)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)


def requests(request, type: int):
    """
    method GET: get all requests of a type
    :param request:
    :param type: the type of the request, can be SALARY_INCREASE(0) or FREE_DAYS(1) or CAREER_DEVELOPMENT(2)
    :return: an array of serialized requests
    :status 200: ok
    :status 400: type is not valid
    :status 405: wrong HTTP method
    """
    if request.method == "GET":
        try: requests = utils.get_requests(type, request.user)
        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        requests = [req.serialize() for req in requests]
        return JsonResponse(requests, safe=False, status=200)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)


def add_salary_increase_request(request):
    """
    method POST: add a salary increase request
    :param request:
    :return:
    :status 201: ok, request added
    :status 400: invalid fields
    :status 403: unauthorized, only employees can add requests
    :status 405: wrong HTTP method
    :status 500: internal server error
    """
    if request.method == "POST":
        if request.user.is_CEO:
            return JsonResponse({'error': 'CEO does not need to add any request'}, status=403)
        employee = request.user.employee
        data=json.loads(request.body)
        description = data.get('description')
        fixed_amount = data.get('fixed_amount')
        percentage = data.get('percentage')
        req = models.SalaryIncreaseRequest(
            user=request.user,
            description=description,
            fixed_amount=fixed_amount,
            percentage=percentage,
        )
        if req.tokens > utils.remaining_tokens(employee):
            return JsonResponse({'error': 'Insufficient tokens'}, status=400)
        if req.salary_increase == 0:
            return JsonResponse({'error': 'No salary increase'}, status=400)
        try: req.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': 'Can not save request'}, status=500)
        employee.tokens -= req.tokens
        try: employee.save()
        except Exception as ex:
            print(ex)
            req.delete()
            return JsonResponse({'error': 'Can not update employee tokens'}, status=500)

        return JsonResponse({'status': 'ok'}, status=201)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)


def add_free_days_request(request):
    """
    method POST: add a free days request
    :param request:
    :return:
    :status 201: ok, request added
    :status 400: invalid fields
    :status 403: unauthorized, only employees can add requests
    :status 405: wrong HTTP method
    :status 500: internal server error
    """
    if request.method == "POST":
        if request.user.is_CEO:
            return JsonResponse({'error': 'CEO does not need to add any request'}, status=403)
        employee = request.user.employee
        data=json.loads(request.body)
        description = data.get('description')
        datetime_start = data.get('datetime_free_days_start')
        datetime_end = data.get('datetime_free_days_end')
        try:
            datetime_start = datetime.datetime.fromisoformat(datetime_start)
            datetime_end = datetime.datetime.fromisoformat(datetime_end)
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': 'Wrong dates'}, status=400)
        if datetime_start.date() > datetime_end.date():
            return JsonResponse({'error': 'Wrong date order'}, status=400)
        req = models.FreeDaysRequest(
            user=request.user,
            description=description,
            date_free_days_start=datetime_start,
            date_free_days_end=datetime_end,
        )
        if req.tokens > utils.remaining_tokens(employee):
            return JsonResponse({'error': 'Insufficient tokens'}, status=400)
        try: req.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': 'Can not save request'}, status=500)
        employee.tokens -= req.tokens
        try: employee.save()
        except Exception as ex:
            print(ex)
            req.delete()
            return JsonResponse({'error': 'Can not update employee tokens'}, status=500)
        return JsonResponse({'status': 'ok'}, status=201)

    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)


def add_career_development_request(request):
    """
    method POST: add a career development request
    :param request:
    :return:
    :status 201: ok, request added
    :status 400: invalid fields
    :status 403: unauthorized, only employees can add requests
    :status 405: wrong HTTP method
    :status 500: internal server error
    """
    if request.method == "POST":
        if request.user.is_CEO:
            return JsonResponse({'error': 'CEO does not need to add any request'}, status=403)
        employee = request.user.employee
        data=json.loads(request.body)
        description = data.get('description')
        try: position = models.EmployeePosition(int(data.get('position')))
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': 'Wrong position'}, status=400)
        if position <= employee.position:
            return JsonResponse({'error': 'Can not request career retrogradation'}, status=400)
        req = models.CareerDevelopmentRequest(
            user=request.user,
            description=description,
            position_requested=position,
        )
        if req.tokens > utils.remaining_tokens(employee):
            return JsonResponse({'error': 'Insufficient tokens'}, status=400)
        try: req.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': 'Can not save request'}, status=500)
        employee.tokens -= req.tokens
        try: employee.save()
        except Exception as ex:
            print(ex)
            req.delete()
            return JsonResponse({'error': 'Can not update employee tokens'}, status=500)
        return JsonResponse({'status': 'ok'}, status=201)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)


def process_request(request, type: int, id: int):
    """
    method POST: accept a request
    method DELETE: reject a request
    :param request:
    :param type: the type of the request, one of the RewardType enum
    :param id: the id of the request
    :return:
    :status 201: ok, request processed
    :status 400: invalid fields
    :status 403: unauthorized, only CEO can process requests
    :status 405: wrong HTTP method
    :status 500: internal server error
    """
    if request.method == "POST":
        if not request.user.is_CEO:
            return JsonResponse({'error': 'Only CEO can process requests'}, status=403)
        try: req = utils.get_request(type, id)
        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        if req.state != models.RequestStatus.PENDING:
            return JsonResponse({'error': 'Request is not pending'}, state=400)
        req.state = models.RequestStatus.ACCEPTED
        try: req.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': 'Can not save request'}, status=500)
        if type == models.RewardType.SALARY_INCREASE:
            employee = req.user.employee
            employee.salary += req.salary_increase
            try: employee.save()
            except Exception as ex:
                print(ex)
                req.state = models.RequestStatus.PENDING
                req.save()
                return JsonResponse({'error': 'Can not update employee salary'}, status=500)
        elif type == models.RewardType.CAREER_DEVELOPMENT:  # Career development
            employee = req.user.employee
            employee.position = req.position_requested
            try: employee.save()
            except Exception as ex:
                print(ex)
                req.state = models.RequestStatus.PENDING
                req.save()
                return JsonResponse({'error': 'Can not update employee position'}, status=500)
        return JsonResponse({'status': 'ok'}, status=200)
    elif request.method == "DELETE":
        try: req = utils.get_request(type, id)
        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        if req.state != models.RequestStatus.PENDING:
            return JsonResponse({'error': 'Request is not pending'}, status=400)
        if not request.user.is_CEO:
            if req.user.id != request.user.id:
                return JsonResponse({'error': 'You can\'t withdraw the requests of other employees'}, status=403)
            tokens = req.tokens
            employee = req.user.employee
            employee.tokens += tokens
            try: employee.save()
            except Exception as ex:
                print(ex)
                return JsonResponse({'error': 'Can not update employee tokens'}, status=500)
            try: req.delete()
            except Exception as ex:
                print(ex)
                employee.tokens -= tokens
                employee.save()
                return JsonResponse({'error': 'Can not delete request'}, status=500)
            return JsonResponse({'status': 'ok'}, status=200)
        elif request.user.is_CEO:
            req.state = models.RequestStatus.REJECTED
            tokens = req.tokens
            employee = req.user.employee
            employee.tokens += round(tokens * settings.TOKENS_BACK_AFTER_REJECTION)
            try: employee.save()
            except Exception as ex:
                print(ex)
                return JsonResponse({'error': 'Can not update employee tokens'}, status=500)
            try: req.save()
            except Exception as ex:
                print(ex)
                employee.tokens -= round(tokens * settings.TOKENS_BACK_AFTER_REJECTION)
                employee.save()
                return JsonResponse({'error': 'Can not save request'}, status=500)
            return JsonResponse({'status': 'ok'}, status=200)
        return JsonResponse({'status': 'ok'}, status=200)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)
