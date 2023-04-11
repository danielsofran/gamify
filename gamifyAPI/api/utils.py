import datetime
from typing import Dict

from django.utils import timezone

import pytz
from gamifyAPI import settings
from . import models


def check_condition(nr_quests: Dict[str, int], badge: models.Badge) -> bool:
    """
    Check if the employee has enough solved quests to get the badge
    :param nr_quests: the number of solved quests for each difficulty
    :param badge: the badge to check
    :return: the result of the check
    """
    rez = True
    if badge.min_quests > 0: rez = rez and badge.min_quests <= nr_quests['all']
    if badge.min_easy_quests > 0: rez = rez and badge.min_easy_quests <= nr_quests['easy']
    if badge.min_medium_quests > 0: rez = rez and badge.min_medium_quests <= nr_quests['medium']
    if badge.min_hard_quests > 0: rez = rez and badge.min_hard_quests <= nr_quests['hard']
    return rez


def update_badges(employee: models.Employee):
    """
    Update the badges of an employee in the database, based on the number of solved quests
    :param employee: the employee to update
    :return: None
    """
    solved_quests = models.SolvedQuest.objects.filter(employee__id=employee.id)
    nr_quests = {
        'all': solved_quests.count(),
        'easy': solved_quests.filter(quest__difficulty=models.QuestDifficulty.EASY).count(),
        'medium': solved_quests.filter(quest__difficulty=models.QuestDifficulty.MEDIUM).count(),
        'hard': solved_quests.filter(quest__difficulty=models.QuestDifficulty.HARD).count(),
    }

    changed = False
    for badge in models.Badge.objects.all():
        if badge not in employee.badges.all() and check_condition(nr_quests, badge):
            employee.badges.add(badge)
            changed = True
        elif badge in employee.badges.all() and not check_condition(nr_quests, badge):
            employee.badges.remove(badge)
            changed = True
    if changed:
        employee.save()


def employee_points(employee: models.Employee):
    """
    Get the number of points of an employee
    :param employee: the employee to get the points from
    :return: the number of points of the employee based on the number of solved quests and their difficulty
    """
    return sum(solved_quest.points for solved_quest in models.SolvedQuest.objects.filter(employee__id=employee.id))


def get_requests(type: int, user: models.OwnUser):
    """
    Get all the requests of a certain type that are made by the user
    :param type: the type of the requests
    :param user: the user that made the requests
    :return: QuerySet of the requests
    :raise ValueError: if the type is invalid or the user is not an employee or a CEO
    """
    if type == models.RewardType.SALARY_INCREASE: model = models.SalaryIncreaseRequest
    elif type == models.RewardType.FREE_DAYS: model = models.FreeDaysRequest
    elif type == models.RewardType.CAREER_DEVELOPMENT: model = models.CareerDevelopmentRequest
    else: raise ValueError('Invalid request type')

    if user.is_employee: return model.objects.filter(user__id=user.id)
    elif user.is_CEO: return model.objects.all()
    else: raise ValueError('Invalid user type')


def get_request(type: int, id: int):
    """
    Get a request of a certain type with a certain id
    :param type: the type of the request
    :param id: the id of the request
    :return: the request, if it exists
    :raise ValueError: if the type is invalid or the request does not exist
    """
    if type == models.RewardType.SALARY_INCREASE: model = models.SalaryIncreaseRequest
    elif type == models.RewardType.FREE_DAYS: model = models.FreeDaysRequest
    elif type == models.RewardType.CAREER_DEVELOPMENT: model = models.CareerDevelopmentRequest
    else: raise ValueError('Invalid request type')

    try: return model.objects.get(id=id)
    except model.DoesNotExist: raise ValueError('Invalid request id')


def remaining_tokens(employee: models.Employee):
    """
    Get the remaining tokens of an employee
    This calculates the number of tokens needed to reward the employees that will possibly solve the quests proposed by him
    :param employee: the employee to get the remaining tokens from
    :return: the remaining tokens of the employee
    """
    tokens = employee.tokens
    quests = models.Quest.objects.filter(author__id=employee.user.id)
    for quest in quests:
        nr_solved_quests = models.SolvedQuest.objects.filter(quest__id=quest.id, quest__datetime_end__gt=timezone.datetime.now()).count()
        tokens -= quest.tokens * (quest.max_winners - nr_solved_quests)
    return tokens
