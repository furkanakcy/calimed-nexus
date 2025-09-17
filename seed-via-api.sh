#!/bin/bash

echo "🌱 Creating demo accounts via API..."

# Backend URL'ini buraya yaz
BACKEND_URL="https://calimed-nexus-backend.onrender.com"

echo "📧 Creating admin company..."
curl -X POST "$BACKEND_URL/api/companies/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CaliMed Demo Company",
    "email": "admin@calimed.com", 
    "password": "demo123"
  }'

echo -e "\n👤 Creating technician user..."
curl -X POST "$BACKEND_URL/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Teknisyen",
    "email": "teknisyen@calimed.com",
    "password": "demo123",
    "role": "technician",
    "companyId": "1"
  }'

echo -e "\n🏥 Creating hospital user..."
curl -X POST "$BACKEND_URL/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Hastane", 
    "email": "hospital@calimed.com",
    "password": "demo123",
    "role": "hospital",
    "companyId": "1"
  }'

echo -e "\n✅ Demo accounts created!"
echo "📧 Login credentials:"
echo "   admin@calimed.com / demo123"
echo "   teknisyen@calimed.com / demo123" 
echo "   hospital@calimed.com / demo123"