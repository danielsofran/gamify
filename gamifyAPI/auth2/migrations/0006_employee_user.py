# Generated by Django 4.2 on 2023-04-08 14:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth2', '0005_alter_ownuser_image_alter_registerrequest_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ownuser', to=settings.AUTH_USER_MODEL),
        ),
    ]
