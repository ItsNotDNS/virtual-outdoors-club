from django.test import TestCase
from ..models import Reservation, GearCategory, Gear
from rest_framework.test import APIRequestFactory


class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        spCat = GearCategory.objects.create(name="Ski poles")
        bkCat = GearCategory.objects.create(name="Ski poles")
        sp = Gear.objects.create(code="SP01", category=spCat, depositFee=12.00, description="Ski poles", condition="RENTABLE", version=1)
        bk = Gear.objects.create(code="BK01", category=bkCat, depositFee=12.00, description="some book", condition="RENTABLE", version=1)
        gr = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.", licenseAddress="Address on their license.", approvedBy="nobody", startDate="2018-10-25", endDate="2018-10-28", payment={"nobody": "nobody"})
        gr.gear.add(sp)
        gr.save()
        self.sp = sp
        self.bk = bk
        self.client = APIRequestFactory

    def test_get(self):
        response = self.client.get('/api/reservation/', content_type="application/json").data['data']

        correctResponse = [{'status': 'REQUESTED',
                            'licenseName': 'Name on their license.',
                            'licenseAddress': 'Address on their license.',
                            'id': 1,
                            'email': 'enry@email.com',
                            # 'approvedBy': 'nobody',    #TODO re-add
                            'gear': [4],
                            'startDate': '2018-10-25',
                            'endDate': '2018-10-28'}]

        self.assertEqual(response, correctResponse)

    def test_checkin(self):
        request = {"id": 1}

        response = self.client.post("/api/reservation/checkin/", request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        correctResponse = [{
            'id': 1,
            'email': 'enry@email.com',
            'licenseName': 'Name on their license.',
            'licenseAddress': 'Address on their license.',
            'status': 'RETURNED',
            'gear': [self.sp.pk],
            'endDate': '2018-10-28',
            'startDate': '2018-10-25'}]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

    def test_cancel(self):
        request = {"id": 1}

        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        correctResponse = [{
            'id': 1,
            'email': 'enry@email.com',
            'licenseName': 'Name on their license.',
            'licenseAddress': 'Address on their license.',
            'status': 'CANCELLED',
            'gear': [self.sp.pk],
            'endDate': '2018-10-28',
            'startDate': '2018-10-25'
        }]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

    def test_post(self):
        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        reservationListOriginalLen = len(reservationList)

        request = {
            "email": "henry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": "2019-10-25",
            "endDate": "2019-10-28",
            "status": "REQUESTED",
            "gear": [self.bk.pk]
        }

        correctResponse = {
            'startDate': '2019-10-25',
            'id': 2,
            'email': 'henry@email.com',
            'endDate': '2019-10-28',
            'gear': [self.bk.pk],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.'
        }

        # Test POST (create new reservation)
        response = self.client.post("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, correctResponse)

        # Test that the new reservation is in the DB
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        self.assertEqual(len(response), reservationListOriginalLen + 1)
