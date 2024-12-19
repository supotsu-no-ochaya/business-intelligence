FROM python:3.11.2-bullseye
ENV PIP_NO_CACHE_DIR=off
ENV PIP_DISABLE_PIP_VERSION_CHECK=on
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV COLUMNS=80
ENV DJANGO_SUPERUSER_PASSWORD=admin
ENV DJANGO_SUPERUSER_USERNAME=admin
ENV DJANGO_SUPERUSER_EMAIL=admin@mail.com
RUN apt-get update \
 && apt-get install -y --force-yes \
 vim netcat python3-pip gettext chrpath libssl-dev libxft-dev \
 libfreetype6 libfreetype6-dev  libfontconfig1 libfontconfig1-dev \
 #libpq-dev postgresql postgresql-contrib \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend/
COPY requirements.txt /app/backend/
RUN pip install -r /app/backend/requirements.txt
COPY . /app/backend/

# copy entrypoint.sh
COPY ./entrypoint.sh /app/backend/.
RUN sed -i 's/\r$//g' /app/backend/entrypoint.sh
RUN chmod +x /app/backend/entrypoint.sh

EXPOSE 8000

# run entrypoint.sh
ENTRYPOINT ["sh", "/app/backend/entrypoint.sh"]
#CMD [ "python", "manage.py", "createsuperuser", "--noinput", "--username","admin", "--email", "admin@mail.com"]
#CMD [ "python", "manage.py", "makemigrations" ]
#CMD [ "python", "manage.py", "migrate" ]
#CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
