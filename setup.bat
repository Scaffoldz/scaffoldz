@echo off
setlocal
echo ========================================
echo       Scaffoldz Project Setup Script    
echo ========================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js could not be found. Please install Node.js.
    exit /b 1
)

:: Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] npm could not be found. Please install npm.
    exit /b 1
)

echo [OK] Node.js and npm are installed.
echo.

echo Installing dependencies across the project...
echo.

:: Frontend (root directory)
if exist package.json (
    echo -- Installing frontend dependencies ^(React, Vite, Tailwind, etc.^)...
    call npm install
) else (
    echo [!] Frontend package.json not found.
)

echo.

:: Backend directory
if exist backend\package.json (
    echo -- Installing backend dependencies ^(Express, PostgreSQL, etc.^)...
    cd backend
    call npm install
    cd ..
) else (
    echo [!] Backend directory or package.json not found.
)

echo.
echo ========================================
echo Setup complete!
echo To start the project, simply run: npm run dev
echo (This starts both the frontend and backend servers)
echo ========================================
pause
