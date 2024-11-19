from rest_framework import routers
from testdata.viewsets import SpeiseViewSet, OrderItemViewSet


router = routers.SimpleRouter()
router.register(r'speise', SpeiseViewSet, basename='speise')
router.register(r'order', OrderItemViewSet, basename='order')
