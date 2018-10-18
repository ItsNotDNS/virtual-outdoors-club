from django.test import TestCase
from rest_framework.test import APIRequestFactory
from decimal import Decimal
from ..models import GearCategory, Gear


class GearTestCase(TestCase):

    # Executed before any tests are run to set up the database.
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        sb = GearCategory.objects.create(name="sleeping bag")
        bp = GearCategory.objects.create(name="backpack")

        Gear.objects.create(code="BP01", category=bp, depositFee=50.00, description="A black Dakine backpack", version=1)
        Gear.objects.create(code="SB01", category=sb, depositFee=50.00, description="A old red sleeping bag", version=1)
        self.client = APIRequestFactory()
        self.sbpk = sb.pk
        self.bppk = bp.pk

    def test_get(self):
        response = self.client.get("/api/gear/", content_type="applcation/json").data
        expectedResponse = {
            "data": [{
                "id": 1,
                "code": "BP01",
                "category": "backpack",
                "checkedOut": False,
                "depositFee": "50.00",
                "description": "A black Dakine backpack",
                #"condition": "NOT YET IMPLEMENTED",
                "version": 1
            }, {
                "id": 2,
                "code": "SB01",
                "category": "sleeping bag",
                "depositFee": "50.00",
                "checkedOut": False,
                "description": "A old red sleeping bag",
                #"condition": "NOT YET IMPLEMENTED",
                "version": 1
            }]
        }

        self.assertEqual(response, expectedResponse)

    def test_post(self):
        gearList = self.client.get("/api/gear/", content_type='application/json').data["data"] # returned as {data: [...]}
        gearListOriginalLen = len(gearList)

        request = {
            "code": "SB02",
            "category": "sleeping bag",
            "depositFee": "50.00",
            "description": "A new blue sleeping bag"
        }

        expectedResponse = {
            "id": gearListOriginalLen + 1,
            "code": request["code"],
            "category": request["category"],
            "depositFee": request["depositFee"],
            "checkedOut": False, # default value
            "description": request["description"],
            #"condition": "NOT YET IMPLEMENTED",
            "version": 1        # default value
        }

        # Test POST (create new gear)
        response = self.client.post("/api/gear/", request, content_type='application/json').data
        self.assertEqual(response, expectedResponse)

        # Test GET (created and added list)
        response = self.client.get("/api/gear/", content_type='application/json').data["data"] # returned as {data: [...]}
        #self.assertEqual(response.status_code, 200) # shouldn't fail
        self.assertEqual(len(response), gearListOriginalLen + 1) # len of GET should +1 original len

    # POST will fail when sending bad key like "descrip7tion"
    def test_post_invalidKey(self):
        request = {
            "code": "SB02",
            "category": "sleeping bag",
            "depositFee": "50.00",
            "descrip7tion": "A new blue sleeping bag"
        }

        response = self.client.post("/api/gear/", request, content_type='application/json').data
        response = response["message"]

        self.assertTrue("'descrip7tion' is" in response)

    def test_post_missingKeys(self):
        request = {
            "code": "SB02",
            "category": "sleeping bag",
            "description": "A new blue sleeping bag"
        }

        response = self.client.post("/api/gear/", request, content_type='application/json').data
        response = response["message"]
        self.assertTrue("provide a 'depositFee'" in response)

        request["depositFee"] = "50.00"
        del request["category"]

        response = self.client.post("/api/gear/", request, content_type='application/json').data
        response = response["message"]
        self.assertTrue("provide a 'category'" in response)

    def test_patch(self):
        patch = {
            "code": "SB02",
            "category": "sleeping bag",
            "depositFee": "100.00",
            "description": "This backpack was actually a sleeping bag all along!",
            #"condition": "RENTABLE"
        }
        request = {
            "id": 1,
            "expectedVersion": 1,
            "patch": patch
        }

        expectedResponse = {
            "id": request["id"],
            "code": patch["code"],
            "category": patch["category"],
            "depositFee": patch["depositFee"],
            "checkedOut": False,
            "description": patch["description"],
            #"condition": "NOT YET IMPLEMENTED",
            "version": request["expectedVersion"] + 1
        }

        # check response data
        response = self.client.patch("/api/gear", request, content_type='application/json').data
        self.assertEqual(response, expectedResponse)

        # check database
        g = Gear.objects.get(id=request["id"])
        self.assertEqual(g.code, patch["code"])
        self.assertEqual(g.category.name, patch["category"])
        self.assertEqual(g.depositFee, Decimal(patch["depositFee"]))
        self.assertEqual(g.description, patch["description"])
        #self.assertEqual(g.code, patch["code"])

