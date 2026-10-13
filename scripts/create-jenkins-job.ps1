$ErrorActionPreference = "Stop"

# Fetch crumb with cookies
curl.exe -s -c cookies.txt http://localhost:8080/crumbIssuer/api/json -o crumb.json
$crumbObj = Get-Content crumb.json | ConvertFrom-Json
$header = "$($crumbObj.crumbRequestField): $($crumbObj.crumb)"

Write-Host "Creating LastZone-Tournament pipeline job..." -ForegroundColor Cyan
curl.exe -s -i -b cookies.txt -H $header -H "Content-Type: application/xml" --data-binary "@E:\naveen\job-config.xml" "http://localhost:8080/createItem?name=LastZone-Tournament" -o create_res.txt

Get-Content create_res.txt | Select-Object -First 10

Remove-Item cookies.txt, crumb.json, create_res.txt -ErrorAction SilentlyContinue
