from django.test import TestCase
from ..models import Reservation, GearCategory, Gear, Member, BlackList
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
        Member.objects.create(email="blackListed@email.com")
        BlackList.objects.create(email="blackListed@email.com")
        self.spCat = GearCategory.objects.create(name="Ski poles")
        self.bkCat = GearCategory.objects.create(name="Book")
        self.sp = Gear.objects.create(code="SP01", category=self.spCat, depositFee=12.00, description="Ski poles",
                                      condition="RENTABLE", version=1)

        self.bk = Gear.objects.create(code="BK01", category=self.bkCat, depositFee=12.00, description="some book",
                                      condition="RENTABLE", version=1)

        gr = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.",
                                        licenseAddress="Address on their license.", approvedBy="nobody",
                                        startDate=today.strftime("%Y-%m-%d"),
                                        endDate=(today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"))

        gr.gear.add(self.sp)
        gr.save()
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

        # testing if get request with start and end dates with a specific email address
        # finds the appropriate reservations
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

        # test to try checkout a reservation with a gear item that is in another reservation
        # that is not returned or cancelled
        newRes = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.",
                                            licenseAddress="Address on their license.", approvedBy="nobody",
                                            startDate=(today-datetime.timedelta(days=9)).strftime("%Y-%m-%d"),
                                            endDate=(today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"))

        newRes.gear.add(self.sp)
        newRes.gear.add(self.bk)
        newRes.status = "TAKEN"
        newRes.save()

        # test fails with 406 error, as reservation with id = 1 has gear item with code "SP01", which is also in the
        # above reservation. The above reservation is before today - the day of the checkout -
        # but has status = "TAKEN", causing the 406 error.
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 406)

        # When the status of the above reservation gets changed to cancelled or returned, the reservation with
        # id = 1 will be succesfully checked out.
        newRes.status = "RETURNED"
        newRes.save()

        # test to checkout a reservation succesfully
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        newRes.delete()

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

        # tests if status of succesfully checked out reservation is "TAKEN" or not
        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

        # order of the next 2 tests matters, as the check for unrentable gear is done before the check for a
        # unpaid reservation

        # test to try and checkout a reservation that is not paid for
        gr.status = "APPROVED"
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 406)

        # test to try and checkout a reservation with gear that is not rentable
        sp = Gear.objects.create(code="SP02", category=self.spCat, depositFee=12.00, description="Ski poles",
                                 condition="DELETED", version=1)
        gr.gear.add(sp)
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 403)

        # test to try and checkout a reservation that DNE
        request = {"id": -1}
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_checkin(self):
        today = datetime.datetime.today()

        #test for a succesful checkin of a reservation
        request = {"id": 1}
        reservation = Reservation.objects.get(pk=1)
        reservation.status = "TAKEN"
        reservation.save()

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

        # tests if status of checked in reservation is "RETURNED" or not
        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, correctResponse)

        # test for if reservation ID is not provided in the request
        request = {"email": "enry@email.com"}
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # test for if a reservation ID that does not exist is input in the request
        request = {"id": -2}
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # test for if a reservation that does not have the "TAKEN" status is attempted to be checked in 
        reservation.status = "CANCELLED"
        reservation.save()
        request = {"id": 1}
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 406)


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

        # reservation with ID = 1 now has status "approved" because of the first test; the response should
        # return a status error.
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
            'id': 3,
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


      # Test that canceling releases hold on gear
        request = {"id": 3} 
        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)
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
            'id': 4,
            'email': 'enry@email.com',
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': [self.bk.pk],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'version': 1
        }

        response = self.client.post("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, correctResponse)


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


    def test_blackListedEmail(self):
        today = datetime.datetime.today()

        request = {
            "email": "blackListed@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": today.strftime("%Y-%m-%d"),
            "endDate": (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [self.bk.pk]
        }

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_postTooFarInFuture(self):
        today = datetime.datetime.today()

        request = {
            "email": "enry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": (today + datetime.timedelta(days=22)).strftime("%Y-%m-%d"),
            "endDate": (today + datetime.timedelta(days=28)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [self.bk.pk]
        }

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)


    def test_tooManyReservations(self):
        # A reservation is already created in the startup, so this is already at the limit
        request = {
            "member": {
                "maxRentals": 1
            }
        }
        response = self.client.post("/api/system/variability", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        today = datetime.datetime.today()

        request = {
            "email": "enry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": (today).strftime("%Y-%m-%d"),
            "endDate": (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [self.bk.pk]
        }

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

