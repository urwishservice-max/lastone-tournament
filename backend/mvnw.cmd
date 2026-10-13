@echo off
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
) else (
    "%~dp0.mvn-bin\apache-maven-3.9.9\bin\mvn.cmd" %*
)
