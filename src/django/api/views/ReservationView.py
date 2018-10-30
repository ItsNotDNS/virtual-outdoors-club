from .error import *
from django.core import exceptions
from rest_framework.views import APIView
from ..models import Reservation, Member, Gear
from ..serializers import ReservationSerializer
from .GearView import gearIdExists
import json
from datetime import datetime



def reservationIdExists(id):
    try:
        reservation = Reservation.objects.get(id=id)
    except exceptions.ObjectDoesNotExist:
        return False
    return reservation


class ReservationView(APIView):

    # Gets list of all reservations
    def get(self, request, checkin):
        reservation = Reservation.objects.all()
        serial = ReservationSerializer(reservation, many=True)

        return Response({'data': serial.data})

    # Attempt to create a new reservation
    def post(self, request, checkin):
        
        if(checkin):
            request = json.loads(str(request.body, encoding='utf-8'))

            idToUpdate = request.get("id", None)
            if not idToUpdate: # if no 'id' was specified
                return RespError(401, "You must specify an id to return.")

            reservation = reservationIdExists(idToUpdate)
            if not reservation:
                return RespError(402, "There is no reservation with the id of '" + str(idToUpdate) + "'")
    
            reservation.status = "RETURNED"
            reservation.save()
           
            return Response(200)

        request = json.loads(str(request.body, encoding='utf-8'))
        itemsRequested = request.get("gear", None)
        if not itemsRequested:
            return RespError(403, "At least one item must be requested")

       
        # Check email if part of member list
        # emailStr = request.get("email", None)
        # if not Member.objects.get(email=emailStr):
        #   return RespError(403, "Your email is not registered with the Outdoors Club. It can take a few days to process your membership after registering. Your membership may have lapsed. You can register at http://outdoorsclub.ca/signup/ if you are not a registered member.")

        startDate = request.get("startDate", None)
        endDate = request.get("endDate", None)

        if not startDate or not endDate:
            return RespError(401, "A start date and end date are both required.")

        #startDate = datetime.strptime(startDate, "%Y-%m-%d")

        startDateAlt = datetime.strptime(startDate, "%Y-%m-%d")

        if startDateAlt <= datetime.now():
            return RespError(402, "Start dates must be in the future.")

        deniedItems = []

        for item in itemsRequested:
            if not gearIdExists(item): # Returns gear, not bool
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
                    if gear.id == item:
                       deniedItems.append(gear)


        # Return those that are not available
        if len(deniedItems) > 0:
            returnStr = ""
            for item in deniedItems:
                returnStr += str(item.code)
                returnStr += ", "
            return RespError(409, "These items are unavailable: " + returnStr[:-2])
 
        # Make reservation
        resv = Reservation(
                email=request["email"],
                licenseName=request["licenseName"],
                licenseAddress=request["licenseAddress"],
                startDate=request["startDate"],
                endDate=request["endDate"],
                status=request["status"],
                payment="Undecided",
                )
        resv.save()
        for item in itemsRequested:
            gear = Gear.objects.get(pk=item)
            resv.gear.add(gear)
        resv.save()

        sResv = ReservationSerializer(data=request)

        if not sResv.is_valid():
            return serialValidation(sResv)
        data = sResv.validated_data
        return Response(data)
