# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# --- Frontend Build ---
# Cache and install frontend dependencies
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Copy frontend source and build
COPY . .
RUN npm run build

# --- Backend Build ---
# Cache and install backend dependencies
WORKDIR /app/backend
RUN npm ci

# Build backend
RUN npm run build


# Stage 2: Production Image
FROM node:20-alpine

LABEL maintainer="Gemini"

# Install Nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Create a non-root user (the default 'node' user already exists in the base image)
# and set up directories for Nginx to run without root
RUN mkdir -p /var/log/nginx && \
    chown -R node:node /var/log/nginx && \
    mkdir -p /run/nginx && \
    chown -R node:node /run/nginx && \
    # Forward request and error logs to docker log collector
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Copy built assets from the builder stage
# Copy backend build output, node_modules, and package files
COPY --from=builder /app/backend /app

# Copy the frontend build into the 'frontend' directory
COPY --from=builder /app/dist /app/frontend

# Create the data directory for volume mounting
RUN mkdir -p /app/data

# Copy Nginx config and startup script
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /app/start.sh

# Make the startup script executable
RUN chmod +x /app/start.sh

# Change ownership of all app files to the non-root 'node' user
RUN chown -R node:node /app

# Switch to the non-root `node` user for security
USER node

# Expose the port Nginx will listen on
EXPOSE 3000

# Set the command to run the startup script
CMD ["/app/start.sh"]