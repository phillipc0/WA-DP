# =============================================
# Stage 1: Build Frontend
# =============================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================
# Stage 2: Build Backend
# =============================================
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY backend/. ./backend/
RUN cd backend && npm run build

# =============================================
# Stage 3: Configure Production Image
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install Nginx
RUN apk add --no-cache nginx

# Copy backend code and install production dependencies
COPY backend/package*.json ./backend/
COPY backend/next.config.js ./backend/
COPY --from=backend-builder /app/backend/.next ./backend/.next
WORKDIR /app/backend
RUN npm ci --omit=dev

# Set the final working directory for the CMD instruction
WORKDIR /app/backend

# Copy built frontend and configurations
COPY --from=frontend-builder /app/dist /app/frontend_build
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80 for Nginx
EXPOSE 80

# Execute the start script
CMD ["/start.sh"]