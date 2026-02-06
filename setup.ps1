# Face Authentication System - Automated Setup Script
# Run this script with: .\setup.ps1

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Face Authentication System Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check MySQL
try {
    $mysqlVersion = mysql --version 2>&1
    Write-Host "✓ MySQL found: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL not found. Please install MySQL from https://dev.mysql.com/downloads/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All prerequisites satisfied!" -ForegroundColor Green
Write-Host ""

# Database setup
Write-Host "Step 1: Setting up database..." -ForegroundColor Yellow
Write-Host "Please enter your MySQL root password when prompted." -ForegroundColor Gray

$mysqlSetup = Read-Host "Do you want to run the database setup? (y/n)"
if ($mysqlSetup -eq 'y') {
    mysql -u root -p < schema.sql
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Database setup failed. Please run 'mysql -u root -p < schema.sql' manually" -ForegroundColor Red
    }
}

Write-Host ""

# Backend setup
Write-Host "Step 2: Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "(This may take 5-10 minutes, especially for dlib)" -ForegroundColor Gray

pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Python installation failed" -ForegroundColor Red
    Write-Host "Note: dlib requires Visual C++ Build Tools on Windows" -ForegroundColor Yellow
    Write-Host "Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/" -ForegroundColor Yellow
}

Write-Host ""

# Frontend setup
Write-Host "Step 3: Installing Node.js dependencies..." -ForegroundColor Yellow

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start Backend (Terminal 1):" -ForegroundColor White
Write-Host "   python app.py" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Frontend (Terminal 2):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""

$startNow = Read-Host "Do you want to start the backend now? (y/n)"
if ($startNow -eq 'y') {
    Write-Host ""
    Write-Host "Starting Flask backend..." -ForegroundColor Yellow
    Write-Host "Open a new terminal and run: npm run dev" -ForegroundColor Cyan
    Write-Host ""
    python app.py
}
