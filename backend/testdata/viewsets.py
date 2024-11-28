from rest_framework import viewsets
from testdata.models import Speise, OrderItem, MesseEvent
from testdata.serializer import SpeiseSerializer, OrderItemSerializer, MesseEventSerializer
from datetime import date

# Same as Controllers
# This set of views corresponds to the predefined actions of CRUD type
class SpeiseViewSet(viewsets.ModelViewSet):
    serializer_class = SpeiseSerializer

    def get_queryset(self):
        return Speise.objects.all()

class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date is not None and end_date is not None:
            queryset = OrderItem.objects.filter(timestamp__date__gte=start_date, timestamp__date__lte=end_date)
        else:
            queryset = OrderItem.objects.all()
        
        return queryset

class MesseEventViewSet(viewsets.ModelViewSet):
    serializer_class = MesseEventSerializer

    def get_queryset(self):
        return MesseEvent.objects.all()
