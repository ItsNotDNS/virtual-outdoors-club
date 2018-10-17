from django.test import TestCase, Client
from .models import Gear, GearCategory, Reservation
import json

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
		pk0 = Gear.objects.get(gearCode="SB01").pk
		pk1 = Gear.objects.get(gearCode="BP01").pk
		response = self.client.get("/api/gear/")
		self.assertEqual(response.status_code, 200)

		# Test json response
		temp = [{"model": "api.gear", "pk": pk0, "fields": {"gearCode": "SB01",
															"gearType": self.sbpk,
															"available": True,
															"depositFee": "50.00",
															"gearDescription": "A old red sleeping bag"}},

				{"model": "api.gear", "pk": pk1, "fields": {"gearCode": "BP01",
															"gearType": self.bppk,
															"available": True,
															"depositFee": "50.00",
															"gearDescription": "A black Dakine backpack"}}]

		self.assertJSONEqual(str(response.content, encoding="utf8"), temp)


	def test_post(self):
		pk0 = Gear.objects.get(gearCode="SB01").pk
		pk1 = Gear.objects.get(gearCode="BP01").pk

		dummy = {"gearCode": "SP02",
				 "gearType": self.sbpk,
				 "available": True,
				 "depositFee": 50.00,
				 "gearDescription": "A new blue sleeping bag"}

		correctReturn = [{"model": "api.gear", "pk": pk1+1, "fields": {"gearCode": "SP02",
																   "gearType": self.sbpk,
																   "available": True,
																   "depositFee": "50.00",
																   "gearDescription": "A new blue sleeping bag"}}]
		# Test the post request
		request = self.client.post("/api/gear/", dummy)
		self.assertEqual(request.status_code, 200)
		self.assertJSONEqual(str(request.content, encoding="utf8"), correctReturn)

		correctReturn = [{"model": "api.gear", "pk": pk0, "fields": {"gearCode": "SB01",
																	"gearType": self.sbpk,
																	"available": True,
																	"depositFee": "50.00",
																	"gearDescription": "A old red sleeping bag"}},

						 {"model": "api.gear", "pk": pk1, "fields": {"gearCode": "BP01",
						 											"gearType": self.bppk,
						 											"available": True,
						 											"depositFee": "50.00",
						 											"gearDescription": "A black Dakine backpack"}},

						 {"model": "api.gear", "pk": pk1+1, "fields": {"gearCode": "SP02",
						 											"gearType": self.sbpk,
						 											"available": True,
						 											"depositFee": "50.00",
						 											"gearDescription": "A new blue sleeping bag"}}]
		# Make sure the post was saved to the db
		response = self.client.get("/api/gear/")
		self.assertEqual(response.status_code, 200)
		self.assertJSONEqual(str(response.content, encoding="utf8"), correctReturn)


	def test_patch(self):
		"""Edits item in gear list"""
		pk0 = Gear.objects.get(gearCode="SB01").pk
		pk1 = Gear.objects.get(gearCode="BP01").pk
		dummy = {"gearID": pk0,
				"gearCode": "SP01",
				"gearType": self.sbpk,
				"available": False,
				"depositFee": 87.99,
				"gearDescription": "An old yellow sleeping bag"}

		response = self.client.patch("/api/gear", json.dumps(dummy))
		self.assertEqual(response.status_code, 200)


		correctReturn = [{"model": "api.gear", "pk": 4, "fields": {"gearCode": "BP01",
																	"gearType": self.bppk,
																	"available": True,
																	"depositFee": "50.00",
																	"gearDescription": "A black Dakine backpack"}},
						
						{"model": "api.gear", "pk": 3, "fields": {"gearCode": "SB01",
																	"gearType": self.sbpk,
																	"available": False,
																	"depositFee": "87.99",
																	"gearDescription": "An old yellow sleeping bag"}}] 
																												   
		# Compare against DB
		response = self.client.get("/api/gear/")
		self.assertEqual(response.status_code, 200)
		self.assertJSONEqual(str(response.content, encoding="utf8"), correctReturn)


