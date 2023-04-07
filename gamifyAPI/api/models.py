import abc
from abc import ABC

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from auth2.models import OwnUser, Employee, Position
from . import settings


# Create your models here.
class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='media/', null=True, blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image': self.image.url if self.image else None,
        }

    def __str__(self):
        return self.name


class Quest(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'E', 'Easy'
        MEDIUM = 'M', 'Medium'
        HARD = 'H', 'Hard'

        @property
        def minimum_tokens(self) -> int:
            res = {self.EASY: 0, self.MEDIUM: 100, self.HARD: 200}
            return res[self]

    author = models.ForeignKey(OwnUser, on_delete=models.SET_NULL, null=True, blank=False)
    title = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=1, choices=Difficulty.choices)
    description = models.CharField(max_length=1000)
    date_start = models.DateField(auto_now_add=True)
    date_end = models.DateField(validators=[MinValueValidator('date_start')])
    max_winners = models.PositiveIntegerField(default=1)
    tokens = models.PositiveIntegerField(default=0)

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author.serialize(),
            'title': self.title,
            'difficulty': self.difficulty,
            'description': self.description,
            'date_start': self.date_start,
            'date_end': self.date_end,
            'max_winners': self.max_winners,
            'tokens': self.tokens,
        }


class SolvedQuest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    date_solved = models.DateField(auto_now_add=True)

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
    posted_by = models.ForeignKey(OwnUser, on_delete=models.CASCADE, related_name='images')
    solved_quest = models.ForeignKey(SolvedQuest, on_delete=models.CASCADE)
    datetime_posted = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='media/')

    def serialize(self):
        return {
            'image': self.image.url,
        }

    class Meta:
        unique_together = ('posted_by', 'solved_quest')


class Status(models.TextChoices):
    PENDING = 'P', 'Pending'
    APPROVED = 'A', 'Approved'
    REJECTED = 'R', 'Rejected'


class RewardRequest(models.Model):
    user = models.ForeignKey(OwnUser, on_delete=models.CASCADE)
    description = models.CharField(max_length=1000)
    datetime_requested = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=1, choices=Status.choices, default=Status.PENDING)

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
            'salary_increase': self.salary_increase,
            'salary_increase_str': self.salary_increase_str,
            'tokens': self.tokens,
        }


class CareerDevelopmentRequest(RewardRequest):
    position_requested = models.IntegerField(choices=Position.choices, default=Position.INTERN, validators=[MinValueValidator(Position.INTERN)])

    @property
    def tokens(self) -> int:
        diff = self.position_requested - self.user.employee.position
        final = self.position_requested
        return diff * settings.TOKEN_TO_ADVANCE_ONE_POSITION + settings.TOKEN_TO_ADVANCE_TO[final]

    def serialize(self):
        return {
            **super().serialize(),
            'description': self.description,
            'position_requested': Position(self.position_requested).label,
            'tokens': self.tokens,
        }


class FreeDaysRequest(RewardRequest):
    # the interval contains both start and end dates
    date_free_days_start = models.DateField()
    date_free_days_end = models.DateField(validators=[MinValueValidator('date_free_days_start')])

    @property
    def days_requested(self) -> int:
        return (self.date_free_days_end - self.date_free_days_start).days + 1

    @property
    def tokens(self) -> int:
        salary_per_day = self.user.employee.salary / 30
        return self.days_requested * (salary_per_day * settings.TOKEN_TO_MONEY_RATIO) * settings.TOKEN_FREE_DAY_PERCENTAGE

    def serialize(self):
        return {
            **super().serialize(),
            'date_free_days_start': self.date_free_days_start,
            'date_free_days_end': self.date_free_days_end,
            'days_requested': self.days_requested,
            'tokens': self.tokens,
        }
