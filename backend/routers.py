from rest_framework import routers
from testdata.viewsets import SpeiseViewSet


router = routers.SimpleRouter()
router.register(r'speise', SpeiseViewSet, basename='speise')
