$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
$dest = (Get-Location).Path + "\images\rasgulla.jpg"
# Unsplash photo of white round sweets in bowl - closest match
$url = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=85"
try {
  $wc.DownloadFile($url, $dest)
  Write-Host "OK: $([math]::Round((Get-Item $dest).Length/1KB,1)) KB"
} catch {
  Write-Host "FAIL: $_"
}
