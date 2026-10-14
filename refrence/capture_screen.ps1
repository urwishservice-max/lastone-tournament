Add-Type -AssemblyName System.Windows.Forms, System.Drawing

$ss = "E:\naveen\refrence\screenshots"

function Capture($filename, $url, $wait = 5) {
    $edge = Start-Process "msedge" "-inprivate --window-size=1366,768 --window-position=0,0 $url" -PassThru
    Start-Sleep -Seconds $wait
    
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bmp = New-Object System.Drawing.Bitmap(1366, 768)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CopyFromScreen(0, 0, 0, 0, (New-Object System.Drawing.Size(1366, 768)))
    $bmp.Save("$ss\$filename")
    $g.Dispose()
    $bmp.Dispose()
    
    Stop-Process -Id $edge.Id -Force -ErrorAction SilentlyContinue
    Start-Sleep 1
    Write-Host "Captured: $filename ($([int]((Get-Item "$ss\$filename").Length/1024)) KB)"
}

Write-Host "Capturing YOUR LastZone app screenshots..."

Capture "your_01_home.png"         "http://localhost/"                                        8
Capture "your_07_jenkins_job.png"  "http://localhost:8080/job/LastZone-Tournament/"           5
Capture "your_08_build3.png"       "http://localhost:8080/job/LastZone-Tournament/3/"         5
Capture "your_09_console.png"      "http://localhost:8080/job/LastZone-Tournament/3/consoleFull" 6

Write-Host "Done! Files:"
Get-ChildItem $ss -Filter "your_*" | Select-Object Name, Length
