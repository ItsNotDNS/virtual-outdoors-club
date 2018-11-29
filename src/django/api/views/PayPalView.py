import paypalrestsdk
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .error import RespError, Response
from ..models import Reservation
from decimal import Decimal
import time
import datetime


@csrf_exempt
@api_view(['GET'])
def returnView(request):
    paymentId = request.query_params.get("paymentId", None)
    payerId = request.query_params.get("PayerID", None)

    if not paymentId and not payerId:
        return render(request, 'cancel.html')

    try:
        res = Reservation.objects.get(payment=paymentId)
    except Reservation.DoesNotExist:
        return render(request, 'cancel.html')

    deposit = paypalrestsdk.Payment.find(paymentId)

    if deposit.execute({"payer_id": payerId}):
        res.payment = deposit['transactions'][0]['related_resources'][0]['authorization']['id']
        res.status = "PAID"
    else:
        res.payment = ""
        return Response(deposit.error)

    res.save()

    return render(request, 'done.html')


@csrf_exempt
def cancelView(request):

    return render(request, 'cancel.html')


@api_view(['POST'])
def paypalView(request):

    data = request.data

    if 'id' not in data:
        return RespError(400, "You must specify an id.")

    try:
        res = Reservation.objects.get(id=data['id'])
    except Reservation.DoesNotExist:
        return RespError(400, "There is no reservation with the id of '" + str(data['id']) + "'")

    if res.status == "PAID":
        return RespError(400, "Reservation already paid for")

    if res.startDate > (datetime.date.today() + datetime.timedelta(days=1)):
        return RespError(400, "The earliest you can pay for a reservation is the day before the start date")

    amount = Decimal()
    itemList = []
    for gear in res.gear.all():
        amount += gear.depositFee
        itemList.append({"sku": gear.code,
                         "name": gear.category.name,
                         "description": gear.description,
                         "quantity": "1",
                         "price": str(gear.depositFee),
                         "currency": "CAD"})

    # TODO Replace with UAOC specif info

    deposit = paypalrestsdk.Payment({
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"},
        "application_context": {
            "brand_name": "University Of Alberta Outdoors Club",
            "shipping_preference": "NO_SHIPPING"},
        "redirect_urls": {
            "return_url": "http://{}{}".format(request.get_host(), reverse('returnView')),
            "cancel_url": "http://{}{}".format(request.get_host(), reverse('cancelView'))},
        "transactions": [{
            "amount": {
                "total": str(amount),
                "currency": "CAD"},
            "description": "authorization for reservation #" + str(res.id),
            "item_list": {
                "items": itemList}
        }]
    })

    if deposit.create():
        for link in deposit.links:
            if link.rel == "approval_url":
                res.payment = deposit.id
                res.save()
                return Response(str(link.href))
    else:
        return RespError(400, deposit.error)


def process(res, amount):
    deposit = paypalrestsdk.Authorization.find(res.payment)

    if amount == 0:
        if deposit.void():

            return
        else:
            return deposit.error

    capture = deposit.capture({"amount": {"currency": "CAD", "total": str(amount)}, "is_final_capture": True})

    if capture.success():
        return
    else:
        return capture.error
