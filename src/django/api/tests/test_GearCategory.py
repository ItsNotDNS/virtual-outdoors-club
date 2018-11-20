from django.test import TestCase
from ..models import GearCategory, Gear
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
        self.bk = GearCategory.objects.create(name="Book")
        GearCategory.objects.create(name="Water Bottle")
        self.gearObj1 = Gear.objects.create(code="BK01", category=self.bk, depositFee=22.00, description="The Necronomicon", condition="RENTABLE", version=1) 
        self.client = APIRequestFactory()

    def test_get(self):
        response = self.client.get("/api/gear/categories/", content_type="application/json").data['data']
        # Test json response
        expectedResponse = [{"name": "Book"}, {'name': "Water Bottle"}]
        self.assertEqual(response, expectedResponse)

    def test_post(self):
        request = {"name": "Tent"}

        # Test the post request
        response = self.client.post("/api/gear/categories/", request, content_type='application/json').data
        self.assertEqual(response, request)
                                                                        
        # Make sure the post (addition of gear category) was saved to the db
        response = self.client.get("/api/gear/categories").data['data']
        correctReturn = [{"name": "Book"}, {'name': "Water Bottle"}, {"name": "Tent"}]
        self.assertEqual(response, correctReturn)
    
    def test_delete(self):
        response = self.client.delete("/api/gear/categories?name=Book", content_type="application/json")
        self.assertEqual(response.status_code, 409) # Cannot delete, still used for item category somewhere

        pk = self.gearObj1.pk
        response = self.client.delete("/api/gear?id=" + str(pk), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        response = self.client.delete("/api/gear/categories?name=Book", content_type="application/json").data
        self.assertEqual(response, {"message": "Deleted the category: 'Book'"})

        response = self.client.get("/api/gear/categories").data['data']
        self.assertEqual(response, [{'name': "Water Bottle"}])


    def test_delete_does_not_exist(self):
        name = "somecategorythatshouldneverexist"
        response = self.client.delete("/api/gear/categories?name=" + name, content_type="application/json").data
        self.assertEqual(response, {"message": "The gear category '" + name + "' does not exist so it cannot be deleted."})
