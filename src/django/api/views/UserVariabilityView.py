from .error import *
from django.core import exceptions
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from ..models import UserVariability
from ..serializers import UserVariabilitySerializer

# Updates the max duration a reservation can be made for in days
@api_view(['POST'])
def updateValues(request):
    request = request.data

    allowedMemberTypes = ["executive", "member"]
    allowedVariables = ["maxLength", "maxFuture", "maxRentals"]

    # Error checking
    for memberType in request:
        if memberType not in allowedMemberTypes:
            return RespError(400, str(memberType) + " is not a valid member type")
        for var in request[memberType]:
            if var not in allowedVariables:
                return RespError(400, str(var) + " is not a valid variable to modify")
            # check legal values
            lowerBound = 0
            if var == "maxLength":
                upperBound = 28
            elif var == "maxFuture":
                upperBound = 365
            elif var == "maxRentals":
                upperBound = 99
            else:
                upperBound = 99
            if request[memberType][var] <= lowerBound or request[memberType][var] >= upperBound:
                return RespError(400, str(request[memberType][var]) + " must be between " + str(lowerBound) + " and " + str(upperBound))

    # Create or update
    for memberType in request:
        for variable in request[memberType]:
            varName = str(memberType) + str(variable) 
            try:
                entry = UserVariability.objects.get(pk=varName)
            except:
                entry = UserVariability.objects.create(variable=varName, value=request[memberType][variable])
            entry.value = request[memberType][variable]
            entry.save()
    return Response(200)


@api_view(['POST'])
def changePassword(request):
    request = request.data
    
    required = ["user", "password"]
    for ele in required:
        if ele not in request:
            return RespError(400, "You are missing " + ele + ".")
    try:
        u = User.objects.get(username=request["user"])
    except:
        return RespError(400, "The username and password combination does not exist.")
    if request["user"] == "admin":
        if "oldPassword" not in request:
            return RespError(400, "You must enter the current password to change the admin password")
        user = authenticate(request, username=request["user"], password=request["oldPassword"])
        if user is None:
            return RespError(400, "The username and password combination does not exist.")
    u.set_password(request["password"])
    u.save()

    return Response(200)
