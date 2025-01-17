from rest_framework import serializers
from django.contrib.auth import get_user_model, models

User = get_user_model()


class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Group
        fields = ("id", "name")

class UserSerializer(serializers.ModelSerializer):
    groups = GroupsSerializer(many=True)
    
    new_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User
        # Tuple of serialized model fields (see link [2])
        fields = ( "id", "username", "new_password", "groups", "is_superuser", "is_staff" )
        extra_kwargs = {
            'url': {'lookup_field': 'id'}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password = validated_data.pop('new_password', 'password'), 
        )
        return user
    
    def update(self, instance, validated_data):
        # Pop off new_password if present
        new_password = validated_data.pop('new_password', None)

        # If there's a new password, set it using the built-in set_password()
        if new_password:
            instance.set_password(new_password)

        # Proceed with the default update for other fields (email, etc.)
        return super().update(instance, validated_data)
    
    def get_object(self):
        return self.request.user