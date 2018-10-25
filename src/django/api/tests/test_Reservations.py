from django.test import TestCase
from ..models import Reservation, GearCategory, Gear, Condition
from rest_framework.test import APIRequestFactory


class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        spCat = GearCategory.objects.create(name="Ski poles")
        goodCon = Condition.objects.create(condition="RENTABLE")
        sp = Gear.objects.create(code="SP01", category=spCat, depositFee=12.00, description="Ski poles", condition=goodCon, version=1)
        gr = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.", licenseAddress="Address on their license.", approvedBy="nobody", startDate="2018-10-25", endDate="2018-10-28", payment={"nobody": "nobody"})
        gr.save()
        gr.gear.add(sp)
        self.client = APIRequestFactory
        self.goodCon = goodCon

    def test_get(self):
        response = self.client.get('/api/reservation/').data['data']

        correctResponse = [{'status': 'REQUESTED',
                            'licenseAddress': 'Address on their license.',
                            'endDate': '2018-10-28',
                            'licenseName': 'Name on their license.',
                            'id': 1,
                            'email': 'enry@email.com',
                            'gear': [[{'depositFee': '12.00',
                                      'code': 'SP01',
                                      'version': 1,
                                      'category': 'Ski poles',
                                      "condition": "RENTABLE",
                                      'id': 4,
                                      'description': 'Ski poles'}]],
                            'startDate': '2018-10-25'}]
        self.assertEqual(response, correctResponse)

    def test_post(self):
        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        reservationListOriginalLen = len(reservationList)

        request = {
            'status': 'REQUESTED',
            'licenseAddress': 'Address on their license.',
            'endDate': '2018-10-28',
            'licenseName': 'Name on their license.',
            'id': 1,
            'email': 'enry@email.com',
            'gear': [{'depositFee': '12.00',
                      'code': 'SP01',
                      'checkedOut': False,
                      'version': 1,
                      'category': 'Ski poles',
                      "condition": 2,
                      'id': 3,
                      'description': 'Ski poles'}],
            'startDate': '2018-10-25'}

        # Test POST (create new reservation)
        response = self.client.post("/api/reservation/", request, content_type='application/json').data

        # Test GET (created and added list)
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        self.assertEqual(len(response), reservationListOriginalLen + 1) # len of GET should +1 original len
