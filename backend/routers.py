from rest_framework import routers
from testdata.viewsets import SpeiseViewSet, OrderItemViewSet, MesseEventViewSet


router = routers.SimpleRouter()
router.register(r'speise', SpeiseViewSet, basename='speise')
router.register(r'order', OrderItemViewSet, basename='order')
router.register(r'messeevent', MesseEventViewSet, basename='messeevent')
