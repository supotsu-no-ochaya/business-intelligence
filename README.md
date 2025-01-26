# Business-Intelligence
Webapplication giving insights in business intelligence.\
Backend: Django\
Frontend: React\
Database: Postgresql

## Docker
### Run Production local:
1. Create a .env_prod file in the root directory containing:
POSTGRES_USER=postgres\
POSTGRES_PASSWORD=your-db-password\
POSTGRES_DB=testdb\
DJANGO_SECRET_KEY=secret-key\
DEBUG=False\
DJANGO_SUPERUSER_USERNAME=admin\
DJANGO_SUPERUSER_EMAIL=admin@email.com\
DJANGO_SUPERUSER_PASSWORD=superduper123

2. Create a secret key (django needs to be installed):
```console
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

3. Run docker compose:
```console
docker compose -f docker-compose-prod.local.yml --env-file .env_prod up --build
```

4. Navigation:
Django admin board -> localhost:80/admin\
Login Page -> localhost:80\
Fixtures are loaded before starting the server.

### Run development:
1. Create a .env file in root directory:
POSTGRES_DB=postgres\
POSTGRES_USER=postgres\
POSTGRES_PASSWORD=postgres\
DB_HOST=db\
DB_PORT=5432\
DJANGO_SECRET_KEY=your_secret_key_here\
DJANGO_DEBUG=True\
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0\
DJANGO_SUPERUSER_USERNAME=admin\
DJANGO_SUPERUSER_PASSWORD=superduper123\
DJANGO_SUPERUSER_EMAIL=admin@admin.com\
REACT_APP_BACKEND_URL=http://localhost:8000\
REACT_APP_ENV=development\
DJANGO_SUPERUSER_USERNAME=admin\
DJANGO_SUPERUSER_PASSWORD=admin\
DJANGO_SUPERUSER_EMAIL=admin@email.com

2. Run docker:
```console
docker compose -f docker-compose.yml --env-file .env up --build
```

3. Navigation:
Backend -> localhost:8000\
Backend Admin Dashboard -> localhost:8000/admin\
Frontend -> localhost:3000\
Fixtures are not loaded before starting the server.


### Run production on server:
Run Production:
```console
docker compose -f docker-compose-prod.yml --env-file .env_prod up --build
```
Fixtures are loaded before starting the server.

### Docker commands
1. Stop container:
```console
docker compose down -v
```

2. Stop all container:
```console
docker stop $(docker ps -a -q)
```

3. Remove all container:
```console
docker rm $(docker ps -a -q)
```

4. Remove all images:
```console
docker image ls -q | xargs -I {} docker image rm -f {}
```

5. Get a shell into running docker image:
```console
docker exec -it NAME bash
```

## Backend
For installation check out the README in /backend

## Frontend
For installation check out the README in frontend

## Upload files
JSON files inside upload-json/
