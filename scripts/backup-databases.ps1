$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "E:\naveen\backend\data\backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$pgBackupFile = "$backupDir\lastzone_postgres_backup_$timestamp.sql"

Write-Host "Creating PostgreSQL backup: $pgBackupFile..." -ForegroundColor Cyan
docker exec lastzone-postgres pg_dump -U lastzone_admin -d lastzone -F p -f "/tmp/pg_backup_$timestamp.sql"
docker cp "lastzone-postgres:/tmp/pg_backup_$timestamp.sql" $pgBackupFile
docker exec lastzone-postgres rm -f "/tmp/pg_backup_$timestamp.sql"

$fileInfo = Get-Item $pgBackupFile
Write-Host "[SUCCESS] PostgreSQL backup created: $($fileInfo.Name) ($($fileInfo.Length) bytes)" -ForegroundColor Green

# Verify backup can be read and contains key tables and statements
$content = Get-Content $pgBackupFile -Raw
if ($content -match "CREATE TABLE public\.users" -and $content -match "CREATE TABLE public\.game_runs" -and $content -match "Chief117") {
    Write-Host "[VERIFIED] Backup file successfully read and validated: contains 'users', 'game_runs', and player 'Chief117'!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backup verification failed!" -ForegroundColor Red
    exit 1
}
