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

    def test_setMaxResvValue(self):
        request = {
            "value": 8
        }
        response = self.client.post("/api/userVar/updateMaxReservation/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        response = response.data

        variable = UserVariability.objects.get(pk="maxReservationDays")
        self.assertEqual(variable.value, 8)

        request = {
            "value": 19
        }
        response = self.client.post("/api/userVar/updateMaxReservation/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        response = response.data

        variable = UserVariability.objects.get(pk="maxReservationDays")
        self.assertEqual(variable.value, 19)

        # test invalid values
        request = {
            "value": 30
        }
        response = self.client.post("/api/userVar/updateMaxReservation/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        response = response.data

        variable = UserVariability.objects.get(pk="maxReservationDays")
        self.assertEqual(variable.value, 19)

        # Test < 1
        request = {
            "value": 0
        }
        response = self.client.post("/api/userVar/updateMaxReservation/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        response = response.data

        variable = UserVariability.objects.get(pk="maxReservationDays")
        self.assertEqual(variable.value, 19)


