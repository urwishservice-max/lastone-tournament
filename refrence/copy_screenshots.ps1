$brain = "C:\Users\JAIDEV\.gemini\antigravity-ide\brain\27527b2d-9db2-49b6-a492-68814ad41e6a"
$ss = "E:\naveen\refrence\screenshots"

Copy-Item "$brain\home_landing_page_1791934619484.png" "$ss\01_home_page.png" -Force
Copy-Item "$brain\login_form_1791934631529.png" "$ss\02_login_form.png" -Force
Copy-Item "$brain\register_form_1791934646247.png" "$ss\03_register_form.png" -Force
Copy-Item "$brain\api_leaderboard_1791934659560.png" "$ss\04_api_leaderboard.png" -Force
Copy-Item "$brain\leaderboard_table_1791934681259.png" "$ss\05_leaderboard_ui.png" -Force
Copy-Item "$brain\game_play_section_1791934711694.png" "$ss\06_game_play.png" -Force
Copy-Item "$brain\jenkins_job_page_1791934728610.png" "$ss\07_jenkins_job.png" -Force
Copy-Item "$brain\jenkins_build_3_1791934740585.png" "$ss\08_jenkins_build3.png" -Force
Copy-Item "$brain\jenkins_console_log_1791934770131.png" "$ss\09_jenkins_console.png" -Force

Get-ChildItem $ss | Select-Object Name, Length
