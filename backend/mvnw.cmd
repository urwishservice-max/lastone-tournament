@echo off
setlocal

:: 1. Check if mvn is directly in PATH
where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

:: 2. Check system installation at C:\ProgramData\maven
if exist "C:\ProgramData\maven\bin\mvn.cmd" (
    call "C:\ProgramData\maven\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

:: 3. Check workspace relative .mvn-bin
if exist "%~dp0.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%~dp0.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

:: 4. Check machine local repository location
if exist "E:\naveen\backend\.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" (
    call "E:\naveen\backend\.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

:: 5. Check common installation directories
if exist "C:\apache-maven\bin\mvn.cmd" (
    call "C:\apache-maven\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

:: 6. Fallback: Automatically download or bootstrap Maven via PowerShell
echo [mvnw] Downloading portable Apache Maven 3.9.9...
powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip' -OutFile '%~dp0maven.zip'; Expand-Archive '%~dp0maven.zip' -DestinationPath '%~dp0.mvn-bin' -Force; Remove-Item '%~dp0maven.zip'"
if exist "%~dp0.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%~dp0.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Apache Maven was not found on this system.
exit /b 1
