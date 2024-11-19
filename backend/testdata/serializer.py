from rest_framework import serializers
from testdata.models import Speise
from testdata.models import OrderItem


class SpeiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speise
        fields = ['id', 'name', 'zutaten', 'preis', 'erstellt', 'updated']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'timestamp', 'Products']
