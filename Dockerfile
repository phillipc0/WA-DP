# =============================================
# Stufe 1: Frontend bauen
# =============================================
FROM node:20-alpine AS frontend-builder

# Setzt das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiert nur die package.json-Dateien, um den Docker-Cache zu nutzen
COPY package*.json ./
COPY .npmrc ./

# Installiert ALLE Abhängigkeiten (inkl. devDependencies) für den Build
RUN npm ci

# Kopiert den gesamten restlichen Quellcode (respektiert .dockerignore)
COPY . .

# Führt den Build-Befehl aus. Das Ergebnis landet in /app/dist
RUN npm run build


# =============================================
# Stufe 2: Backend bauen
# =============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Kopiert nur die package.json des Backends
COPY backend/package*.json ./backend/

# Installiert ALLE Backend-Abhängigkeiten
RUN cd backend && npm ci

# Kopiert den restlichen Backend-Code
COPY backend/. ./backend/

# Baut das Next.js-Backend. Das Ergebnis landet in /app/backend/.next
RUN cd backend && npm run build


# =============================================
# Stufe 3: Finale Anwendung zusammenstellen (schlankes Production-Image)
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Setzt die Umgebung auf "production" für bessere Performance
ENV NODE_ENV=production

# Kopiert nur die package.json des Backends, um NUR Production-Abhängigkeiten zu installieren
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Kopiert die gebauten Artefakte aus den vorherigen Stufen
COPY --from=backend-builder /app/backend/.next ./backend/.next
COPY --from=backend-builder /app/backend/public ./backend/public
COPY --from=backend-builder /app/backend/next.config.js ./backend/next.config.js

# WICHTIG: Kopiert das gebaute Frontend (aus Stufe 1) in das Verzeichnis,
# das der Next.js-Server als 'public' für statische Dateien verwendet.
# Basierend auf Ihrer vite.config.js und der Ordnerstruktur ist das "backend/frontend".
COPY --from=frontend-builder /app/dist ./backend/frontend

# Port freigeben, auf dem das Next.js-Backend läuft (Standard: 3000)
EXPOSE 3000

# Das Kommando zum Starten des Next.js-Servers in der Production-Umgebung
CMD ["npm", "start", "--", "--prefix", "backend"]