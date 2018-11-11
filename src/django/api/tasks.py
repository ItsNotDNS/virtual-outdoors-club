from background_task import background
from .models import Reservation
from django.core import mail
import datetime
import threading


@background()
def worker():

    today = datetime.datetime.today()
    tomorrow = (today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

    reminder = Reservation.objects.filter(endDate=tomorrow, status="TAKEN")

    messages = []
    for res in reminder.all():
        body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that you " \
                "need to return return these gear by tomorrow: \n"

        for gear in res.gear.all():
            body += gear.category.name + " " + gear.code + " - " + gear.description + "\n"

        body += "\nFailure to return these gear by tomorrow can result in blacklisting and forfeiting of your" \
                " deposit. If you have concerns or questions, please contact the University of Alberta Outdoors" \
                " Club as soon as possible so appropriate action can be taken to resolve the issue.\n\nThanks," \
                "\nUniversity of Alberta Outdoors Club"

        messages.append({"body": body, "subject": "Gear Return Reminder", "to": [res.email]})

    if len(messages) > 0:
        EmailThread(messages).start()


def cancelled(res):
    body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that your" \
           " reservation for " + str(res.startDate) + " to " + str(res.endDate) + " has been cancelled. If you have" \
           " concerns or questions, please contact the University of Alberta Outdoors Club as soon as possible so" \
           " appropriate action can be taken to resolve the issue.\n\nThanks,\nUniversity of Alberta Outdoors Club"

    EmailThread([{"subject": "Reservation Cancelled", "body": body, "to": [res.email]}]).start()


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