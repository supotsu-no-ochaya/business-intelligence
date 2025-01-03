from testdata.user.serializers import GroupsSerializer, UserSerializer
from django.contrib.auth import get_user_model, models
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework_roles.granting import is_self

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    # permission_classes = (IsAdminUser,)
    view_permissions = {
        'create': {'admin': True},
        'list': {'admin': True}, 
        'retrieve,me': {'user': is_self},
        'update,partial_update': {'user': is_self, 'admin': True},
    }
    
    def get_queryset(self):
        return User.objects.all()
    
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        self.kwargs['pk'] = request.user.pk
        return self.retrieve(request)
    
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