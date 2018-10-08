from django.test import TestCase
from .models import Gear
from .models import GearCategory

# Create your tests here.


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

class GearCategoryTestCase(TestCase):
    def setUp(self):
        GearCategory.objects.create(categoryID="0", description="Sleeping Bags", symbol="SB")
        GearCategory.objects.create(categoryID="1", description="Tents", symbol="T")
        GearCategory.objects.create(categoryID="2", description="Backpack") #No symbol should fail

    def test_get_category_gear_list(self):
        """Category gear list that is returned is correctly identified"""
        gearCategory = GearCategory.objects.all()
        self.assertEqual(gearCategory.count(), 2)
        sb = gearCategory.get(categoryID="0")
        tent = gearCategory.get(categoryID="1")
        self.assertEqual(sb.description, "Sleeping Bags")
        self.assertEqual(tent.description, "Tents")
