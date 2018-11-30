from django.core import mail
from django.test import TestCase
from ..emailing import cancelled, approved
from ..models import Reservation
from django.contrib.auth.models import User


class EmailTest(TestCase):

    def setUp(self):
        self.gr1 = Reservation.objects.create(email="henry@email.com", licenseName="Name on their license.",
                                              licenseAddress="Address on their license.", approvedBy="nobody",
                                              startDate="2018-10-25", endDate="2018-10-28")

        self.gr2 = Reservation.objects.create(email="ceegan@email.com", licenseName="Name on their license.",
                                              licenseAddress="Address on their license.", approvedBy="nobody",
                                              startDate="2018-10-25", endDate="2018-10-28")
    
        User.objects.create_superuser("admin1", "admin@gmail.com", "pass")

    def test_cancelled(self):
        self.client.login(username="admin1", password="pass")

        # Send messages.
        cancelled([self.gr1, self.gr2])

        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 2)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, 'Reservation Cancelled')
        self.assertEqual(mail.outbox[0].to, ['henry@email.com'])

        self.assertEqual(mail.outbox[1].subject, 'Reservation Cancelled')
        self.assertEqual(mail.outbox[1].to, ['ceegan@email.com'])

    def test_approved(self):
        self.client.login(username="admin1", password="pass")

        # Send message.

        approved(self.gr1)

        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, 'Reservation Approved')
