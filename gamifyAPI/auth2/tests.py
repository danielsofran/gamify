from django.test import TestCase
from auth2.models import *

# Create your tests here.
class RegistrationTest(TestCase):
    def setUp(self):
        self.ceo = OwnUser.objects.create(username='ceo', password='ceo')
        self.registration_request = RegisterRequest.objects.create(
            username="angajat",
            email="company@email.com",
            first_name="Angajat",
            last_name="Angajat",
            password="angajat",
            date_of_birth=datetime.date.today(),
            image=None,
        )


    def test_registration(self):
        self.employee = Employee.objects.create(
            date_employed=datetime.date.today(),
            salary=1000,
            position=EmployeePosition.INTERN,
            date_of_birth=self.registration_request.date_of_birth,
            tokens=0,
            discount_next_purchase=0,
        )
        self.user = OwnUser.objects.create(
            username=self.registration_request.username,
            password=self.registration_request.password,
            email=self.registration_request.email,
            first_name=self.registration_request.first_name,
            last_name=self.registration_request.last_name,
            image=self.registration_request.image,
            employee=self.employee,
        )
        self.employee.user = self.user
        self.employee.save()
        self.assertEqual(self.user.username, "angajat")
        self.assertEqual(self.user.password, "angajat")
        self.assertEqual(self.user.email, "company@email.com")
        self.assertEqual(self.user.first_name, "Angajat")
        self.assertEqual(self.user.last_name, "Angajat")
        self.assertEqual(self.user.image, None)
        self.assertEqual(self.user.employee.date_employed, self.registration_request.date_of_birth)
        self.assertEqual(self.user.employee.salary, 1000)
        self.assertEqual(self.user.employee.position, EmployeePosition.INTERN)

        self.assertEqual(self.user.employee.user.id, self.user.id)





