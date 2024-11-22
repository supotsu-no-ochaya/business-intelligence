from rest_framework import viewsets
from testdata.models import Speise, OrderItem, MesseEvent
from testdata.serializer import SpeiseSerializer, OrderItemSerializer, MesseEventSerializer

# Same as Controllers
# This set of views corresponds to the predefined actions of CRUD type
class SpeiseViewSet(viewsets.ModelViewSet):
    serializer_class = SpeiseSerializer

    def get_queryset(self):
        return Speise.objects.all()

class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        return OrderItem.objects.all()

class MesseEventViewSet(viewsets.ModelViewSet):
    serializer_class = MesseEventSerializer

    def get_queryset(self):
        return MesseEvent.objects.all()
