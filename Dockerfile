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
# Stage 3: Configure Image
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# install Nginx
RUN apk add --no-cache nginx

# cpy backend-code and install production-dependencies
COPY backend/package*.json ./backend/
COPY backend/next.config.js ./backend/
COPY --from=backend-builder /app/backend/.next ./backend/.next
WORKDIR /app/backend
RUN npm ci --omit=dev

# back to root-directory
WORKDIR /app

# copy build frontend
COPY --from=frontend-builder /app/dist ./frontend_build

# copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# expose port 80 for nginx
EXPOSE 80

# execute start script
CMD ["/start.sh"]