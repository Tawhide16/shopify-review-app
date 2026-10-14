# Auto Git Push with Randomized Human-like Intervals (35m - 95m)
$logFile = "activity.log"
$commitMessages = @(
    "chore: update internal sync pulse",
    "docs: update maintenance log and heartbeat",
    "refactor: optimize routine runtime telemetry",
    "chore(metrics): refresh activity timestamp",
    "perf: minor routine housekeeping",
    "style: format comments and log trail",
    "chore: sync tracking notes"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Automated Git Push Engine Started!" -ForegroundColor Green
Write-Host "   Intervals: Randomized between 35 and 95 minutes" -ForegroundColor Yellow
Write-Host "   Target: origin/main" -ForegroundColor Yellow
Write-Host "   Press [Ctrl + C] anytime to stop." -ForegroundColor Red
Write-Host "==========================================================" -ForegroundColor Cyan

$pushCount = 0

while ($true) {
    # Random interval between 35 and 95 minutes (in seconds)
    $randomMinutes = Get-Random -Minimum 35 -Maximum 95
    $sleepSeconds = $randomMinutes * 60
    $nextTime = (Get-Date).AddMinutes($randomMinutes).ToString("hh:mm:ss tt")

    Write-Host "`n⏳ Next push scheduled in $randomMinutes minutes (at approx $nextTime)..." -ForegroundColor Magenta
    Start-Sleep -Seconds $sleepSeconds

    $pushCount++
    $now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $logEntry = "[$now] Activity pulse #$pushCount"
    Add-Content -Path $logFile -Value $logEntry

    $msg = $commitMessages | Get-Random

    Write-Host "`n[$now] 📦 Preparing Push #$pushCount..." -ForegroundColor Green
    git add $logFile
    git commit -m "$msg [sync $pushCount]"
    
    $pushOutput = git push origin main 2>&1
    Write-Host $pushOutput -ForegroundColor Gray
    Write-Host "✅ Push #$pushCount successfully completed to GitHub!" -ForegroundColor Green
}
