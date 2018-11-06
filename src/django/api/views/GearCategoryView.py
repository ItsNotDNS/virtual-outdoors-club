from ..models import GearCategory
from django.core import exceptions
from ..serializers import GearCategorySerializer
from .error import *
from django.db.models import ProtectedError
from rest_framework.views import APIView



# Returns False or the category if it exists
def gearCategoryExists(category):
    try:
        category = GearCategory.objects.get(name=category)
    except exceptions.ObjectDoesNotExist:
        return False
    return category


class GearCategoryView(APIView):
    def get(self, request):
        categories = GearCategory.objects.all()
        categories = GearCategorySerializer(categories, many=True)

        return Response({"data": categories.data})

    # handles addition of a gear category
    def post(self, request):
        newGearCategory = request.data
        requiredProperties = {
            "name": False,
        }

        for key in newGearCategory:
            if key not in requiredProperties:
                return RespError(400, "'" + str(key) + "' is not valid in this POST method.")
            else:
                requiredProperties[key] = True

        for key in requiredProperties:
            if not requiredProperties[key]:
                return RespError(400, "You are required to provide a '" + key + "' when creating a gear category.")

        newGearCategory["name"] = newGearCategory["name"].title()

        serial = GearCategorySerializer(data=newGearCategory)
        
        # check for invalid serial, i.e. malformed request
        if not serial.is_valid():
            return serialValidation(serial)

        data = serial.validated_data
         
        # checking if the current gear category already exists
        if gearCategoryExists(data["name"]):
            return RespError(409, "The gear category already exists")
        
        # adding new gear category
        newGearCategory = GearCategory(name=data["name"])
            
        #saving new gear category to database
        newGearCategory.save()
        
        #success
        return Response(data)

    def patch(self, request):
        request = request.data

        currentName = request.get("name", None)
        patch = request.get("patch", None)

        if not currentName:
            return RespError(400, "You must specify a category to patch.")

        if not patch:
            return RespError(400, "You must specify a 'patch' object with methods.")

        newName = patch.get("name")

        if not newName:
            return RespError(400, "You must specify a new name to update to.")

        currentCategory = gearCategoryExists(currentName)
        newCategory = gearCategoryExists(newName)

        if newCategory:
            return RespError(400, "A category already exists with the name '" + newName + "'.")

        # check validity
        serial = GearCategorySerializer(data=patch)
        if not serial.is_valid():
            return serialValidation(serial)

        currentCategory.name = newName

        currentCategory.save()

        return Response({"name": newName})

    # handles deletion of a gear category
    def delete(self, request):
        nameToDelete = request.query_params.get("name", None)
        if not nameToDelete:
            return RespError(400, "You must specify a 'name' parameter to delete.")

        # try to delete the category
        try:
            delGearCategory = GearCategory.objects.get(name=nameToDelete)
        except ProtectedError:
            return RespError(409, "You cannot remove a gear category that is currently being referenced by a piece of gear.")
        except exceptions.ObjectDoesNotExist:
            return RespError(400, "The gear category '" + nameToDelete + "' does not exist so it cannot be deleted.")
        
        delGearCategory.delete()
        
        return RespError(200, "Deleted the category: '" + nameToDelete + "'")
