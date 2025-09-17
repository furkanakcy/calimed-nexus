#!/bin/bash

echo "🚀 CaliMed Nexus - Fly.io Deployment Script"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    print_error "flyctl is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    print_error "You are not logged in to Fly.io. Please run: flyctl auth login"
    exit 1
fi

print_status "Logged in to Fly.io"

# Deploy backend
echo ""
echo "🔧 Deploying Backend..."
echo "======================"

# Set backend secrets
print_status "Setting backend secrets..."
flyctl secrets set DATABASE_URL="postgresql://calimed:secure_password@calimed-db.internal:5432/calimed_nexus" -a calimed-nexus
flyctl secrets set JWT_SECRET="super_secret_key_change_in_production" -a calimed-nexus

# Deploy backend
print_status "Deploying backend application..."
flyctl deploy -a calimed-nexus

# Check backend health
echo ""
print_status "Checking backend health..."
sleep 10
if curl -f https://calimed-nexus.fly.dev/health; then
    print_status "Backend is healthy!"
else
    print_warning "Backend health check failed. Check logs with: flyctl logs -a calimed-nexus"
fi

# Deploy frontend
echo ""
echo "🎨 Deploying Frontend..."
echo "======================="

print_status "Deploying frontend application..."
flyctl deploy -c fly.frontend.toml -a calimed-frontend

# Check frontend health
echo ""
print_status "Checking frontend health..."
sleep 10
if curl -f https://calimed-frontend.fly.dev/; then
    print_status "Frontend is healthy!"
else
    print_warning "Frontend health check failed. Check logs with: flyctl logs -a calimed-frontend"
fi

echo ""
print_status "Deployment completed!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: https://calimed-frontend.fly.dev"
echo "   Backend:  https://calimed-nexus.fly.dev"
echo ""
echo "📊 Monitor your apps:"
echo "   flyctl status -a calimed-nexus"
echo "   flyctl status -a calimed-frontend"
echo ""
echo "📝 View logs:"
echo "   flyctl logs -a calimed-nexus"
echo "   flyctl logs -a calimed-frontend"