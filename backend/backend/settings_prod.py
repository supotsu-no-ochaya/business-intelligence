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

# Allow only production domain
ALLOWED_HOSTS = ['*']

# Set the security key (ensure this is securely generated in production)
SECRET_KEY = config('DJANGO_SECRET_KEY', 'your-production-secret-key')

CORS_ALLOWED_ORIGINS = [
    'http://localhost:80'
]

# Set DEBUG to False for production
DEBUG = False

# Other production settings like static files, logging, etc. can be configured here
STATIC_URL = '/django-static/'
# Directory where static files will be collected
STATIC_ROOT = '/app/staticfiles/'
