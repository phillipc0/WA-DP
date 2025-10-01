# =============================================
# Stufe 1: Frontend bauen
# =============================================
FROM node:20-alpine AS frontend-builder

# Setzt das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiert nur die package.json-Dateien, um den Docker-Cache effizient zu nutzen.
# Wenn sich diese Dateien nicht ändern, wird der 'npm ci'-Schritt übersprungen.
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
# Stufe 3: Finale Anwendung zusammenstellen (KORRIGIERT)
# =============================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production

# --- ÄNDERUNG 1: Arbeitsverzeichnis direkt auf /app/backend setzen ---
WORKDIR /app/backend

# Kopiert die package.json des Backends in das neue WORKDIR
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Kopiert die gebauten Artefakte. Die Zielpfade sind jetzt relativ zum neuen WORKDIR.
COPY --from=backend-builder /app/backend/.next ./.next
COPY --from=backend-builder /app/backend/next.config.js ./next.config.js

# Kopiert das gebaute Frontend (aus Stufe 1) in das "frontend"-Verzeichnis innerhalb des Backends
COPY --from=frontend-builder /app/dist ./frontend

# Port freigeben
EXPOSE 3000

# --- ÄNDERUNG 2: Vereinfachtes Start-Kommando, da wir schon im richtigen Verzeichnis sind ---
CMD ["npm", "start"]