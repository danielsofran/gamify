# Generated by Django 4.2 on 2023-04-10 06:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_badge_min_easy_quests_badge_min_hard_tasks_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='badge',
            old_name='min_hard_tasks',
            new_name='min_hard_quests',
        ),
        migrations.RenameField(
            model_name='badge',
            old_name='min_medium_tasks',
            new_name='min_medium_quests',
        ),
        migrations.AlterField(
            model_name='quest',
            name='datetime_end',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 10, 9, 38, 28, 658422)),
        ),
        migrations.AlterField(
            model_name='quest',
            name='datetime_start',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 10, 9, 38, 28, 658422)),
        ),
    ]
