#!/usr/bin/env bash
# exit on error
set -o errexit

cd server
npm install
npx prisma generate
npx prisma db push

# Force seed with error handling
echo "🌱 Running seed..."
node seed.js || echo "⚠️ Seed failed, continuing..."

echo "✅ Build completed!"