from .error import *
from django.core import exceptions
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from ..models import UserVariability
from ..serializers import UserVariabilitySerializer


@api_view(['POST'])
def updateMaxReservation(request):
    request = request.data

    if not request["value"]:
        return RespError(400, "You must specify the new value of Max Reservation Duration")
    variableName = "maxReservationDays"
    value = int(request["value"])

    # check legal values
    if value > 29 or value <= 0:
        return RespError(400, "The new value must be between 1 and 29 days")

    try:    # try to get old value
        entry = UserVariability.objects.get(pk=variableName)
    except exceptions.ObjectDoesNotExist:   # else, just create new one
        entry = UserVariability.objects.create(variable=variableName, value=value)

    # Safe to update
    entry.value = value
    entry.save()

    return Response(200)

