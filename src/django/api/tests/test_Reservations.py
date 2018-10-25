from django.test import TestCase
from ..models import Reservation, GearCategory, Gear
from rest_framework.test import APIRequestFactory


class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        spCat = GearCategory.objects.create(name="Ski poles")
        sp = Gear.objects.create(code="SP01", category=spCat, depositFee=12.00, description="Ski poles", condition="RENTABLE", version=1)
        gr = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.", licenseAddress="Address on their license.", approvedBy="nobody", startDate="2018-10-25", endDate="2018-10-28", payment={"nobody": "nobody"})
        gr.save()
        gr.gear.add(sp)
        self.sp = sp
        self.client = APIRequestFactory

    def test_get(self):
        response = self.client.get('/api/reservation/').data['data']

        correctResponse = [{'id': 1,
                            'email': 'enry@email.com',
                            'licenseName': 'Name on their license.',
                            'licenseAddress': 'Address on their license.',
                            'startDate': '2018-10-25',
                            'endDate': '2018-10-28',
                            'status': 'REQUESTED',
                            'gear': [{'code': 'SP01',
                                      'id': 4,
                                      'depositFee': '12.00',
                                      'version': 1,
                                      'category': 'Ski poles',
                                      "condition": "RENTABLE",
                                      'description': 'Ski poles'}],
                            }]
        self.assertEqual(response, correctResponse)

    def test_post(self):
        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        reservationListOriginalLen = len(reservationList)
        request = {
            "email": "henry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": "2018-10-25",
            "endDate": "2018-10-28",
            "status": "REQUESTED",
            "gear": [1]}

        # Test POST (create new reservation)
        response = self.client.post("/api/reservation/", request, content_type='application/json').data

        # Test GET (created and added list)
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        #self.assertEqual(len(response), reservationListOriginalLen + 1) # len of GET should +1 original len
