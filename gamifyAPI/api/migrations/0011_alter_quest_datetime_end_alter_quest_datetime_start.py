# Generated by Django 4.2 on 2023-04-12 00:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_solvedquest_date_solved_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quest',
            name='datetime_end',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 12, 3, 33, 7, 456689)),
        ),
        migrations.AlterField(
            model_name='quest',
            name='datetime_start',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 12, 3, 33, 7, 456689)),
        ),
    ]