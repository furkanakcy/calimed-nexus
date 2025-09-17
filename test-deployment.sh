#!/usr/bin/env bash

URL="https://calimed-nexus-1.onrender.com"

echo "Testing CaliMed Nexus deployment..."
echo "URL: $URL"
echo ""

echo "1. Testing main page..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$URL"

echo ""
echo "2. Testing health endpoint..."
curl -s -w "Status: %{http_code}\n" "$URL/health"

echo ""
echo "3. Testing API health..."
curl -s -w "Status: %{http_code}\n" "$URL/api/health"

echo ""
echo "4. Testing login endpoint..."
curl -s -X POST "$URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}' \
  -w "Status: %{http_code}\n"

echo ""
echo "5. Testing demo login..."
curl -s -X POST "$URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@calimed.com","password":"demo123"}' \
  -w "Status: %{http_code}\n"