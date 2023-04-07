from django.contrib import admin
from .models import Badge, Quest, SolvedQuest, Image, SalaryIncreaseRequest, FreeDaysRequest, CareerDevelopmentRequest

# Register your models here.
admin.site.register(Badge)
admin.site.register(Quest)
admin.site.register(SolvedQuest)
admin.site.register(Image)
admin.site.register(SalaryIncreaseRequest)
admin.site.register(FreeDaysRequest)
admin.site.register(CareerDevelopmentRequest)
