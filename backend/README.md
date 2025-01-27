# Backend
Framwork: Django 5.1.2\
Database: PostgreSQL

## Installation
Create python environment:
```console
python3 -m venv backend
```

Activate environment:
```console
source backend/bin/activate
```

Install dependencies:
```console
pip install -r path/to/requirements.txt
```

PostgreSQL under Linux [PostgreSQL Link](https://www.postgresql.org/download/):
```console
sudo apt install libpq-dev postgresql postgresql-contrib
```
Login for interactive session:
```console
sudo -u postgres psql
```

Create user:
```console
postgres=# CREATE USER userName WITH PASSWORD 'password';
```

Create database:
```console
postgres=# CREATE DATABASE dbName OWNER userName;
```

Find hba_file:
```console
postgres=# SHOW hba_file;
```
and **change** (seperated by taps):
von:    local   all             all             peer\
zu:     local   all             all             md5

Close:
```console
postgres=# \q
```

Restart PostgreSQL:
```console
sudo systemctl restart postgresql
```

Login psql:
```console
psql -U userName -W -d dbName
```

Curl command for file upload:
```console
curl -X POST http://127.0.0.1:8000/upload-json/ -H "Content-Type: multipart/form-data" -F "file=@export.json"
```

Delete entries from fileupload (need to clean the db befor retrying the upload):
```console
python3 manage.py clear_data
```

## Docker
0. Check firewall rule and change them:
```console
sudo ufw allow 8000
```
**Windows** check if ports are open:
```console
netstat -an | find "8000"
netstat -an | find "5432"
```
If they are not open, well open them.


1. Configure pg_hba.conf:
```console
sudo vim /etc/postgresql/<version>/main/pg_hba.conf
```
**Windows** under: C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf

Add entry and allow connections from docker subnet (seperated by taps):\
host    all             all             172.17.0.0/16          md5

These IP ranges should be occupied by docker. If not check the container IP with\
like below!

2. Configure postgres to listen:
```console
sudo vim /etc/postgresql/<version>/main/postgresql.conf
```
**Windows** under: C:\Program Files\PostgreSQL\<version>\data\postgresql.conf\

Add entry:\
listen_addresses = '*'

3. Restart postgres:
```console
sudo systemctl restart postgresql
```
**Windows** adjust version number!:
```console
net stop postgresql-x64-13
net start postgresql-x64-13
```


4. Change DB_HOST in ../.env to container ip:
You have to build and run it first to retrieve ip even if fails
```console
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id>
```
Now change DB_HOST to the ip.

5. Build development:
```console
docker build -f Dockerfile -t backend-app .
```

6. Run development:
```console
docker run --env-file ../.env -p 8000:8000 backend-app
```


