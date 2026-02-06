#!/bin/bash

# Face Authentication System - Automated Setup Script (Linux/Mac)
# Run this script with: bash setup.sh

echo "================================="
echo "Face Authentication System Setup"
echo "================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✓ Python found: $PYTHON_VERSION"
else
    echo "✗ Python not found. Please install Python 3.8+"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js found: $NODE_VERSION"
else
    echo "✗ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version)
    echo "✓ MySQL found: $MYSQL_VERSION"
else
    echo "✗ MySQL not found. Please install MySQL"
    exit 1
fi

echo ""
echo "All prerequisites satisfied!"
echo ""

# Database setup
echo "Step 1: Setting up database..."
echo "Please enter your MySQL root password when prompted."

read -p "Do you want to run the database setup? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mysql -u root -p < schema.sql
    if [ $? -eq 0 ]; then
        echo "✓ Database created successfully"
    else
        echo "✗ Database setup failed. Please run 'mysql -u root -p < schema.sql' manually"
    fi
fi

echo ""

# Backend setup
echo "Step 2: Installing Python dependencies..."
echo "(This may take 5-10 minutes, especially for dlib)"

pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Python dependencies installed"
else
    echo "✗ Python installation failed"
    echo "Note: dlib may require build tools. On Ubuntu: sudo apt-get install build-essential cmake"
fi

echo ""

# Frontend setup
echo "Step 3: Installing Node.js dependencies..."

npm install

if [ $? -eq 0 ]; then
    echo "✓ Node.js dependencies installed"
else
    echo "✗ Node.js installation failed"
    exit 1
fi

echo ""
echo "================================="
echo "Setup Complete!"
echo "================================="
echo ""

echo "To start the application:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   python3 app.py"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""

read -p "Do you want to start the backend now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting Flask backend..."
    echo "Open a new terminal and run: npm run dev"
    echo ""
    python3 app.py
fi
