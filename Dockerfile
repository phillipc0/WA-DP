# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Build Frontend
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# Build Backend
WORKDIR /app/backend
RUN npm ci
RUN npm run build


# Stage 2: Production Image
FROM node:20-alpine

LABEL maintainer="Gemini"

# Install Nginx and create necessary directories for the 'node' user
RUN apk add --no-cache nginx && \
    mkdir -p /var/lib/nginx/tmp /run/nginx && \
    chown -R node:node /var/lib/nginx /run/nginx

WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/backend/.next ./.next
COPY --from=builder /app/dist ./frontend
COPY --from=builder /app/backend/public ./public

# Create the data directory for volume mounting
RUN mkdir -p /app/data

# Copy Nginx config and startup script
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /app/start.sh

# Set correct permissions
RUN chmod +x /app/start.sh && chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose the internal port Nginx will listen on
EXPOSE 80

# Start the application
CMD ["/app/start.sh"]