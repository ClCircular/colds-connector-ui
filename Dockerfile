# Use the official Node.js image as base image
FROM node:lts

# Set working directory inside the container
WORKDIR /app

# Copiamos los package.json para instalar deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY colds-api/lambdas/colds_api/package*.json ./colds-api/lambdas/colds_api/

# Instalamos dependencias raíz, frontend y backend-proxy
RUN npm install && \
    cd frontend && npm install && \
    cd ../colds-api/lambdas/colds_api && npm install

# Copiamos todo el código
COPY . .

# Exponemos los puertos de dev
EXPOSE 5173
EXPOSE 8083

# Arrancamos usando el script dev del monorepo (concurrently frontend + backend)
CMD ["npm", "run", "dev"]
