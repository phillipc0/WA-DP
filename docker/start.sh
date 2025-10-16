#!/bin/sh
set -e

BACKEND_PFJ="/app/data/portfolio.json"
FRONTEND_PFJ="/app/frontend/portfolio.json"

# Check if the source file exists / a volume was mounted
if [ -f "$BACKEND_PFJ" ]; then
    cp "$BACKEND_PFJ" "$FRONTEND_PFJ"
fi

# Start the Next.js backend server in the background
npm start -- -p 4000 &

# Start Nginx in the foreground, to keep the container running
exec nginx -g 'daemon off;'