from .error import *
from rest_framework.views import APIView
from ..models import Reservation
from ..serializers import ReservationSerializer
from .GearView import gearIdExists

class ReservationView(APIView):

    # Gets list of all reservations
    def get(self, request):
        reservation = Reservation.objects.all()
        serial = ReservationSerializer(reservation, many=True)

        return Response({'data': serial.data})

    # Attempt to create a new reservation
    def post(self, request):
        request = json.loads(str(request.body, encoding='utf-8'))
        items = request.get("items", None)

        #TODO Check email if part of member list
        emailStr = request.get("email", None)
        if not Member.objects.get(email=emailStr):
            return RespError(403, "Your email is not registered with the Outdoors Club. It can take a few days to process your membership after registering. Your membership may have lapsed. You can register at http://outdoorsclub.ca/signup/ if you are not a registered member.")

        # Perform check to see if items are available
        deniedItems = []
        #TODO get list of all gearRequests that DON'T end before this start and DON'T start before this end
        #TODO finish gearRequests = GearRequests.objects.filter()

        for item in items:
            if not gearIdExists(item.id): # Returns gear, not bool
                deniedItems.append(item)

            #TODO check items in date range

        # Return those that are not available
        if len(deniedItems) > 0:
            return RespError(409, "These items are unavailable: " + deniedItems)
 
        # Add reservations if all items are available
        for item in items:
            #make new reservation for each item
            newReservation = Reservation.objects.create(gearID)
            newReservation.save()

        return Response(200)

