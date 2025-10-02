#!/bin/sh
set -e

nginx &

exec npm start --prefix backend -- --port 3001