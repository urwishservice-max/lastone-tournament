# ==============================================================================
# LastZone Automated Jenkins Recovery Script (Administrator)
# ==============================================================================
$ErrorActionPreference = "Stop"

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Requesting Administrator elevation for Jenkins recovery..." -ForegroundColor Yellow
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit 0
}

$configPath = "C:\ProgramData\Jenkins\.jenkins\config.xml"
$backupPath = "C:\ProgramData\Jenkins\.jenkins\config.xml.bak"

Write-Host "1. Stopping Jenkins service..." -ForegroundColor Cyan
Stop-Service -Name "Jenkins" -Force
Start-Sleep -Seconds 3

Write-Host "2. Creating configuration backup..." -ForegroundColor Cyan
Copy-Item -Path $configPath -Destination $backupPath -Force

Write-Host "3. Temporarily modifying security policy..." -ForegroundColor Cyan
(Get-Content -Path $configPath) -replace '<useSecurity>true</useSecurity>', '<useSecurity>false</useSecurity>' | Set-Content -Path $configPath -Force

Write-Host "4. Restarting Jenkins service in recovery mode..." -ForegroundColor Cyan
Start-Service -Name "Jenkins"
Start-Sleep -Seconds 6

Write-Host "Jenkins recovery configuration successfully applied!" -ForegroundColor Green
Write-Host "You can now access Jenkins at http://localhost:8080" -ForegroundColor Green
Start-Sleep -Seconds 3
