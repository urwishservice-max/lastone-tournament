@echo off
:: ==============================================================================
:: LastZone Jenkins Auto-Recovery Tool
:: ==============================================================================
title Jenkins Access Recovery

:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Requesting Administrator permission...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

echo [1/4] Stopping Jenkins Service...
net stop Jenkins >nul 2>&1

echo [2/4] Backing up Jenkins configuration...
if exist "C:\ProgramData\Jenkins\.jenkins\config.xml" (
    copy /y "C:\ProgramData\Jenkins\.jenkins\config.xml" "C:\ProgramData\Jenkins\.jenkins\config.xml.bak" >nul
)

echo [3/4] Temporarily disabling sign-in requirement...
powershell -NoProfile -Command "(Get-Content 'C:\ProgramData\Jenkins\.jenkins\config.xml') -replace '<useSecurity>true</useSecurity>', '<useSecurity>false</useSecurity>' | Set-Content 'C:\ProgramData\Jenkins\.jenkins\config.xml'"

echo [4/4] Starting Jenkins Service...
net start Jenkins

echo.
echo ==============================================================================
echo [SUCCESS] Jenkins is now unlocked!
echo.
echo 1. Return to your browser tab at: http://localhost:8080
echo 2. Press F5 (Refresh).
echo 3. You will enter Jenkins immediately without any username or password!
echo ==============================================================================
echo.
pause
