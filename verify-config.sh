#!/bin/bash

echo "🔍 CaliMed Nexus - Configuration Verification"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo ""
echo "📁 Checking file structure..."

# Check required files
files=(
    "server/server.js"
    "server/package.json"
    "server/.env"
    "server/prisma/schema.prisma"
    "fly.toml"
    "fly.frontend.toml"
    "Dockerfile"
    "Dockerfile.frontend"
    "nginx.conf"
    ".env"
    ".env.example"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file is missing"
    fi
done

echo ""
echo "🔧 Checking backend configuration..."

# Check server.js port configuration
if grep -q "process.env.PORT || 5000" server/server.js; then
    print_status "Backend port configuration is correct"
else
    print_error "Backend port configuration needs fixing"
fi

# Check health endpoint
if grep -q "/health" server/server.js; then
    print_status "Health endpoint exists"
else
    print_error "Health endpoint is missing"
fi

echo ""
echo "🌐 Checking fly.toml configuration..."

# Check internal_port in fly.toml
if grep -q "internal_port = 5000" fly.toml; then
    print_status "Backend internal_port is correct (5000)"
else
    print_error "Backend internal_port should be 5000"
fi

# Check health check path
if grep -q 'path = "/health"' fly.toml; then
    print_status "Health check path is correct"
else
    print_error "Health check path should be /health"
fi

echo ""
echo "🎨 Checking frontend configuration..."

# Check frontend fly.toml
if grep -q "internal_port = 80" fly.frontend.toml; then
    print_status "Frontend internal_port is correct (80)"
else
    print_error "Frontend internal_port should be 80"
fi

# Check Dockerfile.frontend
if grep -q "EXPOSE 80" Dockerfile.frontend; then
    print_status "Frontend Dockerfile exposes port 80"
else
    print_error "Frontend Dockerfile should expose port 80"
fi

echo ""
echo "🗄️  Checking database configuration..."

# Check DATABASE_URL format
if grep -q "\.internal:5432" server/.env; then
    print_status "Database URL uses internal domain"
else
    print_warning "Database URL should use .internal domain for Fly.io"
fi

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exist
if [ -d "node_modules" ]; then
    print_status "Frontend dependencies installed"
else
    print_warning "Run 'npm install' to install frontend dependencies"
fi

if [ -d "server/node_modules" ]; then
    print_status "Backend dependencies installed"
else
    print_warning "Run 'cd server && npm install' to install backend dependencies"
fi

echo ""
echo "🚀 Deployment readiness check complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Install missing dependencies if any"
echo "   2. Run ./setup-db.sh to create database"
echo "   3. Run ./deploy.sh to deploy applications"
echo ""
echo "🔗 Useful commands:"
echo "   flyctl auth login"
echo "   flyctl apps list"
echo "   flyctl status -a calimed-nexus"