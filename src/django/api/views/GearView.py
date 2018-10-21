from ..models import Gear
from django.core import exceptions
from ..serializers import GearSerializer
from .GearCategoryView import gearCategoryExists
from rest_framework.views import APIView
from .error import *
import json


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
        allGear = Gear.objects.all()
        allGear = GearSerializer(allGear, many=True)

        return Response({"data": allGear.data})

    def post(self, request):
        newGear = json.loads(str(request.body, encoding='utf-8'))
        requiredProperties = {
            "code": False,
            "category": False,
            "depositFee": False,
            "description": False
            #"condition": True (not yet implemented)
        }

        # check for extra uncessessary keys
        for key in newGear:
            if key not in requiredProperties:
                return RespError(400, "'" + str(key) + "' is not valid this POST method, please resubmit the request without it.")
            else:
                requiredProperties[key] = True

        # check that all the required keys are present
        for key in requiredProperties:
            if not requiredProperties[key]:
                return RespError(400, "You are required to provide a '" + key + "' when creating a piece of gear.")

        # Check that the category exists in the database, then replace the string
        # in the new gear object with the database primary key
        categoryName = newGear.get("category")
        category = gearCategoryExists(categoryName)
        if not category:
            return RespError(400, "The gear category '" + categoryName + "' does not exist.")
        newGear["category"] = category

        # set the initial version
        newGear["version"] = 1

        # use the serializer to do validation on the properties
        # this ensures the database constraints are not violated when we create an object
        sGear = GearSerializer(data=newGear)

        if not sGear.is_valid():
            return serialValidation(sGear)

        g = Gear.objects.create(**newGear)
        sGear = GearSerializer(g)
        return Response(sGear.data)

    def patch(self, request):    #Edit object in list
        request = json.loads(str(request.body, encoding='utf-8'))
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
        if not idToUpdate: # if no 'id' was specified
            return RespError(400, "You must specify an id to patch.")
        
        if not expectedVersion: # if no 'expectedVersion' 
            return RespError(400, "You must specify an 'expectedVersion'.")

        if not patch: # if no 'expectedVersion' 
            return RespError(400, "You must specify a 'patch' object with methods.")

        for key in patch:
            if not key in allowedPatchMethods:
                return RespError(400, "'" + key + "' is not a valid patch method.")

        # Check that specified gear exists by primary key search
        # Must try-catch because the model will throw an exception if it's not found
        gear = gearIdExists(idToUpdate)
        if not gear:
            return RespError(400, "There is no gear with the id of '" + str(idToUpdate) + "'")

        # Check that the category exists in the databaseg
        categoryName = patch["category"]
        patch["category"] = gearCategoryExists(categoryName)
        if not patch["category"]:
            return RespError(400, "The gear category '" + categoryName + "' does not exist.")

        # up the patch number
        patch["version"] = gear.version + 1

        s = GearSerializer(gear, data=patch, partial=True)
        if not s.is_valid():
            return serialValidation(s) # returns an error response to caller

        # write the validated fields
        gear.code = patch["code"]
        gear.category = patch["category"]
        gear.depositFee = patch["depositFee"]
        gear.description = patch["description"]
        gear.version = patch["version"]
        # and condition code needs to be updated separately, if passed in
        # may need to consider not including it in these methods

        gear.save()

        return Response(s.data)
