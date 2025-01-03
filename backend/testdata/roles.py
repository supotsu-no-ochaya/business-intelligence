from rest_framework_roles.roles import is_user, is_anon, is_admin


def is_kitchen_staff(request, view):
    return is_user(request, view) and request.user.groups.filter(name='kitchen').exists()

def is_waiter(request, view):
    return is_user(request, view) and request.user.groups.filter(name='waiter').exists()

def is_treasurer(request, view):
    return is_user(request, view) and request.user.groups.filter(name='treasurer').exists()


ROLES = {
    # Django out-of-the-box
    'admin': is_admin,
    'user': is_user,
    'anon': is_anon,

    # Some custom role examples
    'kitchen': is_kitchen_staff,
    'waiter': is_waiter,
    'tresurer': is_treasurer,
}

DEFAULT_PERMISSIONS = {
    'create': {'admin': True},
    'list': {'user': True}, 
    'retrieve': {'user': True},
    'update,partial_update': {'admin': True},
}