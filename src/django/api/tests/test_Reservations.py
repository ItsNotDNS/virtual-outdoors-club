from django.test import TestCase
from ..models import Reservation, GearCategory, Gear
from rest_framework.test import APIRequestFactory


class ReservationTestCase(TestCase):

    # Create test data and save primary key of all objects
    @classmethod
    def setUpClass(self):
        super().setUpClass()
        spCat = GearCategory.objects.create(name="Ski poles")
        sp = Gear.objects.create(code="SP01", category=spCat, depositFee=12.00, description="Ski poles", condition="RENTABLE", version=1)
        gr = Reservation.objects.create(email="enry@email.com", licenseName="Name on their license.", licenseAddress="Address on their license.", approvedBy="nobody", startDate="2018-10-25", endDate="2018-10-28", payment={"nobody": "nobody"})
        gr.save()
        gr.gear.add(sp)
        self.sp = sp
        self.client = APIRequestFactory

    def test_get(self):
        response = self.client.get('/api/reservation/').data['data']

        correctResponse = [{'status': 'REQUESTED',
                            'licenseName': 'Name on their license.',
                            'licenseAddress': 'Address on their license.',
                            'id': 1,
                            'email': 'enry@email.com',
#                            'approvedBy': 'nobody',    #TODO re-add
                            'gear': [{'depositFee': '12.00',
                                      'code': 'SP01',
                                      'condition': "RENTABLE",
                                      'version': 1,
                                      'category': 'Ski poles',
                                      'id': 4,
                                      'description': 'Ski poles'}],
                            'startDate': '2018-10-25',
                            'endDate': '2018-10-28',
                            'status': 'REQUESTED',
                                                        }]

        self.assertEqual(response, correctResponse)

    def test_checkin(self):
        request = {
            "id": 1,
        }

        correctResponse = [{
                            'id': 1,
#                            'version': 1,
                            'email': 'enry@email.com',
                            'licenseName': 'Name on their license.',
                            'licenseAddress': 'Address on their license.',
                            'status': 'RETURNED',
                            'gear': [{'depositFee': '12.00',
                                      'code': 'SP01',
                                      'version': 1,
                                      'category': 'Ski poles',
                                      "condition": "RENTABLE",
                                      'id': 4,
                                      'description': 'Ski poles'}],
                            'endDate': '2018-10-28',
                            'startDate': '2018-10-25'}]
        response = self.client.post('/api/reservation/checkin/', request, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/reservation/').data['data']


        self.assertEqual(response, correctResponse)

    def test_post(self):
        reservationList = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        reservationListOriginalLen = len(reservationList)
        request = {
            "email": "henry@email.com",
            "licenseName": "Name on their license.",
            "licenseAddress": "Address on their license.",
            "startDate": "2019-10-25",
            "endDate": "2019-10-28",
            "status": "REQUESTED",
            "gear": [self.sp.pk]}

        # Test POST (create new reservation)
        response = self.client.post("/api/reservation/", request, content_type='application/json')
        # Test GET (created and added list)
        response = self.client.get("/api/reservation/", content_type='application/json').data["data"] # returned as {data: [...]}
        self.assertEqual(len(response), reservationListOriginalLen + 1) # len of GET should +1 original len
