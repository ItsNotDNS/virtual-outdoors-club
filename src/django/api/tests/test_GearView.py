from django.test import TestCase
from decimal import Decimal
from django.contrib.auth.models import User
from ..models import GearCategory, Gear, Reservation
import datetime


class GearTestCase(TestCase):

    # Executed before any tests are run to set up the database.
    def setUp(self):
        self.today = datetime.date.today()
        sb = GearCategory.objects.create(name="Sleeping Bag")
        bp = GearCategory.objects.create(name="Backpack")

        self.gearObj1 = Gear.objects.create(code="BP01", category=bp, depositFee=50.00,
                                            description="A black Dakine backpack", condition="RENTABLE", version=1)
        self.gearObj2 = Gear.objects.create(code="SB01", category=sb, depositFee=50.00,
                                            description="A old red sleeping bag", condition="RENTABLE", version=1)
        self.sbpk = sb.pk
        self.bppk = bp.pk
        User.objects.create_superuser("admin1", "admin@gmail.com", "pass")

    def test_get(self):
        response = self.client.get("/api/gear/", content_type="application/json").data
        expected = {
            "data": [{
                "id": self.gearObj1.id,
                "code": "BP01",
                "category": "Backpack",
                "depositFee": "50.00",
                "description": "A black Dakine backpack",
                "condition": "RENTABLE",
                "statusDescription": "",
                "version": 1
            }, {
                "id": self.gearObj2.id,
                "code": "SB01",
                "category": "Sleeping Bag",
                "depositFee": "50.00",
                "description": "A old red sleeping bag",
                "condition": "RENTABLE",
                "statusDescription": "",
                "version": 1
            }]
        }
        response = self.client.get("/api/gear/", content_type="application/json").data
        self.assertEqual(response, expected)

    def test_get_reservation(self):
        self.client.login(username="admin1", password="pass")

        url = "/api/gear?from=hello&to=world"
        response = self.client.get(url, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        today = datetime.datetime.today()
        startDate = today.strftime("%Y-%m-%d")
        endDate = (today + datetime.timedelta(days=3)).strftime("%Y-%m-%d")
        url = "/api/gear?from=" + startDate + "&to=" + endDate
        response = self.client.get(url, content_type="application/json").data["data"]
        originalResponseLength = len(response)

        gr = Reservation.objects.create(
            email="enry@email.com", 
            licenseName="Name on their license.",
            status="APPROVED",
            licenseAddress="Address on their license.", 
            approvedBy="nobody",
            startDate=startDate,
            endDate=endDate
        )
        gr.gear.add(self.gearObj1)
        gr.save()

        response = self.client.get(url, content_type="application/json").data["data"]
        self.assertEqual(originalResponseLength - 1, len(response))

        today = datetime.datetime.today() + datetime.timedelta(days=4)
        startDate = today.strftime("%Y-%m-%d")
        endDate = (today + datetime.timedelta(days=8)).strftime("%Y-%m-%d")
        url = "/api/gear?from=" + startDate + "&to=" + endDate
        response = self.client.get(url, content_type="application/json").data['data']
        self.assertEqual(len(response), originalResponseLength)

    def test_gearHistory(self):
        self.client.login(username="admin1", password="pass")
        
        response = self.client.get("/api/gear/history/?id=").data['message']
        self.assertEqual(response, "Must give the ID to search for")

        invalid_id = Gear.objects.latest("id").id + 1
        response = self.client.get("/api/gear/history/?id=" + str(invalid_id)).data['message']
        self.assertEqual(response, "Gear ID does not exist")

        query = "/api/gear/history/?id=" + str(self.gearObj1.id)
        response = self.client.get(query, content_type="application/json").data

        expected = {
            "data": [{
                "id": self.gearObj1.id,
                "code": "BP01",
                "category": "Backpack",
                "depositFee": "50.00",
                "description": "A black Dakine backpack",
                "condition": "RENTABLE",
                "statusDescription": "",
                "version": 1
            }]
        }
        self.assertEqual(response, expected)

        # Patch and check history again
        patch = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "depositFee": "100.00",
            "description": "This backpack was actually a sleeping bag all along!",
            "condition": "FLAGGED"
        }
        request = {
            "id": self.gearObj2.id,
            "expectedVersion": 1,
            "patch": patch
        }
        # check response data
        response = self.client.patch("/api/gear", request, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Check if model history kept properly
        query = "/api/gear/history/?id=" + str(self.gearObj2.id)
        response = self.client.get(query, content_type="application/json").data
        expected = {
            "data": [
                {"id": self.gearObj2.id,
                 "code": "SB02",
                 "category": "Sleeping Bag",
                 "depositFee": "100.00",
                 "description": "This backpack was actually a sleeping bag all along!",
                 "condition": "FLAGGED",
                 "statusDescription": "",
                 "version": 2},
                {"id": self.gearObj2.id,
                 "code": "SB01",
                 "category": "Sleeping Bag",
                 "depositFee": "50.00",
                 "description": "A old red sleeping bag",
                 "condition": "RENTABLE",
                 "statusDescription": "",
                 "version": 1}
            ]}

        self.assertEqual(response, expected)

        # Test illegal condition values
        patch = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "depositFee": "100.00",
            "description": "This backpack was actually a sleeping bag all along!",
            "condition": "DELETED"
        }
        request = {
            "id": 2,
            "expectedVersion": 2,
            "patch": patch
        }
        # check response data
        response = self.client.patch("/api/gear", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        patch = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "depositFee": "100.00",
            "description": "This backpack was actually a sleeping bag all along!",
            "condition": "ASDF:LH"
        }
        request = {
            "id": 2,
            "expectedVersion": 2,
            "patch": patch
        }
        # check response data
        response = self.client.patch("/api/gear", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_post(self):
        self.client.login(username="admin1", password="pass")

        gearList = self.client.get("/api/gear/", content_type='application/json').data["data"]
        gearListOriginalLen = len(gearList)

        request = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "depositFee": "50.00",
            "description": "A new blue sleeping bag",
            "condition": "RENTABLE",
        }

        expected = {
            "id": Gear.objects.latest('id').id + 1,
            "code": request["code"],
            "category": request["category"],
            "depositFee": request["depositFee"],
            "description": request["description"],
            "condition": "RENTABLE",
            "statusDescription": "",
            "version": 1        # default value
        }

        # Test POST (create new gear)
        response = self.client.post("/api/gear/", request, content_type='application/json').data
        self.assertEqual(response, expected)

        # Test GET (created and added list)
        response = self.client.get("/api/gear/", content_type='application/json').data["data"]
        self.assertEqual(len(response), gearListOriginalLen + 1)

    # POST will fail when sending bad key like "descrip7tion"
    def test_post_invalidKey(self):
        self.client.login(username="admin1", password="pass")

        request = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "depositFee": "50.00",
            "descrip7tion": "A new blue sleeping bag"
        }

        response = self.client.post("/api/gear/", request, content_type='application/json').data
        response = response["message"]

        self.assertTrue("'descrip7tion' is" in response)

    def test_post_missingKeys(self):
        self.client.login(username="admin1", password="pass")

        request = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "description": "A new blue sleeping bag",
            "condition": "RENTABLE"
        }

        response = self.client.post("/api/gear/", request, content_type='application/json').data
        response = response["message"]
        self.assertTrue("depositFee: This field is required." in response)

        request["depositFee"] = 12.00
        del request["category"]

        response = self.client.post("/api/gear/", request, content_type='application/json').data
        response = response["message"]

        self.assertTrue("category: This field is required." in response)

    def test_patch(self):
        self.client.login(username="admin1", password="pass")

        request = {}
        response = self.client.patch("/api/gear/", request, content_type='application/json').data["message"]
        self.assertEqual(response, "You must specify an 'id' to patch.")

        request["id"] = self.gearObj2.id
        response = self.client.patch("/api/gear/", request, content_type='application/json').data["message"]
        self.assertEqual(response, "You must specify an 'expectedVersion'.")

        request["expectedVersion"] = 1
        response = self.client.patch("/api/gear/", request, content_type='application/json').data["message"]
        self.assertEqual(response, "You must specify a 'patch' object with attributes to patch.")

        patch = {
            "code": "SB02",
            "category": "Sleeping Bag",
            "depositFee": "1000.00",
            "description": "This backpack was actually a sleeping bag all along!",
            "condition": "FLAGGED"
        }
        request['patch'] = patch

        response = self.client.patch("/api/gear/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        request['patch']['depositFee'] = "100.00"
        expected = {
            "id": request["id"],
            "code": patch["code"],
            "category": patch["category"],
            "depositFee": patch["depositFee"],
            "description": patch["description"],
            "condition": "FLAGGED",
            "statusDescription": "",
            "version": request["expectedVersion"] + 1
        }

        # check response data
        response = self.client.patch("/api/gear", request, content_type='application/json').data
        self.assertEqual(response, expected)

        # check database
        g = Gear.objects.get(id=request["id"])
        self.assertEqual(g.code, patch["code"])
        self.assertEqual(g.category.name, patch["category"])
        self.assertEqual(g.depositFee, Decimal(patch["depositFee"]))
        self.assertEqual(g.description, patch["description"])
        self.assertEqual(g.condition, patch["condition"])

    def test_delete(self):
        self.client.login(username="admin1", password="pass")

        response = self.client.delete("/api/gear?id=" + str(self.gearObj2.pk), content_type="application/json").data
        self.assertEqual(response, {"message": "Successfully deleted gear: 'SB01'"})
        
        response = self.client.get("/api/gear/", content_type='application/json').data["data"]

        correctResponse = [{
                "id": self.gearObj1.id,
                "code": "BP01",
                "category": "Backpack",
                "depositFee": "50.00",
                "description": "A black Dakine backpack",
                "condition": "RENTABLE",
                "statusDescription": "",
                "version": 1
            }, {
                "id": self.gearObj2.id,
                "code": "SB01",
                "category": "Sleeping Bag",
                "depositFee": "50.00",
                "description": "A old red sleeping bag",
                "condition": "DELETED",
                "statusDescription": "",
                "version": 1
            }]

        self.assertEqual(response, correctResponse)

    def test_delete_missingId(self):
        self.client.login(username="admin1", password="pass")

        response = self.client.delete("/api/gear?code=SB02", content_type="application/json").data
        self.assertEqual(response, {"message": "Missing gear id in request"})

    def test_delete_DNEGear(self):
        self.client.login(username="admin1", password="pass")

        lastGear = Gear.objects.latest('id')
        response = self.client.delete("/api/gear?id=" + str(lastGear.id + 1), content_type="application/json").data
        self.assertEqual(response, {"message": "The gear item trying to be removed does not exist"})
