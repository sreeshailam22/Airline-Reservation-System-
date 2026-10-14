# Multi-stage lightweight Node.js container (No Tomcat required!)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose server port
EXPOSE 3000

# Start modern AeroSky Airline web application
CMD ["node", "server.js"]
