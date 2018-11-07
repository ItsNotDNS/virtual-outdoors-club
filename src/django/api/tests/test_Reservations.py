from django.test import TestCase
from ..models import Reservation, GearCategory, Gear, Member
from rest_framework.test import APIRequestFactory
import datetime


class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        today = datetime.datetime.today()
        Member.objects.create(email="enry@email.com")
        Member.objects.create(email="henry@email.com")
        spCat = GearCategory.objects.create(name="Ski poles")
        bkCat = GearCategory.objects.create(name="Book")
        sp = Gear.objects.create(code="SP01", category=spCat, depositFee=12.00, description="Ski poles", condition="RENTABLE", version=1)
        bk = Gear.objects.create(code="BK01", category=bkCat, depositFee=12.00, description="some book", condition="RENTABLE", version=1)
        gr = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.", licenseAddress="Address on their license.", approvedBy="nobody", startDate=today.strftime("%Y-%m-%d"), endDate=(today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"))
        gr.gear.add(sp)
        gr.save()
        self.sp = sp
        self.bk = bk
        self.client = APIRequestFactory

    def test_get(self):
        today = datetime.datetime.today()
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
                            'startDate': today.strftime("%Y-%m-%d"),
                            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
                            'version': 1
                            }]

        self.assertEqual(response, correctResponse)

        # 2 valid ways of checking query params in GET/delete requests: 

        # Way 1: response = self.client.get('/api/reservation/', {"id": 1, "email": "enry@email.com"},
        # content_type="application/json").data['data']

        # Way 2 is the below format. Either one works, but be consistent.

        # testing if get request with id and email parameters finds the appropriate reservations
        response = self.client.get('/api/reservation/?id=1&email=enry@email.com', content_type="application/json").data['data']
        self.assertEqual(response, correctResponse)

        # get all reservations that fall within/overap in this time range
        fromDate = (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        toDate = (today + datetime.timedelta(days=5)).strftime("%Y-%m-%d") 

        getReqStr = '/api/reservation/?' + 'from=' + fromDate + '&to=' + toDate
        
        # testing if get request with start and end dates finds the appropriate reservations
        response = self.client.get(getReqStr, content_type="application/json").data['data']
        self.assertEqual(response, correctResponse)
        
        getReqStr+='&email=enry@email.com'

        # testing if get request with start and end dates with a specific email address finds the appropriate reservations
        response = self.client.get(getReqStr, content_type="application/json").data['data']
        self.assertEqual(response, correctResponse)

        # testing if get request with just an email address gets all reservations by that email properly
        response = self.client.get('/api/reservation/?email=enry@email.com', content_type="application/json").data['data']
        self.assertEqual(response, correctResponse)        


    def test_checkout(self):
        gr = Reservation.objects.get(pk=1)
        gr.status = "PAID"
        gr.save()
        request = {"id": 1}
        today = datetime.datetime.today()

        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        correctResponse = [{
            'id': 1,
            'email': 'enry@email.com',
            'licenseName': 'Name on their license.',
            'licenseAddress': 'Address on their license.',
            'status': 'TAKEN',
            'gear': [{'id': self.sp.pk,
                      'code': 'SP01',
                      'category': 'Ski poles',
                      'depositFee': '12.00',
                      'description': 'Ski poles',
                      'condition': 'RENTABLE',
                      'version': 1}],
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'startDate': today.strftime("%Y-%m-%d"),
            'version': 1
            }]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)


    def test_checkin(self):
        request = {"id": 1}
        today = datetime.datetime.today()

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
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'startDate': today.strftime("%Y-%m-%d"),
            'version': 1
            }]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

        # Doing it again should return an error because the condition is different
        response = self.client.post("/api/reservation/checkin/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

       

    def test_cancel(self):
        request = {"id": 1}
        today = datetime.datetime.today()

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
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'startDate': today.strftime("%Y-%m-%d"),
            'version': 1
            }]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

        request = {"email": "enry@email.com"}

        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        request = {"id": -2}

        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        reservation = Reservation.objects.get(pk=1)
        reservation.status = "TAKEN"
        # reservation with ID = 1 now has status "TAKEN"; returns a status error code (406)

        request = {"id": 1}

        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 406)


    def test_approve(self):
        request = {"id": 1}
        today = datetime.datetime.today()

        response = self.client.post('/api/reservation/approve/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        correctResponse = [{
            'id': 1,
            'email': 'enry@email.com',
            'licenseName': 'Name on their license.',
            'licenseAddress': 'Address on their license.',
            'status': 'APPROVED',
            'gear': [{'id': self.sp.pk,
                      'code': 'SP01',
                      'category': 'Ski poles',
                      'depositFee': '12.00',
                      'description': 'Ski poles',
                      'condition': 'RENTABLE',
                      'version': 1}],
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'startDate': today.strftime("%Y-%m-%d"),
            'version': 1
            }]

        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

        request = {"email": "enry@email.com"}

        response = self.client.post('/api/reservation/approve/', request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        request = {"id": -2}

        response = self.client.post('/api/reservation/approve/', request, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # reservation with ID = 1 now has status "approved" because of the first test; the response should return a status error.
        request = {"id": 1}

        response = self.client.post('/api/reservation/approve/', request, content_type='application/json')
        self.assertEqual(response.status_code, 406)

    def test_post(self):
        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        reservationListOriginalLen = len(reservationList)

        today = datetime.datetime.today()

        request = {
            "email": "enry@email.com",
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
            'email': 'enry@email.com',
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': [self.bk.pk],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'version': 1
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


    def test_patch(self):

        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        reservationListOriginalLen = len(reservationList)

        today = datetime.datetime.today()

        patch = {
            "gear": [self.sp.pk, self.bk.pk]
        }

        request = {
            "id": 1,
            "expectedVersion": 1,
            "patch": patch,
        }

        correctResponse = {
            'startDate': today.strftime("%Y-%m-%d"),
            'id': 1,
            'email': 'enry@email.com',
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': patch["gear"],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'version': 2
        }

        response = self.client.patch("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, correctResponse)

        # Test that num of reservations is the same in the DB
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        self.assertEqual(len(response), reservationListOriginalLen)


    def test_invalidEmail(self):
        today = datetime.datetime.today()

        request = {
            "email": "invalid@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": today.strftime("%Y-%m-%d"),
            "endDate": (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [self.bk.pk],
            "version": 1
        }

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)



