$ErrorActionPreference = "Stop"

$build = Invoke-RestMethod -Uri "http://localhost:8080/job/LastZone-Tournament/3/api/json"
Write-Host "Build Number: $($build.number)" -ForegroundColor Cyan
Write-Host "Result: $($build.result)" -ForegroundColor Green
Write-Host "Duration: $([math]::Round($build.duration / 1000, 2)) seconds"
Write-Host "Timestamp: $([DateTimeOffset]::FromUnixTimeMilliseconds($build.timestamp).DateTime)"

try {
    $testReport = Invoke-RestMethod -Uri "http://localhost:8080/job/LastZone-Tournament/3/testReport/api/json"
    Write-Host "Tests Total: $($testReport.totalCount)" -ForegroundColor Green
    Write-Host "Tests Passed: $($testReport.passCount)" -ForegroundColor Green
    Write-Host "Tests Failed: $($testReport.failCount)"
    Write-Host "Tests Skipped: $($testReport.skipCount)"
} catch {
    Write-Host "Test report: $($_.Exception.Message)"
}
