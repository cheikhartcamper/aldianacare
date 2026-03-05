# Aldiana Care - Deployment Script to VPS
# Usage: .\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aldiana Care - Deployment to VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$VPS_IP = "192.162.70.251"
$VPS_USER = "root"
$VPS_PATH = "/var/www/aldianacare"
$DIST_PATH = ".\dist"

# Step 1: Build the project
Write-Host "[1/4] Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Upload to VPS
Write-Host "[2/4] Uploading to VPS ($VPS_IP)..." -ForegroundColor Yellow
scp -r "$DIST_PATH\*" "${VPS_USER}@${VPS_IP}:${VPS_PATH}/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Upload successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Fix permissions on VPS
Write-Host "[3/4] Fixing permissions on VPS..." -ForegroundColor Yellow
ssh "${VPS_USER}@${VPS_IP}" @"
chown -R www-data:www-data ${VPS_PATH}
find ${VPS_PATH} -type d -exec chmod 755 {} \;
find ${VPS_PATH} -type f -exec chmod 644 {} \;
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "Permission fix failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Permissions fixed!" -ForegroundColor Green
Write-Host ""

# Step 4: Reload Nginx
Write-Host "[4/4] Reloading Nginx..." -ForegroundColor Yellow
ssh "${VPS_USER}@${VPS_IP}" "nginx -t && systemctl reload nginx"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Nginx reload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Nginx reloaded!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Visit: https://aldianacare.com" -ForegroundColor Cyan
Write-Host "Press Ctrl+F5 to force refresh" -ForegroundColor Yellow
