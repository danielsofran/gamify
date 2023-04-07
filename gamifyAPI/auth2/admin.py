from django.contrib import admin

from .models import OwnUser, Employee

# Register your models here.
admin.site.register(OwnUser)
admin.site.register(Employee)
