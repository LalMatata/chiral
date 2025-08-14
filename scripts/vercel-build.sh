#!/bin/bash

# Script for Vercel deployment
# This script ensures only frontend dependencies are installed

echo "Starting Vercel build process..."

# Clean install with only production dependencies (skipping optional)
echo "Installing dependencies (without optional backend packages)..."
npm install --legacy-peer-deps --omit=optional

# Run the build
echo "Building the application..."
npm run build

echo "Build completed successfully!"