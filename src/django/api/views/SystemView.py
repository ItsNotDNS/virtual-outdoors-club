from .error import *
from rest_framework.views import APIView
from ..models import System, Reservation
from ..serializers import SystemSerializer
from django.db.models import Q
from ..emailing import cancelled
from .PayPalView import process


class SystemView(APIView):

	# get request to retrieve the boolean variables of system
	def get(self, request):
		if not request.user.is_authenticated:
			return RespError(401, "You don't have permission to visit this page!")

		sys = System.objects.all()

		# if a get request for system has been made without the system being initialized, initialize it:
		if not sys:
			serviceEntry = System.objects.create(service="disableSys", disabled=False)
			serviceEntry.save()
			sys = System.objects.all()

		serial = SystemSerializer(sys, many=True)
		return Response({"data": serial.data}) 

	def post(self, request):
		# function to disable or enable the rental system

		if not request.user.is_authenticated:
			return RespError(401, "You don't have permission to visit this page!")
			
		request = request.data

		# Common checks to make sure request is valid

		if "disableSys" not in request:
			return RespError(400, "You are missing the required key 'disableSys' in the request.")

		# Set the boolean of the disableSys service in the system to the one passed in by the request
		# If the service doesn't already exist, create it with the boolean in the request
		try:
			serviceEntry = System.objects.get(service="disableSys")
			serviceEntry.disabled = request["disableSys"]
			serviceEntry.save()

		except System.DoesNotExist:
			serviceEntry = System.objects.create(service="disableSys", disabled=request["disableSys"])
			serviceEntry.save()

		disableSysService = System.objects.get(service="disableSys")
		disableSysBool = disableSysService.disabled

		if "cancelRes" in request:
			if not disableSysBool:
				return RespError(400, "You cannot cancel any reservations while enabling the system.")

			cancelResBool = request["cancelRes"]
			# Cancels all reservations with status = REQUESTED, APPROVED, and
			# PAID if cancelRes == True in the system (and the rental service is being disabled)
			if disableSysBool and cancelResBool:
				allResToCancel = Reservation.objects.filter(Q(status="REQUESTED") | Q(status="APPROVED") | Q(status="PAID"))

				# voids any paid reservations
				unvoidedRes = []
				paidRes = Reservation.objects.filter(status="PAID")

				for res in paidRes:
					processReturn = process(res, 0) 
					if processReturn: 
						# if process() returns an error message, track all unvoided reservations
						unvoidedRes.append(res.id)

				# sends cancellation emails accordingly
				cancelled(allResToCancel)

				outputStr=""
				for resId in unvoidedRes:
					outputStr+=str(resId)
					if resId != unvoidedRes[-1]:
						outputStr+=", "

				# cancels all appropriate reservations 
				allResToCancel.update(status="CANCELLED")

				# if there are any unvoided reservations, output a specific error message
				if unvoidedRes:
					return Response({"message": "All reservations not checked out were succesfully cancelled, but" +  
						"the following paid reservations could not be voided right now: reservation IDs " +
						outputStr + "."}, 200)
				else:
					return Response({"message": "All reservations not checked out were succesfully cancelled."}, 200)

		return Response(200)    