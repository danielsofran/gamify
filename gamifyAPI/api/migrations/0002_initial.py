# Generated by Django 4.1.7 on 2023-04-07 08:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth2', '0001_initial'),
        ('api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='solvedquest',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth2.employee'),
        ),
        migrations.AddField(
            model_name='solvedquest',
            name='quest',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.quest'),
        ),
        migrations.AddField(
            model_name='rewardrequest',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='quest',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='image',
            name='posted_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='image',
            name='solved_quest',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.solvedquest'),
        ),
        migrations.AlterUniqueTogether(
            name='solvedquest',
            unique_together={('employee', 'quest')},
        ),
        migrations.AlterUniqueTogether(
            name='image',
            unique_together={('posted_by', 'solved_quest')},
        ),
    ]
