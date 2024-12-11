from rest_framework import routers
from testdata.viewsets import OrderItemViewSet, ProductViewSet, SpeiseViewSet, OrderViewSet, MesseEventViewSet


router = routers.SimpleRouter()
router.register(r'speise', SpeiseViewSet, basename='speise')
router.register(r'order', OrderViewSet, basename='order')
router.register(r'messeevent', MesseEventViewSet, basename='messeevent')
router.register(r'product', ProductViewSet, basename='product')
router.register(r'orderitem', OrderItemViewSet, basename='orderitem')
