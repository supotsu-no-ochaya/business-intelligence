# settings_prod.py

from .settings import *
from decouple import config

# Override any production-specific settings here

# Example database settings for production (from environment variables or a .env file)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('POSTGRES_DB', 'your_database_name'),
        'USER': config('POSTGRES_USER', 'your_database_user'),
        'PASSWORD': config('POSTGRES_PASSWORD', 'your_database_password'),
        'HOST': config('DB_HOST', 'db'),
        'PORT': config('DB_PORT', '5432'),
    }
}

# Allow only production domain (need to be different not *)
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '141.45.146.228']

# Set the security key (ensure this is securely generated in production)
SECRET_KEY = config('DJANGO_SECRET_KEY', 'your-production-secret-key')

CORS_ALLOWED_ORIGINS = [
    'https://localhost', 'https://141.45.146.228',
    'http://localhost', 'http://141.45.146.228',
    'http://141.45.146.228:80', 'https://141.45.146.228:80',
    'http://141.45.146.228:8000', 'https://141.45.146.228:8000',
    'http://localhost:8000', 'https://localhost:8000',
]

# Change this to not *
CSRF_TRUSTED_ORIGINS = [
    'http://localhost', 'http://127.0.0.1', 'http://141.45.146.228',
    'https://localhost', 'https://127.0.0.1', 'https://141.45.146.228',
    'http://141.45.146.228:8000', 'https://141.45.146.228:8000',
    'http://localhost:8000', 'https://localhost:8000',
]

# Set DEBUG to False for production
DEBUG = False

# Other production settings like static files, logging, etc. can be configured here
#STATIC_URL = '/django-static/'
# Directory where static files will be collected
#STATIC_ROOT = '/app/staticfiles/'

# The URL to use when referring to static files (where they will be served from)
STATIC_URL = '/static/'
#STATIC_ROOT = os.path.join(BASE_DIR,'staticfiles')
STATIC_ROOT = '/app/staticfiles/'
print(f'Settings_prod.py STATIC_ROOT: {STATIC_ROOT}')

