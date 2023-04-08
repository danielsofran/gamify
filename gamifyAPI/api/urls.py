from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.views.decorators.csrf import ensure_csrf_cookie

urlpatterns = [
    path('add_quest/', ensure_csrf_cookie(views.add_quest), name='add_quest'),
    path('quests/', views.get_quests, name='get_quests'),
    path('quest/<int:id>/',ensure_csrf_cookie(views.quest), name='quest'),
    path('quest/<int:id>/winners/', views.get_quest_solvers, name='get_quest_solvers'),
]

