from django.test import TestCase
from ..models import BlackList
from django.contrib.auth.models import User


class BlackListTestCase(TestCase):

    # Create test data and save primary key of all objects
    def setUp(self):
        BlackList.objects.create(email="jim@gmail.com")
        BlackList.objects.create(email="jam@gmail.com")
        User.objects.create_superuser("admin1", "admin@gmail.com", "pass")

    def test_get(self):
        self.client.login(username="admin1", password="pass")

        response = self.client.get("/api/members/blacklist/", content_type="application/json").data['data']
        # Test json response
        expectedResponse = [{"email": "jim@gmail.com"}, {'email': "jam@gmail.com"}]
        self.assertEqual(response, expectedResponse)

    def test_post(self):
        self.client.login(username="admin1", password="pass")

        request = {"email": "henry@gmail.com"}

        # Test the post request
        response = self.client.post("/api/members/blacklist/", request, content_type='application/json').data
        self.assertEqual(response, request)
                                                                        
        # Make sure the post (addition of blacklist email) was saved to the db
        response = self.client.get("/api/members/blacklist").data['data']
        correctReturn = [{"email": "jim@gmail.com"}, {"email": "jam@gmail.com"}, {"email": "henry@gmail.com"}]
        self.assertEqual(response, correctReturn)

        # Test duplicate
        request = {"email": "henry@gmail.com"}
        response = self.client.post("/api/members/blacklist/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # Test bad post
        request = {"name": "henry@gmail.com"}
        response = self.client.post("/api/members/blacklist/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        request = {"email": "henry"}
        response = self.client.post("/api/members/blacklist/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        request = {"email": ""}
        response = self.client.post("/api/members/blacklist/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

        request = {"email": 123}
        response = self.client.post("/api/members/blacklist/", request, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_delete(self):
        self.client.login(username="admin1", password="pass")

        response = self.client.delete("/api/members/blacklist?email=jim@gmail.com", content_type="application/json").data
        self.assertEqual(response, {"message": "Deleted the email: 'jim@gmail.com'"})

        response = self.client.get("/api/members/blacklist").data['data']
        self.assertEqual(response, [{'email': "jam@gmail.com"}])

    def test_delete_does_not_exist(self):
        self.client.login(username="admin1", password="pass")

        email = "someemailthatshouldneverexist"
        response = self.client.delete("/api/members/blacklist?email=" + email, content_type="application/json").data
        self.assertEqual(response, {"message": "The email '" + email + "' does not exist so it cannot be deleted."})
