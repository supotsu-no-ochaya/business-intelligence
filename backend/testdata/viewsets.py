from rest_framework import viewsets
from testdata.models import (CompanyExpense, Order, OrderItem2, Product, Speise, 
                             OrderItem, MesseEvent, Recipe, Ingredient)
from testdata.serializer import (OrderItem2Serializer, ProductSerializer, SpeiseSerializer, 
                                 OrderItemSerializer, MesseEventSerializer, OrderSerializer,
                                 IngredientUsageSerializer, CompanyExpenseSerializer)
from datetime import date
from testdata.roles import DEFAULT_PERMISSIONS

# Same as Controllers
# This set of views corresponds to the predefined actions of CRUD type
class SpeiseViewSet(viewsets.ModelViewSet):
    serializer_class = SpeiseSerializer    
    view_permissions = DEFAULT_PERMISSIONS

    def get_queryset(self):
        return Speise.objects.all()

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientUsageSerializer
    view_permissions = DEFAULT_PERMISSIONS

class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    view_permissions = DEFAULT_PERMISSIONS

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
    view_permissions = DEFAULT_PERMISSIONS

    def get_queryset(self):
        print('------> Anonymous: {0}'.format(self.request.user.is_anonymous))
        return MesseEvent.objects.all()
    
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    view_permissions = DEFAULT_PERMISSIONS

    def get_queryset(self):
        return Order.objects.all()
    
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    view_permissions = DEFAULT_PERMISSIONS

    def get_queryset(self):
        return Product.objects.all()
    
class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItem2Serializer
    view_permissions = DEFAULT_PERMISSIONS

    def get_queryset(self):
        return OrderItem2.objects.all()
    

class CompanyExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyExpenseSerializer
    view_permissions = DEFAULT_PERMISSIONS

    def get_queryset(self):
        return CompanyExpense.objects.all().order_by('-date')