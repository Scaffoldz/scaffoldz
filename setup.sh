#!/bin/bash
echo "========================================"
echo "      Scaffoldz Project Setup Script    "
echo "========================================"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js could not be found. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm could not be found. Please install npm."
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "✅ Node.js $NODE_VERSION and npm $NPM_VERSION are installed."
echo ""

# === FRONTEND (root) ===
echo "🔍 [1/2] Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo "   node_modules already exists. Checking for missing packages..."
    npm install --prefer-offline
else
    echo "   node_modules not found. Installing frontend dependencies..."
    echo "   (React, Vite, Tailwind CSS, React Router, etc.)"
    npm install
fi
echo "   ✅ Frontend: Done."
echo ""

# === BACKEND ===
echo "🔍 [2/2] Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   node_modules already exists. Checking for missing packages..."
    cd backend
    npm install --prefer-offline
    cd ..
else
    echo "   node_modules not found. Installing backend dependencies..."
    echo "   (Express, PostgreSQL, bcryptjs, JWT, nodemon, etc.)"
    cd backend
    npm install
    cd ..
fi
echo "   ✅ Backend: Done."

echo ""
echo "========================================"
echo "🎉 Setup complete! Everything is ready."
echo ""
echo "⚠️  IMPORTANT: Make sure backend/.env exists"
echo "    with your database credentials before starting."
echo ""
echo "▶️  To start the full project, run:"
echo "       npm run dev"
echo ""
echo "💡 NOTE: If you see 'port 5000 already in use',"
echo "         run: lsof -ti:5000 | xargs kill -9"
echo "========================================"
