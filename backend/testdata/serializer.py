from rest_framework import serializers
from testdata.models import (
    Speise, OrderItem, MesseEvent,
    Station, Category, ProductAttribute, Product,
    OrderEvent, Order, OrderItem2, PaymentOption, Payment,
    StorageItem, StorageLocation, Ingredient, SpeiseIngredient,
    SpeiseLager
)

import logging
logging.basicConfig(level=logging.DEBUG)

class SpeiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speise
        fields = ['id', 'name', 'zutaten', 'preis', 'erstellt', 'updated']

# Ingredient Serializer
class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'quantity', 'unit', 'last_updated']

# SpeiseIngredient Serializer
class SpeiseIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(required=False, allow_null=True)
    
    class Meta:
        model = SpeiseIngredient
        fields = ['ingredient', 'portion']

# Updated Speise Serializer to include Ingredients
class SpeiseLagerSerializer(serializers.ModelSerializer):
    zutaten = SpeiseIngredientSerializer(many=True)  # Include ingredients with their portions
    
    class Meta:
        model = SpeiseLager
        fields = ['id', 'name', 'zutaten', 'preis', 'erstellt', 'updated']

    # Overriding update method to include ingredient availability update
    def update_ingredient_availability(self, speise, order_quantity):
        speise.update_ingredient_availability(order_quantity)

class OrderItemSerializer(serializers.ModelSerializer):
    Products = SpeiseLagerSerializer(read_only=True, many=True)

    class Meta:
        model = OrderItem
        fields = "__all__"

class MesseEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MesseEvent
        fields = "__all__"


# Serializers for file upload
# Serializer for Station
class StationSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    class Meta:
        model = Station
        fields = '__all__'

# Serializer for Category
class CategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    class Meta:
        model = Category
        fields = '__all__'

# Serializer for ProductAttribute
class ProductAttributeSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    class Meta:
        model = ProductAttribute
        fields = '__all__'

# Serializer for Product
class ProductSerializer(serializers.ModelSerializer):
    station = StationSerializer()
    category = CategorySerializer()
    attribute = ProductAttributeSerializer(many=True, required=False)
    id = serializers.CharField()

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        station_data = validated_data.pop('station')
        category_data = validated_data.pop('category')
        attributes_data = validated_data.pop('attribute', [])

        station, _ = Station.objects.get_or_create(**station_data)
        category, _ = Category.objects.get_or_create(**category_data)

        product, _ = Product.objects.update_or_create(**validated_data, station=station, category=category)

        for attr_data in attributes_data:
            attribute1, _ = ProductAttribute.objects.get_or_create(**attr_data)
            product.attribute.add(attribute1)

        return product

# Serializer for OrderEvent
class OrderEventSerializer(serializers.ModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = OrderEvent
        fields = '__all__'

# Serializer for Order
class OrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    events = OrderEventSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        import pprint
        pprint.pprint(validated_data.get("events"))
        events_data = validated_data.pop('events', [])
        order, _ = Order.objects.update_or_create(**validated_data)

        for event_data in events_data:
            event, _ = OrderEvent.objects.get_or_create(**event_data)
            order.events.add(event)

        return order

# Serializer for OrderItem
class OrderItem2Serializer(serializers.ModelSerializer):
    id = serializers.CharField()
    events = OrderEventSerializer(many=True, required=False)

    class Meta:
        model = OrderItem2
        fields = '__all__'

    def create(self, validated_data):
        events_data = validated_data.pop('events', [])
        order_item, _ = OrderItem2.objects.update_or_create(**validated_data)

        for event_data in events_data:
            event, _ = OrderEvent.objects.get_or_create(**event_data)
            order_item.events.add(event)

        return order_item

# Serializer for PaymentOption
class PaymentOptionSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    class Meta:
        model = PaymentOption
        fields = '__all__'

# Serializer for Payment
class PaymentSerializer(serializers.ModelSerializer):
    payment_option = PaymentOptionSerializer()
    id = serializers.CharField()

    class Meta:
        model = Payment
        fields = '__all__'

    def create(self, validated_data):
        payment_option_data = validated_data.pop('payment_option')
        payment_option, _ = PaymentOption.objects.get_or_create(**payment_option_data)

        payment, _ = Payment.objects.update_or_create(**validated_data, payment_option=payment_option)
        return payment
    
class StorageItemSerializer(serializers.ModelSerializer):
    product = SpeiseLagerSerializer()  # Include details about the product
    location = serializers.CharField(source='location.name')  # Display the storage location name

    class Meta:
        model = StorageItem
        fields = ['product', 'location', 'quantity', 'unit']

