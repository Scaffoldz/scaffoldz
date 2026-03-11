#!/bin/bash

echo "========================================"
echo "      Scaffoldz Project Setup Script    "
echo "========================================"

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js could not be found. Please install Node.js."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null
then
    echo "❌ npm could not be found. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed."
echo ""

# Array of directories containing a package.json (relative to root)
# The root itself (.) and the backend folder (backend)
DIRECTORIES=(`.` `backend`)

echo "📦 Installing dependencies across the project..."
echo ""

# Frontend (root)
if [ -f "package.json" ]; then
    echo "➡️ Installing frontend dependencies (React, Vite, Tailwind, etc.)..."
    npm install
else
    echo "⚠️ Frontend package.json not found."
fi

echo ""

# Backend
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo "➡️ Installing backend dependencies (Express, PostgreSQL, etc.)..."
    cd backend
    npm install
    cd ..
else
    echo "⚠️ Backend directory or package.json not found."
fi

echo ""
echo "🎉 Setup complete!"
echo "👉 To start the project, simply run: npm run dev"
echo "   (This uses concurrently to start both the Vite frontend and Node/Express backend)"
