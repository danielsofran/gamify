# Generated by Django 4.2 on 2023-04-09 19:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_image_unique_together_alter_quest_datetime_end_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='badge',
            name='min_easy_quests',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='badge',
            name='min_hard_tasks',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='badge',
            name='min_medium_tasks',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='badge',
            name='min_quests',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='quest',
            name='datetime_end',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 9, 22, 30, 11, 706702)),
        ),
        migrations.AlterField(
            model_name='quest',
            name='datetime_start',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 9, 22, 30, 11, 706702)),
        ),
    ]