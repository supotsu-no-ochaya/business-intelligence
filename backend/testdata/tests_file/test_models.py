from django.test import TestCase
from testdata.models import Speise, OrderItem

class SpeiseModelTest(TestCase):
    def setUp(self):
        self.speise = Speise.objects.create(name="Nutella Crepes", price=2.5)

    def test_speise_creation(self):
        self.assertEqual(self.speise.name, "Nutella Crepes")
        self.assertEqual(self.speise.price, 2.5)

class OrderItemModelTest(TestCase):
    def setUp(self):
        self.speise1 = Speise.objects.create(name="Nutella Crepes", price=2.5)
        self.speise2 = Speise.objects.create(name="Spekulatiuscreme Mochi", price=2.5)
        self.order = OrderItem.objects.create(timestamp="2025-01-21T10:00:00Z")
        self.order.Products.set([self.speise1, self.speise2])

    def test_get_total_price(self):
        self.assertEqual(self.order.getTotalPrice(), 5.0)
