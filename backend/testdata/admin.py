from django.contrib import admin
from .models import (MesseEvent, Recipe, RecipeIngredient, Speise, Order, OrderEvent, Ingredient,
                     Payment, PaymentOption, PortionUnit)

from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin as DefaultGroupAdmin
from django import forms

# Register your models here.

admin.site.site_title = 'Supotsu no Ochaya'
admin.site.site_header = "Supotsu no Ochaya Admin Panel"
admin.site.index_title = "Welcome to the Admin Dashboard"

@admin.register(MesseEvent)
class MesseEventAdmin(admin.ModelAdmin):
    list_display = ["name", "start_date", "end_date"]

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    search_fields = ['name_ing']  # Enable search functionality in the dropdown

@admin.register(PortionUnit)
class PortionUnitAdmin(admin.ModelAdmin):
    search_fields = ['name_unit']  # Enable search functionality

class RecipeIngredientInline(admin.TabularInline):  # or admin.StackedInline for a vertical layout
    model = RecipeIngredient
    extra = 1  # Number of empty ingredient fields shown by default
    autocomplete_fields = ['ingredient', 'unit']  # Enables autocomplete for FK fields

class RecipeAdmin(admin.ModelAdmin):
    list_display = ['name_recipe', 'valid_from', 'valid_until', 'created', 'last_updated']
    search_fields = ['name_recipe']
    list_filter = ['valid_from', 'valid_until']
    inlines = [RecipeIngredientInline]  # Embedding the RecipeIngredient model inside Recipe

admin.site.register(Recipe, RecipeAdmin)

@admin.register(Speise)
class SpeiseAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "ordered_stock"]

# @admin.register(Order)
# class OrderAdmin(admin.ModelAdmin):
#     list_display = ["id", "table", "waiter", "status", "created", "updated"]
#     search_fields = ('id', 'waiter', 'status')

# @admin.register(OrderEvent)
# class OrderEventAdmin(admin.ModelAdmin):
#     list_display = ["id", "type", "content", "created", "updated"]

# @admin.register(PaymentOption)
# class PaymentOptionAdmin(admin.ModelAdmin):
#     list_display = ('name', 'details', 'created', 'updated')
#     search_fields = ('name', 'details')

# @admin.register(Payment)
# class PaymentAdmin(admin.ModelAdmin):
#     list_display = ('id', 'order', 'payment_option', 'total_amount', 'tip_amount', 'discount_percent', 'created', 'updated')
#     search_fields = ('order__id', 'payment_option__name')   


# Custom form to exclude permissions
class GroupAdminForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = ['name']  # Only include the name field, exclude permissions


# Custom GroupAdmin
class CustomGroupAdmin(DefaultGroupAdmin):
    form = GroupAdminForm

    fieldsets = (
        (None, {
            'fields': ('name',),
            'description': (
                "Only provide a **Name** for the group. Rights management has to be done separately in the backend, so no further configuration is needed here."
            ),
        }),
    )


# Unregister the default Group admin
admin.site.unregister(Group)

# Register the customized Group admin
admin.site.register(Group, CustomGroupAdmin)
