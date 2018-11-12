from django.test import TestCase
from rest_framework.test import APIRequestFactory
from decimal import Decimal
from ..models import UserVariability


class UserVariabilityTestCase(TestCase):

    # Executed before any tests are run to set up the database.
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.client = APIRequestFactory()
        self.maxLength = "maxLength"
        self.maxFuture = "maxFuture"
        self.maxRentals = "maxRentals"

    def test_setMaxResvValue(self):

        request = {
            "executive": {
                self.maxLength: 21,
            },
            "member": {
                self.maxLength: 14,
            }
        }
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
        request = {
            "executive": {
                self.maxRentals: 3,
            },
            "member": {
                self.maxRentals: 2,
            }
        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        variable = UserVariability.objects.get(pk="executive"+self.maxRentals)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxRentals)
        self.assertEqual(variable.value, 2)

        # test invalid values
        request = {
            "executive": {
                self.maxRentals: 3,
            },
            "member": {
                self.maxRentals: -1,
            }
        }

        response = self.client.post("/api/system/variability/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        variable = UserVariability.objects.get(pk="executive"+self.maxRentals)
        self.assertEqual(variable.value, 3)
        variable = UserVariability.objects.get(pk="member"+self.maxRentals)
        self.assertEqual(variable.value, 2)


