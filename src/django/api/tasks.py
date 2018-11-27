from .views.PayPalView import process
from background_task import background
from .models import Gear, Reservation, GearStat
from .emailing import EmailThread
from django.db.models import F
import datetime


@background()
def stats_worker():
    create = False
    if datetime.datetime.today().weekday() == 0:
        create = True

    for gear in Gear.objects.all():
        try:
            gs = GearStat.objects.get(gearID=gear, counter__lt=7)
        except GearStat.DoesNotExist:
            gs = None

        if gear.reservation_set.filter(status="TAKEN").exists():
            if gs:
                gs.usage += 1
            elif create:
                gs = GearStat.objects.create(gearID=gear, usage=1)
        elif not gs and create:
            gs = GearStat.objects.create(gearID=gear, usage=0)

        if gs:
            gs.save()

    GearStat.objects.filter(counter__lt=7).update(counter=F('counter')+1)


@background()
def email_worker():
    today = datetime.datetime.today()
    tomorrow = (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

    oldpaidres = Reservation.objects.filter(endDate=today, status="PAID")

    for res in oldpaidres.all():
        process(res, 0)

    oldpaidres.update(status="CANCELLED")

    # Remove approved but unclaimed reservations
    oldres = Reservation.objects.filter(endDate=today)
    (oldres.filter(status="APPROVED") | oldres.filter(status="REQUESTED")).update(status="CANCELLED")

    # Create due date reminder
    reminder = Reservation.objects.filter(endDate=tomorrow, status="TAKEN")

    messages = []
    for res in reminder.all():
        body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that you " \
               "must return the gear listed below by tomorrow: \n"

        for gear in res.gear.all():
            body += gear.category.name + " " + gear.code + " - " + gear.description + "\n"

        body += "\nFailure to return these gear by tomorrow can result in blacklisting and forfeiting of your" \
                " deposit. If you have concerns or questions, please contact the University of Alberta Outdoors" \
                " Club as soon as possible so appropriate action can be taken to resolve the issue.\n\nThanks," \
                "\nUniversity of Alberta Outdoors Club"

        messages.append({"body": body, "subject": "Gear Return Reminder", "to": [res.email]})

    # Create payment email
    payment = Reservation.objects.filter(startDate=tomorrow, status="APPROVED")

    # TODO: REPLACE LINK ADDRESS WITH PROPER ADDRESS
    for res in payment.all():
        body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that you " \
               "can now pay for your reservation. Please follow the link below to pay with PayPal:\n\n " \
               "127.0.0.1:8081/pay?id=" + res.id + " \n\nYou can also choose to pay for this reservation tomorrow " \
               "when you go to pick it up with cash or PayPal still.\n\nThanks,\nUniversity of Alberta Outdoors Club"

        messages.append({"body": body, "subject": "Reservation Payment", "to": [res.email]})

    if len(messages) > 0:
        EmailThread(messages).start()