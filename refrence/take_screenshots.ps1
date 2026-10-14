Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$ss_dir = "E:\naveen\refrence\screenshots"

function TakeScreenshot($filename, $url) {
    $ie = New-Object -ComObject InternetExplorer.Application
    $ie.Visible = $true
    $ie.Navigate($url)
    Start-Sleep -Seconds 5
    
    $width = 1366
    $height = 768
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen(0, 0, 0, 0, $bitmap.Size)
    $bitmap.Save("$ss_dir\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    $ie.Quit()
    Write-Host "Saved $filename"
}

# Use Chrome/Edge to take screenshots via PowerShell
function ScreenshotWithEdge($url, $filename, $waitSeconds = 5) {
    $outPath = "$ss_dir\$filename"
    
    # Start Edge, navigate, take screenshot
    Start-Process "msedge" "--headless --screenshot=$outPath --window-size=1366,768 $url"
    Start-Sleep -Seconds $waitSeconds
    
    if (Test-Path $outPath) {
        $size = (Get-Item $outPath).Length
        Write-Host "Saved: $filename ($size bytes)"
    } else {
        Write-Host "FAILED: $filename"
    }
}

Write-Host "Taking screenshots of LastZone at http://localhost..."

ScreenshotWithEdge "http://localhost/" "your_01_home.png" 8
ScreenshotWithEdge "http://localhost/#login" "your_02_home_nav.png" 5
ScreenshotWithEdge "http://localhost:8080/job/LastZone-Tournament/" "your_07_jenkins_job.png" 6
ScreenshotWithEdge "http://localhost:8080/job/LastZone-Tournament/3/" "your_08_jenkins_build3.png" 5
ScreenshotWithEdge "http://localhost:8080/job/LastZone-Tournament/3/consoleFull" "your_09_jenkins_console.png" 6

Write-Host "Done!"
Get-ChildItem $ss_dir -Filter "your_*" | Select-Object Name, Length
