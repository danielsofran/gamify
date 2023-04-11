from django.test import TestCase
from api.models import *
from auth2.models import *
from auth2.tests import RegistrationTest

# Create your tests here.
class QuestSolveTest(TestCase):
    def setUp(self) -> None:
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
        self.quest_ceo = Quest.objects.create(
            title="Test Quest",
            description="Test Description",
            difficulty=QuestDifficulty.EASY,
            datetime_start=datetime.datetime.now(),
            datetime_end=datetime.datetime.now()+datetime.timedelta(days=1),
            max_winners=1,
            tokens=100,
            author=self.ceo,
        )
        self.quest_employee = Quest.objects.create(
            title="Test Quest",
            description="Test Description",
            difficulty=QuestDifficulty.EASY,
            datetime_start=datetime.datetime.now(),
            datetime_end=datetime.datetime.now()+datetime.timedelta(days=1),
            max_winners=1,
            tokens=100,
            author=self.user,
        )
        self.user2 = OwnUser.objects.create(username='user2', password='user2')
        self.employee2 = Employee.objects.create(
            date_employed=datetime.date.today(),
            salary=1000,
            position=EmployeePosition.INTERN,
            date_of_birth=self.registration_request.date_of_birth,
            tokens=0,
            discount_next_purchase=0,
            user=self.user2
        )
        self.employee2.save()
        self.user2.employee = self.employee2
        self.user2.save()

    def test_quest_ceo_solve(self):
        self.client.force_login(self.user)
        response = self.client.post(f'/api/quest/{self.quest_ceo.id}/', {'quest_id': self.quest_ceo.id})
        self.assertEqual(response.status_code, 201)
        self.employee = Employee.objects.get(id=self.employee.id)
        self.assertEqual(self.employee.tokens, 100)
        response = self.client.get(f'/api/quest/{self.quest_ceo.id}/winners/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['username'], self.user.username)
