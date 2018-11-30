from django.test import TestCase
from ..models import Reservation, GearCategory, Gear, Member, BlackList
from django.contrib.auth.models import User, Permission
import datetime


class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    def setUp(self):
        self.today = datetime.datetime.today()
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
                                        startDate=self.today.strftime("%Y-%m-%d"),
                                        endDate=(self.today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"))

        gr.gear.add(self.sp)
        gr.save()
        User.objects.create_superuser("admin1", "admin@gmail.com", "pass")
        executive = User.objects.create_user("exec", "exec@gmail.com", "pass")
        p = Permission.objects.get(codename="change_reservation")
        executive.user_permissions.add(p)
        executive.save()
        self.reservationId = gr.id

    def test_get(self):
        self.client.login(username="admin1", password="pass")

        response = self.client.get('/api/reservation?from=hello', content_type="application/json").data['message']
        self.assertEqual(response, "startDate is in an invalid date format. Make sure it's in the YYYY-MM-DD format.")

        query = '/api/reservation?from=2018-11-20&to=world'
        response = self.client.get(query, content_type="application/json").data['message']
        self.assertEqual(response, "endDate is in an invalid date format. Make sure it's in the YYYY-MM-DD format.")

        response = self.client.get('/api/reservation?id=hello', content_type="application/json").data['message']
        self.assertEqual(response, "id must be an integer.")

        response = self.client.get('/api/reservation?gearId=hello', content_type="application/json").data['message']
        self.assertEqual(response, "gearId must be an integer.")

        query = '/api/reservation?id=0&email=enry@email.com'
        response = self.client.get(query, content_type="application/json").data['message']
        self.assertEqual(response, "No reservation with this ID and email combination were found.")

        expected = [
            {"id": self.reservationId,
             "email": "enry@email.com",
             "licenseName": "Name on their license.",
             "licenseAddress": "Address on their license.",
             "startDate": self.today.strftime("%Y-%m-%d"),
             "endDate": (self.today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
             "status": "REQUESTED",
             "gear": [
                 {"id": self.sp.id,
                  "code": "SP01",
                  "category": "Ski poles",
                  "depositFee": "12.00",
                  "description": "Ski poles",
                  "condition": "RENTABLE",
                  "statusDescription": "",
                  "version": 1}
             ],
             "version": 1}
        ]

        response = self.client.get('/api/reservation/', content_type="application/json").data['data']
        self.assertEqual(response, expected)

        # 2 valid ways of checking query params in GET/delete requests: 

        # Way 1: response = self.client.get('/api/reservation/', {"id": 1, "email": "enry@email.com"},
        # content_type="application/json").data['data']

        # Way 2 is the below format. Either one works, but be consistent.

        # testing if get request with id and email parameters finds the appropriate reservations
        query = '/api/reservation/?id=' + str(self.reservationId) + '&email=enry@email.com'
        response = self.client.get(query, content_type="application/json").data['data']
        self.assertEqual(response, expected)

        # get all reservations that fall within/overap in this time range
        fromDate = (self.today - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        toDate = (self.today + datetime.timedelta(days=5)).strftime("%Y-%m-%d")

        getReqStr = '/api/reservation/?' + 'from=' + fromDate + '&to=' + toDate
        
        # testing if get request with start and end dates finds the appropriate reservations
        response = self.client.get(getReqStr, content_type="application/json").data['data']
        self.assertEqual(response, expected)
        
        getReqStr+='&email=enry@email.com'

        # testing if get request with start and end dates with a specific email address
        # finds the appropriate reservations
        response = self.client.get(getReqStr, content_type="application/json").data['data']
        self.assertEqual(response, expected)

        # testing if get request with just an email address gets all reservations by that email properly
        response = self.client.get('/api/reservation/?email=enry@email.com', content_type="application/json").data['data']
        self.assertEqual(response, expected)

        # Test getting all reservations gear was in
        response = self.client.get('/api/reservation/?gearId=' + str(self.sp.id), content_type="application/json").data['data']
        self.assertEqual(response, expected)

        # Test invalid combination
        response = self.client.get('/api/reservation?from=2018-11-20', content_type="application/json").data['message']
        self.assertEqual(response, "Invalid combination of query parameters.")

    def test_getHistory(self):
        self.client.login(username="admin1", password="pass")

        invalid_id = str(Reservation.objects.latest("id").id + 1)
        response = self.client.patch("/api/reservation?id=" + invalid_id, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        patch = {
            "gear": [self.sp.pk, self.bk.pk]
        }

        request = {
            "id": self.reservationId,
            "expectedVersion": 1,
            "patch": patch,
        }

        response = self.client.patch("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        # testing get history request with id
        response = self.client.get('/api/reservation/history/?id=' + str(self.reservationId), content_type="application/json").data
        self.assertEqual(len(response["data"]), 2)

    def test_checkout(self):
        self.client.login(username="admin1", password="pass")

        request = {}
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json').data['message']
        self.assertEqual(response, "There needs to be a reservation id to checkout.")

        request['id'] = self.reservationId

        # test to try checkout a reservation with a gear item that is in another reservation
        # that is not returned or cancelled
        newRes = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.",
                                            licenseAddress="Address on their license.", approvedBy="nobody",
                                            startDate=(self.today-datetime.timedelta(days=9)).strftime("%Y-%m-%d"),
                                            endDate=(self.today - datetime.timedelta(days=1)).strftime("%Y-%m-%d"))

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

        # test for checkout with cash
        request['cash'] = True
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        gr = Reservation.objects.get(id=self.reservationId)
        self.assertEqual(gr.payment, 'CASH')

        gr.payment = ""
        gr.status = "PAID"
        gr.save()
        del request['cash']

        # test to checkout a reservation succesfully
        response = self.client.post("/api/reservation/checkout/", request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # test to checkout a reservation that has an endDate before today 
        # newRes has a startDate of today-9 days by default
        newReq = {"id": newRes.pk}
        response = response = self.client.post("/api/reservation/checkout/", newReq, content_type='application/json')
        self.assertEqual(response.status_code, 406)

        # test to checkout a reservation that has an startDate after today 
        newRes.endDate = (self.today+datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        newRes.startDate = (self.today+datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        response = response = self.client.post("/api/reservation/checkout/", newReq, content_type='application/json')
        self.assertEqual(response.status_code, 406)

        newRes.delete()

        correctResponse = [{
            'id': self.reservationId,
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
                      "statusDescription": "",
                      'version': 1}],
            'endDate': (self.today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'startDate': self.today.strftime("%Y-%m-%d"),
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
        self.client.login(username="admin1", password="pass")
        
        invalid_id = str(Gear.objects.latest("id").id + 1)
        request = {
            "id": self.reservationId,
            "charge": "hello",
            "gear": [{
                'id': invalid_id,
                "comment": "Didn't get returned"}
            ]
        }

        reservation = Reservation.objects.get(pk=self.reservationId)
        reservation.status = "TAKEN"
        reservation.payment = "CASH"
        reservation.save()

        response = self.client.post("/api/reservation/checkin/", request, content_type='application/json').data['message']
        self.assertEqual(response, "There is no gear with the ID of " + invalid_id)

        request['gear'][0]['id'] = self.sp.pk
        response = self.client.post("/api/reservation/checkin/", request, content_type='application/json').data['message']
        self.assertEqual(response, "You must provide status for each gear object!")

        request['gear'][0]['status'] = "FLAGGED"
        response = self.client.post("/api/reservation/checkin/", request, content_type='application/json').data['message']
        self.assertEqual(response, "'hello' is not a valid decimal number.")

        request['charge'] = -1
        response = self.client.post("/api/reservation/checkin/", request, content_type='application/json').data['message']
        self.assertEqual(response, "Capture amount must be greater than or equal to zero.")

        request['charge'] = 0
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        expected = [{
            'id': self.reservationId,
            'email': 'enry@email.com',
            'licenseName': 'Name on their license.',
            'licenseAddress': 'Address on their license.',
            'status': 'RETURNED',
            'gear': [{'id': self.sp.pk,
                      'code': 'SP01',
                      'category': 'Ski poles',
                      'depositFee': '12.00',
                      'description': 'Ski poles',
                      'condition': 'FLAGGED',
                      "statusDescription": "Didn't get returned",
                      'version': 1}],
            'endDate': (self.today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'startDate': self.today.strftime("%Y-%m-%d"),
            'version': 1
        }]

        # tests if status of checked in reservation is "RETURNED" or not
        response = self.client.get('/api/reservation/').data['data']
        self.assertEqual(response, expected)

        # test for if reservation ID is not provided in the request
        request = {"email": "enry@email.com"}
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # test for if a reservation ID that does not exist is input in the request
        request = {"id": -2}
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json').data['message']
        self.assertEqual(response, "There is no reservation with the id of '-2'.")

        # test for if a reservation that does not have the "TAKEN" status is attempted to be checked in 
        reservation.status = "CANCELLED"
        reservation.save()
        request = {
                "id": self.reservationId,
                "charge": 0,
                "gear":[{
                       'id': self.sp.pk,
                       "status": "MISSING",
                       "comment": "Didn't get returned",
                    }
                ]
                }
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 406)

    def test_cancel(self):
        self.client.login(username="admin1", password="pass")

        request = {"id": self.reservationId}
        today = datetime.datetime.today()

        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        correctResponse = [{
            'id': self.reservationId,
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
                      "statusDescription": "",
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

        reservation = Reservation.objects.get(pk=self.reservationId)
        reservation.status = "TAKEN"
        # reservation with ID = 1 now has status "TAKEN"; returns a status error code (406)

        request = {"id": self.reservationId}

        response = self.client.post('/api/reservation/cancel/', request, content_type='application/json')
        self.assertEqual(response.status_code, 406)

    def test_approve(self):
        self.client.login(username="admin1", password="pass")

        request = {"id": self.reservationId}
        today = datetime.datetime.today()

        response = self.client.post('/api/reservation/approve/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        correctResponse = [{
            'id': self.reservationId,
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
                      "statusDescription": "",
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
        request = {"id": self.reservationId}

        response = self.client.post('/api/reservation/approve/', request, content_type='application/json')
        self.assertEqual(response.status_code, 406)

    def test_post(self):
        self.client.login(username="admin1", password="pass")

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

        expected = {
            'startDate': today.strftime("%Y-%m-%d"),
            'id': 6,
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
        postedReservationData = response
        expected["id"] = postedReservationData["id"]
        self.assertEqual(response, expected)

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
        request = {"id": postedReservationData["id"]} 
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

        expected = {
            'startDate': today.strftime("%Y-%m-%d"),
            'id': postedReservationData["id"] + 1,
            'email': 'enry@email.com',
            'endDate': (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': [self.bk.pk],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'version': 1
        }

        response = self.client.post("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, expected)

    def test_patch(self):
        self.client.login(username="admin1", password="pass")

        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        reservationListOriginalLen = len(reservationList)

        request = {}
        response = self.client.patch("/api/reservation", request, content_type="application/json").data['message']
        self.assertEqual(response, "You must specify an id to patch.")

        request['id'] = self.reservationId
        response = self.client.patch("/api/reservation", request, content_type="application/json").data['message']
        self.assertEqual(response, "You must specify an 'expectedVersion'.")

        request['expectedVersion'] = 1
        response = self.client.patch("/api/reservation", request, content_type="application/json").data['message']
        self.assertEqual(response, "You must specify a 'patch' object with attributes to patch.")

        patch = {
            "hello": [self.sp.pk, self.bk.pk],
            "startDate": (self.today + datetime.timedelta(days=0)).strftime("%Y-%m-%d"),
        }

        request['patch'] = patch
        response = self.client.patch("/api/reservation", request, content_type="application/json").data['message']
        self.assertEqual(response, "'hello' is not a valid patch attribute.")

        del request['patch']['hello']
        request['patch']['gear'] = [self.sp.pk, self.bk.pk]

        Reservation.objects.filter(id=self.reservationId).update(status="TAKEN")
        response = self.client.patch("/api/reservation", request, content_type="application/json").data['message']
        self.assertEqual(response, "The reservation status must be 'requested' or 'approved' to be modified.")
        Reservation.objects.filter(id=self.reservationId).update(status="REQUESTED")

        expected = {
            'startDate': (self.today + datetime.timedelta(days=0)).strftime("%Y-%m-%d"),
            'id': self.reservationId,
            'email': 'enry@email.com',
            'endDate': (self.today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': [
                {   
                    'id': self.sp.pk,
                    'code': 'SP01',
                    'category': 'Ski poles',
                    'depositFee': '12.00',
                    'description': 'Ski poles',
                    'condition': 'RENTABLE',
                    "statusDescription": "",
                    'version': 1
                },
                {
                    'id': self.bk.pk,
                    'code': 'BK01',
                    'category': 'Book',
                    'depositFee': '12.00',
                    'description': 'some book',
                    'condition': 'RENTABLE',
                    "statusDescription": "",
                    'version': 1
                }
            ],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'version': 2
        }

        response = self.client.patch("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, expected)

        # Test that num of reservations is the same in the DB
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"]
        self.assertEqual(len(response), reservationListOriginalLen)

        # Test with no gear update
        patch = {
            "startDate": (self.today + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        }

        request = {
            "id": self.reservationId,
            "expectedVersion": 2,
            "patch": patch,
        }

        expected = {
            'startDate': (self.today + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            'id': self.reservationId,
            'email': 'enry@email.com',
            'endDate': (self.today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            'gear': [
                {   
                    'id': self.sp.pk,
                    'code': 'SP01',
                    'category': 'Ski poles',
                    'depositFee': '12.00',
                    'description': 'Ski poles',
                    'condition': 'RENTABLE',
                    "statusDescription": "",
                    'version': 1
                },
                {
                    'id': self.bk.pk,
                    'code': 'BK01',
                    'category': 'Book',
                    'depositFee': '12.00',
                    'description': 'some book',
                    'condition': 'RENTABLE',
                    "statusDescription": "",
                    'version': 1
                }
            ],
            'licenseName': 'Name on their license.',
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'version': 3
        }

        response = self.client.patch("/api/reservation", request, content_type="application/json").data
        self.assertEqual(response, expected)

        sp1 = Gear.objects.create(code="SP02", category=self.spCat, depositFee=14.00, description="Ski poles", condition="RENTABLE", version=1)

        request = {
            "email": "henry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": (self.today + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "endDate": (self.today + datetime.timedelta(days=5)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [sp1.pk]
        }

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        patch = {
            "gear": [self.sp.pk, self.bk.pk, sp1.pk],
            "startDate": (self.today + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        }

        request = {
            "id": self.reservationId,
            "expectedVersion": 2,
            "patch": patch,
        }

        response = self.client.patch("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Make second resv and test editing it
        request = {
            "email": "henry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": (self.today + datetime.timedelta(days=6)).strftime("%Y-%m-%d"),
            "endDate": (self.today + datetime.timedelta(days=11)).strftime("%Y-%m-%d"),
            "status": "REQUESTED",
            "gear": [sp1.pk]
        }

        response = self.client.post("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        postedRequestData = response.data

        patch = {
            "gear": [self.sp.pk, self.bk.pk],
            "startDate": (self.today + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
        }

        request = {
            "id": postedRequestData["id"],
            "expectedVersion": 1,
            "patch": patch,
        }
        response = self.client.patch("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

    # BUGFIX-TEST: You can pass in any expectedVersion and it results in a patch
    # even if the expected version doesn't match
    def test_patch_expectedVersionMatters(self):
        self.client.login(username="admin1", password="pass")

        reservation = self.client.get("/api/reservation").data["data"][0]
        gear = self.client.get("/api/gear").data["data"][0]

        patch = {
            "id": reservation["id"],
            "expectedVersion": reservation["version"] + 10, # Should fail because this is not the current version 
            "patch": {
                "gear": [gear["id"]]
            }
        }

        response = self.client.patch("/api/reservation", patch, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        patch["expectedVersion"] = reservation["version"]
        response = self.client.patch("/api/reservation", patch, content_type="application/json")
        self.assertEqual(response.status_code, 200)

    def test_invalidEmail(self):
        self.client.login(username="admin1", password="pass")

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
        self.client.login(username="admin1", password="pass")

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
        self.client.login(username="exec", password="pass")

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
        self.client.login(username="admin1", password="pass")

        # A reservation is already created in the startup, so this is already at the limit
        request = {
            "member": {
                "maxReservations": 1
            }
        }
        response = self.client.post("/api/system/variability", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.client.logout()

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

    def test_testExecPrivilege(self):
        self.client.login(username="exec", password="pass")

        invalid_id = str(Reservation.objects.latest("id").id + 1)
        response = self.client.patch("/api/reservation?id=" + invalid_id, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        patch = {
            "gear": [self.sp.pk, self.bk.pk]
        }

        request = {
            "id": self.reservationId,
            "expectedVersion": 1,
            "patch": patch,
        }

        response = self.client.patch("/api/reservation", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
