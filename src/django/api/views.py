from .models import Gear, GearCategory, Reservation
from django.core import serializers, exceptions
from django.http import HttpResponse
from django.views import View
from .serializers import GearSerializer
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


    def patch(self, request):    #Edit object in list
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


class ReservationView(View):

    def get(self, request):
        reservation = Reservation.objects.all()
        return HttpResponse(serializers.serialize("json", reservation), content_type='application/json', status=200)
