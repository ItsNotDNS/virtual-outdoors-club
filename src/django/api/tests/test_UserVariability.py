from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from ..models import UserVariability


class UserVariabilityTestCase(TestCase):

    # Executed before any tests are run to set up the database.
    def setUp(self):
        self.maxLength = "maxLength"
        self.maxFuture = "maxFuture"
        self.maxReservations = "maxReservations"
        self.maxGearPerReservation = "maxGearPerReservation"
        User.objects.create_superuser("admin", "admin@gmail.com", "pass")

    def test_get(self):
        self.client.login(username="admin", password="pass")

        expected = [
                {"variable": "membermaxLength", "value": 14},
                {"variable": "membermaxFuture", "value": 7},
                {"variable": "membermaxReservations", "value": 3},
                {"variable": "membermaxGearPerReservation", "value": 5},
                {"variable": "executivemaxLength", "value": 14},
                {"variable": "executivemaxFuture", "value": 7},
                {"variable": "executivemaxReservations", "value": 3},
                {"variable": "executivemaxGearPerReservation", "value": 5},
        ]
        response = self.client.get("/api/system/variability/", content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(expected, response.data["data"])

    def test_setMaxResvValue(self):
        self.client.login(username="admin", password="pass")

        request = {
            "executive": {
                self.maxLength: 21,
            },
            "hello": {
                "world": 23
            },
            "member": {
                "world": 14,
            },

        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json").data['message']
        self.assertEqual(response, "hello is not a valid member type")

        del request['hello']
        response = self.client.post("/api/system/variability/", request, content_type="application/json").data['message']
        self.assertEqual(response, "world is not a valid variable to modify")

        request['member'] = {self.maxLength: 14}
        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        variable = UserVariability.objects.get(pk="executive"+self.maxLength)
        self.assertEqual(variable.value, 21)

        variable = UserVariability.objects.get(pk="member"+self.maxLength)
        self.assertEqual(variable.value, 14)

        request = {
            "executive": {
                self.maxLength: 3,
            },
            "member": {
                self.maxLength: 17,
            }
        }
        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        variable = UserVariability.objects.get(pk="executive"+self.maxLength)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxLength)
        self.assertEqual(variable.value, 17)
        
        # test invalid values
        request = {
            "executive": {
                self.maxLength: 15,
            },
            "member": {
                self.maxLength: 0,
            }
        }
        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        variable = UserVariability.objects.get(pk="executive"+self.maxLength)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxLength)
        self.assertEqual(variable.value, 17)

    def test_updateDaysInAdvanceToMakeReservation(self):
        self.client.login(username="admin", password="pass")

        request = {
            "executive": {
                self.maxFuture: 21,
            },
            "member": {
                self.maxFuture: 14,
            }
        }
        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        variable = UserVariability.objects.get(pk="executive"+self.maxFuture)
        self.assertEqual(variable.value, 21)
        variable = UserVariability.objects.get(pk="member"+self.maxFuture)
        self.assertEqual(variable.value, 14)

        # test invalid values
        request = {
            "executive": {
                self.maxFuture: -1,
            },
            "member": {
                self.maxFuture: 14,
            }
        }
        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        variable = UserVariability.objects.get(pk="executive"+self.maxFuture)
        self.assertEqual(variable.value, 21)
        variable = UserVariability.objects.get(pk="member"+self.maxFuture)
        self.assertEqual(variable.value, 14)

    def test_updateMaxReservations(self):
        self.client.login(username="admin", password="pass")

        request = {
            "executive": {
                self.maxReservations: 3,
            },
            "member": {
                self.maxReservations: 2,
            }
        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        variable = UserVariability.objects.get(pk="executive"+self.maxReservations)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxReservations)
        self.assertEqual(variable.value, 2)

        # test invalid values
        request = {
            "executive": {
                self.maxReservations: 3,
            },
            "member": {
                self.maxReservations: -1,
            }
        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        variable = UserVariability.objects.get(pk="executive"+self.maxReservations)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxReservations)
        self.assertEqual(variable.value, 2)

    def test_updateMaxGearPerReservation(self):
        self.client.login(username="admin", password="pass")

        request = {
            "executive": {
                self.maxGearPerReservation: 3,
            },
            "member": {
                self.maxGearPerReservation: 2,
            }
        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        variable = UserVariability.objects.get(pk="executive"+self.maxGearPerReservation)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxGearPerReservation)
        self.assertEqual(variable.value, 2)

        # test invalid values
        request = {
            "executive": {
                self.maxGearPerReservation: 3,
            },
            "member": {
                self.maxGearPerReservation: -1,
            }
        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        variable = UserVariability.objects.get(pk="executive"+self.maxGearPerReservation)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxGearPerReservation)
        self.assertEqual(variable.value, 2)

    def test_login(self):
        request = {
            "user": "admin",
            "password": "pass",
        }
        response = self.client.post("/api/system/accounts/login/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

    def test_bad_login(self):
        request = {
            "user": "admin",
            "password": "wrongPass",
        }
        response = self.client.post("/api/system/accounts/login/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_changePassword(self):
        self.client.login(username="admin", password="pass")

        User.objects.create_user("exec", "exec@gmail.com", "oldPass")
        request = {
            "user": "hello",
        }

        response = self.client.post("/api/system/accounts/", request, content_type="application/json").data['message']
        self.assertEqual(response, "You are missing password.")

        request['password'] = "newPass"
        response = self.client.post("/api/system/accounts/", request, content_type="application/json").data['message']
        self.assertEqual(response, "The username and password combination does not exist.")

        request['user'] = "exec"
        response = self.client.post("/api/system/accounts/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        user = authenticate(username="exec", password="newPass")
        if user is None:
            self.assertEqual("Authentication failed", 1)    # Deliberately fail if no user found

        request = {
            "user": "admin",
            "password": "newPass",
        }
        response = self.client.post("/api/system/accounts/password/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        request = {
            "user": "admin",
            "password": "newPass",
            "oldPassword": "pass",
        }
        response = self.client.post("/api/system/accounts/password/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        user = authenticate(username="admin", password="newPass")
        if user is None:
            self.assertEqual("Authentication failed", 1)    # Deliberately fail if no user found
