from ..models import BlackList
from ..serializers import BlackListSerializer
from .error import *
from rest_framework.views import APIView


class BlackListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.view_blacklist"):
            return RespError(400, "You don't have permission to visit this page!")
 
        members = BlackList.objects.all()
        members = BlackListSerializer(members, many=True)

        return Response({"data": members.data})

    # handles addition of a blacklisted email
    def post(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.add_blacklist"):
            return RespError(400, "You don't have permission to visit this page!")
 
        newBlackList = request.data

        if "email" not in newBlackList:
            return RespError(400, "You are required to provide an email when adding an email to the blacklist.")

        serial = BlackListSerializer(data=newBlackList)
        
        # check for invalid serial, i.e. malformed request
        if not serial.is_valid():
            return serialValidation(serial)

        serial.save()

        data = serial.validated_data       
        
        return Response(data)

    # handles deletion of blacklist email
    def delete(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.delete_blacklist"):
            return RespError(400, "You don't have permission to visit this page!")
 
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
