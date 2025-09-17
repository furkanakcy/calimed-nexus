#!/usr/bin/env bash

URL="https://calimed-nexus-1.onrender.com"

echo "=== CaliMed Nexus Deployment Diagnostics ==="
echo "URL: $URL"
echo ""

echo "1. Basic connectivity test..."
curl -s -o /dev/null -w "HTTP Status: %{http_code} | Total Time: %{time_total}s\n" "$URL"

echo ""
echo "2. Check if it's serving React app..."
curl -s "$URL" | head -3

echo ""
echo "3. Test various API endpoints..."
echo "   /api/auth/login (POST):"
curl -s -X POST "$URL/api/auth/login" -H "Content-Type: application/json" -d '{}' -w " [Status: %{http_code}]" && echo

echo "   /api/hospitals (GET with demo token):"
curl -s "$URL/api/hospitals" -H "Authorization: Bearer demo-token-admin" -w " [Status: %{http_code}]" && echo

echo "   /api/users (GET with demo token):"
curl -s "$URL/api/users" -H "Authorization: Bearer demo-token-admin" -w " [Status: %{http_code}]" && echo

echo ""
echo "4. Check for any error responses..."
curl -s -X GET "$URL/nonexistent" -w " [Status: %{http_code}]" && echo