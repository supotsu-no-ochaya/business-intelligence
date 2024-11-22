from rest_framework import serializers
from testdata.models import Speise, OrderItem

class SpeiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speise
        fields = ['id', 'name', 'zutaten', 'preis', 'erstellt', 'updated']

class OrderItemSerializer(serializers.ModelSerializer):
    Products = SpeiseSerializer(read_only=True, many=True)

    class Meta:
        model = OrderItem
        fields = "__all__"
