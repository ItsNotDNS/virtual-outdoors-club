from .error import *
from rest_framework.views import APIView
from ..models import Reservation
from ..serializers import ReservationSerializer


class ReservationView(APIView):

    def get(self, request):
        reservation = Reservation.objects.all()
        serial = ReservationSerializer(reservation, many=True)

        return Response({'data': serial.data})
