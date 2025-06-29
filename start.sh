#!/bin/bash

# Start script for Render deployment
# This script starts the Flask application using Gunicorn

echo "Starting BFSI Financial Security Platform..."

# Set default port if not provided
export PORT=${PORT:-5000}

# Create uploads directory if it doesn't exist
mkdir -p backend/uploads

# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the Flask application with Gunicorn
gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120 