from django.db import models

# Create your models here.

class Speise(models.Model):
    name = models.CharField()
    zutaten = models.TextField()
    menge = models.IntegerField()
    preis = models.FloatField()
    rabatt = models.IntegerField()
    r_preis = models.FloatField()
    erstellt = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
