#!/bin/sh
set -e

# Starts the Next.js backend server in the background
echo "Starting Next.js backend server..."
npm start &

# Starts Nginx in the foreground to keeps the container running
echo "Starting Nginx..."
nginx -g 'daemon off;'
