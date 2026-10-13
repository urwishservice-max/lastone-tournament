@echo off
:: ==============================================================================
:: LastZone Jenkins Auto-Recovery Tool
:: ==============================================================================
title Jenkins Access Recovery

:: Check for administrative privileges using openfiles
openfiles >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Requesting Administrator permission...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo.
echo ==============================================================================
echo [1/4] Stopping Jenkins Service...
net stop Jenkins

echo [2/4] Backing up config.xml...
copy /y "C:\ProgramData\Jenkins\.jenkins\config.xml" "C:\ProgramData\Jenkins\.jenkins\config.xml.bak"

echo [3/4] Modifying config.xml (useSecurity = false)...
powershell -NoProfile -Command "(Get-Content -Path 'C:\ProgramData\Jenkins\.jenkins\config.xml') -replace '<useSecurity>true</useSecurity>', '<useSecurity>false</useSecurity>' | Set-Content -Path 'C:\ProgramData\Jenkins\.jenkins\config.xml' -Force"

echo [4/4] Starting Jenkins Service...
net start Jenkins

echo.
echo ==============================================================================
echo [SUCCESS] Jenkins has been unlocked!
echo.
echo 1. Open your browser: http://localhost:8080
echo 2. Press F5 (Refresh)
echo 3. You are now inside Jenkins without any password!
echo ==============================================================================
echo.
pause
