import datetime

from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
from django.db import models
from .utils import get_current_time


# Create your models here.
class OwnUser(AbstractUser):
    image = models.ImageField(upload_to='media/', null=True, blank=True)
    employee = models.OneToOneField('Employee', on_delete=models.CASCADE, null=True, blank=True)

    @property
    def is_employee(self):
        return self.employee is not None

    @property
    def is_CEO(self):
        return self.is_superuser

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'image': self.image.url if self.image else None,
            'employee': self.employee.serialize() if self.employee else None,
        }


class Position(models.IntegerChoices):
    INTERN = 0, 'Intern'
    JUNIOR = 1, 'Junior'
    MIDDLE = 2, 'Middle'
    SENIOR = 3, 'Senior'
    MANAGER = 4, 'Manager'
    LEAD = 5, 'Lead'


class Employee(models.Model):
    date_employed = models.DateField()
    salary = models.PositiveIntegerField(default=2000)
    position = models.IntegerField(choices=Position.choices, default=Position.INTERN)
    date_of_birth = models.DateField(default=datetime.date.fromisocalendar(1980, 1, 1))

    tokens = models.PositiveIntegerField(default=0)
    discount_next_purchase = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(1)])
    badges = models.ManyToManyField('api.Badge', related_name='employees', blank=True)

    @property
    def seniority(self) -> int:
        return (get_current_time().date() - self.date_employed).years

    def serialize(self):
        return {
            'id': self.id,
            'date_employed': self.date_employed,
            'salary': self.salary,
            'position': Position(self.position).label,
            'tokens': self.tokens,
            'discount_next_purchase': self.discount_next_purchase,
            'badges': [badge.serialize() for badge in self.badges.all()],
        }


class RegisterRequest(models.Model):
    username = models.CharField(max_length=20)
    email = models.EmailField(default="email@company.com")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    password = models.CharField(max_length=50, validators=[MinLengthValidator(8)])
    date_of_birth = models.DateField(default=datetime.date.fromisocalendar(1980, 1, 1), validators=[MaxValueValidator(datetime.date.today())])
    image = models.ImageField(upload_to='media/', null=True, blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth,
            'image': self.image.url if self.image else None,
        }

