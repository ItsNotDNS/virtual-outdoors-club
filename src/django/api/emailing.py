from django.core import mail
import threading


def cancelled(reservations):
    emails = []
    for res in reservations:
        body = "Hey " + res.licenseName.split()[0] + ",\n\nThis is an automated email letting you know that your" \
               " reservation for " + str(res.startDate) + " to " + str(res.endDate) + " has been cancelled. If you have" \
               " concerns or questions, please contact the University of Alberta Outdoors Club as soon as possible so" \
               " appropriate action can be taken to resolve the issue.\n\nThanks,\nUniversity of Alberta Outdoors Club"
        emails.append({"subject": "Reservation Cancelled", "body": body, "to": [res.email]})

    EmailThread(emails).start()


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
