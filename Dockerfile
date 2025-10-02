# =============================================
# Stufe 1: Frontend bauen
# =============================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================
# Stufe 2: Backend bauen
# =============================================
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY backend/. ./backend/
RUN cd backend && npm run build

# =============================================
# Stufe 3: Finale Anwendung zusammenstellen
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Nginx installieren
RUN apk add --no-cache nginx

# Backend-Abhängigkeiten installieren
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Build-Artefakte kopieren
COPY --from=backend-builder /app/backend/.next ./backend/.next
COPY --from=frontend-builder /app/dist ./backend/frontend

# Konfigurationsdateien und Skripte aus dem 'docker' Ordner kopieren
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Nginx Port 80 freigeben
EXPOSE 80

# Start-Skript ausführen
CMD ["/start.sh"]