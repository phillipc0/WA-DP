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

LABEL maintainer="Gemini"

# Install Nginx und erstelle die notwendigen Verzeichnisse mit den richtigen Berechtigungen
RUN apk add --no-cache nginx && \
    # Erstelle Verzeichnisse für Logs, temporäre Dateien und den PID-File
    mkdir -p /var/lib/nginx/tmp /var/log/nginx /run/nginx && \
    # Setze den 'node'-Benutzer als Eigentümer
    chown -R node:node /var/lib/nginx /var/log/nginx /run/nginx && \
    # Leite die Nginx-Logs an die Docker-Logs weiter
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

WORKDIR /app

# Kopiere die Build-Artefakte aus dem Builder-Stage
COPY --from=builder /app/backend /app
COPY --from=builder /app/dist /app/frontend

# Erstelle das 'data'-Verzeichnis für das Volume
RUN mkdir -p /app/data

# Kopiere die Nginx-Konfiguration und das Start-Skript
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /app/start.sh

# Mache das Start-Skript ausführbar
RUN chmod +x /app/start.sh

# Setze den 'node'-Benutzer als Eigentümer für das gesamte App-Verzeichnis
RUN chown -R node:node /app

# Wechsle