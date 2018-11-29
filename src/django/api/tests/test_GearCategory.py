from django.test import TestCase
from ..models import GearCategory, Gear
from django.contrib.auth.models import User

'''
should have a test to ensure that all input and editing to category names
are input as lowercase
'''


class GearCategoryTestCase(TestCase):

    # Create test data and save primary key of all objects
    def setUp(self):
        self.bk = GearCategory.objects.create(name="Book")
        GearCategory.objects.create(name="Water Bottle")
        User.objects.create_superuser("admin", "admin@gmail.com", "pass")

        self.gr1 = Gear.objects.create(code="BK01", category=self.bk, depositFee=22.00,
                                       description="The Necronomicon", condition="RENTABLE", version=1)

    def test_get(self):
        self.client.login(username="admin", password="pass")
        
        expected = [{"name": "Book"}, {'name': "Water Bottle"}]
        response = self.client.get("/api/gear/categories/", content_type="application/json").data['data']
        self.assertEqual(response, expected)

    def test_post(self):
        self.client.login(username="admin", password="pass")

        request = {"hello": "world"}
        response = self.client.post("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "You are required to provide a name for a gear category")

        request = {"name": "Tent"}
        response = self.client.post("/api/gear/categories/", request, content_type='application/json').data
        self.assertEqual(response, request)

        request = {"name": "Tent"}
        response = self.client.post("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "name: gear category with this name already exists.")

        request = {"name": 123}
        response = self.client.post("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "Gear category name needs to be a string")

        # Make sure the post (addition of gear category) was saved to the db
        response = self.client.get("/api/gear/categories").data['data']
        expected = [{"name": "Book"}, {'name': "Water Bottle"}, {"name": "Tent"}]
        self.assertEqual(response, expected)

    def test_patch(self):
        self.client.login(username="admin", password="pass")

        request = {}
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "You must specify a category to patch.")

        request['name'] = "hello"
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "You must specify a 'patch' object with attributes to patch.")

        request['patch'] = {"name": 123}
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "Gear category names must be a string")

        request['name'] = 123
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "Gear category names must be a string")

        request['patch']['name'] = 'book'
        request['name'] = "Hello"
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "Gear category 'Hello' does not exist")

        request['name'] = 'Water bottle'
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data['message']
        self.assertEqual(response, "name: gear category with this name already exists.")

        request['patch']['name'] = "map"
        response = self.client.patch("/api/gear/categories/", request, content_type='application/json').data
        self.assertEqual(response, {"name": "Map"})

    def test_delete(self):
        self.client.login(username="admin", password="pass")
        response = self.client.delete("/api/gear/categories?name=Book", content_type="application/json")
        self.assertEqual(response.status_code, 409) # Cannot delete, still used for item category somewhere

        pk = self.gr1.pk
        response = self.client.delete("/api/gear?id=" + str(pk), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        response = self.client.delete("/api/gear/categories?name=Book", content_type="application/json").data
        self.assertEqual(response, {"message": "Deleted the category: 'Book'"})

        response = self.client.get("/api/gear/categories").data['data']
        self.assertEqual(response, [{'name': "Water Bottle"}])

    def test_delete_does_not_exist(self):
        self.client.login(username="admin", password="pass")
        name = "somecategorythatshouldneverexist"
        response = self.client.delete("/api/gear/categories?name=" + name, content_type="application/json").data
        self.assertEqual(response, {"message": "The gear category '" + name + "' does not exist so it cannot be deleted."})
