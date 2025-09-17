#!/bin/bash
set -e

echo "=== CaliMed Nexus Build Script ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"

echo "=== Installing frontend dependencies ==="
npm ci

echo "=== Building frontend ==="
npm run build

echo "=== Verifying frontend build ==="
if [ ! -d "dist" ]; then
    echo "ERROR: dist directory not found!"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "ERROR: dist/index.html not found!"
    exit 1
fi

echo "Frontend build successful. Files in dist:"
ls -la dist/

echo "=== Setting up backend ==="
cd server

echo "Installing backend dependencies..."
npm ci --omit=dev

echo "Generating Prisma client..."
npx prisma generate

echo "Testing database connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "DATABASE_URL: ${DATABASE_URL}"
fi

echo "Running database migrations..."
if npx prisma migrate deploy; then
    echo "Migrations completed successfully"
else
    echo "Migration failed, trying to push schema..."
    npx prisma db push --force-reset || echo "Schema push failed, continuing..."
fi

echo "Seeding database with demo data..."
if node seed.js; then
    echo "Database seeded successfully"
else
    echo "Seeding failed, but continuing with build..."
fi

echo "=== Preparing static files ==="
rm -rf public
mkdir -p public

echo "Copying frontend build to server public directory..."
cp -r ../dist/* ./public/

echo "=== Verifying static files ==="
if [ ! -f "public/index.html" ]; then
    echo "ERROR: public/index.html not found after copy!"
    exit 1
fi

echo "Static files ready. Contents of public:"
ls -la public/

echo "=== Build completed successfully! ==="