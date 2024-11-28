from django.test import TestCase
from testdata.serializer import SpeiseSerializer
from testdata.models import Speise

class SpeiseSerializerTest(TestCase):
    def test_serialization(self):
        speise = Speise(name="Pizza", zutaten="Cheese, Tomato", preis=10.5)
        serializer = SpeiseSerializer(speise)
        self.assertEqual(serializer.data['name'], "Pizza")
