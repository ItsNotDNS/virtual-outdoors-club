from django.test import TestCase
from ..models import Reservation, GearCategory, Gear
from rest_framework.test import APIRequestFactory
import datetime

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
                            'gear': [{'id': self.sp.pk,
                                      'code': 'SP01',
                                      'category': 'Ski poles',
                                      'depositFee': '12.00',
                                      'description': 'Ski poles',
                                      'condition': 'RENTABLE',
                                      'version': 1}],
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
            'gear': [{'id': self.sp.pk,
                      'code': 'SP01',
                      'category': 'Ski poles',
                      'depositFee': '12.00',
                      'description': 'Ski poles',
                      'condition': 'RENTABLE',
                      'version': 1}],
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
            'gear': [{'id': self.sp.pk,
                      'code': 'SP01',
                      'category': 'Ski poles',
                      'depositFee': '12.00',
                      'description': 'Ski poles',
                      'condition': 'RENTABLE',
                      'version': 1}],
            'endDate': '2018-10-28',
            'startDate': '2018-10-25'
        }]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

    def test_post(self):
        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        reservationListOriginalLen = len(reservationList)

        today = datetime.datetime.today()

        request = {
            "email": "henry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": today.strftime("%Y-%m-%d"),
            "endDate": (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [self.bk.pk]
        }

        correctResponse = {
            'startDate': today.strftime("%Y-%m-%d"),
            'id': 2,
            'email': 'henry@email.com',
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': [self.bk.pk],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.'
        }

        # B = Booked dates
        # F = Free dates

        # Test POST (create new reservation)
        # F F F F F F
        #   ^     ^
        response = self.client.post("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, correctResponse)

        # Test that the new reservation is in the DB
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        self.assertEqual(len(response), reservationListOriginalLen + 1)

        # Test for new reservation with same dates
        # F B B B B F
        #   ^     ^
        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test for overlapping endDate with startDate
        # F B B B B F
        # ^ ^
        request['endDate'] = request['startDate']
        request['startDate'] = (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test for current startDate contained in new date range
        # F B B B B F
        # ^   ^
        request['endDate'] = (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test current startDate overlapping with new startDate
        # F B B B B F
        #   ^ ^
        request['startDate'] = today.strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test new reservation contained within current reservation
        # F B B B B F
        #     ^ ^
        request['startDate'] = (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        request['endDate'] = (today + datetime.timedelta(days=2)).strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test current endDate overlapping with new endDate
        # F B B B B F
        #     ^   ^
        request['endDate'] = (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test for current endDate contained within new date range
        # F B B B B F
        #     ^     ^
        request['endDate'] = (today + datetime.timedelta(days=4)).strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test for current endDate overlapping with new startDate
        # F B B B B F
        #         ^ ^
        request['startDate'] = (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d")

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test that no new reservations were created
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        self.assertEqual(len(response), reservationListOriginalLen + 1)
