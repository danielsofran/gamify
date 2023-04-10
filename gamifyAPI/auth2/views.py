import json

from django.contrib.auth import authenticate
from django.contrib import auth
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import redirect
from django.middleware.csrf import get_token



from . import models


# Create your views here.
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = None
        try: user = models.OwnUser.objects.get(username=username, password=password)
        except: pass
        if user is not None:
            auth.login(request, user)
            return JsonResponse({'status': 'ok', 'user': user.serialize()}, status=200)
        else:
            return JsonResponse({'error': "Invalid username/password"}, status=401)
    else:
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)


def logout(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': "User not logged in"}, status=401)
    try: auth.logout(request)
    except: return JsonResponse({'status': 'error'}, status=500)
    return JsonResponse({'status': 'ok'}, status=200)


def user(request):
    if request.user.is_authenticated:
        return JsonResponse(request.user.serialize(), status=200)
    else:
        return JsonResponse({}, status=401)


def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        if models.OwnUser.objects.filter(username=username).exists():
            return JsonResponse({'error': "Username already exists"}, status=430)
        password = request.POST['password']
        email = request.POST['email']
        if models.OwnUser.objects.filter(email=email).exists():
            return JsonResponse({'error': "Email already exists"}, status=440)
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        date_of_birth = request.POST['date_of_birth']

        image = request.FILES['image']

        register_request = models.RegisterRequest(username=username, password=password, email=email,
                          first_name=first_name, last_name=last_name, date_of_birth=date_of_birth, image=image)
        try: register_request.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': "Invalid data"}, status=420)

        return JsonResponse({'status': 'ok'}, status=200)
    else:
        return JsonResponse({'error': "Wrong HTTP method"}, status=405)


def register_requests(request):
    if request.user.is_superuser:
        register_requests = models.RegisterRequest.objects.all()
        return JsonResponse([register_request.serialize() for register_request in register_requests], safe=False, status=200)
    else:
        return JsonResponse({'error': "Unauthorized"}, status=401)


def get_request(request, id):
    if request.user.is_superuser:
        register_request_id = id
        register_request = models.RegisterRequest.objects.get(id=register_request_id)
        return JsonResponse(register_request.serialize(), status=200)
    else:
        return JsonResponse({'error': "Unauthorized"}, status=401)


def save_register_request(request):
    if request.user.is_superuser:
        data = json.loads(request.body)
        register_request_id = data.get('register_request_id')
        accepted = data.get('accepted')
        if not accepted:
            register_request = models.RegisterRequest.objects.get(id=register_request_id)
            # email to user that the request was rejected
            register_request.delete()
            return JsonResponse({'status': 'deleted'}, status=200)

        salary = data.get('salary')
        if salary is None or salary <= 0:
            return JsonResponse({'error': "Invalid salary"}, status=400)

        position = data.get('position')
        date_employed = data.get('date_employed')
        tokens = data.get('tokens')

        register_request = models.RegisterRequest.objects.get(id=register_request_id)
        employee = models.Employee(
            date_employed=date_employed,
            salary=salary,
            position=position,
            date_of_birth=register_request.date_of_birth,
            tokens=tokens,
            discount_next_purchase=0,
        )
        user = models.OwnUser(
            username=register_request.username,
            password=register_request.password,
            email=register_request.email,
            first_name=register_request.first_name,
            last_name=register_request.last_name,
            image=register_request.image,
            employee=employee,
        )
        employee.user = user
        try:
            employee.save()
            user.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': "Invalid data"}, status=400)

        register_request.delete()
        return JsonResponse({'status': 'saved'}, status=200)

