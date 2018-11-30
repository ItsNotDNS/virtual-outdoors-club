from django.test import TestCase
from ..models import Reservation, Gear, GearCategory, Member
import datetime
from django.core import mail
from django.contrib.auth.models import User


class SystemTestCase(TestCase):

    # Executed before any tests are run to set up the database.
    def setUp(self):
        User.objects.create_superuser("admin1", "admin@gmail.com", "pass")

    def test_get(self):

        # Test to ensure non-admins can't make the get request (a 401, NOT FORBIDDEN error is thrown)
        response = self.client.get("/api/system/", content_type="application/json")
        self.assertEqual(response.status_code, 401)

        # After logging in, the get request can be succesfully made (see below in the "Succesful get request test")
        self.client.login(username="admin1", password="pass")

        # Note that initially, disableSys will be set to False - these are their initial values.
        # Observe how even when theis variable is not first set by the client,
        # there is a response of these default initialized values.

        # initialization test
        correctResponse = [{"service": "disableSys", "disabled": False},]

        # Succesful get request test
        response = self.client.get("/api/system/", content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(correctResponse, response.data["data"])

    def test_disableRentalSystem(self):
        # Test to ensure non-admins can't make the get request,
        # regardless of the request (a 401, NOT FORBIDDEN error is thrown)

        # Correct request to disable the rental system:
        request = {"disableSys": True, "cancelRes": False}
        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 401)

        # After logging in, the disableRentalSystem request can be succesfully made.
        # No tests below now throw the 401 error.
        self.client.login(username="admin1", password="pass")

        # 2 keys required for a request to disableRentalSystem: "disableSys" and "cancelRes" (both with boolean values)
        # 1 key required for a request to enable the RentalSystem: "disableSys" (bool)

        # missing key in request test
        request = {"name": "John Smith"}
        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # test to enable system while also passing in cancelRes variable (rejected with error code 400)
        request = {"disableSys": False, "cancelRes": False}
        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # test to enable system succesfully (note how only 1 key is accepted: disaleSys, when enabling the system)
        request = {"disableSys": False}
        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        # tests to disable rental system succesfully

        today = datetime.date.today()

        # 3 different reservations which should all be cancelled if the system is disabled

        # Reservation that starts today (present reservations)
        res1 = Reservation(email="henry@email.com", licenseName="Name on their license.",
                           startDate=today.strftime("%Y-%m-%d"),
                           endDate=(today + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
                           status="APPROVED")

        # Reservation that started 7 days from now (past reservations)
        res2 = Reservation(email="shardul@email.com", licenseName="Name on their license.",
                           licenseAddress="Address on their license.", approvedBy="nobody",
                           startDate=(today - datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
                           endDate=(today + datetime.timedelta(days=8)).strftime("%Y-%m-%d"),
                           status="APPROVED")

        # Reservation that will start in 7 days (future reservations)
        res3 = Reservation(email="shardul@email.com", licenseName="Name on their license.",
                           licenseAddress="Address on their license.", approvedBy="nobody",
                           startDate=(today + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
                           endDate=(today + datetime.timedelta(days=20)).strftime("%Y-%m-%d"),
                           status="REQUESTED")

        Reservation.objects.bulk_create([res1, res2, res3])

        # Test for succesful disabling of rental system without cancelling reservations not taken
        request = {"disableSys": True, "cancelRes": False}

        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        # The status of the above reservations should be unchanged as cancelRes = False
        statusTuple = (res1.status, res2.status, res3.status,)

        self.assertEqual(statusTuple, ("APPROVED", "APPROVED", "REQUESTED",))

        # Test for succesful disabling of rental system while also cancelling reservations not taken

        request = {"disableSys": True, "cancelRes": True}

        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        # Note: we MUST retrieve the same reservations again using "get" and assert those status.
        # Simply using the reservation objects' info from above won't work because reservations
        # were changed in the DB, so the above reservations info is outdated.

        res1 = Reservation.objects.get(pk=res1.pk)
        res2 = Reservation.objects.get(pk=res2.pk)
        res3 = Reservation.objects.get(pk=res3.pk)

        # The status of the above reservations should all be changed to "CANCELLED" as cancelRes = True
        statusTuple = (res1.status, res2.status, res3.status,)

        self.assertEqual(statusTuple, ("CANCELLED", "CANCELLED", "CANCELLED",))

        # Test that three messages - one for each reservation cancellation - has been sent.
        self.assertEqual(len(mail.outbox), 3)

        # Verify that the subjects of all three messages are correct.
        self.assertEqual(mail.outbox[0].subject, 'Reservation Cancelled')
        self.assertEqual(mail.outbox[0].to, ['henry@email.com'])
        self.assertEqual(mail.outbox[1].subject, 'Reservation Cancelled')
        self.assertEqual(mail.outbox[1].to, ['shardul@email.com'])
        self.assertEqual(mail.outbox[2].subject, 'Reservation Cancelled')
        self.assertEqual(mail.outbox[2].to, ['shardul@email.com'])

        # Test to ensure that once the rental system has been DISABLED {"disableSys": True},
        # no more reservations can be made:

        self.bkCat = GearCategory.objects.create(name="Book")
        self.bk = Gear.objects.create(code="BK01", category=self.bkCat, depositFee=12.00, description="some book",
                                      condition="RENTABLE", version=1)

        memb = Member.objects.create(email="sharduls@email.com")
        memb.save()
        resRequest ={
                    "email": "sharduls@email.com",
                    "licenseName": "Name on their license.",
                    "licenseAddress": "Address on their license.",
                    "startDate": (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
                    "endDate": (today + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
                    "status": "REQUESTED",
                    "gear": [self.bk.pk]
                    }

        # Attempt to make any new reservation fails with a "FORBIDDEN" 403 HTML status code
        response = self.client.post("/api/reservation", resRequest, content_type="application/json")

        self.assertEqual(response.status_code, 403)

        # Test to ensure if the rental system has been ENABLED again (a request with {"disableSys": False},
        # reservations can be made again:
        request = {"disableSys": False}

        response = self.client.post("/api/system/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        # New reservations can be succesfully made again, with a "SUCCESS" 200 HTML status code
        response = self.client.post("/api/reservation", resRequest, content_type="application/json")
        self.assertEqual(response.status_code, 200)
