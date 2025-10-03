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

# Install Nginx and set up necessary directories and permissions
RUN apk add --no-cache nginx && \
    mkdir -p /var/lib/nginx/tmp /var/log/nginx /run/nginx && \
    chown -R node:node /var/lib/nginx /var/log/nginx /run/nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/backend /app
COPY --from=builder /app/dist /app/frontend

# Create the data directory for volume mounting
RUN mkdir -p /app/data

# Copy Nginx config and startup script
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /app/start.sh

# Make the startup script executable and change ownership of all app files
RUN chmod +x /app/start.sh && \
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["/app/start.sh"]