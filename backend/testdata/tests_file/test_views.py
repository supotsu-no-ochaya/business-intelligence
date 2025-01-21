from django.test import TestCase, Client
from django.urls import reverse
from testdata.models import Speise

class EarningsViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.speise = Speise.objects.create(name="Nutella Crepes", price=2.5)

    def test_earnings_view(self):
        response = self.client.get(reverse('total_earnings'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('earnings', response.json())
