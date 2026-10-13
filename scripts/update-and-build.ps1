$ErrorActionPreference = "Stop"

curl.exe -s -c cookies.txt http://localhost:8080/crumbIssuer/api/json -o crumb.json
$crumbObj = Get-Content crumb.json | ConvertFrom-Json
$header = "$($crumbObj.crumbRequestField): $($crumbObj.crumb)"

Write-Host "Updating LastZone-Tournament configuration..." -ForegroundColor Cyan
curl.exe -s -i -b cookies.txt -H $header -H "Content-Type: application/xml" --data-binary "@E:\naveen\job-config.xml" "http://localhost:8080/job/LastZone-Tournament/config.xml" -o update_res.txt
Get-Content update_res.txt | Select-Object -First 3

Write-Host "Triggering Build #2..." -ForegroundColor Cyan
curl.exe -s -i -b cookies.txt -H $header -X POST "http://localhost:8080/job/LastZone-Tournament/build" -o build_res.txt
Get-Content build_res.txt | Select-Object -First 3

Remove-Item cookies.txt, crumb.json, update_res.txt, build_res.txt -ErrorAction SilentlyContinue
