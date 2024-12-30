from rest_framework import serializers
from django.contrib.auth import get_user_model, models
from django.contrib.auth.hashers import make_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User
        # Tuple of serialized model fields (see link [2])
        fields = ( "id", "username", "new_password", "groups", )
        extra_kwargs = {
            'url': {'lookup_field': 'id'}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user
    
    def update(self, instance, validated_data):
        # Pop off new_password if present
        new_password = validated_data.pop('new_password', None)

        # If there's a new password, set it using the built-in set_password()
        if new_password:
            instance.set_password(make_password(new_password))

        # Proceed with the default update for other fields (email, etc.)
        return super().update(instance, validated_data)



class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = ("id", "name")