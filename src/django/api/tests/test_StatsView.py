from django.test import TestCase
from ..models import GearCategory, Gear, GearStat
from decimal import Decimal
import datetime


class StatsViewTestCase(TestCase):

    def setUp(self):
        self.today = datetime.datetime.today()

        self.gc1 = GearCategory(name="Map")
        self.gc2 = GearCategory(name="Ski Poles")
        GearCategory.objects.bulk_create([self.gc1, self.gc2])

        self.gr1 = Gear(code="MP01", category=self.gc1, depositFee=50.00)
        self.gr2 = Gear(code="MP02", category=self.gc1, depositFee=50.00)
        self.gr3 = Gear(code="SP01", category=self.gc2, depositFee=50.00)
        Gear.objects.bulk_create([self.gr1, self.gr2, self.gr3])

        gs1 = GearStat(counter=7, gearID=self.gr1, usage=5)
        gs2 = GearStat(counter=7, gearID=self.gr3, usage=4)
        gs3 = GearStat(counter=7, gearID=self.gr1, usage=4)
        gs4 = GearStat(counter=7, gearID=self.gr2, usage=4)
        gs5 = GearStat(counter=7, gearID=self.gr3, usage=1)
        gs6 = GearStat(counter=6, gearID=self.gr1, usage=6)
        gs7 = GearStat(counter=6, gearID=self.gr2, usage=4)
        gs8 = GearStat(counter=6, gearID=self.gr3, usage=0)
        GearStat.objects.bulk_create([gs1, gs2, gs3, gs4, gs5, gs6, gs7, gs8])

    def test_invalid_requests(self):
        response = self.client.get('/api/statistics?from=2018-hello').data['message']
        self.assertEqual(response, "The start date is in an invalid format. Make sure it's in the YYYY-MM-DD format.")

        response = self.client.get('/api/statistics?from=' +
                                   (self.today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")).data['message']
        self.assertEqual(response, "The start date cannot be in the future.")

        response = self.client.get('/api/statistics?to=2018-11-world').data["message"]
        self.assertEqual(response, "The end date is in an invalid format. Make sure it's in the YYYY-MM-DD format.")

        response = self.client.get('/api/statistics?to=' +
                                   (self.today + datetime.timedelta(days=1)).strftime("%Y-%m-%d")).data['message']
        self.assertEqual(response, "The end date cannot be in the future.")

        response = self.client.get('/api/statistics?to=2018-11-23&from=2018-11-24').data['message']
        self.assertEqual(response, "The end date cannot be before the start date.")

    def test_get_dates(self):
        correct_response = {
            'gear': {
                'SP01': {
                    'description': '',
                    'usage': [Decimal('0.1428571428571428571428571429')]},
                'MP02': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714')]},
                'MP01': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714')]}},
            'category': {
                'Ski Poles': [Decimal('0.1428571428571428571428571429')],
                'Map': [Decimal('0.5714285714285714285714285714')]}
        }

        query = '/api/statistics?from=' + (self.today - datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {
                'SP01': {
                    'description': '',
                    'usage': [Decimal('0.1428571428571428571428571429'), Decimal('0.5714285714285714285714285714')]},
                'MP02': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714'), 0]},
                'MP01': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714'), Decimal('0.7142857142857142857142857143')]}},
            'category': {
                'Ski Poles': [Decimal('0.1428571428571428571428571429'), Decimal('0.5714285714285714285714285714')],
                'Map': [Decimal('0.5714285714285714285714285714'), Decimal('0.7142857142857142857142857143')]}
        }

        query = '/api/statistics?from=' + (self.today - datetime.timedelta(days=14)).strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {
                'SP01': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714')]},
                'MP01': {
                    'description': '',
                    'usage': [Decimal('0.7142857142857142857142857143')]}},
            'category': {
                'Ski Poles': [Decimal('0.5714285714285714285714285714')],
                'Map': [Decimal('0.7142857142857142857142857143')]}
        }

        query = '/api/statistics?to=' + (self.today - datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {},
            'category': {}
        }

        query = '/api/statistics?to=' + (self.today - datetime.timedelta(days=14)).strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {
                'SP01': {
                    'description': '',
                    'usage': [Decimal('0.1428571428571428571428571429')]},
                'MP02': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714')]},
                'MP01': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714')]}},
            'category': {
                'Ski Poles': [Decimal('0.1428571428571428571428571429')],
                'Map': [Decimal('0.5714285714285714285714285714')]}
        }

        query = '/api/statistics?from=' + (self.today - datetime.timedelta(days=7)).strftime("%Y-%m-%d") + '&to=' + self.today.strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {
                'SP01': {
                    'description': '',
                    'usage': [Decimal('0.1428571428571428571428571429'), Decimal('0.5714285714285714285714285714')]},
                'MP02': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714'), 0]},
                'MP01': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714'), Decimal('0.7142857142857142857142857143')]}},
            'category': {
                'Ski Poles': [Decimal('0.1428571428571428571428571429'), Decimal('0.5714285714285714285714285714')],
                'Map': [Decimal('0.5714285714285714285714285714'), Decimal('0.7142857142857142857142857143')]}
        }

        query = '/api/statistics?from=' + (self.today - datetime.timedelta(days=14)).strftime("%Y-%m-%d") + '&to=' + self.today.strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {
                'SP01': {
                    'description': '',
                    'usage': [Decimal('0.5714285714285714285714285714')]},
                'MP01': {
                    'description': '',
                    'usage': [Decimal('0.7142857142857142857142857143')]}},
            'category': {
                'Ski Poles': [Decimal('0.5714285714285714285714285714')],
                'Map': [Decimal('0.7142857142857142857142857143')]}
        }

        query = '/api/statistics?from=' + (self.today - datetime.timedelta(days=14)).strftime("%Y-%m-%d") + '&to=' + (self.today - datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)

        correct_response = {
            'gear': {},
            'category': {}
        }

        query = '/api/statistics?from=' + (self.today - datetime.timedelta(days=21)).strftime("%Y-%m-%d") + '&to=' + (self.today - datetime.timedelta(days=14)).strftime("%Y-%m-%d")
        response = self.client.get(query).data['data']
        self.assertEqual(response, correct_response)
