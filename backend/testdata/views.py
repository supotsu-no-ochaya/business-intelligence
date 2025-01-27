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
from datetime import datetime, timedelta
from testdata.models import (
    OrderItem, Product, Order, OrderItem2, OrderEvent,
    Payment, Ingredient,Speise, RecipeIngredient, StorageItem,
    StorageLocation, PriceCurrency, PortionUnit, Recipe, IngredientUsage,

)
from testdata.serializer import (
    ProductSerializer, OrderSerializer,
    OrderItem2Serializer, PaymentSerializer, IngredientSerializer,
    OrderEventSerializer, StorageItemSerializer, PortionUnitSerializer,
    PriceCurrencySerializer, StorageLocationSerializer, RecipeSerializer,
    RecipeIngredientSerializer, IngredientUsageSerializer
)
from testdata.roles import DEFAULT_PERMISSIONS
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

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


def calculate_ingredient_usage(start_date=None, end_date=None):
    try:
        # Fetch orders that are in 'processed' state (ready to calculate ingredient usage)
        orders = OrderItem2.objects.filter(order__status="process")

        # Apply date filtering if provided
        if start_date and end_date:
            orders = orders.filter(order__created__range=[start_date, end_date])

        for order_item in orders:
            print(f"Processing Order: {order_item.id}")

            # Ensure bom_data is parsed correctly
            try:
                bom_data = json.loads(order_item.bom) if isinstance(order_item.bom, str) else order_item.bom
            except json.JSONDecodeError as e:
                print(f"Error parsing bom data for order_item {order_item.id}: {str(e)}")
                bom_data = {}

            bom_details = bom_data.get('details', {})
            speise_items = bom_details.get('products', [])

            for bom_item in speise_items:
                product_id = bom_item.get('product_id')
                quantity = bom_item.get('quantity', 0)

                if not product_id:
                    continue  # Skip if product_id is missing

                try:
                    product = Product.objects.get(id=product_id)
                    speise = Speise.objects.filter(name=product.name).first()

                    if not speise:
                        continue  # Skip if no corresponding speise found

                    recipe_ingredients = RecipeIngredient.objects.filter(recipe__speise=speise)

                    for recipe_ingredient in recipe_ingredients:
                        ingredient = recipe_ingredient.ingredient
                        total_quantity_used = recipe_ingredient.quantity_per_portion * quantity

                        # Update or create ingredient usage entry
                        IngredientUsage.objects.update_or_create(
                            ingredient=ingredient,
                            order=order_item,
                            defaults={
                                'quantity_used': total_quantity_used,
                                'unit': ingredient.unit.name_unit if ingredient.unit else None,
                            }
                        )

                except Product.DoesNotExist:
                    print(f"Product with ID {product_id} does not exist for order_item {order_item.id}")
                    continue

            # Update order status to "need_deducting"
            order_item.status = "need_deducting"
            order_item.save()

        return {"message": "Ingredient usage saved successfully."}

    except Exception as e:
        return {"error": f"An error occurred while calculating and saving ingredient usage: {str(e)}"}

# Ingredient Usage View
class IngredientUsageView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'start_date', 
                openapi.IN_QUERY, 
                description='Start date for filtering (YYYY-MM-DD)', 
                type=openapi.TYPE_STRING, 
                required=False
            ),
            openapi.Parameter(
                'end_date', 
                openapi.IN_QUERY, 
                description='End date for filtering (YYYY-MM-DD)', 
                type=openapi.TYPE_STRING, 
                required=False
            ),
        ],
        responses={200: "Success", 400: "Bad Request", 500: "Server Error"}
    )
    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Validate date format (if provided)
        try:
            if start_date:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
            if end_date:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # If the start_date and end_date are the same, set end_date to the end of the day
        if start_date and end_date and start_date == end_date:
            end_date = end_date + timedelta(days=1) - timedelta(seconds=1)

        # Calculate ingredient usage (optional step)
        result = calculate_ingredient_usage(start_date=start_date, end_date=end_date)

        if "error" in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Fetch all ingredient usage records
        ingredient_usages = IngredientUsage.objects.all()

        # Filter IngredientUsage records by date range if dates are provided
        if start_date and end_date:
            ingredient_usages = ingredient_usages.filter(order__order__created__range=(start_date, end_date))

        # Aggregate the ingredient usage by ingredient and sum the quantities
        aggregated_result =  ingredient_usages.values(
            'ingredient__name_ing', 
            'ingredient__unit__name_unit'
        ).annotate(total_usage=Sum('quantity_used'))

        # Serialize and return the aggregated data
        return Response({
            "message": result["message"],
            "data": aggregated_result
        }, status=status.HTTP_200_OK)

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
    @swagger_auto_schema(request_body=IngredientSerializer)
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

def update_storage_item_stock(ingredient_usage_data, is_new_order=True):
    try:
        today = now().date()

        # Get orders that require stock deduction
        orders_to_deduct = OrderItem2.objects.filter(status="need_deducting")

        if not orders_to_deduct.exists():
            return {"message": "No orders require stock deduction."}

        # Get all related ingredient usage records
        ingredient_usages = IngredientUsage.objects.filter(order__in=orders_to_deduct)

        if not ingredient_usages.exists():
            return {"message": "No ingredient usage records found for deduction."}

        for usage in ingredient_usages:
            ingredient = usage.ingredient
            total_quantity_used = usage.quantity_used

            # Find the corresponding storage item
            storage_item = StorageItem.objects.filter(name_ingredient=ingredient).first()

            if storage_item:
                print(f"Before Update: {storage_item.name_ingredient.name_ing} - {storage_item.total_stock}")

                # Deduct stock only if needed
                storage_item.total_stock -= total_quantity_used
                storage_item.last_updated = now()
                storage_item.save()

                print(f"After Update: {storage_item.name_ingredient.name_ing} - {storage_item.total_stock}")

        # Update order status to 'completed' after deduction
        orders_to_deduct.update(status="completed")

        return {"message": "Stock updated successfully for deducted orders."}

    except Exception as e:
        return {"error": f"An error occurred while updating the stock: {str(e)}"}
class StorageItemListView(APIView):
    permission_classes = [IsAuthenticated]

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
    # PUT method: Update an existing item
    @swagger_auto_schema(request_body=StorageItemSerializer)
    def put(self, request, *args, **kwargs):
        item_id = kwargs.get('id')  # Extract the ingredient ID from URL parameters
        ingredient_id = kwargs.get('id')  # Extract the ingredient ID from URL parameters
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

    @swagger_auto_schema(
        responses={200: "Stock updated successfully", 500: "Server Error"}
    )
    def patch(self, request, *args, **kwargs):
        try:
            # Call the update_storage_item_stock function to update the stock based on ingredient usage
            result = update_storage_item_stock(ingredient_usage_data=None, is_new_order=False)

            return Response({
                "message": result.get("message", "Stock updated successfully."),
                "ingredient_usage": result
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"An error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
