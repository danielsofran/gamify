from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie

from . import views

urlpatterns = [
    path('csrf/', views.get_csrf, name='csrf'),
    path('user/', views.user, name='user'),
    path('login/', ensure_csrf_cookie(views.login), name='login'),
    path('logout/', ensure_csrf_cookie(views.logout), name='logout'),
    path('register/', ensure_csrf_cookie(views.register), name='register'),
    path('register_requests/', views.register_requests, name='register_requests'),
]
