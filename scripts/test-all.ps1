# ==============================================================================
# LastZone Full Test Suite Runner
# ==============================================================================
Write-Host "Running Backend Integration Tests..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot/../backend"
& ".\mvnw.cmd" test
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Backend tests failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "[OK] All backend integration tests passed!" -ForegroundColor Green

Write-Host "Building Frontend Production Bundle..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot/.."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Frontend build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "[OK] Frontend build completed successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "All tests and builds passed successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
