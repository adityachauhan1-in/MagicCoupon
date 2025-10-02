@echo off
echo ========================================
echo MagicCoupon Docker Setup
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop and start it.
    pause
    exit /b 1
)

echo Docker is running. Starting services...
echo.

echo Building and starting containers...
docker-compose up --build -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Checking service status...
docker-compose ps

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo MongoDB:  localhost:27017
echo.
echo Useful commands:
echo   View logs: docker-compose logs
echo   Stop:      docker-compose down
echo   Restart:   docker-compose restart
echo.
pause
