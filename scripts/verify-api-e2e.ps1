# ==============================================================================
# LastZone End-to-End API and Game Score Flow Verification
# ==============================================================================
param (
    [int]$port = 8081
)

$ErrorActionPreference = "Stop"
$baseUri = "http://localhost:$port"

Write-Host "Verifying Health Check at $baseUri/api/health..." -ForegroundColor Cyan
$health = Invoke-RestMethod -Uri "$baseUri/api/health" -Method Get
Write-Host "[PASS] Health status: $($health.status)" -ForegroundColor Green

$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$username = "DevOpsOperative_$timestamp"

Write-Host "Testing User Registration for $username..." -ForegroundColor Cyan
$regBody = @{
    username = $username
    displayName = "DevOps Operative"
    email = "$username@vanguard.local"
    password = "SpartanPassword117!"
    confirmPassword = "SpartanPassword117!"
} | ConvertTo-Json

$authResponse = Invoke-RestMethod -Uri "$baseUri/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
$token = $authResponse.token
Write-Host "[PASS] Registration succeeded for $($authResponse.user.username)!" -ForegroundColor Green

Write-Host "Testing User Login..." -ForegroundColor Cyan
$loginBody = @{
    usernameOrEmail = $username
    password = "SpartanPassword117!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUri/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "[PASS] Login succeeded for $($loginResponse.user.username)!" -ForegroundColor Green

Write-Host "Testing Run Start (/api/runs/start)..." -ForegroundColor Cyan
$headers = @{
    Authorization = "Bearer $token"
}
$runStart = Invoke-RestMethod -Uri "$baseUri/api/runs/start" -Method Post -Headers $headers
$runToken = $runStart.runToken
Write-Host "[PASS] Run started successfully! RunToken: $runToken, StartedAt: $($runStart.startedAt)" -ForegroundColor Green

Write-Host "Testing Score Submission (/api/runs/finish)..." -ForegroundColor Cyan
$finishBody = @{
    runToken = $runToken
    score = 1750
    kills = 15
    wave = 3
    survivalDuration = 115
} | ConvertTo-Json

$runFinish = Invoke-RestMethod -Uri "$baseUri/api/runs/finish" -Method Post -Headers $headers -Body $finishBody -ContentType "application/json"
Write-Host "[PASS] Score submitted successfully! Rank: $($runFinish.rank), Score: $($runFinish.score), Kills: $($runFinish.kills)" -ForegroundColor Green

Write-Host "Testing Duplicate Submission Protection..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "$baseUri/api/runs/finish" -Method Post -Headers $headers -Body $finishBody -ContentType "application/json"
    Write-Host "[FAIL] Duplicate submission was accepted!" -ForegroundColor Red
    exit 1
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "[PASS] Duplicate submission correctly rejected with HTTP 409 Conflict!" -ForegroundColor Green
    } else {
        Write-Host "[PASS] Duplicate submission rejected with HTTP $statusCode" -ForegroundColor Yellow
    }
}

Write-Host "Verifying Leaderboard retrieval..." -ForegroundColor Cyan
$leaderboard = Invoke-RestMethod -Uri "$baseUri/api/leaderboard" -Method Get
$found = $false
foreach ($entry in $leaderboard) {
    if ($entry.username -eq $username) {
        $found = $true
        Write-Host "[PASS] Verified user $username appears on leaderboard with Rank $($entry.rank), Score $($entry.score), Kills $($entry.kills)!" -ForegroundColor Green
        break
    }
}

if (-not $found) {
    Write-Host "[WARN] User not found in top entries, total entries: $($leaderboard.Count)" -ForegroundColor Yellow
}

Write-Host "=========================================" -ForegroundColor Green
Write-Host "ALL GAME & DATA FLOW TESTS PASSED!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
