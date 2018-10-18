from ..models import GearCategory
from django.core import exceptions
from ..serializers import GearCategorySerializer
from .error import *
from django.db.models import ProtectedError
from rest_framework.views import APIView
from json import loads

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

        return Response({'data': categories.data})

    def post(self, request):
        # handles addition of a gear category
        postReq = request.POST
        
        newGearCategoryName = postReq.get("name", None)
        
        if not newGearCategoryName:
            return RespError(400, "Malformed post data")

        serial = GearCategorySerializer(data=postReq)
        
        # check for invalid serial, i.e. malformed request
        if not serial.is_valid():
            return serialValidation(serial)

        data = serial.validated_data
         
        # checking if the current gear category already exists
        if gearCategoryExists(data['name']):
            return RespError(409, 'The gear category already exists')
            
        # adding new gear category
        newGearCategory = GearCategory(name=data['name'])
            
        #saving new gear category to database
        newGearCategory.save()
        
        #success
        return Response(data)

    # handles deletion of a gear category
    def delete(self, request):
        delReq = loads(str(request.body, encoding='utf8'))
        if 'name' not in delReq:
            return RespError(400, "Missing name in request")

        # try deleting gear category in DB
        try:
            delGearCategory = GearCategory.objects.get(name=delReq['name'])
        except ProtectedError:
            return RespError(409, "You cannot remove a gear category that is currently being referenced by a piece if gear.")
        except exceptions.ObjectDoesNotExist:
            return RespError(404, "The gear category trying to be removed does not exist")
        
        delGearCategory.delete()
        
        return RespError(200, "Deleted the category: '" + delReq['name'] + "'")
