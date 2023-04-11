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
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('reward/<int:id>/', ensure_csrf_cookie(views.reward), name='reward'),
    path('get_tokens/<int:type>/', views.get_tokens, name='get_tokens'),
    path('requests/<int:type>/', views.requests, name='requests'),
    path('request/<int:type>/<int:id>/', ensure_csrf_cookie(views.process_request), name='request'),
    path('add_request/salary_increase/', ensure_csrf_cookie(views.add_salary_increase_request), name='add_salary_increase_request'),
    path('add_request/free_days/', ensure_csrf_cookie(views.add_free_days_request), name='add_free_days_request'),
    path('add_request/career_development/', ensure_csrf_cookie(views.add_career_development_request), name='add_career_development_request'),
]
