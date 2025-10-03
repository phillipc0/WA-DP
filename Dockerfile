# =============================================
# Stufe 1: Build Frontend
# Verwenden Sie ein Debian-basiertes Image für bessere Kompatibilität beim Bauen.
# =============================================
FROM node:20-bookworm AS frontend-builder
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================
# Stufe 2: Build Backend
# =============================================
FROM node:20-bookworm AS backend-builder
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY backend/. ./backend/
# Kopiert die gebauten Frontend-Dateien in das Verzeichnis, das vom Backend bereitgestellt wird.
COPY --from=frontend-builder /app/dist ./backend/frontend
RUN cd backend && npm run build

# =============================================
# Stufe 3: Finales Produktions-Image
# Hier verwenden wir wieder Alpine für ein möglichst kleines Image.
# =============================================
FROM node:20-alpine AS runner

# Setzt das Arbeitsverzeichnis auf /app/backend für die folgenden Befehle
WORKDIR /app/backend

# Installiert Nginx
RUN apk add --no-cache nginx

# Kopiert die Nginx-Konfiguration aus dem docker-Ordner
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Kopiert die package.json-Dateien in das aktuelle Arbeitsverzeichnis (/app/backend)
COPY backend/package.json backend/package-lock.json ./
# Führt npm ci direkt im Arbeitsverzeichnis aus, um nur Produktionsabhängigkeiten zu installieren
RUN npm ci --omit=dev

# Kopiert den gesamten gebauten Backend-Code aus der Builder-Stufe in das aktuelle Verzeichnis
COPY --from=backend-builder /app/backend .

# Macht die Ports für Nginx (80) und den Node-Server (3000) verfügbar
EXPOSE 80
EXPOSE 3000

# Kopiert das Start-Skript in einen allgemeinen Pfad und macht es ausführbar
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Befehl zum Starten der Anwendung
CMD ["/start.sh"]