#!/usr/bin/env bash

URL="https://calimed-nexus-1.onrender.com"

echo "=== Testing Basic CaliMed Nexus Functionality ==="
echo ""

echo "1. Testing demo login..."
RESPONSE=$(curl -s -X POST "$URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}')

if [ -n "$RESPONSE" ]; then
  echo "✓ Login endpoint responding"
  echo "Response: $RESPONSE"
else
  echo "✗ Login endpoint not responding"
fi

echo ""
echo "2. Testing with demo token..."
curl -s "$URL/api/hospitals" \
  -H "Authorization: Bearer demo-token-admin" \
  -H "Content-Type: application/json" \
  && echo "✓ Demo token works" || echo "✗ Demo token failed"

echo ""
echo "3. Testing frontend access..."
FRONTEND=$(curl -s "$URL" | grep -o "CaliMed Nexus")
if [ "$FRONTEND" = "CaliMed Nexus" ]; then
  echo "✓ Frontend is accessible"
else
  echo "✗ Frontend not accessible"
fi