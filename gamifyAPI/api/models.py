import datetime

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from auth2.models import OwnUser, Employee, EmployeePosition
from . import settings


# Create your models here.
class Badge(models.Model):
    """
    Badge model

    :param name: the name of the badge
    :param description: the description of the badge
    :param image: the image of the badge
    :param min_quests: the minimum number of quests the employee must complete to get the badge
    :param min_easy_quests: the minimum number of easy quests the employee must complete to get the badge
    :param min_medium_quests: the minimum number of medium quests the employee must complete to get the badge
    :param min_hard_quests: the minimum number of hard quests the employee must complete to get the badge
    """
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='media/')
    min_quests = models.PositiveIntegerField(default=1)
    min_easy_quests = models.PositiveIntegerField(default=1)
    min_medium_quests = models.PositiveIntegerField(default=0)
    min_hard_quests = models.PositiveIntegerField(default=0)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image': self.image.url if self.image else None,
        }

    def __str__(self):
        return self.name


class QuestDifficulty(models.TextChoices):
    EASY = 'E', 'Easy'
    MEDIUM = 'M', 'Medium'
    HARD = 'H', 'Hard'

    @property
    def tokens(self):
        return settings.TOKEN_POINTS[self]


class Quest(models.Model):
    """
    Quest model

    :param author: the author of the quest
    :param title: the title of the quest
    :param difficulty: the difficulty of the quest
    :param description: the description of the quest
    :param datetime_start: the start date and time of the quest
    :param datetime_end: the end date and time of the quest
    :param max_winners: the maximum number of winners of the quest
    :param tokens: the number of tokens the quest gives to one winner
    """
    author = models.ForeignKey(OwnUser, on_delete=models.SET_NULL, null=True, blank=False)
    title = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=1, choices=QuestDifficulty.choices)
    description = models.CharField(max_length=1000)
    datetime_start = models.DateTimeField(default=datetime.datetime.now())
    datetime_end = models.DateTimeField(default=datetime.datetime.now())
    max_winners = models.PositiveIntegerField(default=1)
    tokens = models.PositiveIntegerField(default=0)

    @property
    def points(self):
        return settings.TOKEN_POINTS[self.difficulty]

    def serialize(self):
        return {
            'id': self.id,
            'author': None if self.author is None else self.author.serialize(),
            'title': self.title,
            'difficulty': self.difficulty,
            'description': self.description,
            'datetime_start': self.datetime_start,
            'datetime_end': self.datetime_end,
            'max_winners': self.max_winners,
            'tokens': self.tokens,
        }


class SolvedQuest(models.Model):
    """
    SolvedQuest model

    This model represents a many-to-many relationship between Employee and Quest.

    :param employee: the employee who solved the quest
    :param quest: the quest that was solved
    :param date_solved: the date when the quest was solved
    """
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    date_solved = models.DateField(auto_now_add=True)

    @property
    def points(self):
        return self.quest.points

    def serialize(self):
        return {
            'id': self.id,
            'employee': self.employee.serialize(),
            'quest': self.quest.serialize(),
            'date_solved': self.date_solved,
        }

    class Meta:
        unique_together = ('employee', 'quest')


class Image(models.Model):
    """
    Image model

    :param solved_quest: the solved quest that the image belongs to
    :param image: the image
    """
    solved_quest = models.ForeignKey(SolvedQuest, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/')

    def serialize(self):
        return {
            'solved_quest_id': self.solved_quest.id,
            'image': self.image.url,
        }


class RequestStatus(models.TextChoices):
    PENDING = 'P', 'Pending'
    ACCEPTED = 'A', 'Accepted'
    REJECTED = 'R', 'Rejected'


class RewardType(models.IntegerChoices):
    SALARY_INCREASE = 0, 'Salary Increase'
    FREE_DAYS = 1, 'Free Days'
    CAREER_DEVELOPMENT = 2, 'Career Development'


class RewardRequest(models.Model):
    """
    RewardRequest model

    This model represents an abstract reward request class for the other types.

    :param user: the user who requested the reward
    :param description: the description of the reward request
    :param datetime_requested: the date and time when the reward request was created
    :param state: the state of the reward request
    """
    user = models.ForeignKey(OwnUser, on_delete=models.CASCADE)
    description = models.CharField(max_length=1000)
    datetime_requested = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=1, choices=RequestStatus.choices, default=RequestStatus.PENDING)

    @property
    def tokens(self) -> int:
        raise NotImplementedError("This method must be implemented in a subclass")

    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.serialize(),
            'datetime_requested': self.datetime_requested,
            'description': self.description,
            'state': self.state,
        }

    def __str__(self):
        return f'{self.user}'


class SalaryIncreaseRequest(RewardRequest):
    """
    SalaryIncreaseRequest model

    This model represents a salary increase request.
    It's not mandatory to fill both fields, but at least one of them must be filled.

    :param fixed_amount: the fixed amount of the salary increase
    :param percentage: the percentage of the salary increase
    """
    fixed_amount = models.PositiveIntegerField(default=0)
    percentage = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])

    @property
    def salary_increase_str(self) -> str:
        if self.fixed_amount == 0:
            return f'{self.percentage}%'
        elif self.percentage == 0:
            return f'{self.fixed_amount} {settings.MONETARY_UNIT}'
        else:
            return f'{self.fixed_amount}$ and {self.percentage}%'

    @property
    def salary_increase(self) -> int:
        return round(self.fixed_amount + self.percentage / 100.0 * self.user.employee.salary)

    @property
    def tokens(self) -> int:
        return self.salary_increase * settings.TOKEN_TO_MONEY_RATIO

    def serialize(self):
        return {
            **super().serialize(),
            'description': self.description,
            'fixed_amount': self.fixed_amount,
            'percentage': self.percentage,
            'salary_increase': self.salary_increase,
            'tokens': self.tokens,
        }


class CareerDevelopmentRequest(RewardRequest):
    """
    CareerDevelopmentRequest model

    This model represents a career development request.

    :param position_requested: the position requested
    """
    position_requested = models.IntegerField(choices=EmployeePosition.choices, default=EmployeePosition.INTERN, validators=[MinValueValidator(EmployeePosition.INTERN)])

    @property
    def tokens(self) -> int:
        diff = self.position_requested - self.user.employee.position
        final = self.position_requested
        return diff * settings.TOKEN_TO_ADVANCE_ONE_POSITION + settings.TOKEN_TO_ADVANCE_TO[final]

    def serialize(self):
        return {
            **super().serialize(),
            'description': self.description,
            'position_requested': self.position_requested,
            'tokens': self.tokens,
        }


class FreeDaysRequest(RewardRequest):
    """
    FreeDaysRequest model

    This model represents a free days request.

    :param date_free_days_start: the start date of the free days interval
    :param date_free_days_end: the end date of the free days interval
    """
    # the interval contains both start and end dates
    date_free_days_start = models.DateField()
    date_free_days_end = models.DateField(validators=[MinValueValidator('date_free_days_start')])

    @property
    def days_requested(self) -> int:
        return (self.date_free_days_end - self.date_free_days_start).days + 1

    @property
    def tokens(self) -> int:
        salary_per_day = self.user.employee.salary / 30
        return int(self.days_requested * (salary_per_day * settings.TOKEN_TO_MONEY_RATIO) * settings.TOKEN_FREE_DAY_PERCENTAGE)

    def serialize(self):
        return {
            **super().serialize(),
            'date_free_days_start': self.date_free_days_start,
            'date_free_days_end': self.date_free_days_end,
            'days_requested': self.days_requested,
            'tokens': self.tokens,
        }
