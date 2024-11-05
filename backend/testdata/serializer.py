from rest_framework import serializers
from testdata.models import Speise


class SpeiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speise
        fields = ['id', 'name', 'zutaten', 'menge', 'preis', 'rabatt',
                  'r_preis', 'erstellt', 'updated']
