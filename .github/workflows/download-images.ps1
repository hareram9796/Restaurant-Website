$imgs = @(
  "gulab-jamun.jpg|https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80",
  "rasgulla.jpg|https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
  "kaju-katli.jpg|https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
  "ladoo.jpg|https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=500&q=80",
  "coconut-water.jpg|https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500&q=80",
  "phirni.jpg|https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80",
  "kulfi.jpg|https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80",
  "kheer.jpg|https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80",
  "halwa.jpg|https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80"
)
foreach ($entry in $imgs) {
  $parts = $entry.Split("|")
  $name = $parts[0]
  $url  = $parts[1]
  $dest = "images\$name"
  try {
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    $wc.DownloadFile($url, (Resolve-Path "rg-food").Path + "\$dest")
    Write-Host "OK: $name"
  } catch {
    Write-Host "FAIL: $name - $_"
  }
}
Write-Host "Done."
