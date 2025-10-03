# Stage 1: Build Frontend and Backend
FROM node:20-alpine AS builder

WORKDIR /app

# --- Frontend Build ---
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
RUN npm run build

# --- Backend Build ---
WORKDIR /app/backend
RUN npm ci
RUN npm run build


# Stage 2: Production Image
FROM node:20-alpine

# Install Nginx and prepare directories for non-root execution
RUN apk add --no-cache nginx && \
    mkdir -p /run/nginx && \
    chown -R node:node /run/nginx /var/lib/nginx

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/backend /app
COPY --from=builder /app/dist /app/frontend

# Create data directory for volume mounting
RUN mkdir -p /app/data

# Copy configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /app/start.sh

# Set correct permissions
RUN chmod +x /app/start.sh && chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 80

CMD ["/app/start.sh"]