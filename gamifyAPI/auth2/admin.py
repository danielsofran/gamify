from django.contrib import admin

from .models import OwnUser, Employee, RegisterRequest

# Register your models here.
admin.site.register(OwnUser)
admin.site.register(Employee)
admin.site.register(RegisterRequest)