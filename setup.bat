@echo off
setlocal
echo ========================================
echo       Scaffoldz Project Setup Script    
echo ========================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js could not be found. Please install Node.js from https://nodejs.org
    exit /b 1
)

:: Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] npm could not be found. Please install npm.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% and npm %NPM_VERSION% are installed.
echo.

:: === FRONTEND (root) ===
echo [1/2] Checking frontend dependencies...
if exist node_modules (
    echo      node_modules already exists. Checking for missing packages...
    call npm install --prefer-offline
) else (
    echo      node_modules not found. Installing frontend dependencies...
    echo      ^(React, Vite, Tailwind CSS, React Router, etc.^)
    call npm install
)
echo      Frontend: Done.
echo.

:: === BACKEND ===
echo [2/2] Checking backend dependencies...
if exist backend\node_modules (
    echo      node_modules already exists. Checking for missing packages...
    cd backend
    call npm install --prefer-offline
    cd ..
) else (
    echo      node_modules not found. Installing backend dependencies...
    echo      ^(Express, PostgreSQL, bcryptjs, JWT, nodemon, etc.^)
    cd backend
    call npm install
    cd ..
)
echo      Backend: Done.

echo.
echo ========================================
echo  Setup complete! Everything is ready.
echo.
echo  IMPORTANT: Make sure backend\.env exists
echo  with your database credentials before starting.
echo.
echo  To start the full project, run:
echo      npm run dev
echo.
echo  NOTE: If you see "port 5000 already in use",
echo  run this to fix it:
echo      for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %%a
echo ========================================
pause

