# Backend
Framwork: Django 5.1.2\
Database: PostgreSQL

## Installation
Erstelle ein Python Environment z.B. in deinem home/ Ordner.
```console
python3 -m venv backend
```

Aktiviere dein Environment
```console
source backend/bin/activate
```

Installiere die dependencies
```console
pip install -r path/to/requirements.txt
```

Postgresql unter Linux\
[PostgreSQL Link](https://www.postgresql.org/download/)
```console
sudo apt install libpq-dev postgresql postgresql-contrib
```

Login fuer eine interactive PostgreSQL session
```console
sudo -u postgres psql
```

Erstelle einen User der sich mit der DB verbinden und interagieren kann
```console
postgres=# CREATE USER userName WITH PASSWORD 'password';
```

Datenbank erstellen
```console
postgres=# CREATE DATABASE dbName OWNER userName;
```

Finde hba_file
```console
postgres=# SHOW hba_file;
```
und aendere:\
von:    local   all             all             peer\
zu:     local   all             all             md5\

Schliesse
```console
postgres=# \q
```

Starte postgresql neu:
```console
sudo systemctl restart postgresql
```

Login psql
```console
psql -U userName -W -d dbName
```

**Change or create** a .env file under /backend/backend/ die folgende Felder
enthalten:\
DB_ENGINE=django.db.backends.postgresql\
DB_NAME=dbName\
DB_USER=userName\
DB_PASSWORD=yourPassword\
DB_HOST=localhost\
DB_PORT=5432\

Curl command for file upload
```console
curl -X POST http://127.0.0.1:8000/upload-json/ -H "Content-Type: multipart/form-data" -F "file=@export.json"
```

Delete entries from fileupload (need to clean the db befor retrying the upload)
```console
python3 manage.py clear_data
```

