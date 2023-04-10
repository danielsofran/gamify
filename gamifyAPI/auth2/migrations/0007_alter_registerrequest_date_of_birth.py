# Generated by Django 4.2 on 2023-04-09 15:04

import datetime
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth2', '0006_employee_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registerrequest',
            name='date_of_birth',
            field=models.DateField(default=datetime.date(1979, 12, 31), validators=[django.core.validators.MaxValueValidator(datetime.date(2023, 4, 9))]),
        ),
    ]