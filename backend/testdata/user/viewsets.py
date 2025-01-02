from testdata.user.serializers import GroupsSerializer, UserSerializer
from django.contrib.auth import get_user_model, models
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from pprint import pprint

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    # permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return User.objects.all()
    
class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupsSerializer

    def get_queryset(self):
        return models.Group.objects.all()