# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    netcat-openbsd inetutils-ping\
    && apt-get clean

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Expose port 8000 for Django development server
EXPOSE 8000

# Set the environment to development
ENV DJANGO_SETTINGS_MODULE=backend.settings
# Command to run the development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

