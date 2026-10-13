# ==============================================================================
# LastZone Safe Shutdown Script (Preserves DB and Data)
# ==============================================================================
Write-Host "Gracefully stopping LastZone processes (Data preserved)..." -ForegroundColor Yellow

# Stop any running node dev servers
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Stop any java backend processes running lastzone-backend
Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*lastzone*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "[OK] Development services stopped safely. Database and logs are intact." -ForegroundColor Green
