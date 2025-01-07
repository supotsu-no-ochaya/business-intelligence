from pprint import pprint
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from testdata.user.serializers import GroupsSerializer, UserSerializer
from django.contrib.auth import get_user_model, models
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework_roles.granting import is_self

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # permission_classes = (IsAdminUser,)
    view_permissions = {
        'create': {'admin': True},
        'list': {'admin': True}, 
        'retrieve': {'user': is_self, 'admin': True},
        'me': {'user': True}, # authenticated users can get their own profile infos
        'update,partial_update': {'user': is_self, 'admin': True},
    }
    
    def get_queryset(self):
        return User.objects.all()

    @action(detail=False)
    def me(self, request, *args, **kwargs):
        print('-----------> request user:', request.user)
        # Fetch the authenticated user
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupsSerializer
    view_permissions = {
        'create': {'admin': True},
        'list': {'user': True}, # everyone logged in
        'retrieve': {'admin': True},
        'update,partial_update': {'admin': True},
    }

    def get_queryset(self):
        return models.Group.objects.all()