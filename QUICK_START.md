# Quick Start Guide - Sankat Mochan

## 🚀 Method 1: Docker Setup (Recommended)

### Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM available

### Commands
```bash
# 1. Clone and navigate to project
cd Sankat_mochan

# 2. Create environment file
copy env.example .env
# Edit .env file with your configuration (optional for basic testing)

# 3. Start all services
docker-compose up -d --build

# 4. Check if services are running
docker-compose ps

# 5. View logs if needed
docker-compose logs -f
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 🛠️ Method 2: Local Development Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL and Redis (using Docker)
docker-compose up postgres redis -d

# Run database migrations (if needed)
flask db upgrade

# Start backend server
python run.py
```

### Frontend Setup

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

---

## 🔧 Troubleshooting Common Issues

### Docker Issues

**Issue**: `docker-compose` command not found
```bash
# Solution: Install Docker Desktop or use docker compose (newer version)
docker compose up -d --build
```

**Issue**: Port conflicts (3000, 5000, 5432, 6379 already in use)
```bash
# Solution: Stop conflicting services or change ports in docker-compose.yml
# Check what's using the ports:
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill processes if needed:
taskkill /PID <PID_NUMBER> /F
```

**Issue**: Docker containers won't start
```bash
# Solution: Check logs and restart
docker-compose down
docker system prune -f
docker-compose up -d --build
```

### Backend Issues

**Issue**: `pip install` fails
```bash
# Solution: Upgrade pip and try again
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**Issue**: Database connection error
```bash
# Solution: Ensure PostgreSQL is running
docker-compose up postgres -d

# Check if database is accessible
docker-compose exec postgres psql -U postgres -d sankat_mochan -c "SELECT 1;"
```

**Issue**: Redis connection error
```bash
# Solution: Ensure Redis is running
docker-compose up redis -d

# Test Redis connection
docker-compose exec redis redis-cli ping
```

**Issue**: Import errors in Python
```bash
# Solution: Ensure virtual environment is activated and dependencies installed
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Issues

**Issue**: `npm install` fails
```bash
# Solution: Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript/React errors
```bash
# Solution: Install missing dependencies
npm install @types/react @types/react-dom @types/node

# If using older Node version, upgrade to Node 18+
node --version
```

**Issue**: Tailwind CSS not working
```bash
# Solution: Install Tailwind dependencies
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npx tailwindcss init -p
```

**Issue**: API connection errors
```bash
# Solution: Check if backend is running and update API URL
# In frontend/.env or frontend/src/services/api.ts
# Ensure REACT_APP_API_URL=http://localhost:5000/api
```

### Network/CORS Issues

**Issue**: CORS errors in browser
```bash
# Solution: Ensure backend CORS is configured correctly
# Check backend/config.py CORS_ORIGINS setting
# Should include: http://localhost:3000
```

**Issue**: API requests failing
```bash
# Solution: Check backend health endpoint
curl http://localhost:5000/api/health

# Or in browser: http://localhost:5000/api/health
# Should return: {"status": "healthy", "message": "Sankat Mochan API is running"}
```

---

## 📋 Development Workflow

### Daily Development Setup
```bash
# 1. Start infrastructure (run once)
docker-compose up postgres redis -d

# 2. Start backend (Terminal 1)
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python run.py

# 3. Start frontend (Terminal 2)
cd frontend
npm start
```

### Environment Variables Setup
```bash
# Copy example environment file
copy env.example .env

# Edit .env file with your settings:
# - SECRET_KEY: Generate a secure key
# - DATABASE_URL: Usually default is fine for development
# - OPENAI_API_KEY: Optional, for AI features
# - GOOGLE_CLIENT_ID: Optional, for Google OAuth
```

---

## 🧪 Testing the Application

### Backend API Tests
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test user registration
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🔍 Debugging Commands

### Check Service Status
```bash
# Docker services
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
docker-compose logs redis
```

### Database Inspection
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d sankat_mochan

# List tables
\dt

# Check users table
SELECT * FROM users LIMIT 5;
```

### Redis Inspection
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check keys
KEYS *

# Check a specific key
GET some_key
```

---

## 🛑 Stopping Services

### Stop Docker Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (caution: this deletes data)
docker-compose down -v

# Clean up Docker system
docker system prune -f
```

### Stop Local Development
```bash
# Stop backend: Ctrl+C in backend terminal
# Stop frontend: Ctrl+C in frontend terminal
# Stop infrastructure: docker-compose down
```

---

## 📞 Getting Help

If you encounter issues not covered here:

1. **Check the logs** first: `docker-compose logs -f`
2. **Restart services**: `docker-compose restart`
3. **Clean restart**: `docker-compose down && docker-compose up -d --build`
4. **Check GitHub issues** for similar problems
5. **Create a new issue** with error logs and system info 