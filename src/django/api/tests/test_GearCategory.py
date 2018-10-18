from django.test import TestCase
from ..models import GearCategory
from rest_framework.test import APIRequestFactory

'''
should have a test to ensure that all input and editing to category names
are input as lowercase
'''


class GearCategoryTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        GearCategory.objects.create(name="book")
        GearCategory.objects.create(name="Water bottle")
        self.client = APIRequestFactory

    def test_get(self):
        response = self.client.get("/api/gear/categories/", content_type="application/json").data['data']
        # Test json response
        expectedResponse = [{"name": "book"}, {'name': "Water bottle"}]
        self.assertEqual(response, expectedResponse)

    def test_post(self):
        dummy = {"name": "tent"}

        # Test the post request
        reponse = self.client.post("/api/gear/categories/", dummy).data
        self.assertEqual(reponse, dummy)
                                                                        
        # Make sure the post (addition of gear category) was saved to the db
        response = self.client.get("/api/gear/categories").data['data']
        correctReturn = [{"name": "book"}, {'name': "Water bottle"}, {"name": "tent"}]
        self.assertEqual(response, correctReturn)
    
    def test_delete(self):
        dummy = {"name": "book"}
        response = self.client.delete("/api/gear/categories/", dummy, content_type="application/json").data
        self.assertEqual(response, {"message": "Deleted the category: 'book'"})

        response = self.client.get("/api/gear/categories").data['data']
        self.assertEqual(response, [{'name': "Water bottle"}])
