from paypal.standard.forms import PayPalPaymentsForm
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import time

@csrf_exempt
def returnView(request):
    return render(request, 'done.html')


@csrf_exempt
def cancelView(request):
    return render(request, 'cancel.html')


def paypalView(request):

    required = {
        "business": "ceegan-facilitator@ualberta.ca",
        "amount": 10.00,
        "item_name": "Order 1234",
        "invoice": str(int(time.time())),
        "currency_code": 'CAD',
        "notify_url": "http://{}{}".format(request.get_host(), reverse('paypal-ipn')),
        "return_url": "http://{}{}".format(request.get_host(), reverse('returnView')),
        "cancel_return": "http://{}{}".format(request.get_host(), reverse('cancelView'))
    }

    form = PayPalPaymentsForm(initial=required)
    return render(request, "payment.html", {'form': form})
