# Hiring and Assessment Platform - Start Frontend
# Run this script to start the React development server

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Hiring Platform Frontend" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting React development server..." -ForegroundColor Green
Write-Host "Frontend will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Change to frontend directory and start Vite dev server
Set-Location frontend
npm run dev
