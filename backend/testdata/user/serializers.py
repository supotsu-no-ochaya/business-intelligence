from rest_framework import serializers
from django.contrib.auth import get_user_model, models

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )

        return user

    class Meta:
        model = User
        # Tuple of serialized model fields (see link [2])
        fields = ( "id", "username", "password", 'groups' )
        extra_kwargs = {
            'url': {'lookup_field': 'id'}
        }

class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = ("id", "name")