from django.core import mail
from django.test import TestCase
from ..emailing import cancelled, approved
from ..models import Reservation


class EmailTest(TestCase):

    def setUp(self):
        self.gr = Reservation.objects.create(email="henry@email.com", licenseName="Name on their license.",
                                             licenseAddress="Address on their license.", approvedBy="nobody",
                                             startDate="2018-10-25", endDate="2018-10-28")

    def test_cancelled(self):
        # Send message.

        cancelled(self.gr)

        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, 'Reservation Cancelled')

    def test_approved(self):
        # Send message.

        approved(self.gr)

        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, 'Reservation Approved')
