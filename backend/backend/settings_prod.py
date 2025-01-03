# settings_prod.py

from .settings import *

# Override any production-specific settings here

# Example database settings for production (from environment variables or a .env file)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'your_database_name'),
        'USER': os.getenv('DB_USER', 'your_database_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'your_database_password'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Allow only production domain
ALLOWED_HOSTS = ['*']

# Set the security key (ensure this is securely generated in production)
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'your-production-secret-key')

# Set DEBUG to False for production
DEBUG = False

# Other production settings like static files, logging, etc. can be configured here
STATIC_URL = '/static/'
