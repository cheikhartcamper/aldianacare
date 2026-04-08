# Génère public/og-image.png depuis public/og-image.html via Edge headless
# Usage: .\scripts\generate-og-image.ps1

$projectRoot = Split-Path $PSScriptRoot -Parent
$htmlFile    = Join-Path $projectRoot "public\og-image.html"
$outputFile  = Join-Path $projectRoot "public\og-image.png"
$htmlUrl     = "file:///" + $htmlFile.Replace('\', '/')

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Génération OG Image — Aldiana Care" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Chercher Edge
$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$edgePath = $edgePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edgePath) {
    Write-Host "ERREUR: Microsoft Edge introuvable." -ForegroundColor Red
    Write-Host "Ouvre public/og-image.html dans ton navigateur et fais une capture 1200x630." -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/2] Edge trouvé : $edgePath" -ForegroundColor Green
Write-Host "[2/2] Capture en cours (1200x630)..." -ForegroundColor Yellow

# Supprimer ancien fichier si présent
if (Test-Path $outputFile) { Remove-Item $outputFile -Force }

# Lancer Edge headless
& $edgePath `
    --headless=new `
    --disable-gpu `
    --no-sandbox `
    --screenshot="$outputFile" `
    --window-size=1200,630 `
    --hide-scrollbars `
    "$htmlUrl" 2>$null

Start-Sleep -Seconds 3

if (Test-Path $outputFile) {
    $size = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)
    Write-Host ""
    Write-Host "  OG image générée avec succès !" -ForegroundColor Green
    Write-Host "  Fichier : public/og-image.png ($size KB)" -ForegroundColor White
    Write-Host ""
    Write-Host "  Lance ensuite : .\deploy.ps1" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERREUR: Le fichier n'a pas été créé." -ForegroundColor Red
    Write-Host "Essaie d'ouvrir manuellement public/og-image.html dans Edge" -ForegroundColor Yellow
    Write-Host "et fais Ctrl+Maj+P > 'Capture screenshot' (1200x630)." -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
