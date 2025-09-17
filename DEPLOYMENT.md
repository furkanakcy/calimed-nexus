# CaliMed Nexus - Fly.io Deployment Guide

This guide will help you deploy CaliMed Nexus to Fly.io without errors.

## Prerequisites

1. **Install Fly.io CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**:
   ```bash
   flyctl auth login
   ```

3. **Install dependencies**:
   ```bash
   # Backend dependencies
   cd server && npm install && cd ..
   
   # Frontend dependencies
   npm install
   ```

## Deployment Steps

### Step 1: Database Setup

Run the database setup script:
```bash
./setup-db.sh
```

This will:
- Create a PostgreSQL database named `calimed-db` in the `fra` region
- Attach it to your backend app
- Run Prisma migrations

### Step 2: Deploy Applications

Run the deployment script:
```bash
./deploy.sh
```

This will:
- Set environment variables and secrets
- Deploy the backend to `calimed-nexus.fly.dev`
- Deploy the frontend to `calimed-frontend.fly.dev`
- Perform health checks

### Manual Deployment (Alternative)

If you prefer manual deployment:

#### Backend Deployment:
```bash
# Set secrets
flyctl secrets set DATABASE_URL="postgresql://calimed:secure_password@calimed-db.internal:5432/calimed_nexus" -a calimed-nexus
flyctl secrets set JWT_SECRET="super_secret_key_change_in_production" -a calimed-nexus

# Deploy backend
flyctl deploy -a calimed-nexus
```

#### Frontend Deployment:
```bash
# Deploy frontend
flyctl deploy -c fly.frontend.toml -a calimed-frontend
```

## Configuration Files

### Backend Configuration (`fly.toml`)
- **Port**: 5000 (configurable via PORT env var)
- **Health Check**: `/health` endpoint
- **Region**: fra (Frankfurt)
- **Memory**: 1GB

### Frontend Configuration (`fly.frontend.toml`)
- **Port**: 80 (Nginx)
- **Health Check**: `/` endpoint
- **Region**: fra (Frankfurt)
- **Memory**: 512MB

### Environment Variables

#### Backend (`.env` in server folder):
```env
DATABASE_URL="postgresql://calimed:secure_password@calimed-db.internal:5432/calimed_nexus"
JWT_SECRET="super_secret_key_change_in_production"
NODE_ENV="production"
```

#### Frontend (`.env` in root folder):
```env
VITE_API_URL="https://calimed-nexus.fly.dev"
```

## Troubleshooting

### Common Issues and Solutions

1. **PrismaClientInitializationError**:
   - Ensure DATABASE_URL is correctly set
   - Check if database is in the same region as backend
   - Verify Prisma schema is pushed: `npx prisma db push`

2. **ECONNREFUSED (database connection)**:
   - Ensure database app is running: `flyctl status -a calimed-db`
   - Check if DATABASE_URL uses `.internal` domain
   - Verify database is attached: `flyctl postgres attach --app calimed-nexus calimed-db`

3. **Health check failures on port 80**:
   - Backend uses port 5000, not 80
   - Frontend uses port 80 with Nginx
   - Check `internal_port` in fly.toml matches your app's port

4. **Environment variable issues**:
   - Use `flyctl secrets set` for sensitive data
   - Use `[env]` section in fly.toml for non-sensitive data
   - Check secrets: `flyctl secrets list -a calimed-nexus`

### Useful Commands

```bash
# Check app status
flyctl status -a calimed-nexus
flyctl status -a calimed-frontend
flyctl status -a calimed-db

# View logs
flyctl logs -a calimed-nexus
flyctl logs -a calimed-frontend

# Connect to database
flyctl postgres connect -a calimed-db

# SSH into app
flyctl ssh console -a calimed-nexus

# Scale app
flyctl scale count 1 -a calimed-nexus

# Set region
flyctl regions set fra -a calimed-nexus
```

## Application URLs

After successful deployment:
- **Frontend**: https://calimed-frontend.fly.dev
- **Backend API**: https://calimed-nexus.fly.dev
- **Health Check**: https://calimed-nexus.fly.dev/health

## Security Notes

1. Change default JWT_SECRET in production
2. Use strong database passwords
3. Enable HTTPS (automatically handled by Fly.io)
4. Regularly update dependencies
5. Monitor application logs

## Support

If you encounter issues:
1. Check the logs: `flyctl logs -a <app-name>`
2. Verify configuration files
3. Ensure all secrets are set correctly
4. Check Fly.io status page for service issues