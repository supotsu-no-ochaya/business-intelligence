import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import (
    OrderItem, Product, Order, OrderItem2,
    Payment
)
from .serializer import (
    ProductSerializer, OrderSerializer,
    OrderItem2Serializer, PaymentSerializer
)

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
            events_data = order_data.pop('events', [])
            order_serializer = OrderSerializer(data=order_data)
            if order_serializer.is_valid():
                order = order_serializer.save()

                # Handle Order Items
                for order_item_data in order_items_data:
                    events_data = order_item_data.pop('events', [])
                    order_item_serializer = OrderItem2Serializer(data={**order_item_data, 'order': order.id})
                    if order_item_serializer.is_valid():
                        order_item = order_item_serializer.save()

                        # Handle Order Item Events
                        for event_data in events_data:
                            event_serializer = OrderSerializer(data=event_data)
                            if event_serializer.is_valid():
                                event_serializer.save()
                            else:
                                return Response({"error": event_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        print(f'Error occurs here')
                        return Response({"error": order_item_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                print("Order Validation Errors: ", order_serializer.errors)
                return Response({"error": order_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Process Payments
        payments = data.get('payments', [])
        for payment_data in payments:
            serializer = PaymentSerializer(data=payment_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Data uploaded successfully"}, status=status.HTTP_201_CREATED)

