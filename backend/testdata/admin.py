from django.contrib import admin
from .models import (MesseEvent, Speise, Order, OrderEvent, Ingredient,
                     Payment, PaymentOption)

# Register your models here.

@admin.register(MesseEvent)
class MesseEventAdmin(admin.ModelAdmin):
    list_display = ["name", "start_date", "end_date"]

@admin.register(Speise)
class SpeiseAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "ordered_stock"]  

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "table", "waiter", "status", "created", "updated"]
    search_fields = ('id', 'waiter', 'status')

@admin.register(OrderEvent)
class OrderEventAdmin(admin.ModelAdmin):
    list_display = ["id", "type", "content", "created", "updated"]

@admin.register(PaymentOption)
class PaymentOptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'details', 'created', 'updated')
    search_fields = ('name', 'details')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'payment_option', 'total_amount', 'tip_amount', 'discount_percent', 'created', 'updated')
    search_fields = ('order__id', 'payment_option__name')   
