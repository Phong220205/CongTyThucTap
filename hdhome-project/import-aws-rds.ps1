# ============================================
# Import HDHOME schema & seed vào AWS RDS MySQL
# Dùng: .\import-aws-rds.ps1 -DbHost "..." -DbPort 3306 -DbPassword "..."
# ============================================

param(
    [Parameter(Mandatory=$true)] [string]$DbHost,
    [string]$DbPort = "3306",
    [Parameter(Mandatory=$true)] [string]$DbUser = "admin",
    [Parameter(Mandatory=$true)] [string]$DbPassword,
    [string]$DbName = "hdhome"
)

$ErrorActionPreference = "Stop"
$SchemaFile = "backend\database\schema.sql"
$SeedFile   = "backend\database\seed.sql"

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "HDHOME AWS RDS Import" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Host: $DbHost" -ForegroundColor Yellow
Write-Host "Port: $DbPort" -ForegroundColor Yellow
Write-Host "User: $DbUser" -ForegroundColor Yellow
Write-Host "DB:   $DbName" -ForegroundColor Yellow
Write-Host ""

# Kiểm tra file
if (-not (Test-Path $SchemaFile)) { Write-Host "Khong tim thay $SchemaFile" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $SeedFile))   { Write-Host "Khong tim thay $SeedFile"   -ForegroundColor Red; exit 1 }

# ========== Bước 1: Tạo database ==========
Write-Host "[1/4] Tao database `$DbName`..." -ForegroundColor Cyan
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) { Write-Host "Khong co MySQL client. Cai dat truoc." -ForegroundColor Red; exit 1 }

$env:MYSQL_PWD = $DbPassword
& mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser -e "CREATE DATABASE IF NOT EXISTS `$DbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "Loi khi tao database." -ForegroundColor Red; exit 1 }
Write-Host "  OK" -ForegroundColor Green

# ========== Bước 2: Chuẩn bị schema (bỏ CREATE DATABASE, USE) ==========
Write-Host "`n[2/4] Xu ly schema.sql..." -ForegroundColor Cyan
$schemaContent = Get-Content $SchemaFile -Raw -Encoding UTF8
$schemaContent = $schemaContent -replace '(?is)CREATE\s+DATABASE[^;]*;\s*', ''
$schemaContent = $schemaContent -replace '(?i)USE\s+\w+;', ''
$tmpSchema = [System.IO.Path]::GetTempFileName() + ".sql"
[System.IO.File]::WriteAllText($tmpSchema, $schemaContent, [System.Text.Encoding]::UTF8)
Write-Host "  OK" -ForegroundColor Green

# ========== Bước 3: Chuẩn bị seed ==========
Write-Host "`n[3/4] Xu ly seed.sql..." -ForegroundColor Cyan
$seedContent = Get-Content $SeedFile -Raw -Encoding UTF8
$seedContent = $seedContent -replace '(?i)USE\s+\w+;', ''
$tmpSeed = [System.IO.Path]::GetTempFileName() + ".sql"
[System.IO.File]::WriteAllText($tmpSeed, $seedContent, [System.Text.Encoding]::UTF8)
Write-Host "  OK" -ForegroundColor Green

# ========== Bước 4: Import ==========
Write-Host "`n[4/4] Import..." -ForegroundColor Cyan
Write-Host "  Import schema..." -ForegroundColor Yellow
& mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser < $tmpSchema 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "Loi khi import schema!" -ForegroundColor Red; exit 1 }
Write-Host "  OK" -ForegroundColor Green

Write-Host "  Import seed..." -ForegroundColor Yellow
& mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser --database=$DbName < $tmpSeed 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "Loi khi import seed!" -ForegroundColor Red; exit 1 }
Write-Host "  OK" -ForegroundColor Green

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "HOAN THANH! Database da duoc import thanh cong." -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Update env trong Render backend:" -ForegroundColor Yellow
Write-Host "  DB_HOST     = $DbHost" -ForegroundColor White
Write-Host "  DB_PORT     = $DbPort" -ForegroundColor White
Write-Host "  DB_USER     = $DbUser" -ForegroundColor White
Write-Host "  DB_PASSWORD = $DbPassword" -ForegroundColor White
Write-Host "  DB_NAME     = $DbName" -ForegroundColor White
Write-Host "  DB_SSL      = false" -ForegroundColor White
