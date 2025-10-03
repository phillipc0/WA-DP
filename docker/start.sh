#!/bin/sh
set -e

# Start the Next.js backend in the background on port 4000
npm start -- -p 4000 &

# Start Nginx in the foreground to keep the container running
exec nginx -g 'daemon off;'