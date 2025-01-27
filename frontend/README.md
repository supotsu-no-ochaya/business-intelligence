# Frontend
## Install
```console
cd frontend
```
```console
npm install react-scripts
```
Unter windows evtl: powershell -ExecutionPolicy Bypass

## Environment files
1. Add frontend/.env (next to package.json):
```python
REACT_APP_API_BASE_URL=http://localhost:8000
```
2. Add frontend/.env.local (next to package.json):
```python
REACT_APP_API_BASE_URL=http://localhost:8000
```
2. Add frontend/.env.production (next to package.json):
```python
REACT_APP_API_BASE_URL=IP-OF-SERVER
```

## Run
```console
npm start
```

## Docker
1. Build development
```console
docker build -f Dockerfile -t react-app .
```

2. Run development
```console
docker run -p 3000:3000 react-app
```

