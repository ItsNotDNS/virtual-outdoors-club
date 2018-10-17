from .models import Gear, GearCategory, Reservation
from django.core import serializers, exceptions
from django.http import HttpResponse
from django.views import View
from .serializers import GearSerializer, GearCategorySerializer
import json

# Create your views here.


class GearView(View):

	def get(self, request):
		gear = Gear.objects.all()
		return HttpResponse(serializers.serialize("json", gear), content_type='application/json', status=200)

	def post(self, request):
		# Check for malformed request
		_gearUUID = request.POST.get("gearID", None)
		serial = GearSerializer(data=request.POST)
		if not serial.is_valid():
			return HttpResponse("<h1>Malformed gear information<h1>", status=406)

		data = serial.validated_data
		# Checking if gear category exists
		try:
			Gear.objects.get(gearType=data['gearType'], gearCode=data['gearCode'])
		except exceptions.MultipleObjectsReturned:  # Checking if item in gear category exists
			return HttpResponse("<h1>Multiple copies of this gear in database<h1>", status=405)
		except exceptions.ObjectDoesNotExist:
			pass

		if(_gearUUID):
			return self.patch(request) # If object already exists, update it instead!

		# Create the new gear object and save it to the db
		gear = Gear(
			gearCode=data['gearCode'],
			gearType=data['gearType'],
			available=data['available'],
			depositFee=data['depositFee'],
			gearDescription=request.POST.get("gearDescription", ""))
		gear.save()
		return HttpResponse(serializers.serialize("json", [gear, ]), content_type='application/json', status=200)


	def patch(self, request):	#Edit object in list
		request.POST = json.loads(str(request.body, encoding='utf-8'))
		# Checking if gearUUID exists
		_gearUUID = request.POST.get("gearID", None) 
		try:
			gear = Gear.objects.get(pk=_gearUUID)  #Crashes if doesn't exist
		except:   # Checking if item in gear category exists
			return HttpResponse("<h1>Gear does not exist<h1>", status=401)

		_gearType = request.POST.get("gearType", gear.gearType)
		_gearType = GearCategory.objects.get(pk=_gearType)
		_available = request.POST.get("available", gear.available)
		_depositFee = request.POST.get("depositFee", gear.depositFee) 
		_description = request.POST.get("gearDescription", gear.gearDescription)
		
		# Perform checks
		if not _gearType:
			return HttpResponse("<h1>Gear category (gearType) does not exist<h1>", status=402)
		if(float(_depositFee) < 0):   # Checks fee is greater than 0
			return HttpResponse("<h1>Fee must be 0 or greater<h1>", status=403)

		# Good to update
		gear.gearType = _gearType
		gear.available = _available
		gear.depositFee = _depositFee 
		gear.gearDescription = _description
		gear.save()
		
		return HttpResponse(serializers.serialize("json", [gear, ]), content_type='application/json', status=200)


class GearCategoryView(View):

	def get(self, request):
		gear = GearCategory.objects.all()
		return HttpResponse(serializers.serialize("json", gear), content_type='application/json', status=200)

	def post(self, request):
		#handles addition of a gear category
		postReq = request.POST
		
		newGearCategorySymbol = postReq.get("symbol", None) 
		newGearCategoryDescription = postReq.get("categoryDescription", None)
		
		if (newGearCategorySymbol == None or newGearCategoryDescription == None):
			return HttpResponse("<h1>One or more fields of the new gear category are missing</h1>", status=406) #HTTP_406_NOT_ACCEPTABLE

		serial = GearCategorySerializer(data=postReq)
		
		# check for invalid serial, i.e. malformed request
		if serial.is_valid() == False:
			return HttpResponse("<h1>Malformed gear category request<h1>", status=400) #HTTP_400_BAD_REQUEST
		
		data = serial.validated_data # data = dictionary of valid data
		 
		 # checking if the current gear category already exists
		try: 
			duplicateGearCategory = GearCategory.objects.get(symbol = data["symbol"])
		except exceptions.ObjectDoesNotExist:
			duplicateGearCategory = None
		
		if duplicateGearCategory is not None:
			return HttpResponse("<h1>That gear category already exists</h1>", status=409) #HTTP_409_CONFLICT
			
		#adding new gear category	
		newGearCategory = GearCategory(categoryDescription=data['categoryDescription'], symbol=data["symbol"])
			
		#saving new gear category to database
		newGearCategory.save()
		
		#success
		return HttpResponse(serializers.serialize("json", [newGearCategory, ]), content_type='application/json', status=200) #HTTP_200_OK
		
	def delete(self, request):
		#handles deletion of a gear category
		
		postReq = json.loads(str(request.body, encoding='utf-8'))
		
		delGearCategoryID = postReq.get("categoryID", None)

		try: #try deleting gear category in DB	
			delGearCategory = GearCategory.objects.get(pk=delGearCategoryID)
		except ProtectedError: #except if the gear category is being referenced by a gear object
			return HttpResponse("<h1> The gear category trying to be removed is currently being referenced by a piece of gear</h1>", status=409) #HTTP_409_CONFLICT
		except exceptions.ObjectDoesNotExist:  # if the gear category to be deleted does not exist
			return HttpResponse("<h1> The gear category trying to be removed does not exist</h1>", status=404) #HTTP_404_NOT_FOUND
		
		delGearCategory.delete()
		#successfully deleted
		
		return HttpResponse(serializers.serialize("json", [delGearCategory, ]), content_type='application/json', status=200) #HTTP_200_OK
  

class ReservationView(View):

    def get(self, request):
        reservation = Reservation.objects.all()
        return HttpResponse(serializers.serialize("json", reservation), content_type='application/json', status=200)
 