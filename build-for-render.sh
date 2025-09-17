#!/usr/bin/env bash
set -e

echo "Building frontend..."
npm install
npm run build

echo "Setting up backend..."
cd server
npm install
npx prisma generate

echo "Copying frontend build to server public directory..."
cp -r ../dist ./public

echo "Build complete!"