# Generated by Django 4.2 on 2023-04-08 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_badge_image_alter_image_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='badge',
            name='image',
            field=models.ImageField(upload_to='media/'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.ImageField(upload_to='media/'),
        ),
    ]
