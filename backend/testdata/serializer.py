from rest_framework import serializers
from testdata.models import Speise, OrderItem, MesseEvent

class SpeiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speise
        fields = ['id', 'name', 'zutaten', 'preis', 'erstellt', 'updated']

class OrderItemSerializer(serializers.ModelSerializer):
    Products = SpeiseSerializer(read_only=True, many=True)

    class Meta:
        model = OrderItem
        fields = "__all__"

class MesseEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MesseEvent
        fields = "__all__"
