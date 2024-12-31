# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy project files
COPY frontend/ ./

# Build the React app
RUN npm run build

# Expose port 3000 for development
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]

