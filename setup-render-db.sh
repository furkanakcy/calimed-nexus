#!/usr/bin/env bash
set -e

echo "Setting up Render database..."

# Use the external database URL for setup
export DATABASE_URL="postgresql://calimed_db_7p88_user:G1JXY1NXPu32T0tkGiEQJYNgq2nlQAdH@dpg-d35j0mvfte5s73fg03ng-a.frankfurt-postgres.render.com/calimed_db_7p88"

cd server

echo "Pushing database schema..."
npx prisma db push

echo "Seeding database with demo data..."
node seed.js

echo "Database setup complete!"