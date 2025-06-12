# Use the official Node.js image as base image
FROM node:lts

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install && \
    cd frontend && npm install && \
    cd ../backend && npm install

# Copy all source files to the container
COPY . .

# Expose the frontend port your app runs on
EXPOSE 5173 
EXPOSE 8083 

# Start the server using concurrently
CMD ["npm", "run", "dev"]

