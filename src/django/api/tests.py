from django.test import TestCase, Client
from .models import Gear, GearCategory

# Create your tests here.
'''
class GearTestCase(TestCase):
    def setUp(self):
        Gear.objects.create(gearID="SB01", gearType="SB", depositFee=50.00, description="A sleeping bag")
        Gear.objects.create(gearID="BP01", gearType="BP", depositFee=50.00, description="A backpack")

    def test_get_gear_list(self):
        """Gear list that is returned is correctly identified"""
        gear = Gear.objects.all()
        self.assertEqual(gear.count(), 2)
        sb = gear.get(gearID="SB01")
        bp = gear.get(gearID="BP01")
        self.assertEqual(sb.description, "A sleeping bag")
        self.assertEqual(bp.description, "A backpack")

    def test_add_gear(self):
        """Adds item to gear list"""
        c = Client()
#        response = c.post("/api/add-gear-category-list", request={"categoryID": 2, "description":"Sleeping Bags", "symbol":"SB"})  # Note: We currently don't have the add-gear-category-list function so this can't be checked
#        assert(response.status_code == 200)
        GearCategory.objects.create(categoryID=2, description="Sleeping Bags", symbol="SB") # Temporary until previous line can be uncommented
        response = c.post("/api/add-gear-to-list", {"gearID": 2, "gearType": "SB"})
        #assert(response.status_code >= 200 and response.status_code < 300)  #2xx is success
        response = c.get("/api/get-gear-list")
        gear = Gear.objects.all()
        self.assertEqual(gear.count(), 3)

class GearCategoryTestCase(TestCase):
    def setUp(self):
        GearCategory.objects.create(categoryID=0, description="Sleeping Bags", symbol="SB")
        GearCategory.objects.create(categoryID=1, description="Tents", symbol="T")

    def test_get_category_gear_list(self):
        """Category gear list that is returned is correctly identified"""
        gearCategory = GearCategory.objects.all()
        self.assertEqual(gearCategory.count(), 2)
        sb = gearCategory.get(categoryID=0)
        tent = gearCategory.get(categoryID=1)
        self.assertEqual(sb.description, "Sleeping Bags")
        self.assertEqual(tent.description, "Tents")
'''
