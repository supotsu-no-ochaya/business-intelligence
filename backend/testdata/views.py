from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import OrderItem

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