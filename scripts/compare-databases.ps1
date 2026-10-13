$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "1. Querying H2 Database via Local Backend (8081)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
$h2Data = Invoke-RestMethod -Uri "http://localhost:8081/api/leaderboard"
Write-Host "H2 Leaderboard Entries count: $($h2Data.Count)"
$h2Data | Format-Table rank, username, displayName, score, kills, wave, survivalDuration -AutoSize

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "2. Querying PostgreSQL Database via Docker (Port 80)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
$pgData = Invoke-RestMethod -Uri "http://localhost:80/api/leaderboard"
Write-Host "Postgres Leaderboard Entries count: $($pgData.Count)"
$pgData | Format-Table rank, username, displayName, score, kills, wave, survivalDuration -AutoSize

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "3. Directly querying PostgreSQL container via psql" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
docker exec lastzone-postgres psql -U lastzone_admin -d lastzone -c "SELECT id, username, email, display_name, created_at FROM users ORDER BY id;"
docker exec lastzone-postgres psql -U lastzone_admin -d lastzone -c "SELECT id, user_id, score, kills, wave, survival_duration, status FROM game_runs ORDER BY id;"
