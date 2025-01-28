import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils.timezone import now
from rest_framework.permissions import BasePermission
from datetime import datetime
from testdata.models import (
    OrderItem, Product, Order, OrderItem2, OrderEvent,
    Payment, Ingredient,Speise, RecipeIngredient, StorageItem,
    StorageLocation, PriceCurrency, PortionUnit, Recipe
)
from testdata.serializer import (
    ProductSerializer, OrderSerializer,
    OrderItem2Serializer, PaymentSerializer, IngredientSerializer,
    OrderEventSerializer, StorageItemSerializer, PortionUnitSerializer,
    PriceCurrencySerializer, StorageLocationSerializer, RecipeSerializer,
    RecipeIngredientSerializer
)
from testdata.roles import DEFAULT_PERMISSIONS
from drf_yasg.utils import swagger_auto_schema

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
        # Retrieve the latest unprocessed order
        latest_order = OrderItem2.objects.order_by('created').last()  # Adjust sorting if necessary

        if not latest_order:
            return {"error": "No orders found to process."}

        try:
            bom_data = json.loads(latest_order.bom) if isinstance(latest_order.bom, str) else latest_order.bom
        except json.JSONDecodeError:
            bom_data = {}

        bom_details = bom_data.get('details', {})
        speise_items = bom_details.get('products', [])

        for bom_item in speise_items:
            product_id = bom_item.get('product_id')
            quantity = bom_item.get('quantity', 0)

            if product_id is None:
                continue

            try:
                product = Product.objects.get(id=product_id)
                speise = Speise.objects.filter(name=product.name).first()

                if not speise:
                    continue

                recipe_ingredients = RecipeIngredient.objects.filter(recipe__speise=speise)

                for recipe_ingredient in recipe_ingredients:
                    ingredient = recipe_ingredient.ingredient
                    total_quantity_used = recipe_ingredient.quantity_per_portion * quantity

                    if ingredient.name_ing not in ingredient_usage:
                        ingredient_usage[ingredient.name_ing] = {
                            'unit': recipe_ingredient.unit.name_unit if recipe_ingredient.unit else None,
                            'quantity_used': total_quantity_used,
                        }
                    else:
                        ingredient_usage[ingredient.name_ing]['quantity_used'] += total_quantity_used

            except Product.DoesNotExist:
                continue

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
    permission_classes = [IsAuthenticated]

    #GET Method (show the total ingredient usage)
    def get(self, request, *args, **kwargs):
        usage_data = calculate_ingredient_usage()

        if isinstance(usage_data, dict) and "error" in usage_data:
            return Response({"error": usage_data["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"ingredient_usage": usage_data}, status=status.HTTP_200_OK)

# Ingredient Availability View
def calculate_total_available(ingredient, start_date=None, end_date=None):
    try:
        # Get the total stock from StorageItem
        total_stock = StorageItem.objects.filter(name_ingredient=ingredient).aggregate(
            total=Sum('total_stock')
        )['total'] or 0

        # Fetch usage data for this ingredient
        ingredient_usage = 0
        usage_data = calculate_ingredient_usage(start_date=start_date, end_date=end_date)

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


# Available Product View
class AvailableProductView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        # Validate date inputs
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

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

                    # Calculate total available dynamically with the date range
                    total_available = calculate_total_available(ingredient, start_date=start_date, end_date=end_date)

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
                    total_available = calculate_total_available(ingredient) #Current available stock

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

class PriceCurrencyView(APIView):
    permission_classes = [IsAuthenticated]

    # GET method: Retrieve all currencies
    def get(self, request):
        try:
            currencies = PriceCurrency.objects.all()
            if not currencies:
                return Response({"detail": "No currencies found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = PriceCurrencySerializer(currencies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # POST method: Create a new currency
    @swagger_auto_schema(request_body=PriceCurrencySerializer)
    def post(self, request):
        try:
            serializer = PriceCurrencySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT method: Update an existing currency
    @swagger_auto_schema(request_body=PriceCurrencySerializer)
    def put(self, request, *args, **kwargs):
        try:
            currency_id = kwargs.get('id')  # Fetch the ID from URL parameters
            currency = PriceCurrency.objects.get(id=currency_id)
            serializer = PriceCurrencySerializer(currency, data=request.data, partial=True)  # Allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PriceCurrency.DoesNotExist:
            return Response({"detail": "Currency not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE method: Delete a currency
    def delete(self, request, *args, **kwargs):
        try:
            currency_id = kwargs.get('id')  # Fetch the ID from URL parameters
            currency = PriceCurrency.objects.get(id=currency_id)
            currency.delete()
            return Response({"detail": "Currency deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except PriceCurrency.DoesNotExist:
            return Response({"detail": "Currency not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PortionUnitView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            units = PortionUnit.objects.all()
            if not units:
                return Response({"detail": "No portion units found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = PortionUnitSerializer(units, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(request_body=PortionUnitSerializer)
    def post(self, request):
        try:
            serializer = PortionUnitSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(request_body=PortionUnitSerializer)
    def put(self, request, *args, **kwargs):
        try:
            unit_id = kwargs.get('id')
            unit = PortionUnit.objects.get(id=unit_id)
            serializer = PortionUnitSerializer(unit, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PortionUnit.DoesNotExist:
            return Response({"detail": "Portion unit not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        try:
            unit_id = kwargs.get('id')
            unit = PortionUnit.objects.get(id=unit_id)
            unit.delete()
            return Response({"detail": "Portion unit deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except PortionUnit.DoesNotExist:
            return Response({"detail": "Portion unit not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IngredientListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            ingredients = Ingredient.objects.all()
            if not ingredients:
                return Response({"detail": "No ingredients found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = IngredientSerializer(ingredients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # PUT method: Update an existing ingredient
    @swagger_auto_schema(request_body=IngredientSerializer,)
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
    @swagger_auto_schema(request_body=IngredientSerializer,)
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
    
    @swagger_auto_schema()
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

class RecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            recipes = Recipe.objects.all()
            if not recipes:
                return Response({"detail": "No recipes found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = RecipeSerializer(recipes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(request_body=RecipeSerializer)
    def post(self, request):
        try:
            serializer = RecipeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(request_body=RecipeSerializer)
    def put(self, request, *args, **kwargs):
        try:
            recipe_id = kwargs.get('id')
            recipe = Recipe.objects.get(id=recipe_id)
            serializer = RecipeSerializer(recipe, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Recipe.DoesNotExist:
            return Response({"detail": "Recipe not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        try:
            recipe_id = kwargs.get('id')
            recipe = Recipe.objects.get(id=recipe_id)
            recipe.delete()
            return Response({"detail": "Recipe deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Recipe.DoesNotExist:
            return Response({"detail": "Recipe not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RecipeIngredientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            recipe_ingredients = RecipeIngredient.objects.all()
            if not recipe_ingredients:
                return Response({"detail": "No recipe ingredients found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = RecipeIngredientSerializer(recipe_ingredients, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(request_body=RecipeIngredientSerializer)
    def post(self, request):
        try:
            serializer = RecipeIngredientSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(request_body=RecipeIngredientSerializer)
    def put(self, request, *args, **kwargs):
        try:
            recipe_ingredient_id = kwargs.get('id')
            recipe_ingredient = RecipeIngredient.objects.get(id=recipe_ingredient_id)
            serializer = RecipeIngredientSerializer(recipe_ingredient, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RecipeIngredient.DoesNotExist:
            return Response({"detail": "Recipe ingredient not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        try:
            recipe_ingredient_id = kwargs.get('id')
            recipe_ingredient = RecipeIngredient.objects.get(id=recipe_ingredient_id)
            recipe_ingredient.delete()
            return Response({"detail": "Recipe ingredient deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except RecipeIngredient.DoesNotExist:
            return Response({"detail": "Recipe ingredient not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class StorageLocationListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            locations = StorageLocation.objects.all()
            if not locations:
                return Response({"detail": "No locations found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = StorageLocationSerializer(locations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # POST method: Update an existing location
    @swagger_auto_schema(request_body=StorageLocationSerializer)
    def post(self, request):
        try:
            serializer = StorageLocationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT method: Update an existing location
    @swagger_auto_schema(request_body=StorageLocationSerializer)
    def put(self, request, *args, **kwargs):
        try:
            location_id = kwargs.get('id')  # Fetch the ingredient ID from URL parameters
            location = StorageLocation.objects.get(id=location_id)
            serializer = StorageLocationSerializer(location, data=request.data, partial=True)  # Allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except StorageLocation.DoesNotExist:
            return Response({"detail": "Ingredient not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE method: Delete an existing location    
    @swagger_auto_schema()
    def delete(self, request, *args, **kwargs):
        try:
            location_id = kwargs.get('id')  # Fetch the ingredient ID from URL parameters
            location = StorageLocation.objects.get(id=location_id)
            location.delete()
            return Response({"detail": "location deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except StorageLocation.DoesNotExist:
            return Response({"detail": "location not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StorageItemListView(APIView):
    permission_classes = [IsAuthenticated]

    # GET method: Fetch all items or a specific item by ID
    def get(self, request):
        try:
            items = StorageItem.objects.all()
            if not items:
                return Response({"detail": "No items found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = StorageItemSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # POST method: Add a new item
    @swagger_auto_schema(request_body=StorageItemSerializer)
    def post(self, request, *args, **kwargs):
        try:
            serializer = StorageItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT method: Update an existing item
    @swagger_auto_schema(request_body=StorageItemSerializer)
    def put(self, request, *args, **kwargs):
        item_id = kwargs.get('id')  # Extract the ingredient ID from URL parameters
        try:
            item = StorageItem.objects.get(id=item_id)
            serializer = StorageItemSerializer(item, data=request.data, partial=True)  # Allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except StorageItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE method: Delete an existing item
    @swagger_auto_schema()
    def delete(self, request, *args, **kwargs):
        item_id = kwargs.get('id')  # Extract the ingredient ID from URL parameters
        try:
            item = StorageItem.objects.get(id=item_id)
            item.delete()
            return Response({"detail": "Item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except StorageItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
def update_storage_item_stock(ingredient_usage_data, is_new_order=True):
    update_data = []
        
    if not is_new_order:
        return update_data

    for ingredient_data in ingredient_usage_data:
        try:
            storage_item = StorageItem.objects.get(name_ingredient__name_ing=ingredient_data['ingredient_name'])

            new_stock = storage_item.total_stock - ingredient_data['quantity_used']
            if new_stock < 0:
                raise ValueError(f"Insufficient stock for ingredient: {ingredient_data['ingredient_name']}")
            
            storage_item.total_stock = new_stock
            storage_item.save()

            update_data.append({
                "stock_item_id": storage_item.id,
                "ingredient_name": storage_item.name_ingredient.name_ing,
                "new_total_stock": new_stock
            })

        except StorageItem.DoesNotExist:
            update_data.append({
                "ingredient_name": ingredient_data['ingredient_name'],
                "unit": ingredient_data['unit'],
                "error": f"Storage item not found for ingredient: {ingredient_data['ingredient_name']}"
            })
        except Exception as e:
            update_data.append({
                "ingredient_name": ingredient_data['ingredient_name'],
                "error": f"Error updating stock: {str(e)}"
            })

    return update_data

class UpdateStockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Calculate ingredient usage for the latest unprocessed order
            ingredient_usage_data = calculate_ingredient_usage()

            if isinstance(ingredient_usage_data, dict) and "error" in ingredient_usage_data:
                return Response({"error": ingredient_usage_data["error"]}, status=status.HTTP_400_BAD_REQUEST)

            # Update stock based on the ingredient usage
            updated_data = update_storage_item_stock(ingredient_usage_data, is_new_order=True)

            return Response({"ingredient_usage": updated_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
