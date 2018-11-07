from ..models import Gear, Reservation
from django.core import exceptions
from ..serializers import GearSerializer
from rest_framework.views import APIView
from .error import *
from django.db.models import ProtectedError
from datetime import datetime
from django.db.models import Q


# returns False if no gear has that id, otherwise the gear with the id is returned
def gearIdExists(id):
    try:
        gear = Gear.objects.get(id=id)
    except exceptions.ObjectDoesNotExist:
        return False
    return gear


# returns False or the gear object with a matching code
def gearCodeExists(code):
    try:
        gear = Gear.objects.get(code=code)
    except exceptions.ObjectDoesNotExist:
        return False
    return gear


class GearView(APIView):

    # gets a list of all gear in the database and returns it as a list of json objects
    def get(self, request):
        start = request.query_params.get("from", None)
        end = request.query_params.get("to", None)

        gear = Gear.objects.all()

        if start and end:
            try:
                start = datetime.strptime(start, "%Y-%m-%d")
                end = datetime.strptime(end, "%Y-%m-%d")
            except ValueError:
                return RespError(400, "Date must be in year-month-day format")

            dateFilter = Q(startDate__range=[start, end]) | \
                         Q(endDate__range=[start, end]) | \
                         Q(startDate__lte=start, endDate__gte=end)

            resGear = Reservation.objects.filter(dateFilter).values("gear")

            if resGear.exists():
                gear = gear.exclude(id__in=resGear)

        gear = GearSerializer(gear, many=True)

        return Response({"data": gear.data})

    def post(self, request):
        newGear = request.data

        properties = {
            "code": False,
            "category": False,
            "depositFee": False,
            "description": False,
            "condition": False
        }

        # check for extra uncessessary keys
        for key in newGear:
            if key not in properties:
                return RespError(400, "'" + str(key) + "' is not valid with this POST method, please resubmit the"
                                                       " request without it.")
        category = newGear.get("category", None)
        if category: newGear["category"] = category.title()
        sGear = GearSerializer(data=newGear)

        if not sGear.is_valid():
            return serialValidation(sGear)

        sGear.save()

        return Response(sGear.data)

    # Edit object in list
    def patch(self, request):
        request = request.data
        # These string values should be constants somewhere..
        allowedPatchMethods = {
            "code": True,
            "category": True,
            "depositFee": True,
            "description": True,
            "condition": True
        }

        idToUpdate = request.get("id", None)
        expectedVersion = request.get("expectedVersion", None)
        patch = request.get("patch", None)

        # The following 3 checks could be up-leveled to a generic PATCH-check function
        if not idToUpdate:
            return RespError(400, "You must specify an id to patch.")
        
        if not expectedVersion:
            return RespError(400, "You must specify an 'expectedVersion'.")

        if not patch:
            return RespError(400, "You must specify a 'patch' object with methods.")

        for key in patch:
            if key not in allowedPatchMethods:
                return RespError(400, "'" + key + "' is not a valid patch method.")

        try:
            gear = Gear.objects.get(id=idToUpdate)
        except Gear.DoesNotExist:
            return RespError(400, "There is no gear with th id '" + str(idToUpdate) + "'")

        gear.version += 1
        sGear = GearSerializer(gear, data=patch)

        if not sGear.is_valid():
            return serialValidation(sGear)

        sGear.save()

        return Response(sGear.data)

    # only admins can delete gear from inventory: this check for admin is done in the frontend
    # this function expects a 'id' key in the parameters of the request 
    def delete(self, request):
        idToDelete = request.query_params.get("id")

        if not idToDelete:
            return RespError(400, "Missing gear id in request")

        try:
            delGear = Gear.objects.get(id=idToDelete) 
            delGearCode = delGear.code
        except ProtectedError:
            return RespError(409, "You cannot remove gear that is currently being reserved")
        except exceptions.ObjectDoesNotExist:
            return RespError(404, "The gear item trying to be removed does not exist")

        delGear.delete()

        return RespError(200, "Successfully deleted gear: " + "'" + delGearCode + "'")