class GearCategoryTestCase(TestCase):
  
	# Create test data and save primary key of all objects
	def setUp(self):
		bk = GearCategory.objects.create(categoryDescription="A book", symbol="BK")
		wb = GearCategory.objects.create(categoryDescription="A water bottle", symbol="WB")
		self.bkpk = bk.pk
		self.wbpk = wb.pk

	def test_get(self):
		response = self.client.get("/api/gear/categories/")
		self.assertEqual(response.status_code, 200)

		# Test json response
		temp = [{"model": "api.gearcategory", "pk": self.bkpk, "fields": {"categoryDescription": "A book",
																			"symbol": "BK"}},
																		  
				{"model": "api.gearcategory", "pk": self.wbpk, "fields": {"categoryDescription": "A water bottle",
																			"symbol": "WB"}}]

		self.assertJSONEqual(str(response.content, encoding="utf8"), temp)
		
	def test_post(self):
		pk0 = self.bkpk
		pk1 = self.wbpk
		
		dummy = {"categoryDescription": "A tent", 
				"symbol": "TE"}
				 
		correctReturn = [{"model": "api.gearcategory", "pk": pk1+1, "fields": {"categoryDescription": "A tent", 
																				"symbol": "TE"}}]
		# Test the post request
		request = self.client.post("/api/gear/categories/", dummy)
		self.assertEqual(request.status_code, 200)
		self.assertJSONEqual(str(request.content, encoding="utf8"), correctReturn)														
		
		gearCat1 = {"model": "api.gearcategory", "pk": pk0, "fields": {"categoryDescription": "A book", 
																		"symbol": "BK"}}				

		gearCat2 = {"model": "api.gearcategory", "pk": pk1, "fields": {"categoryDescription": "A water bottle", 
																		"symbol": "WB"}}	

		correctReturn.insert(0, gearCat2)
		correctReturn.insert(0, gearCat1)   
																		
		# Make sure the post (addition of gear category) was saved to the db
		response = self.client.get("/api/gear/categories")
		self.assertEqual(response.status_code, 200)
		self.assertJSONEqual(str(response.content, encoding="utf8"), correctReturn)
	
	def test_delete(self):
		pk0 = self.bkpk
		pk1 = self.wbpk
		
		dummy = {"categoryID": pk0}	
		
		#Test the delete request
		request = self.client.delete("/api/gear/categories/", json.dumps(dummy))

		self.assertEqual(request.status_code, 200)
		
		#correct return will be only the WB category, as BK category has been deleted
		correctReturn = [{"model": "api.gearcategory", "pk": self.wbpk, "fields": {"categoryDescription": "A water bottle",
																					"symbol": "WB"}}]
		#Make sure delete actually happened in DB
		response = self.client.get("/api/gear/categories")
		self.assertEqual(response.status_code, 200)
		self.assertJSONEqual(str(response.content, encoding="utf8"), correctReturn)
		

class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    def setUp(self):
        spCat = GearCategory.objects.create(categoryDescription="Ski poles", symbol="SP")
        sp = Gear.objects.create(gearCode="SP01", gearType=spCat, depositFee=12.00, gearDescription="Ski poles")
        RSVP01 = Reservation.objects.create(reservedBy="abc123@ualberta.ca", approvedBy="Devon", gearReserved=sp, startDate="2018-03-19", endDate="2018-03-31", status="REQUESTED")
        self.sppk = sp.pk
        self.sp = sp

    def test_get(self):
        response = self.client.get('/api/reservation/')
        self.assertEqual(response.status_code, 200)

        # Test json response
        temp = [{"model": "api.reservation", "pk": 1, "fields": {"reservedBy": "abc123@ualberta.ca",
                                                                        "approvedBy": "Devon",
                                                                        "status": "CHECKED OUT",
                                                                        "gearReserved": 8,
                                                                        "startDate": "2018-03-19",
                                                                        "endDate": "2018-03-31",
                                                                        "status": "REQUESTED"
                                                                        }},
                                                                                            ]
        self.assertJSONEqual(str(response.content, encoding='utf8'), temp)
