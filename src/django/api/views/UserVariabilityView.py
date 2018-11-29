from .error import *
from django.core import exceptions
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from ..models import UserVariability
from ..serializers import UserVariabilitySerializer
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes((AllowAny, ))
def backendLogin(request):
    if request.user.is_authenticated:
        return RespError(400, "You are already logged in")

    required = ["user", "password"]
    for ele in required:
        if ele not in request.data:
            return RespError(400, "You are missing " + ele + ".")

    user = authenticate(request, username=request.data["user"], password=request.data["password"])
    if user is not None:
        # Success
        login(request._request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return Response(token.key, status=200)
    else:
        return RespError(400, "The username and password combination does not exist.")


# Deals with modifiable user variables like max reservations, how long reservations can be and such
class UserVariabilityView(APIView):
    def get(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.view_uservariability"):
            return RespError(400, "You don't have permission to visit this page!")

        variables = UserVariability.objects.all()
        variables = UserVariabilitySerializer(variables, many=True)
        return Response({"data": variables.data})

    def post(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.add_uservariability"):
            return RespError(400, "You don't have permission to visit this page!")

        request = request.data
    
        allowedMemberTypes = ["executive", "member"]
        allowedVariables = ["maxLength", "maxFuture", "maxReservations", "maxGearPerReservation"]
    
        errorMessages = {
            "maxLength": "max reservation length",
            "maxFuture": "max days in future can reserve",
            "maxReservations": "max number of rentals",
            "maxGearPerReservation": "max number of gear per reservation"
        }
    
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
                    return RespError(400, str(memberType).title() + " " + errorMessages[var] + " must be between " + str(lowerBound+1) + " and " + str(upperBound-1))
    
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
    if not request.user.is_authenticated or not request.user.has_perm("api.change_uservariability"):
        return RespError(400, "You don't have permission to visit this page!")
 
    request = request.data
    
    required = ["user", "password"]
    for ele in required:
        if ele not in request:
            return RespError(400, "You are missing " + ele + ".")

    try:
        u = User.objects.get(username=request["user"])
    except User.DoesNotExist:
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
