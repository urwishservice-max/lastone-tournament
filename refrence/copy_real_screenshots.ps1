$brain = "C:\Users\JAIDEV\.gemini\antigravity-ide\brain\27527b2d-9db2-49b6-a492-68814ad41e6a"
$ss = "E:\naveen\refrence\screenshots"

Copy-Item "$brain\home_landing_page_1791935677531.png" "$ss\your_01_home.png" -Force
Copy-Item "$brain\login_form_1791935692984.png" "$ss\your_02_login.png" -Force
Copy-Item "$brain\register_form_1791935714881.png" "$ss\your_03_register.png" -Force
Copy-Item "$brain\leaderboard_table_1791935727469.png" "$ss\your_04_leaderboard.png" -Force
Copy-Item "$brain\jenkins_job_page_1791935748288.png" "$ss\your_07_jenkins_job.png" -Force
Copy-Item "$brain\jenkins_build_3_1791935764375.png" "$ss\your_08_build3.png" -Force
Copy-Item "$brain\jenkins_console_log_1791935795198.png" "$ss\your_09_console.png" -Force
Copy-Item "$brain\api_leaderboard_1791935815989.png" "$ss\your_06_api.png" -Force

Write-Host "Copied all YOUR real screenshots:"
Get-ChildItem $ss -Filter "your_*" | Select-Object Name, Length
