from django.test import TestCase
from testdata.serializer import SpeiseSerializer
from testdata.models import Speise

class SpeiseSerializerTest(TestCase):
    def test_serialization(self):
        speise = Speise(name="Nutella Crepes", price=2.5)
        serializer = SpeiseSerializer(speise)
        self.assertEqual(serializer.data['name'], "Nutella Crepes")
