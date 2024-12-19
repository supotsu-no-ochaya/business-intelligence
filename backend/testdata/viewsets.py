from rest_framework import viewsets
from testdata.models import Order, OrderItem2, Product, Speise, OrderItem, MesseEvent
from testdata.serializer import OrderItem2Serializer, ProductSerializer, SpeiseSerializer, OrderItemSerializer, MesseEventSerializer, OrderSerializer
from datetime import date

# Same as Controllers
# This set of views corresponds to the predefined actions of CRUD type
class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

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
    
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.all()
    
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.all()
    
class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItem2Serializer

    def get_queryset(self):
        return OrderItem2.objects.all()