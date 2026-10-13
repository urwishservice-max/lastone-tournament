@echo off
:: ==============================================================================
:: LastZone Jenkins Restore Security Tool
:: ==============================================================================
title Jenkins Security Restoration

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Requesting Administrator permission...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

echo [1/3] Stopping Jenkins Service...
net stop Jenkins >nul 2>&1

echo [2/3] Restoring sign-in requirement...
powershell -NoProfile -Command "(Get-Content 'C:\ProgramData\Jenkins\.jenkins\config.xml') -replace '<useSecurity>false</useSecurity>', '<useSecurity>true</useSecurity>' | Set-Content 'C:\ProgramData\Jenkins\.jenkins\config.xml'"

echo [3/3] Starting Jenkins Service...
net start Jenkins

echo.
echo ==============================================================================
echo [SUCCESS] Jenkins security has been fully restored!
echo Sign-in is now required at http://localhost:8080.
echo ==============================================================================
echo.
pause
