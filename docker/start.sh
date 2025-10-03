#!/bin/sh
set -e

# start the Next.js backend-server in the background
npm start -- -p 4000 &

# start nginx in the foreground
exec nginx