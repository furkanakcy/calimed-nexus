# Backend Dockerfile for Fly.io deployment - Use Debian instead of Alpine for better Prisma compatibility
FROM node:20-slim

# Install required dependencies for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy server package files
COPY server/package*.json ./
RUN npm install

# Install Prisma CLI globally
RUN npm install -g prisma

# Copy server source code
COPY server/ ./

# Copy Prisma schema and generate client
RUN npx prisma generate

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["npm", "start"]
