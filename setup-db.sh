#!/bin/bash

echo "🗄️  CaliMed Nexus - Database Setup for Fly.io"
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

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    print_error "flyctl is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Create Postgres app
echo ""
print_status "Creating Postgres database..."
flyctl postgres create --name calimed-db --region fra --vm-size shared-cpu-1x --volume-size 3

# Attach database to backend app
echo ""
print_status "Attaching database to backend app..."
flyctl postgres attach --app calimed-nexus calimed-db

# Run Prisma migrations
echo ""
print_status "Running Prisma database setup..."
cd server

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema
print_status "Pushing database schema..."
npx prisma db push

# Seed database (optional)
print_warning "Database seeding will be done after deployment"

cd ..

echo ""
print_status "Database setup completed!"
echo ""
echo "📊 Database info:"
echo "   App name: calimed-db"
echo "   Region: fra"
echo "   Connection: Will be automatically set via DATABASE_URL secret"
echo ""
echo "🔧 Next steps:"
echo "   1. Run ./deploy.sh to deploy your applications"
echo "   2. Check database status: flyctl status -a calimed-db"
echo "   3. Connect to database: flyctl postgres connect -a calimed-db"