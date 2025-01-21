# Business-Intelligence
HTW

## Docker
To build the application run:
```console
foo@bar:~$ docker compose build
```

To run the application run:
```console
foo@bar:~$ docker compose up
```

To build and run the application with .env file:
```console
foo@bar:~$ docker compose -f docker-compose.yml --env-file .env up --build
```

Backend on localhost:8000

Frontend on localhost:3000

Docker commands:
Immer schoen runterfahren nicht Ctrl C...
```console
foo@bar:~$ docker compose down -v
```

Run Production:
```console
foo@bar:~$ docker compose -f docker-compose-prod.yml --env-file .env_prod up --build
```

Run Production local:
```console
foo@bar:~$ docker compose -f docker-compose-prod.local.yml --env-file .env_prod up --build
```

localhost:80/admin -> Admin Dashboard

