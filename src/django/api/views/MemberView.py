from .error import *
from django.core import exceptions
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from ..models import Member
from ..serializers import MemberSerializer


class MemberView(APIView):
    def get(self, request):
        request = request.data
    
        members = Member.objects.all()
        members = MemberSerializer(members, many=True)
    
        return Response({"data": members.data})
    
    
    # Updates the member list in the database by deleting the old one
    # and replacing it with the request list
    def post(self, request):
        request = request.data
    
        if not request["members"]:
            return RespError(400, "You must give a list of members")
        members = request["members"]
    
        Member.objects.all().delete()   # Deletes entire member list
    
        for i in members:
            if "email" not in i:
                return RespError(400, "You must give an email for each member")
            email = email=i["email"]
            if len(email) < 1 or "@" not in email:
                return RespError(400, str(email) + " is not in an email format")
            member = Member.objects.create(email=email)
            member.save()
    
        return Response(200)
    
