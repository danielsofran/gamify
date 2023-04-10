from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie

from . import views

urlpatterns = [
    path('csrf/', views.get_csrf, name='csrf'),
    path('user/', views.user, name='user'),
    path('employee/<int:id>/', views.employee, name='employee'),
    path('login/', ensure_csrf_cookie(views.login), name='login'),
    path('logout/', ensure_csrf_cookie(views.logout), name='logout'),
    path('register/', ensure_csrf_cookie(views.register), name='register'),
    path('register_requests/', views.register_requests, name='register_requests'),
    path('get_register_request/<int:id>/', views.get_request, name='get_register_request'),
    path('save_register_request/', ensure_csrf_cookie(views.save_register_request), name='accept_register_request'),
]
