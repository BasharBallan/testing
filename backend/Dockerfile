# Use the official Node.js image based on Alpine Linux for a lightweight container
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package dependency files first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies to support live-reloading tools like nodemon during development)
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Create necessary directories for file uploads and server logs, and assign ownership to the 'node' user
RUN mkdir -p uploads logs && chown -R node:node /app

# Switch to a non-root security user for better container isolation and security
USER node

# Expose the application port to the host machine
EXPOSE 8000

# Start the application using the development script (e.g., using nodemon)
CMD ["npm", "run", "dev"]
