$log = (Invoke-RestMethod -Uri "http://localhost:8080/job/LastZone-Tournament/3/consoleText") -split "`r?`n"
Write-Host "Total log lines: $($log.Count)" -ForegroundColor Cyan
Write-Host "`n--- Pipeline Stages Executed ---" -ForegroundColor Yellow
$log | Where-Object { $_ -match "\[Pipeline\] \{ \(" } | ForEach-Object { Write-Host $_ }
Write-Host "`n--- Stage Highlights & Tests ---" -ForegroundColor Yellow
$log | Where-Object { $_ -match "(Tests run:|BUILD SUCCESS|Healthcheck passed|Successfully built|Started container|Finished:)" } | ForEach-Object { Write-Host $_ }
