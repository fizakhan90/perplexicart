#!/bin/sh
# backend/entrypoint.sh

# Use the PORT environment variable provided by Render, default to 8000 if not set
APP_PORT=${PORT:-8000}

echo "Starting Uvicorn on host 0.0.0.0 and port $APP_PORT"
exec uvicorn main:app --host 0.0.0.0 --port "$APP_PORT"