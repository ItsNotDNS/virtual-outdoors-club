from django.test import TestCase, Client
from .models import Gear, GearCategory

# Create your tests here.


class GearTestCase(TestCase):

    # Create test data and save primary key of all objects
    def setUp(self):
        sb = GearCategory.objects.create(categoryDescription="A sleeping bag", symbol="SB")
        bp = GearCategory.objects.create(categoryDescription="A backpack", symbol="BP")
        Gear.objects.create(gearCode="SB01", gearType=sb, depositFee=50.00, gearDescription="A old red sleeping bag")
        Gear.objects.create(gearCode="BP01", gearType=bp, depositFee=50.00, gearDescription="A black Dakine backpack")
        self.client = Client()
        self.sbpk = sb.pk
        self.bppk = bp.pk

    def test_get(self):
        response = self.client.get('/api/gear/')
        self.assertEqual(response.status_code, 200)

        # Test json response
        temp = [{"model": "api.gear", "pk": 1, "fields": {"gearCode": "SB01",
                                                          "gearType": self.sbpk,
                                                          "available": True,
                                                          "depositFee": "50.00",
                                                          "gearDescription": "A old red sleeping bag"}},

                {"model": "api.gear", "pk": 2, "fields": {"gearCode": "BP01",
                                                          "gearType": self.bppk,
                                                          "available": True,
                                                          "depositFee": "50.00",
                                                          "gearDescription": "A black Dakine backpack"}}]

        self.assertJSONEqual(str(response.content, encoding='utf8'), temp)

    def test_post(self):
        dummy = {'gearCode': 'SP02',
                 'gearType': self.sbpk,
                 'available': True,
                 'depositFee': 50.00,
                 'gearDescription': 'A new blue sleeping bag'}

        correctReturn = [{"model": "api.gear", "pk": 5, "fields": {"gearCode": "SP02",
                                                                   "gearType": self.sbpk,
                                                                   "available": True,
                                                                   "depositFee": "50.00",
                                                                   "gearDescription": "A new blue sleeping bag"}}]
        # Test the post request
        request = self.client.post('/api/gear/', dummy)
        self.assertEqual(request.status_code, 200)
        self.assertJSONEqual(str(request.content, encoding='utf8'), correctReturn)

        correctReturn = [{"model": "api.gear", "pk": 3, "fields": {"gearCode": "SB01",
                                                                   "gearType": self.sbpk,
                                                                   "available": True,
                                                                   "depositFee": "50.00",
                                                                   "gearDescription": "A old red sleeping bag"}},

                         {"model": "api.gear", "pk": 4, "fields": {"gearCode": "BP01",
                                                                   "gearType": self.bppk,
                                                                   "available": True,
                                                                   "depositFee": "50.00",
                                                                   "gearDescription": "A black Dakine backpack"}},

                         {"model": "api.gear", "pk": 5, "fields": {"gearCode": "SP02",
                                                                   "gearType": self.sbpk,
                                                                   "available": True,
                                                                   "depositFee": "50.00",
                                                                   "gearDescription": "A new blue sleeping bag"}}]
        # Make sure the post was saved to the db
        response = self.client.get('/api/gear/')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf8'), correctReturn)


class GearCategoryTestCase(TestCase):

    # Create test data and save primary key of all objects
    def setUp(self):
        bk = GearCategory.objects.create(categoryDescription="A book", symbol="BK")
        wb = GearCategory.objects.create(categoryDescription="A water bottle", symbol="WB")
        self.bkpk = bk.pk
        self.wbpk = wb.pk

    def test_get(self):
        response = self.client.get('/api/gear/categories/')
        self.assertEqual(response.status_code, 200)

        # Test json response
        temp = [{"model": "api.gearcategory", "pk": self.bkpk, "fields": {"categoryDescription": "A book",
                                                                          "symbol": "BK"}},

                {"model": "api.gearcategory", "pk": self.wbpk, "fields": {"categoryDescription": "A water bottle",
                                                                          "symbol": "WB"}}]

        self.assertJSONEqual(str(response.content, encoding='utf8'), temp)
