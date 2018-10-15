from .models import Gear, GearCategory
from django.core import serializers, exceptions
from django.http import HttpResponse
from django.views import View
from .serializers import GearSerializer

# Create your views here.


class GearView(View):

    def get(self, request):
        gear = Gear.objects.all()
        return HttpResponse(serializers.serialize("json", gear), content_type='application/json', status=200)

    def post(self, request):
        # Check for malformed request
        serial = GearSerializer(data=request.POST)
        if not serial.is_valid():
            return HttpResponse("<h1>Malformed gear information<h1>", status=400)

        data = serial.validated_data
        # Checking if gear category exists
        try:
            Gear.objects.get(gearType=data['gearType'], gearCode=data['gearCode'])
        except exceptions.MultipleObjectsReturned:  # Checking if item in gear category exists
            return HttpResponse("<h1>Multiple copies of this gear in database<h1>", status=400)
        except exceptions.ObjectDoesNotExist:
            pass
        else:
            return HttpResponse("<h1>Object already exists in database<h1>", status=400)

        # Create the new gear object and save it to the db
        gear = Gear(
            gearCode=data['gearCode'],
            gearType=data['gearType'],
            available=data['available'],
            depositFee=data['depositFee'],
            gearDescription=request.POST.get("gearDescription", ""))
        gear.save()
        return HttpResponse(serializers.serialize("json", [gear, ]), content_type='application/json', status=200)


class GearCategoryView(View):

    def get(self, request):
        gear = GearCategory.objects.all()
        return HttpResponse(serializers.serialize("json", gear), content_type='application/json', status=200)
