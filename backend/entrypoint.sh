#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

#python manage.py flush --no-input
python manage.py makemigrations
python manage.py migrate
python3 manage.py loaddata testdata/fixtures/*.json
#python manage.py createcachetable

echo "Creating Superuser"
echo "${DJANGO_SUPERUSER_USERNAME}"
echo "${DJANGO_SUPERUSER_PASSWORD}"
if [ "$DJANGO_SUPERUSER_USERNAME" ]
then
    python manage.py createsuperuser \
        --noinput \
        --username $DJANGO_SUPERUSER_USERNAME \
        --email $DJANGO_SUPERUSER_EMAIL
fi


python manage.py runserver 0.0.0.0:8000
exec "$@"

