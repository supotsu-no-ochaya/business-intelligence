import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from rest_framework.permissions import BasePermission
from rest_framework.permissions import AllowAny
from testdata.models import (
    OrderItem, Product, Order, OrderItem2, OrderEvent,
    Payment, Ingredient,Speise, RecipeIngredient, StorageItem
)
from testdata.serializer import (
    ProductSerializer, OrderSerializer,
    OrderItem2Serializer, PaymentSerializer, IngredientSerializer,
    OrderEventSerializer
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
    
def calculate_ingredient_usage():
    
    ingredient_usage = {}

    try:
        orders = OrderItem2.objects.all()
        for order_item in orders:

            try:
                bom_data = json.loads(order_item.bom) if isinstance(order_item.bom, str) else order_item.bom
            except json.JSONDecodeError:
                bom_data = [] 
            
            bom_details = bom_data.get('details',{})
            speise_items = bom_details.get('speise', [])

            for bom_item in speise_items:
                product_id = bom_item.get('product_id')
                quantity = bom_item.get('quantity', 0)

                if product_id is None:
                    continue

                try:
                    # Fetch the Product
                    product = Product.objects.get(id=product_id)

                    # Use the Product name to find the matching Speise
                    speise = Speise.objects.filter(name=product.name).first()

                    if not speise:
                        continue  # Skip if no matching Speise is found

                    # Fetch recipe ingredients for the Speise
                    recipe_ingredients = RecipeIngredient.objects.filter(recipe__speise=speise)

                    for recipe_ingredient in recipe_ingredients:
                        ingredient = recipe_ingredient.ingredient
                        total_quantity_used = recipe_ingredient.quantity_per_portion * quantity

                        # Accumulate ingredient usage
                        if ingredient.name_ing not in ingredient_usage:
                            ingredient_usage[ingredient.name_ing] = {
                                'unit': ingredient.unit.name_unit if ingredient.unit else None,
                                'quantity_used': total_quantity_used,
                            }
                        else:
                            ingredient_usage[ingredient.name_ing]['quantity_used'] += total_quantity_used

                except Product.DoesNotExist:
                    # Handle missing Product objects
                    continue

        # Return the accumulated data as a list of dictionaries
        return [
            {"ingredient_name": name, "unit": data["unit"], "quantity_used": data["quantity_used"]}
            for name, data in ingredient_usage.items()
        ]

    except Exception as e:
        return {"error": f"An error occurred while calculating ingredient usage: {str(e)}"}




# Helper Function to Calculate Total Available
def calculate_total_available(ingredient):
   
    # Get the total stock from StorageItem
    try:
        # Get the total stock from StorageItem
        total_stock = StorageItem.objects.filter(name_ingredient=ingredient).aggregate(
            total=Sum('total_stock')
        )['total'] or 0

        # Fetch usage data for this ingredient
        ingredient_usage = 0
        usage_data = calculate_ingredient_usage()

        if isinstance(usage_data, dict) and "error" in usage_data:
            return {"error": usage_data["error"]}

        for usage in usage_data:
            if usage["ingredient_name"] == ingredient.name_ing:
                ingredient_usage = usage["quantity_used"]
                break

        # Calculate total available stock
        total_available = total_stock - ingredient_usage
        return max(total_available, 0)  # Ensure non-negative values
    except Exception as e:
        return {"error": f"An error occurred while calculating total availability: {str(e)}"}



# Ingredient Usage View
class IngredientUsageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        usage_data = calculate_ingredient_usage()

        if isinstance(usage_data, dict) and "error" in usage_data:
            return Response({"error": usage_data["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"ingredient_usage": usage_data}, status=status.HTTP_200_OK)


# Ingredient Availability View
class IngredientAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            ingredients = Ingredient.objects.all()
            ingredient_availability = []

            for ingredient in ingredients:
                # Calculate total available stock dynamically
                total_available = calculate_total_available(ingredient)

                if isinstance(total_available, dict) and "error" in total_available:
                    return Response({"error": total_available["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                ingredient_availability.append({
                    'ingredient_name': ingredient.name_ing,
                    'total_stock': StorageItem.objects.filter(name_ingredient=ingredient).aggregate(
                        total=Sum('total_stock')
                    )['total'] or 0,
                    'ingredient_usage': total_available,
                    'unit': ingredient.unit.name_unit if ingredient.unit else None,
                    'total_available': total_available,
                })

            return Response({'ingredients': ingredient_availability}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Available Product View
class AvailableProductView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            speisen = Speise.objects.all()
            available_products = []

            for speise in speisen:
                ingredient_data = []
                min_portions = None

                # Fetch recipe ingredients for the product
                recipe_ingredients = RecipeIngredient.objects.filter(recipe__speise=speise)

                for recipe_ingredient in recipe_ingredients:
                    ingredient = recipe_ingredient.ingredient
                    required_quantity = recipe_ingredient.quantity_per_portion

                    # Calculate total available dynamically
                    total_available = calculate_total_available(ingredient)

                    if isinstance(total_available, dict) and "error" in total_available:
                        return Response({"error": total_available["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    # Calculate max portions based on ingredient availability
                    max_portions = total_available // required_quantity if required_quantity > 0 else 0

                    if min_portions is None or max_portions < min_portions:
                        min_portions = max_portions

                    ingredient_data.append({
                        'ingredient_name': ingredient.name_ing,
                        'required_quantity_per_portion': required_quantity,
                        'total_available': total_available,
                        'max_portions_from_this_ingredient': max_portions,
                    })

                available_products.append({
                    'product_name': speise.name,
                    'price': speise.price,
                    'available_portions': min_portions,
                    'ingredients': ingredient_data,
                })

            return Response({'available_products': available_products}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
class IngredientListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            ingredients = Ingredient.objects.all()
            if not ingredients:
                return Response({"detail": "No ingredients found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = IngredientSerializer(ingredients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        try:
            serializer = IngredientSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT method: Update an existing ingredient
    def put(self, request, *args, **kwargs):
        try:
            ingredient_id = kwargs.get('id')  # Fetch the ingredient ID from URL parameters
            ingredient = Ingredient.objects.get(id=ingredient_id)
            serializer = IngredientSerializer(ingredient, data=request.data, partial=True)  # Allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Ingredient.DoesNotExist:
            return Response({"detail": "Ingredient not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE method: Delete an existing ingredient
    def delete(self, request, *args, **kwargs):
        try:
            ingredient_id = kwargs.get('id')  # Fetch the ingredient ID from URL parameters
            ingredient = Ingredient.objects.get(id=ingredient_id)
            ingredient.delete()
            return Response({"detail": "Ingredient deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Ingredient.DoesNotExist:
            return Response({"detail": "Ingredient not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

