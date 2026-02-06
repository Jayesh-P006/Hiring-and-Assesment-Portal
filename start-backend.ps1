# Face Authentication System - Start Backend
# Run this script to start the Flask server with Python 3.11 virtual environment

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Face Authentication Backend" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Activate virtual environment
Write-Host "Activating Python 3.11 virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Check if MySQL is running
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
$mysqlRunning = Get-Process mysqld -ErrorAction SilentlyContinue
if ($mysqlRunning) {
    Write-Host "✓ MySQL is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL might not be running. Please start MySQL server." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting Flask server..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start Flask app from backend folder
python backend/app.py
