# Generated by Django 4.2 on 2023-04-07 08:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth2', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='date_of_birth',
            field=models.DateField(default=datetime.date(1979, 12, 31)),
        ),
    ]
