# ==============================================================================
# LastZone Restore Jenkins Security Script (Administrator)
# ==============================================================================
$ErrorActionPreference = "Stop"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Requesting Administrator elevation to restore Jenkins security..." -ForegroundColor Yellow
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit 0
}

$configPath = "C:\ProgramData\Jenkins\.jenkins\config.xml"

Write-Host "1. Stopping Jenkins service..." -ForegroundColor Cyan
Stop-Service -Name "Jenkins" -Force
Start-Sleep -Seconds 3

Write-Host "2. Restoring useSecurity to true..." -ForegroundColor Cyan
(Get-Content -Path $configPath) -replace '<useSecurity>false</useSecurity>', '<useSecurity>true</useSecurity>' | Set-Content -Path $configPath -Force

Write-Host "3. Restarting Jenkins service with full security..." -ForegroundColor Cyan
Start-Service -Name "Jenkins"
Start-Sleep -Seconds 6

Write-Host "Jenkins security has been fully restored!" -ForegroundColor Green
Write-Host "Authentication is required at http://localhost:8080" -ForegroundColor Green
Start-Sleep -Seconds 3
