from django.db import models
from django.utils import timezone
# Create your models here.
 
class PriceCurrency(models.Model):
    name_currency = models.CharField(max_length=255) # e.g., "euro", "US dollar", "yen"
    currency = models.CharField(max_length=255) # e.g., "EUR", "USD", "YEN"
    symbol =  models.CharField(max_length=255) #e.g., "€", "$", "¥"

    def __str__(self):
        return self.name_currency

class Speise(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    price_unit = models.ForeignKey(PriceCurrency, on_delete=models.CASCADE,null=True, blank=True)
    ordered_stock = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class PortionUnit(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name_unit = models.CharField(max_length=50)  # e.g., "g", "ml", "pieces"

    def __str__(self):
        return self.name_unit

class Ingredient(models.Model):
    name_ing = models.CharField(max_length=255)
    base_stock = models.PositiveIntegerField(default=0)  # Total stock available
    unit = models.ForeignKey(PortionUnit, on_delete=models.CASCADE,null=True, blank=True)  # e.g., "kg", "g", "pieces"
    created = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return self.name_ing

class Recipe(models.Model):
    speise = models.ForeignKey(Speise, on_delete=models.CASCADE)
    name_recipe = models.CharField(max_length=255)    
    valid_from = models.DateField()
    valid_until = models.DateField()
    created = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name_recipe

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity_per_portion = models.PositiveIntegerField(default=0)  # The required quantity for each portion
    unit = models.ForeignKey(PortionUnit, on_delete=models.CASCADE,null=True, blank=True)
    def __str__(self):
        return f"{self.recipe.name_recipe} requires {self.quantity_per_portion} {self.unit.name_unit} of {self.ingredient.name_ing}"

class StorageLocation(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name_loc = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name_loc
    
class StorageItem(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name_ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE) #ingredient name
    location = models.ForeignKey(StorageLocation, on_delete=models.CASCADE)
    total_stock = models.PositiveIntegerField(default=0)  # Current stock quantity
    unit = models.ForeignKey(PortionUnit, on_delete=models.CASCADE)  # e.g., "kg", "liters", "units"
    last_updated = models.DateTimeField()

    def __str__(self):
        return f"{self.name_ingredient.name_ing} - {self.total_stock} {self.unit.name_unit}"


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
    type = models.CharField(max_length=1, choices=[("I", "Einkommen"), ("E", "Ausgabe")])
    quantity = models.PositiveIntegerField(default=1, help_text="Quantity purchased.")
    date = models.DateField()
    payment_type = models.CharField(choices=PAYMENT_CHOICES)
    handler = models.CharField(help_text="Person who did the payment")
