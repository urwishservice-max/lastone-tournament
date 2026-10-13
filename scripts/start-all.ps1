# ==============================================================================
# LastZone Launch Script (Windows Development Stack)
# ==============================================================================
Write-Host "Starting LastZone Stack..." -ForegroundColor Cyan

# 1. Start Backend if not already running
try {
    $null = Invoke-RestMethod -Uri "http://localhost:8081/api/health" -TimeoutSec 1
    Write-Host "[OK] Backend is already running on port 8081." -ForegroundColor Green
} catch {
    Write-Host "Launching Spring Boot backend on port 8081..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/../backend'; java -Dspring.profiles.active=local -Dserver.port=8081 -jar target/lastzone-backend-1.0.0.jar" -WindowStyle Minimized
    Start-Sleep -Seconds 10
}

# 2. Start Frontend if not already running
try {
    $null = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 1 -UseBasicParsing
    Write-Host "[OK] Frontend is already running on port 5173." -ForegroundColor Green
} catch {
    Write-Host "Launching Vite dev server on port 5173..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/..'; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 5
}

# 3. Health Check
powershell -File "$PSScriptRoot/health-check.ps1"
