#!/bin/sh
set -e

BACKEND_PFJ="/app/data/portfolio.json"
FRONTEND_PFJ="/app/frontend/portfolio.json"
BACKEND_UPLOADS_DIR="/app/data/uploads"
FRONTEND_UPLOADS_DIR="/app/frontend/uploads"

# Check if the source file exists / a volume was mounted
if [ -f "$BACKEND_PFJ" ]; then
    cp "$BACKEND_PFJ" "$FRONTEND_PFJ"
fi

# Restore persisted uploads into the static frontend directory
if [ -d "$BACKEND_UPLOADS_DIR" ]; then
    mkdir -p "$FRONTEND_UPLOADS_DIR"
    cp -r "$BACKEND_UPLOADS_DIR"/. "$FRONTEND_UPLOADS_DIR"/
fi

# Start the Next.js backend server in the background
npm start -- -p 4000 &

# Start Nginx in the foreground, to keep the container running
exec nginx -g 'daemon off;'