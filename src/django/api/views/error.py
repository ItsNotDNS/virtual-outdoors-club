from rest_framework.response import Response
from django.http import JsonResponse


# Returns a response for general errors
def RespError(status, message):
    return Response({"message": message}, status=status)


# Returns a response for why serial validation failed
def serialValidation(serial):
    errors = serial.errors
    for key in errors:
        # report errors using the built in serializer error reporter
        if key == "non_field_errors":
        	return RespError(400, errors[key][0])
        else:
        	return RespError(400, key + ": " + errors[key][0])
        	

def error_500(request):
    return JsonResponse({"message": "Internal server error"}, status=500)
