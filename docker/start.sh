#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Start Nginx in the background
nginx &

# Start the Next.js backend server on port 4000 (for internal use by Nginx)
# The `npm start` command is `next start`, we append `-- -p 4000` to it.
exec npm start -- -p 4000