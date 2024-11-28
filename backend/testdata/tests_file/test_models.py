from django.test import TestCase
from testdata.models import Speise, OrderItem

class SpeiseModelTest(TestCase):
    def setUp(self):
        self.speise = Speise.objects.create(name="Pizza", zutaten="Cheese, Tomato", preis=10.5)

    def test_speise_creation(self):
        self.assertEqual(self.speise.name, "Pizza")
        self.assertEqual(self.speise.preis, 10.5)

class OrderItemModelTest(TestCase):
    def setUp(self):
        self.speise1 = Speise.objects.create(name="Pizza", preis=10.5)
        self.speise2 = Speise.objects.create(name="Burger", preis=8.5)
        self.order = OrderItem.objects.create(timestamp="2024-11-27T10:00:00Z")
        self.order.Products.set([self.speise1, self.speise2])

    def test_get_total_price(self):
        self.assertEqual(self.order.getTotalPrice(), 19.0)
