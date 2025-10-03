#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Start the Next.js backend server in the background on port 4000
# (for internal use by Nginx)
npm start -- -p 4000 &

# Start Nginx in the foreground. This will keep the container running.
# The 'daemon off;' directive prevents Nginx from forking to the background.
exec nginx -g 'daemon off;'