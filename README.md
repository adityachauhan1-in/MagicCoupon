# MagicCoupon

A coupon management application with authentication and user management.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/adityachauhan1-in/MagicCoupon
cd MagicCoupon
```

### 2. Environment Setup
Create a `.env` file in the `server` directory with your configuration:
```bash
# Server Configuration
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongo:27017/magiccoupon
JWT_SECRET=your_secure_jwt_secret_here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://magiccoupon-backend.onrender.com/auth/google/callback
```

### 3. Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend**: https://magiccoupon-frontend.onrender.com
- **Backend API**: https://magiccoupon-backend.onrender.com
- **MongoDB**: localhost:27017 (local development only)

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up
```

### Stop Services
```bash
docker-compose down
```

### Rebuild and Start
```bash
docker-compose up --build
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs server
docker-compose logs client
docker-compose logs mongo
```

### Clean Up
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## 🔧 Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 27017 are already in use:
```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017

# Or modify docker-compose.yml to use different ports
```

### MongoDB Connection Issues
```bash
# Check if MongoDB container is running
docker-compose ps mongo

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB service
docker-compose restart mongo
```

### Build Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 📁 Project Structure
```
MagicCoupon/
├── client/          # React frontend
├── server/          # Node.js backend
├── docker-compose.yml
├── .dockerignore
└── README.md
```

## 🛠️ Development

### Without Docker
```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in new terminal)
cd client
npm install
npm start
```

### With Docker
```bash
# Development mode with volume mounting
docker-compose -f docker-compose.dev.yml up
```

## 📝 Notes
- The application uses MongoDB for data storage
- Authentication is handled with JWT tokens
- Google OAuth is configured but optional
- All services restart automatically unless stopped manually
- Health checks are implemented for better monitoring

## ⚠️ Console Warnings (Normal)
If you see console warnings like:
- `WARNING! Using this console may allow attackers to impersonate you...`
- `ERR_BLOCKED_BY_CLIENT` errors from `play.google.com`

**These are completely normal and expected:**
- The first warning is Google's security message about browser console usage
- The second error occurs when ad blockers block Google's tracking requests
- **Neither affects your app's functionality**
- **Both can be safely ignored**