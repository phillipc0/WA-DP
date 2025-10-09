#!/usr/bin/env bash
set -euo pipefail

# Determine repository root regardless of invocation location
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." && pwd)
cd "$REPO_ROOT"

log() {
  printf "[build] %s\n" "$1"
}

log "Installing frontend dependencies (npm ci)"
npm ci

log "Installing backend dependencies (npm ci --prefix backend)"
npm ci --prefix backend

log "Creating data directory"
mkdir -p backend/data

log "Building backend (npm run build --prefix backend)"
npm run build --prefix backend

log "Building frontend (npm run build)"
npm run build

log "Preparing deployment bundle directory structure"
rm -rf backend/frontend
mkdir -p backend/frontend

log "Copying frontend dist assets into backend/frontend"
cp -R dist/. backend/frontend/

log "Creating wa-dp bundle directory"
rm -rf wa-dp
mkdir -p wa-dp
cp -R backend/. wa-dp/

log "Build and bundle ready in wa-dp/"
