from django.test import TestCase
from rest_framework.test import APIRequestFactory
from decimal import Decimal
from ..models import Member


class MemberTestCase(TestCase):

    # Executed before any tests are run to set up the database.
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        self.client = APIRequestFactory()

    def test_updateMemberList(self):
        request = {
            "members": [
                    {"email": "jon@gmail.com"},
                    {"email": "abc@gmail.com"},
                ]
        }
        response = self.client.post("/api/members/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        response = response.data
        
        members = Member.objects.all()
        self.assertEqual(len(members), 2)

        # Test that it deletes instead of appending
        request = {
            "members": [
                    {"email": "smith@gmail.com"},
                    {"email": "cad@gmail.com"},
                    {"email": "ham@hotmail.com"},
                ]
        }
        response = self.client.post("/api/members/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        response = response.data
        
        members = Member.objects.all()
        self.assertEqual(len(members), 3)

        # Test for non-email entities
        request = {
            "members": [
                    {"email": "cad-gmail.com"}
                ]
        }
        response = self.client.post("/api/members/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # Test for missing email
        request = {
            "members": [
                    {"Name": "James"}
                ]
        }
        response = self.client.post("/api/members/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)


        # Test for too short email
        request = {
            "members": [
                    {"email": ""}
                ]
        }
        response = self.client.post("/api/members/", request, content_type="application/json")
        self.assertEqual(response.status_code, 400)


    def test_getMemberList(self):
        # also tests lowercase
        request = {
            "members": [
                    {"email": "JoN@gMaiL.com"},
                    {"email": "abc@gmail.com"},
                ]
        }

        correctResponse = [
            {"email": "jon@gmail.com"},
            {"email": "abc@gmail.com"},
        ]

        response = self.client.post("/api/members/", request, content_type="application/json")
        self.assertEqual(response.status_code, 200)

        response = self.client.get("/api/members/", content_type="application/json").data["data"]
        self.assertEqual(response, correctResponse)

