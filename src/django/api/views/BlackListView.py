from ..models import BlackList
from django.core import exceptions
from ..serializers import BlackListSerializer
from .error import *
from django.db.models import ProtectedError
from rest_framework.views import APIView

# BlacklistView for managing blacklisted members

# Returns False or the email if it exists
def blackListExists(email):
    try:
        email = BlackList.objects.get(email=email)
    except exceptions.ObjectDoesNotExist:
        return False
    return email


class BlackListView(APIView):
    def get(self, request):
        members = BlackList.objects.all()
        members = BlackListSerializer(members, many=True)

        return Response({"data": members.data})

    # handles addition of a blacklisted email
    def post(self, request):
        newBlackList = request.data

        if "email" not in newBlackList:
            return RespError(400, "You are required to provide an email when adding an email to the blacklist.")
               
        email = str(newBlackList["email"])

        serial = BlackListSerializer(data=newBlackList)
        
        # check for invalid serial, i.e. malformed request
        if not serial.is_valid():
            return serialValidation(serial)

        serial.save()

        data = serial.validated_data       
        
        return Response(data)


    # handles deletion of blacklist email
    def delete(self, request):
        emailToDelete = request.query_params.get("email", None)
        if not emailToDelete:
            return RespError(400, "You must specify an 'email' parameter to delete.")

        # try to delete the blacklisted email
        try:
            delBlackList = BlackList.objects.get(email=emailToDelete)
        except BlackList.DoesNotExist:
            return RespError(400, "The email '" + emailToDelete + "' does not exist so it cannot be deleted.")
        
        delBlackList.delete()
        
        return RespError(200, "Deleted the email: '" + emailToDelete + "'")
