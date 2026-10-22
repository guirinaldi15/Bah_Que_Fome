
$ErrorActionPreference = 'Stop'

$dir = Join-Path $PSScriptRoot 'assets\images'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$photos = [ordered]@{
  'pizza-margherita.jpg' = 'photo-1598023696416-0193a0bcd302'
  'pizza-funghi.jpg' = 'photo-1565299624946-b28f40a0ae38'
  'pizza-calabresa.jpg' = 'photo-1574071318508-1cdbab80d002'
  'carbonara.jpg' = 'photo-1612874742237-6526221588e3'
  'fettuccine.jpg' = 'photo-1555949258-eb67b1ef0ceb'
  'bruschetta.jpg' = 'photo-1506280754576-f6fa8a873550'
  'tiramisu.jpg' = 'photo-1571877227200-a0d98ea607e9'
  'chopp-pilsen.jpg' = 'photo-1608270586620-248524c67de9'
  'chopp-ipa.jpg' = 'photo-1436076863939-06870fe779c2'
  'chopp-weiss.jpg' = 'photo-1559526324-593bc073d938'
  'caipirinha.jpg' = 'photo-1544145945-f90425340c7e'
  'batata.jpg' = 'photo-1630431341973-02e1b662ec35'
  'polenta.jpg' = 'photo-1565299585323-38d6b0865b47'
}

foreach ($item in $photos.GetEnumerator()) {
  $dest = Join-Path $dir $item.Key
  $url = "https://images.unsplash.com/$($item.Value)?w=640&q=80&fit=crop"

  Write-Host "Baixando $($item.Key)..."
  Invoke-WebRequest -Uri $url -OutFile $dest
}

Write-Host 'Fotos baixadas em assets\images!' -ForegroundColor Green
