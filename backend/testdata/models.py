from django.db import models

# Create your models here.

class Speise(models.Model):
    name = models.CharField()
    zutaten = models.TextField()
    preis = models.FloatField()
    erstellt = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField()
    Products = models.ManyToManyField(Speise, related_name='orders')

    def __str__(self):
        return super().__str__()

    def getTotalPrice(self):
        total_price = sum(speise.preis for speise in self.Products.all())
        return total_price

class MesseEvent(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name



# Models for file upload
# Model for Station
class Station(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    created = models.DateTimeField()
    updated = models.DateTimeField()

    def __str__(self):
        return self.name

# Model for Category
class Category(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    created = models.DateTimeField()
    updated = models.DateTimeField()

    def __str__(self):
        return self.name

# Model for Product Attributes
class ProductAttribute(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    created = models.DateTimeField()
    updated = models.DateTimeField()

# Model for Product
class Product(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    is_available = models.BooleanField(default=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    attribute = models.ManyToManyField(ProductAttribute)
    created = models.DateTimeField()
    updated = models.DateTimeField()

    def __str__(self):
        return "Product -- Id: %s - Name: %s - Station: %s - Category: %s".format(self.id, self.name, self.station, self.category)

# Model for Order Events
class OrderEvent(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    type = models.CharField(max_length=255)
    content = models.JSONField()  # JSONField for dynamic event content
    created = models.DateTimeField()
    updated = models.DateTimeField()

# Model for Order
class Order(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    table = models.IntegerField()
    waiter = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    created = models.DateTimeField()
    updated = models.DateTimeField()
    events = models.ManyToManyField(OrderEvent)

# Model for Order Items
class OrderItem2(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=255)
    bom = models.JSONField()  # Bill of Materials as JSON
    created = models.DateTimeField()
    updated = models.DateTimeField()
    events = models.ManyToManyField(OrderEvent, related_name='order_item_events')

# Model for Payment Option
class PaymentOption(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    details = models.TextField()
    created = models.DateTimeField()
    updated = models.DateTimeField()

# Model for Payment
class Payment(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    payment_option = models.ForeignKey(PaymentOption, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tip_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.FloatField()
    created = models.DateTimeField()
    updated = models.DateTimeField()

