#!/usr/bin/env bash

# Render veritabanı ile test
export DATABASE_URL="postgresql://calimed_db_7p88_user:G1JXY1NXPu32T0tkGiEQJYNgq2nlQAdH@dpg-d35j0mvfte5s73fg03ng-a.frankfurt-postgres.render.com/calimed_db_7p88"
export JWT_SECRET="super_secret_key_change_in_production"
export NODE_ENV="production"
export PORT="3002"

echo "Starting server with Render database..."
cd server && node server.js &
SERVER_PID=$!

sleep 5

echo "Testing login..."
curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}' | head -5

echo ""
echo "Testing health..."
curl -s http://localhost:3002/health

echo ""
echo "Stopping server..."
kill $SERVER_PID