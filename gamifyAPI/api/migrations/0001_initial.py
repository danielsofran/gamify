# Generated by Django 4.1.7 on 2023-04-07 08:13

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=1000)),
                ('image', models.ImageField(blank=True, null=True, upload_to='media/')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime_posted', models.DateTimeField(auto_now_add=True)),
                ('image', models.ImageField(upload_to='media/')),
            ],
        ),
        migrations.CreateModel(
            name='Quest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('difficulty', models.CharField(choices=[('E', 'Easy'), ('M', 'Medium'), ('H', 'Hard')], max_length=1)),
                ('description', models.CharField(max_length=1000)),
                ('date_start', models.DateField(auto_now_add=True)),
                ('date_end', models.DateField(validators=[django.core.validators.MinValueValidator('date_start')])),
                ('max_winners', models.PositiveIntegerField(default=1)),
                ('tokens', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='RewardRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=1000)),
                ('datetime_requested', models.DateTimeField(auto_now_add=True)),
                ('state', models.CharField(choices=[('P', 'Pending'), ('A', 'Approved'), ('R', 'Rejected')], default='P', max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='SolvedQuest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_solved', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='CareerDevelopmentRequest',
            fields=[
                ('rewardrequest_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.rewardrequest')),
                ('position_requested', models.IntegerField(choices=[(0, 'Intern'), (1, 'Junior'), (2, 'Middle'), (3, 'Senior'), (4, 'Manager'), (5, 'Lead')], default=0, validators=[django.core.validators.MinValueValidator(0)])),
            ],
            bases=('api.rewardrequest',),
        ),
        migrations.CreateModel(
            name='FreeDaysRequest',
            fields=[
                ('rewardrequest_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.rewardrequest')),
                ('date_free_days_start', models.DateField()),
                ('date_free_days_end', models.DateField(validators=[django.core.validators.MinValueValidator('date_free_days_start')])),
            ],
            bases=('api.rewardrequest',),
        ),
        migrations.CreateModel(
            name='SalaryIncreaseRequest',
            fields=[
                ('rewardrequest_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.rewardrequest')),
                ('fixed_amount', models.PositiveIntegerField(default=0)),
                ('percentage', models.FloatField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
            ],
            bases=('api.rewardrequest',),
        ),
    ]
