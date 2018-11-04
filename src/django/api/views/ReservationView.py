from .error import *
from django.core import exceptions
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from ..models import Reservation
from ..serializers import ReservationPOSTSerializer, ReservationGETSerializer


def reservationIdExists(id):
    try:
        reservation = Reservation.objects.get(id=id)
    except exceptions.ObjectDoesNotExist:
        return False
    return reservation


class ReservationView(APIView):

    # Gets list of all reservations
    def get(self, request):
        ID = request.query_params.get("id", None)
        email = request.query_params.get("email", None)

        res = Reservation.objects.all()

        # If the API call includes id and email parameters, begin a single search
        if ID and email:
            res = res.filter(id=ID, email=email)

        serial = ReservationGETSerializer(res, many=True)
        return Response({"data": serial.data})

    # Attempt to create a new reservation
    def post(self, request):
        newRes = request.data

        properties = {
            "email": False,
            "licenseName": False,
            "licenseAddress": False,
            "startDate": False,
            "endDate": False,
            "gear": False,
            "status": False
        }

        # check for extra unnecessary keys
        for key in newRes:
            if key not in properties:
                return RespError(400, "'" + str(key) + "' is not valid with this POST method, please resubmit the"
                                                       " request without it.")

        sRes = ReservationPOSTSerializer(data=newRes)

        if not sRes.is_valid():
            return serialValidation(sRes)

        sRes.save()

        return Response(sRes.data)


@api_view(['POST'])
def checkin(request):
    request = request.data

    if not request['id']:
        return RespError(400, "You must specify an id to return.")

    reservation = reservationIdExists(request['id'])
    if not reservation:
        return RespError(400, "There is no reservation with the id of '" + str(request['id']) + "'")

    reservation.status = "RETURNED"
    reservation.save()
   
    return Response()


@api_view(['POST'])
def cancel(request):
    request = request.data

    if not request['id']:
        return RespError(400, "You must specify an id to return.")

    reservation = reservationIdExists(request['id'])
    if not reservation:
        return RespError(400, "There is no reservation with the id of '" + str(request['id']) + "'")

    if reservation.status != "REQUESTED" and reservation.status != "APPROVED":
        return RespError(400, "The reservation status must be REQUESTED or APPROVED")

    reservation.status = "CANCELLED"
    reservation.save()

    return Response()
