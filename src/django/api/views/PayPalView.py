from paypal.standard.forms import PayPalPaymentsForm
from paypal.standard.models import ST_PP_PENDING
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .error import RespError
from ..models import Reservation
from decimal import Decimal
import time


@csrf_exempt
def returnView(request):

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

    amount = Decimal()
    for gear in res.gear.all():
        amount += gear.depositFee

    # TODO Replace with UAOC specif info
    required = {
        "business": "ceegan-facilitator@ualberta.ca",
        "amount": amount,
        "item_name": res.id,
        "invoice": int(time.time()),
        "currency_code": 'CAD',
        "paymentaction": "authorization",
        "notify_url": "http://{}{}".format(request.get_host(), reverse('paypal-ipn')),
        "return": "http://{}{}".format(request.get_host(), reverse('returnView')),
        "cancel_return": "http://{}{}".format(request.get_host(), reverse('cancelView'))
    }

    form = PayPalPaymentsForm(initial=required)
    return render(request, "payment.html", {'form': form})


# TODO Replace with UAOC specif info
def confirm(sender, **kwargs):
    ipn_obj = sender

    if ipn_obj.payment_status == ST_PP_PENDING and ipn_obj.receiver_email == "ceegan-facilitator@ualberta.ca":
        try:
            res = Reservation.objects.get(id=ipn_obj.item_name)
        except Reservation.DoesNotExist or AttributeError:
            return

        amount = Decimal()
        for gear in res.gear.all():
            amount += gear.depositFee

        if ipn_obj.auth_amount != amount or ipn_obj.mc_currency != "CAD":
            return

        res.payment = ipn_obj.auth_id
        res.status = "PAID"
        res.save()

    return

