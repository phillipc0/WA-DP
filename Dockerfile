# ===== Stage 1: Build Frontend =====
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== Stage 2: Build Backend (and copy Frontend-Assets) =====
FROM node:22-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY backend ./backend
# Copies the built frontend files into the directory that is served by the backend.
COPY --from=frontend-builder /app/dist ./backend/frontend
RUN cd backend && npm run build

# ===== Stage 3: Final Production Image =====
FROM node:22-alpine AS runner
WORKDIR /app/backend

# Install Nginx
RUN apk add --no-cache nginx

# Copies the Nginx configuration from the Docker folder
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Installs only the production dependencies for the backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Copies the backend code and build artifacts from the builder stage
COPY --from=backend-builder /app/backend .

# Makes the ports for Nginx (80) and the Node server (3000) available
EXPOSE 80
EXPOSE 3000

# Copies the start script from the Docker folder and makes it executable
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Command to start the application
CMD ["/start.sh"]
