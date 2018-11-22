from background_task import background
from .models import Reservation
from django.core import mail
import datetime
import threading


@background()
def worker():

    today = datetime.datetime.today()
    tomorrow = (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

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


def cancelled(res):
    body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that your" \
           " reservation for " + str(res.startDate) + " to " + str(res.endDate) + " has been cancelled. If you have" \
           " concerns or questions, please contact the University of Alberta Outdoors Club as soon as possible so" \
           " appropriate action can be taken to resolve the issue.\n\nThanks,\nUniversity of Alberta Outdoors Club"

    EmailThread([{"subject": "Reservation Cancelled", "body": body, "to": [res.email]}]).start()


def approved(res):
    body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that your" \
           " reservation for " + str(res.startDate) + " to " + str(res.endDate) + " has been approved." \
           " You'll recieve an email the day before allowing you to pay through Paypal, or can come to the" \
           " office to pay in person when you come to pick up your gear on " + str(res.startDate) + ""\
           "\n\nThanks,\nUniversity of Alberta Outdoors Club"

    EmailThread([{"subject": "Reservation Approved", "body": body, "to": [res.email]}]).start()


# Async email sender
class EmailThread(threading.Thread):

    def __init__(self, messages):
        self.messages = messages
        threading.Thread.__init__(self)

    # TODO Change dev@ualberta.ca to actual email address
    def run(self):
        connection = mail.get_connection(fail_silently=False)
        connection.open()

        mass = []

        for item in self.messages:
            mass.append(mail.EmailMessage(item['subject'], item['body'], "dev@ualberta.ca", item['to']))

        connection.send_messages(mass)
        connection.close()
