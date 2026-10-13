$ErrorActionPreference = "Stop"

curl.exe -s -c cookies.txt http://localhost:8080/crumbIssuer/api/json -o crumb.json
$crumbObj = Get-Content crumb.json | ConvertFrom-Json
$header = "$($crumbObj.crumbRequestField): $($crumbObj.crumb)"

Write-Host "Triggering LastZone-Tournament pipeline build with parameters..." -ForegroundColor Cyan
curl.exe -s -i -b cookies.txt -H $header -X POST "http://localhost:8080/job/LastZone-Tournament/buildWithParameters?DEPLOY_FLEET=true" -o build_res.txt

Get-Content build_res.txt | Select-Object -First 10
Remove-Item cookies.txt, crumb.json, build_res.txt -ErrorAction SilentlyContinue
