import datetime

from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator
from django.db import models
from .utils import get_current_time


# Create your models here.
class OwnUser(AbstractUser):
    """
    Custom user model

    :param image: the profile image
    :param employee: the employee object
    If the user is an employee, this field will be not null
    """
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
            'password': self.password,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'image': self.image.url if self.image else None,
            'employee': self.employee.serialize() if self.employee else None,
        }


class EmployeePosition(models.IntegerChoices):
    INTERN = 0, 'Intern'
    JUNIOR = 1, 'Junior'
    MIDDLE = 2, 'Middle'
    SENIOR = 3, 'Senior'
    MANAGER = 4, 'Manager'
    LEAD = 5, 'Lead'


class Employee(models.Model):
    """
    Employee model

    :param user: the user object
    :param date_employed: the date when the employee was hired
    :param salary: the salary of the employee
    :param position: the position of the employee
    :param date_of_birth: the date of birth of the employee
    :param tokens: the number of tokens the employee has
    :param discount_next_purchase: the discount the employee will have on the next purchase
    :param badges: the badges the employee has
    """
    user = models.OneToOneField('OwnUser', on_delete=models.CASCADE, null=True, blank=True, related_name='ownuser')
    date_employed = models.DateField()
    salary = models.PositiveIntegerField(default=2000)
    position = models.IntegerField(choices=EmployeePosition.choices, default=EmployeePosition.INTERN)
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
            'position': self.position,
            'tokens': self.tokens,
            'discount_next_purchase': self.discount_next_purchase,
            'badges': [badge.serialize() for badge in self.badges.all()],
        }


class RegisterRequest(models.Model):
    """
    Register request model

    :param username: the username of the future user
    :param email: the email of the future user
    :param first_name: the first name of the future user
    :param last_name: the last name of the future user
    :param password: the password of the future user
    :param date_of_birth: the date of birth of the future user
    :param image: the profile image of the future user
    """
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

