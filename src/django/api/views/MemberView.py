from django.db import transaction
from rest_framework.views import APIView
from ..models import Member, BlackList
from ..serializers import MemberSerializer
from .error import *


class MemberView(APIView):
    def get(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.view_member"):
            return RespError(400, "You don't have permission to visit this page!")
 
        blacklistedEmails = BlackList.objects.all().values_list("email", flat=True)
        members = Member.objects.all().exclude(pk__in=blacklistedEmails)
        members = MemberSerializer(members, many=True)
    
        return Response({"data": members.data})

    # Transaction that replaces the current member list with a new one
    # if the atomic transaction fails, no changes are saved to the DB
    @transaction.atomic
    def post(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.add_member"):
            return RespError(400, "You don't have permission to visit this page!")
 
        request = request.data
        members = request.get("members", None)
        if not members:
            return RespError(400, "You must provide a list of members.")
        try:
            with transaction.atomic():
                Member.objects.all().delete()

                serial = MemberSerializer(data=members, many=True)
                if not serial.is_valid():
                    errors = serial.errors
                    for key in errors:
                        raise Exception(key + ": " + errors[key][0])
            
                serial.save()

        except Exception as e:
            return RespError(400, str(e))

        # return the same response as the GET endpoint
        blacklistedEmails = BlackList.objects.all().values_list("email", flat=True)
        members = Member.objects.all().exclude(pk__in=blacklistedEmails)
        members = MemberSerializer(members, many=True)
    
        return Response({"data": members.data})
