# ==============================================================================
# Non-blocking Database Backup Script
# ==============================================================================
$ErrorActionPreference = "Stop"

$src = "E:\naveen\backend\data\lastzonedb.mv.db"
$backupDir = "E:\naveen\backend\data\backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dst = Join-Path $backupDir "lastzonedb_backup_$timestamp.mv.db"

Write-Host "Backing up database from $src to $dst..." -ForegroundColor Cyan

$inStream = [System.IO.File]::Open($src, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$outStream = [System.IO.File]::Create($dst)
$inStream.CopyTo($outStream)
$inStream.Close()
$outStream.Close()

Write-Host "Database backup created successfully: $dst ($( (Get-Item $dst).Length ) bytes)" -ForegroundColor Green
Get-ChildItem $backupDir | Format-Table Name, Length, LastWriteTime
