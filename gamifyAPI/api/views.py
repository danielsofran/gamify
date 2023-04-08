import json

from django.http import JsonResponse
from django.shortcuts import render

from api import models
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
            tokens_quests_proposed = sum(quest.tokens*quest.max_winners for quest in models.Quest.objects.filter(author=user))
            print(f"User {user.username} has {remaining_tokens} tokens, and has proposed {tokens_quests_proposed} tokens in quests")
            remaining_tokens -= tokens_quests_proposed
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


def quest(request, id):
    if request.method == 'DELETE':
        try:
            quest = models.Quest.objects.get(id=id)
        except:
            return JsonResponse({'error': "Quest not found"}, status=404)
        if not request.user.is_CEO or request.user != quest.author:
            return JsonResponse({'error': "User not authorized"}, status=401)
        try:
            quest.delete()
        except:
            return JsonResponse({'error': "Error deleting quest"}, status=500)
        return JsonResponse({'status': 'ok'}, status=200)
    elif request.method == 'GET':
        try:
            quest = models.Quest.objects.get(id=id)
        except:
            return JsonResponse({'error': "Quest not found"}, status=404)
        data = quest.serialize()
        no_solvers = models.SolvedQuest.objects.filter(quest__id=quest.id).count()
        data['no_of_winners'] = no_solvers
        return JsonResponse(data, status=200)
    return JsonResponse({'error': "Wrong HTTP method"}, status=405)


def get_quests(request):
    if request.method != 'GET':
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)
    quests = []
    for quest in models.Quest.objects.all():
        data = quest.serialize()
        no_solvers = models.SolvedQuest.objects.filter(quest__id=quest.id).count()
        data['no_of_winners'] = no_solvers
        quests.append(data)
    return JsonResponse(quests, safe=False, status=200)


def get_quest_solvers(request, id: int):
    if request.method != 'GET':
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)
    solvers = models.SolvedQuest.objects.filter(quest__id=id)
    solvers = [solver.employee.user.serialize() for solver in solvers]
    return JsonResponse(solvers, safe=False, status=200)
