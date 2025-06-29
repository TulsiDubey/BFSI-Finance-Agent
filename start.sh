#!/bin/bash

# Start script for Render deployment
# This script starts the Flask application using Gunicorn

echo "Starting BFSI Financial Security Platform..."

# Set default port if not provided
export PORT=${PORT:-5000}

# Create uploads directory if it doesn't exist
mkdir -p backend/uploads

# Install dependencies if needed
if [ -f "backend/requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r backend/requirements.txt
fi

# Change to backend directory
cd backend

# Start the application with Gunicorn
echo "Starting Gunicorn server on port $PORT..."
gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --access-logfile - --error-logfile - app:app 