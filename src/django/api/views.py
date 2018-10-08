from django.shortcuts import render
from .models import Gear
from django.core import serializers
from django.http import HttpResponse

# Create your views here.


def getGearList(request):
    gear = Gear.objects.all()
    data = serializers.serialize('json', gear)
    return HttpResponse(data, content_type='application/json')
