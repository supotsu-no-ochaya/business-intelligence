from django.core.management.base import BaseCommand
from testdata.models import (
    Station, Category, ProductAttribute, Product,
    OrderEvent, Order, OrderItem2, PaymentOption,
    Payment
)

class Command(BaseCommand):
    help = 'Clear all data from the database'

    def handle(self, *args, **kwargs):
        Station.objects.all().delete()
        Category.objects.all().delete()
        ProductAttribute.objects.all().delete()
        Product.objects.all().delete()
        OrderEvent.objects.all().delete()
        Order.objects.all().delete()
        OrderItem2.objects.all().delete()
        PaymentOption.objects.all().delete()
        Payment.objects.all().delete()
        self.stdout.write("All data has been cleared!")

