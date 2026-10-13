$log = Get-Content 'C:\ProgramData\Jenkins\.jenkins\jobs\LastZone-Tournament\builds\2\log'
Write-Host "Total lines: $($log.Count)"

for ($i = 0; $i -lt $log.Count; $i++) {
    $line = $log[$i]
    if ($line -match "FAILURE|ERROR|failed|exception|not recognized" -and $line -notmatch "gzip|test") {
        Write-Host "Line $i : $line" -ForegroundColor Red
        $start = [Math]::Max(0, $i - 4)
        $end = [Math]::Min($log.Count - 1, $i + 4)
        for ($j = $start; $j -le $end; $j++) {
            Write-Host "   $j : $($log[$j])"
        }
        Write-Host "----------------------------------------------"
    }
}
