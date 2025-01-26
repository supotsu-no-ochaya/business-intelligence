# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json /app/
RUN npm install

# Copy project files
COPY frontend /app/

# Build the React app (this is for production)
#RUN npm run build

# Expose port 3000 for development
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Serve the app
CMD ["npm", "start"]

