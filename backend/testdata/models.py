from django.db import models

# Create your models here.

class Speise(models.Model):
    name = models.CharField(max_length=255)
    zutaten = models.TextField()
    preis = models.FloatField()
    erstellt = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50, default='unit')  # e.g., "kg", "g", "pieces"
    quantity = models.PositiveIntegerField(default=0)  # The current quantity of the ingredient in storage
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.quantity} {self.unit}"

class SpeiseLager(models.Model):
    name = models.CharField(max_length=255)
    zutaten = models.ManyToManyField(Ingredient, through='SpeiseIngredient')
    preis = models.FloatField()
    erstellt = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def update_ingredient_availability(self, order_quantity):
        # Iterate through all the SpeiseIngredient relationships
        for speise_ingredient in self.speiseingredient_set.all():
            speise_ingredient.update_ingredient_availability(order_quantity)

class SpeiseIngredient(models.Model):
    speise = models.ForeignKey(SpeiseLager, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    portion = models.PositiveIntegerField(default=1)  # Amount of the ingredient used per dish portion
    required_quantity = models.PositiveIntegerField(default=0)  # The required quantity for each portion
    
    def __str__(self):
        return f"{self.speise.name} uses {self.ingredient.name} ({self.portion} {self.ingredient.unit})"

    def save(self, *args, **kwargs):
        # Automatically calculate the required_quantity before saving
        self.required_quantity = self.portion
        super().save(*args, **kwargs)

    def update_ingredient_availability(self, order_quantity):
        for speise_ingredient in self.speiseingredient_set.all():
            ingredient = speise_ingredient.ingredient
            ingredient_quantity_used = speise_ingredient.required_quantity * order_quantity
            ingredient.quantity -= ingredient_quantity_used
            ingredient.save()


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
# Model for Station (z.B. mochi, sandwich, etc)
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
    menu_item_name = models.CharField()
    menu_item_price_in_cents = models.IntegerField()
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

class StorageLocation(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class StorageItem(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    product = models.ForeignKey(SpeiseLager, on_delete=models.CASCADE)  
    location = models.ForeignKey(StorageLocation, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)  # Current stock quantity
    unit = models.CharField(max_length=50, default='unit')  # e.g., "kg", "liters", "units"
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.quantity} {self.unit}"
    
class CompanyExpense(models.Model):
    EXPENSE_CATEGORIES = [
        ('FOOD', 'Essen & Getränke'),
        ('DECOR', 'Dekorationen'),
        ('COSTUME', 'Kostüme'),
        ('PROMO', 'Werbung & Promotion'),
        ('SUPPLY', 'Materialien'),
        ('EQUIP', 'Ausrüstung'),
        ('TRAVEL', 'Reisekosten'),
        ('FEES', 'Gebühren & Lizenzen'),
        ('MISC', 'Sonstiges'),
    ]

    PAYMENT_CHOICES =  [
        ("CC", "Kreditkarte"),
        ("CA", "Bargeld"),
    ]

    id = models.AutoField(primary_key=True, auto_created=True)
    description = models.TextField(blank=True, help_text="Details about the product or its purpose.")
    title = models.CharField(max_length=255)
    amount = models.IntegerField()
    category = models.CharField(
        max_length=10,
        choices=EXPENSE_CATEGORIES,
        help_text="Category of the expense."
    )
    quantity = models.PositiveIntegerField(default=1, help_text="Quantity purchased.")
    date = models.DateField()
    payment_type = models.CharField(choices=PAYMENT_CHOICES)
    handler = models.CharField(help_text="Person who did the payment")