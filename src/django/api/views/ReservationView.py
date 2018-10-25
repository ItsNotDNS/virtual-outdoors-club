from .error import *
from rest_framework.views import APIView
from ..models import Reservation, Member, Gear
from ..serializers import ReservationSerializer
from .GearView import gearIdExists
import json
from datetime import datetime

class ReservationView(APIView):

    # Gets list of all reservations
    def get(self, request):
        reservation = Reservation.objects.all()
        serial = ReservationSerializer(reservation, many=True)

        return Response({'data': serial.data})

    # Attempt to create a new reservation
    def post(self, request):
        request = json.loads(str(request.body, encoding='utf-8'))

        # Check email if part of member list
        # emailStr = request.get("email", None)
        # if not Member.objects.get(email=emailStr):
        #   return RespError(403, "Your email is not registered with the Outdoors Club. It can take a few days to process your membership after registering. Your membership may have lapsed. You can register at http://outdoorsclub.ca/signup/ if you are not a registered member.")

        startDate = request.get("startDate", None)
        endDate = request.get("endDate", None)

        if not startDate or not endDate:
            return RespError(400, "A start date and end date are both required.")


        startDateAlt = datetime.strptime(startDate, "%Y-%m-%d")

        if startDateAlt <= datetime.now():
            return RespError(400, "Start dates must be in the future.")


        itemsRequested = request.get("gear", None)
        if not itemsRequested:
            return RespError(400, "At least one item must be requested")

        # Perform check to see if items are available
        deniedItems = []

        for item in itemsRequested:
            if not gearIdExists(item["id"]): # Returns gear, not bool
                deniedItems.append(item)

        # Get all requests that end after the start date of the request and end before the request end date

        qs1 = Reservation.objects.filter(endDate__gte=startDate).filter(endDate__lte=endDate)

        # Get all requests that start before the request ends and start after the request start date
        qs2 = Reservation.objects.filter(startDate__lte=endDate).filter(startDate__gte=startDate)

        relevantReservations = qs1.union(qs1, qs2)
        for reservation in relevantReservations:
            gears = reservation.gear.all()
            for gear in gears:
                for item in itemsRequested:
                    if gear.id == item["id"]:
                       deniedItems.append(gear)


        # Return those that are not available
        if len(deniedItems) > 0:
            return RespError(409, "These items are unavailable: " + str(deniedItems))
 
        # Make reservation
        resv = Reservation(
                email=request["email"],
                licenseName=request["licenseName"],
                licenseAddress=request["licenseAddress"],
                startDate=request["startDate"],
                endDate=request["endDate"],
                status=request["status"],
                payment="Undecided",
                )#ReservationSerializer(data=request)
        resv.save()
        # if not resv.is_valid():
        #   return serialValidation(resv)

        return Response(200)