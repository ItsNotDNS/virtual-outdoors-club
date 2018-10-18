from django.test import TestCase
from ..models import Reservation, GearCategory, Gear, GearRequest
from rest_framework.test import APIRequestFactory

class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        spCat = GearCategory.objects.create(name="Ski poles")
        sp = Gear.objects.create(code="SP01", category=spCat, depositFee=12.00, description="Ski poles", version=1)
        gr = GearRequest.objects.create(email="enry@email.com", licenseName="Name on their license.", licenseAddress="Address on their license.", approvedBy="nobody", startDate="2018-10-25", endDate="2018-10-28", payment={"nobody": "nobody"})
        Reservation.objects.create(reservationID=gr, gearID=sp)
        self.client = APIRequestFactory

    def test_get(self):
        response = self.client.get('/api/reservation/').data['data']
        correctResponse = [{'status': 'REQUESTED',
                            'licenseAddress': 'Address on their license.',
                            'endDate': '2018-10-28',
                            'licenseName': 'Name on their license.',
                            'id': 1,
                            'email': 'enry@email.com',
                            'gear': [{'depositFee': '12.00',
                                      'code': 'SP01',
                                      'checkedOut': False,
                                      'version': 1,
                                      'category': 'Ski poles',
                                      'id': 4,
                                      'description': 'Ski poles'}],
                            'startDate': '2018-10-25'}]

        self.assertEqual(response, correctResponse)
