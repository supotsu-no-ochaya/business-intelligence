import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from rest_framework.permissions import BasePermission
from testdata.models import (
    OrderItem, Product, Order, OrderItem2, OrderEvent,
    Payment, SpeiseLager, Ingredient
)
from testdata.serializer import (
    ProductSerializer, OrderSerializer,
    OrderItem2Serializer, PaymentSerializer, 
    OrderEventSerializer, IngredientSerializer
)
from testdata.roles import DEFAULT_PERMISSIONS

# Create your views here.

def earnings(request):
    # Fetch the order item
    orders = OrderItem.objects.all()

    total_earnings = 0
    for order_item in orders:
        total_earnings += order_item.getTotalPrice()

    response = {"earnings":
                {"total": total_earnings}
                }

    #@Todo earnings by day?

    # Return JSON response
    return JsonResponse(response)



# File upload
class UploadJsonView(APIView):
    view_permissions = {'post': {'admin': True},}
    def post(self, request, *args, **kwargs):
        # Get the uploaded file from the request
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Parse the JSON file
        try:
            data = json.load(uploaded_file)
        except Exception as e:
            return Response({"error": f"Invalid JSON file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Process Products
        products = data.get('products', [])
        for product_data in products:
            serializer = ProductSerializer(data=product_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response({"error in products": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        # Process Orders and Order Items
        orders = data.get('orders', [])
        for order_data in orders:
            order_items_data = order_data.pop('order_items', [])
            events_data = order_data.get('events', [])
            order_serializer = OrderSerializer(data=order_data)
            if order_serializer.is_valid():
                order = order_serializer.save()

                # Handle Order Items
                for order_item_data in order_items_data:
                    events_data = order_item_data.pop('events', [])
                    order_item_serializer = OrderItem2Serializer(data={**order_item_data, 'order': order.id})
                    if order_item_serializer.is_valid():
                        order_item = order_item_serializer.save()

                        # Update ingredient availability for each ordered product
                        if getattr(order_item, 'Products', False): # fix for unavailable Products field
                            for product in order_item.Products:
                                for speise_ingredient in product.zutaten:
                                    ingredient = speise_ingredient.ingredient
                                    ingredient_quantity_used = speise_ingredient.portion * order_item_data['quantity']
                                    
                                    # Update ingredient availability
                                    ingredient.quantity -= ingredient_quantity_used
                                    ingredient.save()

                        # Handle Order Item Events
                        for event_data in events_data:
                            existing_event = OrderEvent.objects.filter(id=event_data.get("id")).first()
                            if existing_event:
                                event_serializer = OrderEventSerializer(existing_event, data=event_data)
                            else:
                                event_serializer = OrderEventSerializer(data=event_data)
                                
                            import pprint
                            pprint.pprint(event_serializer.initial_data)
                            if event_serializer.is_valid():
                                event_serializer.save()
                            else:
                                return Response({"event data error": event_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        print(f'Error occurs here')
                        return Response({"Order item error": order_item_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                print("Order Validation Errors: ", order_serializer.errors)
                return Response({"Order error": order_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Process Payments
        payments = data.get('payments', [])
        for payment_data in payments:
            serializer = PaymentSerializer(data=payment_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response({"Payments error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Data uploaded successfully"}, status=status.HTTP_201_CREATED)

class IsTreasurer(BasePermission):
    def has_permission(self, request, view):
        # Check if the user has the 'view_payment' permission
        return request.user.has_perm('testdata.view_payment')

class IncomeListView(APIView):
    permission_classes = [IsAuthenticated, IsTreasurer]

    def get(self, request, *args, **kwargs):
        # Filter payments by 'income' type
        income_payments = Payment.objects.all()

        # Calculate total income
        total_income = income_payments.aggregate(total=Sum('total_amount'))['total'] or 0

        # Group income by payment option 
        income_by_payment_option = income_payments.values('payment_option__name').annotate(
            total=Sum('total_amount')
        )

        # Return both total income and breakdown by payment method
        return Response({
            "total_income": total_income,
            "income_by_payment_option": income_by_payment_option
        })

class AvailableProductView(APIView):
    def get(self, request, *args, **kwargs):
        speisen = SpeiseLager.objects.all()  # Fetch all menu items
        available_data = []

        for speise in speisen:
            ingredient_data = []
            min_portions = None  # Placeholder to calculate available portions

            for speise_ingredient in speise.speiseingredient_set.all():
                ingredient = speise_ingredient.ingredient
                required_quantity = speise_ingredient.portion * speise.preis  # Assuming order quantity is linked to price for simplicity
                # Check the stock of the ingredient
                available_quantity = ingredient.quantity

                if min_portions is None or available_quantity // required_quantity < min_portions:
                    min_portions = available_quantity // required_quantity

                ingredient_data.append({
                    'name': ingredient.name,
                    'available_quantity': available_quantity,
                    'unit': ingredient.unit,
                    'required_quantity': required_quantity
                })

            available_data.append({
                'name': speise.name,
                'price': speise.preis,
                'available_portions': min_portions,
                'ingredients': ingredient_data
            })

        return Response(available_data)
    
class IngredientListView(APIView):
    def get(self, request):
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)