from django.shortcuts import render
from .models import Gear, GearCategory
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.db.models import Max
from django.views import View

# Create your views here.

class GearView(View):
    allowed_methods = ["GET", "POST"]

    def get(request): # Get list of objects
        gear = Gear.objects.all()
        data = serializers.serialize('json', gear)
        return HttpResponse(data, content_type='application/json', status=200)
    
    def post(request, *args, **kwargs):    #Add object to list
        # Checking if gearID and gearType are None
        _gearID = request.POST.get("gearID", None)
        _gearType = request.POST.get("gearType", None)
        if(_gearID == None):
            _gearID = 0
            return HttpResponse("<h1>Invalid gearID or gearType<h1>", status=400)
        if(_gearType == None):
            _gearType = 0
        gear = Gear.objects.get(pk=_gearID)
        if(gear == None):   # Checking if gear category exists
            return HttpResponse("<h1>Invalid gear category<h1>", status=400)
        try:
            gear = Gear.objects.get(pk=gearID, gearType=_gearType)  #Crashes if doesn't exist
            return HttpResponse("<h1>Duplicate gear ID in category<h1>", status=400)
        except:   # Checking if item in gear category exists
            pass

        gear = Gear(
                gearID=_gearID, 
                gearType=_gearType,
                available=True,
                depositFee=request.POST.get("depositFee", 50.00),
                description=request.POST.get("description", ""))
        gear.save()

        return HttpResponseRedirect("get-gear-list", status=200)

def getGearCategoryList(request):
    gearCategory = GearCategory.objects.all()
    data = serializers.serialize('json', gearCategory)
    return HttpResponse(data, content_type='application/json', status=200)
