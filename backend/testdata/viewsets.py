from rest_framework import viewsets
from testdata.models import Speise
from testdata.serializer import SpeiseSerializer

# Same as Controllers
# This set of views corresponds to the predefined actions of CRUD type
class SpeiseViewSet(viewsets.ModelViewSet):
    serializer_class = SpeiseSerializer

    def get_queryset(self):
        return Speise.objects.all()
