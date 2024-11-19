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
    id = models.CharField(primary_key=True)
    timestamp = models.DateTimeField()
    Products = models.ManyToManyField(Speise, related_name='orders')

    def __str__(self):
        return super().__str__()