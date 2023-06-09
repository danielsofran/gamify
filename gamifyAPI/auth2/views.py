import json

from django.contrib.auth import authenticate
from django.contrib import auth
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import redirect
from django.middleware.csrf import get_token
from . import models


def login(request):
    """
    login user
    :param request:
    :status 200: ok
    :status 401: invalid username/password
    :status 405: wrong HTTP method, POST expected
    """
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
    """
    logout user
    :param request:
    :return:
    :status 200: ok
    :status 401: user not logged in
    :status 500: logout server error
    """
    if not request.user.is_authenticated:
        return JsonResponse({'error': "User not logged in"}, status=401)
    try: auth.logout(request)
    except: return JsonResponse({'status': 'error'}, status=500)
    return JsonResponse({'status': 'ok'}, status=200)


def user(request):
    """
    get user info for logged user
    :param request:
    :return: the serialized user
    :status 200: ok
    :status 401: user not logged in
    """
    if request.user.is_authenticated:
        return JsonResponse(request.user.serialize(), status=200)
    else:
        return JsonResponse({}, status=401)


def employee(request, id):
    """
    get user info for employee with id
    :param request:
    :param id: the id of the employee
    :return: the serialized employee, if the user is an employee
    :status 200: ok
    :status 400: employee does not exist
    :status 403: unauthorized
    :status 405: wrong HTTP method, GET expected
    """
    if request.method == 'GET':
        if request.user.is_CEO:
            try: employee = models.OwnUser.objects.get(id=id)
            except: return JsonResponse({'error', 'Employee does not exist'}, status=400)
            return JsonResponse(employee.serialize(), status=200)
        return JsonResponse({'error', 'Unauthorized'}, status=403)
    return JsonResponse({'error': 'Wrong HTTP method'}, status=405)


def get_csrf(request):
    """
    get csrf token
    :param request:
    :return: the csrf token
    """
    return JsonResponse({'csrfToken': get_token(request)})


def register(request):
    """
    create a register request
    :param request:
    :return:, if the request was created, otherwise an error
    :status 200: ok
    :status 405: wrong HTTP method, POST expected
    :status 420: invalid data
    :status 430: username already exists
    :status 440: email already exists
    """
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
    """
    get all register requests, if the user is CEO
    :param request:
    :return: an array of serialized register requests
    :status 200: ok
    :status 401: unauthorized
    """
    if request.user.is_superuser:
        register_requests = models.RegisterRequest.objects.all()
        return JsonResponse([register_request.serialize() for register_request in register_requests], safe=False, status=200)
    else:
        return JsonResponse({'error': "Unauthorized"}, status=401)


def get_request(request, id):
    """
    get a register request, if the user is CEO
    :param request:
    :param id: the id of the register request
    :return: the serialized register request
    :status 200: ok
    :status 401: unauthorized
    """
    if request.user.is_superuser:
        register_request_id = id
        register_request = models.RegisterRequest.objects.get(id=register_request_id)
        return JsonResponse(register_request.serialize(), status=200)
    else:
        return JsonResponse({'error': "Unauthorized"}, status=401)


def save_register_request(request):
    """
    save a register request, if the user is CEO
    :param request:
    :return:, if the request was saved, otherwise an error
    :status 200: ok
    :status 400: invalid data
    :status 401: unauthorized
    :status 405: wrong HTTP method, POST expected
    """
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

        try:
            employee.save()
            user.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': "Invalid data"}, status=400)

        try:
            employee.user = user
            employee.save()
        except Exception as ex:
            print(ex)
            return JsonResponse({'error': "Can not save employee"}, status=400)
        register_request.delete()
        return JsonResponse({'status': 'saved'}, status=200)

