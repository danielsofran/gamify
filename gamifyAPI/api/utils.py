import datetime
from typing import Dict

import pytz
from gamifyAPI import settings
from . import models


def check_condition(nr_quests: Dict[str, int], badge: models.Badge) -> bool:
    rez = True
    if badge.min_quests > 0: rez = rez and badge.min_quests <= nr_quests['all']
    if badge.min_easy_quests > 0: rez = rez and badge.min_easy_quests <= nr_quests['easy']
    if badge.min_medium_quests > 0: rez = rez and badge.min_medium_quests <= nr_quests['medium']
    if badge.min_hard_quests > 0: rez = rez and badge.min_hard_quests <= nr_quests['hard']
    return rez


def update_badges(employee: models.Employee):
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
    return sum(solved_quest.points for solved_quest in models.SolvedQuest.objects.filter(employee__id=employee.id))
