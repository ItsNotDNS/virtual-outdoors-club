from django.core import mail
from django.test import TestCase
from ..tasks import cancelled
from ..models import Reservation


class EmailTest(TestCase):

    def setUp(self):
        self.gr = Reservation.objects.create(email="henry@email.com", licenseName="Name on their license.",
                                             licenseAddress="Address on their license.", approvedBy="nobody",
                                             startDate="2018-10-25", endDate="2018-10-28", payment={"nobody": "nobody"})

    def test_cancelled(self):
        # Send message.

        cancelled(self.gr)

        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, 'Reservation Cancelled')
