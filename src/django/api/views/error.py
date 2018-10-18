from rest_framework.response import Response


# Returns a response for general errors
def RespError(status, message):
    return Response({"message": message}, status=status)


# Returns a response for why serial validation failed
def serialValidation(serial):
    errors = serial.errors
    for key in errors:
        # report errors using the built in serializer error reporter
        return RespError(400, key + ": " + errors[key][0])