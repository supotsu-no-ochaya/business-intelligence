from django.contrib import admin
from .models import MesseEvent, Speise

# Register your models here.

@admin.register(MesseEvent)
class MesseEventAdmin(admin.ModelAdmin):
    list_display = ["name", "start_date", "end_date"]

@admin.register(Speise)
class SpeiseAdmin(admin.ModelAdmin):
    list_display =  ["name", "zutaten", "preis"]
