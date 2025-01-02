from .settings import *  # Import all settings from the default settings.py

# Override settings for testing purposes

# Use PostgreSQL for testing with the values provided by GitHub Actions
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'testdb',  # This matches the database name in the PostgreSQL service
        'USER': 'postgres',  # Default PostgreSQL user
        'PASSWORD': 'postgres',  # Default password set in GitHub Actions workflow
        'HOST': 'localhost',  # PostgreSQL is running inside the GitHub Actions Docker container
        'PORT': '5432',  # Default PostgreSQL port
    }
}

# Security settings
SECRET_KEY = 'testsecretkey'  # Make sure you set this securely in production
DEBUG = True

# Disable email sending for tests
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Disable CSRF checks in tests (optional)
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# Other testing-specific configurations
# Set up the test database to be separate from your main database
DATABASES['default']['NAME'] = 'testdb'

# Disable migrations for faster testing (optional)
"""
MIGRATION_MODULES = {
    'auth': None,
    'contenttypes': None,
    'sessions': None,
    'admin': None,
    'auth': None,
    'messages': None,
    'staticfiles': None,
}
"""
