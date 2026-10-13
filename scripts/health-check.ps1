# ==============================================================================
# LastZone Health Check Script
# ==============================================================================
$ErrorActionPreference = "SilentlyContinue"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       LASTZONE SYSTEM HEALTH AUDIT       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check Backend on port 8081
$backendUrl = "http://localhost:8081/api/health"
try {
    $backendRes = Invoke-RestMethod -Uri $backendUrl -TimeoutSec 3 -Method Get
    if ($backendRes.status -eq "UP") {
        Write-Host "[OK] Backend API is ONLINE (Port 8081): $($backendRes.service)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Backend responded but status is: $($backendRes.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAIL] Backend API is OFFLINE at $backendUrl" -ForegroundColor Red
}

# 2. Check Frontend on port 5173
$frontendUrl = "http://localhost:5173"
try {
    $frontRes = Invoke-WebRequest -Uri $frontendUrl -TimeoutSec 3 -UseBasicParsing
    if ($frontRes.StatusCode -eq 200) {
        Write-Host "[OK] Frontend (Vite) is ONLINE at $frontendUrl (Status 200)" -ForegroundColor Green
    }
} catch {
    Write-Host "[FAIL] Frontend is OFFLINE at $frontendUrl" -ForegroundColor Red
}

# 3. Check Vite /api proxy
$proxyUrl = "http://localhost:5173/api/health"
try {
    $proxyRes = Invoke-RestMethod -Uri $proxyUrl -TimeoutSec 3 -Method Get
    if ($proxyRes.status -eq "UP") {
        Write-Host "[OK] Frontend API Proxy (/api/health) is WORKING" -ForegroundColor Green
    }
} catch {
    Write-Host "[FAIL] Frontend API Proxy FAILED at $proxyUrl" -ForegroundColor Red
}

# 4. Check Jenkins CI on port 8080
$jenkinsUrl = "http://localhost:8080/login"
try {
    $jenkinsRes = Invoke-WebRequest -Uri $jenkinsUrl -TimeoutSec 3 -UseBasicParsing
    if ($jenkinsRes.StatusCode -eq 200) {
        Write-Host "[OK] Jenkins CI Server is ONLINE at http://localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "[WARN] Jenkins CI is OFFLINE or unreachable on port 8080" -ForegroundColor Yellow
}

# 5. Check Ngrok Tunnel
try {
    $ngrokRes = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -TimeoutSec 3
    if ($ngrokRes.tunnels.Count -gt 0) {
        $publicUrl = $ngrokRes.tunnels[0].public_url
        Write-Host "[OK] Ngrok Public HTTPS Tunnel is ACTIVE: $publicUrl" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Ngrok is running but no active tunnels found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[INFO] Ngrok dashboard not running on http://localhost:4040" -ForegroundColor DarkGray
}

Write-Host "=========================================" -ForegroundColor Cyan
