from django.test import TestCase
from .models import Gear

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
