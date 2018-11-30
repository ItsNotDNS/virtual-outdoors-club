from .error import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from ..models import Reservation, System, Gear
from ..emailing import cancelled, approved
from ..views.PayPalView import process
from ..serializers import ReservationPOSTSerializer, ReservationGETSerializer, GearSerializer
from django.db.models import Q
from django.db import transaction
from rest_framework.permissions import AllowAny
import datetime
import decimal


def reservationIdExists(id):
    try:
        reservation = Reservation.objects.get(id=id)
    except Reservation.DoesNotExist:
        return False

    return reservation


class ReservationView(APIView):
    permission_classes = (AllowAny, )

    # Gets list of all reservations or specific reservations, depending on parameters
    def get(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.view_reservation"):
            return RespError(400, "You don't have permission to visit this page!")
 
        # Look for the following parameters in GET request
        ID = request.query_params.get("id", None)
        email = request.query_params.get("email", None)
        startDate = request.query_params.get("from", None)
        endDate = request.query_params.get("to", None)
        gearId = request.query_params.get("gearId", None)

        res = Reservation.objects.all()

        # Error check the dates to be in YYYY-MM-DD
        if startDate is not None:
            try:
                datetime.datetime.strptime(startDate, '%Y-%m-%d')
            except ValueError:
                return RespError(400,
                                 "startDate is in an invalid date format. Make sure it's in the YYYY-MM-DD format.")

        if endDate is not None:
            try:
                datetime.datetime.strptime(endDate, '%Y-%m-%d')
            except ValueError:
                return RespError(400, "endDate is in an invalid date format. Make sure it's in the YYYY-MM-DD format.")

        if ID is not None:
            try:
                int(ID)
            except ValueError:
                return RespError(400, "id must be an integer.")

        if gearId is not None:
            try:
                int(gearId)
            except ValueError:
                return RespError(400, "gearId must be an integer.")

        dateFilter = Q(startDate__range=[startDate, endDate]) | Q(endDate__range=[startDate, endDate]) | \
                     Q(startDate__lte=startDate, endDate__gte=endDate)

        # Find a single reservation with a specific ID, associated with by a specific email
        if ID and email:
            res = res.filter(id=ID, email=email)
            if not res:
                return RespError(404, "No reservation with this ID and email combination were found.")

        # Find all reservations in a specific date range if only the start and end dates are given
        elif (startDate and endDate) and not (ID or email):
            res = res.filter(dateFilter)

        # Find all reservations made by a certain email address in a certain date range
        elif startDate and endDate and email and (not ID):
            res = res.filter(dateFilter).filter(email=email)

        # Find all reservations made by a certain email address
        elif email and not (ID or startDate or endDate):
            res = res.filter(email=email)

        # Find ALL reservations if all parameters are missing
        elif not ID and not email and not startDate and not endDate:
            pass

        # Return all resv in which this gear has been in
        elif gearId and not (ID or email or startDate or endDate):
            res = res.filter(gear__id=gearId)

        # if there is some other combination of parameters in the get request, return error
        else:
            return RespError(400, "Invalid combination of query parameters.")

        # Success: return requested data in GET request
        serial = ReservationGETSerializer(res, many=True)
        return Response({"data": serial.data})

    # Attempt to create a new reservation
    def post(self, request):

        # Get the value of the disableSys boolean from System in the DB.
        # If it doesn't exist, initialize it to the default value of False
        try:
            disableSys = System.objects.get(service="disableSys")
            disableSysBool = disableSys.disabled

        except System.DoesNotExist:
            # by default, the rental system is enabled (disableSys's value by default = False). Thus:
            serviceEntry = System.objects.create(service="disableSys")
            serviceEntry.save()
            disableSysBool = False

        # Before making any reservations, check if the rental system is disabled or not.
        if disableSysBool:
            return RespError(403, "You cannot make reservations because the rental system is currently disabled.")

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
                return RespError(400, "'" + str(key) + "' is not valid with this POST method, please resubmit the "
                                                       "request without it.")

        sRes = ReservationPOSTSerializer(data=newRes, context={'request': request})

        if not sRes.is_valid():
            return serialValidation(sRes)

        sRes.save()

        return Response(sRes.data)

    # Edit gear in reservation
    def patch(self, request):
        if not request.user.is_authenticated or not request.user.has_perm("api.change_reservation"):
            return RespError(400, "You don't have permission to visit this page!")
 
        orgRequest = request
        request = request.data
        allowedPatchMethods = {
            "gear": True,
            "startDate": True,
            "endDate": True,
        }

        idToUpdate = request.get("id", None)
        expectedVersion = request.get("expectedVersion", None)
        patch = request.get("patch", None)

        # The following 3 checks could be up-leveled to a generic PATCH-check function
        if not idToUpdate:
            return RespError(400, "You must specify an id to patch.")

        if not expectedVersion:
            return RespError(400, "You must specify an 'expectedVersion'.")

        if not patch:
            return RespError(400, "You must specify a 'patch' object with attributes to patch.")

        for key in patch:
            if key not in allowedPatchMethods:
                return RespError(400, "'" + key + "' is not a valid patch attribute.")

        try:
            resv = Reservation.objects.get(id=idToUpdate)
        except Reservation.DoesNotExist:
            return RespError(400, "There is no reservation with the id of '" + str(idToUpdate) + "'.")

        if expectedVersion < resv.version:
            return RespError(400, "The version you are trying to update is out of date.")
        elif expectedVersion > resv.version:
            return RespError(400, "The version you are trying to update doesn't exist yet.")

        # Check if reservation gear can be modified based on status
        if resv.status not in ["REQUESTED", "APPROVED"]:
            return RespError(400, "The reservation status must be 'requested' or 'approved' to be modified.")

        for field in resv._meta.fields:  # field = Api.Reservation.fieldName
            f = str(field)
            f = f[16:]  # truncates Api.Reservation. part out
            if f not in patch:
                patch[f] = getattr(resv, f)

        if "gear" not in patch:
            patch["gear"] = []
            gear = resv.gear.all()
            for g in gear:
                patch["gear"].append(g.pk)

        sResv = ReservationPOSTSerializer(resv, data=patch, partial=True, context={'request': orgRequest.user.username})

        if not sResv.is_valid():
            return serialValidation(sResv)

        resv.version += 1
        sResv.save()
        sResv = ReservationGETSerializer(resv)

        return Response(sResv.data)


@api_view(['GET'])
def getHistory(request):
    if not request.user.is_authenticated or not request.user.has_perm("api.view_reservation"):
        return RespError(400, "You don't have permission to visit this page!")
 
    ID = request.query_params.get("id", None)

    try:
        res = Reservation.objects.get(id=ID)
    except Reservation.DoesNotExist:
        return RespError(400, "There is no reservation with the id of '" + str(ID) + "'.")
    res = res.history.all()
    serial = ReservationGETSerializer(res, many=True)

    data = []
    for i in range(len(serial.data)):
        if i == 0:
            data.append(serial.data[i])
            continue
        if serial.data[i] != serial.data[i - 1]:
            data.append(serial.data[i])

    return Response({"data": data})


@api_view(['POST'])
def checkout(request):
    if not request.user.is_authenticated or not request.user.has_perm("api.change_reservation"):
        return RespError(400, "You don't have permission to visit this page!")
 
    request = request.data

    if "id" not in request:
        return RespError(400, "There needs to be a reservation id to checkout.")

    reservation = reservationIdExists(request['id'])
    if not reservation:
        return RespError(400, "There is no reservation with the id of '" + str(request['id']) + "'")

    today = datetime.date.today()
    if reservation.endDate < today:
        return RespError(406, "You cannot checkout a reservation that ends before today;"
                              " please fix the endDate and try again.")

    if reservation.startDate > today:
        return RespError(406, "You cannot checkout a reservation that starts after today;"
                              " please fix the startDate and try again.")

    gearList = reservation.gear.all()
    for gear in gearList:
        if gear.condition != "RENTABLE":
            return RespError(403, "The gear item with the code of '" + str(gear.code) + "' is not 'rentable',"
                                                                                        " and thus can't be checked out. To still proceed with checking out, you"
                                                                                        " must remove the gear item from this reservation.")

        try:
            # the below query does the following:
            # Finds all reservations with a gear item in the reservation attempted to be checked out.
            # then, find the latest reservation before the current day by endDate.
            # If endDates are the same, find by the latest startDate.
            latestResWithGearItem = Reservation.objects.filter(gear=gear).filter(endDate__lte=today).latest('endDate',
                                                                                                            'startDate')

            if latestResWithGearItem.status != "CANCELLED" and latestResWithGearItem.status != "RETURNED":
                return RespError(406, "The gear item with the code of '" + str(gear.code) + "' is currently held"
                                                                                            " in another reservation (id #" + str(
                    latestResWithGearItem.id) + "),"
                                                " because that reservation hasn't been marked as 'returned' or 'cancelled'."
                                                " You must remove the gear itemfrom your reservation in order to proceed.")

        except Reservation.DoesNotExist:
            # no other reservation currently with the gear item.
            pass

    if reservation.status == "PAID":
        reservation.status = "TAKEN"
    elif "cash" in request:
        reservation.status = "TAKEN"
        reservation.payment = "CASH"
    else:
        return RespError(406, "The reservation status must be paid before it can be checked out.")

    reservation.save()
    serial = ReservationGETSerializer(reservation)
    return Response(serial.data)


@api_view(['POST'])
@transaction.atomic
def checkin(request):
    if not request.user.is_authenticated or not request.user.has_perm("api.change_reservation"):
        return RespError(400, "You don't have permission to visit this page!")
 
    request = request.data

    if "id" not in request and "charge" not in request:
        return RespError(400, "You must specify an id to return and the amount you wish to capture.")

    reservation = reservationIdExists(request['id'])
    if not reservation:
        return RespError(404, "There is no reservation with the id of '" + str(request['id']) + "'.")

    resvGear = reservation.gear.all()

    if "gear" in request:
        for gear in request["gear"]:
            for ele in ["id", "status", "comment"]:
                if ele not in gear:
                    return RespError(400, "You must provide " + str(ele) + " for each gear object!")
                try:
                    Gear.objects.get(pk=gear["id"])
                except Gear.DoesNotExist:
                    return RespError(400, "There is no gear with the ID of " + str(gear["id"]))

            g = resvGear.filter(id=gear["id"])
            if len(g) == 0:
                return RespError(400, "You can only return gear that was in the reservation")

    if reservation.status != "TAKEN":
        return RespError(406, "The reservation status must be 'taken'.")

    try:
        charge = decimal.Decimal(request['charge'])
    except decimal.InvalidOperation:
        return RespError(400, "'" + request['charge'] + "' is not a valid decimal number.")

    if charge < 0:
        return RespError(400, "Capture amount must be greater than or equal to zero.")

    # Passes all checks
    try:
        with transaction.atomic():
            if "gear" in request:
                for gear in request["gear"]:
                    g = Gear.objects.get(id=gear["id"])
                    patch = {
                        "condition": gear["status"],
                        "statusDescription": gear["comment"]
                    }
                    sGear = GearSerializer(g, data=patch, partial=True)
                    if not sGear.is_valid():
                        return serialValidation(sGear)
                    sGear.save()

            if reservation.payment != "CASH":
                status = process(reservation, charge)

                if status:
                    return RespError(400, status)

            reservation.status = "RETURNED"
            reservation.save()
    except Exception as e:
        return RespError(400, str(e))

    serial = ReservationGETSerializer(reservation)

    return Response(serial.data)


@api_view(['POST'])
def cancel(request):
    if not request.user.is_authenticated or not request.user.has_perm("api.change_reservation"):
        return RespError(400, "You don't have permission to visit this page!")
 
    request = request.data

    if "id" not in request:
        return RespError(400, "You must specify a reservation id to cancel.")

    reservation = reservationIdExists(request['id'])
    if not reservation:
        return RespError(404, "There is no reservation with the id of '" + str(request['id']) + "'.")

    if reservation.status != "REQUESTED" and reservation.status != "APPROVED":
        return RespError(406, "The reservation status must be 'requested' or 'approved'.")

    reservation.status = "CANCELLED"
    reservation.save()

    cancelled([reservation])

    serial = ReservationGETSerializer(reservation)
    return Response(serial.data)


@api_view(['POST'])
def approve(request):
    if not request.user.is_authenticated or not request.user.has_perm("api.change_reservation"):
        return RespError(400, "You don't have permission to visit this page!")
 
    request = request.data

    if "id" not in request:
        return RespError(400, "You must specify a reservation id to approve.")

    reservation = reservationIdExists(request['id'])
    if not reservation:
        return RespError(404, "There is no reservation with the id of '" + str(request['id']) + "'.")

    if reservation.status != "REQUESTED":
        return RespError(406, "The reservation status must be 'requested' in order to be approved.")

    reservation.status = "APPROVED"
    reservation.save()

    approved(reservation)

    serial = ReservationGETSerializer(reservation)

    return Response(serial.data)
