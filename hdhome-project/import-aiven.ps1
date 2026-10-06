# ============================================
# Import HDHOME schema & seed vào Aiven MySQL
# Dùng: .\import-aiven.ps1 -DbHost "..." -DbPort "..." -DbPassword "..."
# ============================================

param(
    [Parameter(Mandatory=$true)] [string]$DbHost,
    [Parameter(Mandatory=$true)] [string]$DbPort,
    [Parameter(Mandatory=$true)] [string]$DbUser = "avnadmin",
    [Parameter(Mandatory=$true)] [string]$DbPassword,
    [string]$DbName = "defaultdb"
)

$ErrorActionPreference = "Stop"
$SchemaFile = "backend\database\schema.sql"
$SeedFile   = "backend\database\seed.sql"

Write-Host "===========================================`nHDHOME Aiven DB Import`n===========================================" -ForegroundColor Cyan
Write-Host "Host: $DbHost`nPort: $DbPort`nUser: $DbUser`nDB:   $DbName`n" -ForegroundColor Yellow

# Kiểm tra file tồn tại
if (-not (Test-Path $SchemaFile)) {
    Write-Host "Khong tim thay $SchemaFile" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $SeedFile)) {
    Write-Host "Khong tim thay $SeedFile" -ForegroundColor Red
    exit 1
}

# ========== Bước 1: Đọc schema.sql, bỏ CREATE DATABASE / USE, thay tên DB ==========
Write-Host "[1/3] Dang xu ly schema.sql..." -ForegroundColor Cyan
$schemaContent = Get-Content $SchemaFile -Raw -Encoding UTF8

# Bỏ lệnh CREATE DATABASE và USE
$schemaContent = $schemaContent -replace 'CREATE DATABASE IF NOT EXISTS hdhome_management\s+CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\s*', ''
$schemaContent = $schemaContent -replace 'USE hdhome_management;\s*', ''
# Thay mọi `hdhome_management` -> `defaultdb`
$schemaContent = $schemaContent -replace 'hdhome_management', $DbName

# Ghi tạm
$tmpSchema = [System.IO.Path]::GetTempFileName() + ".sql"
[System.IO.File]::WriteAllText($tmpSchema, $schemaContent, [System.Text.Encoding]::UTF8)
Write-Host "  OK -> $tmpSchema" -ForegroundColor Green

# ========== Bước 2: Đọc seed.sql, thay tên DB ==========
Write-Host "`n[2/3] Dang xu ly seed.sql..." -ForegroundColor Cyan
$seedContent = Get-Content $SeedFile -Raw -Encoding UTF8
$seedContent = $seedContent -replace 'USE\s+hdhome_management;', ''
$seedContent = $seedContent -replace '\bhdhome_management\b', $DbName
$tmpSeed = [System.IO.Path]::GetTempFileName() + ".sql"
[System.IO.File]::WriteAllText($tmpSeed, $seedContent, [System.Text.Encoding]::UTF8)
Write-Host "  OK -> $tmpSeed" -ForegroundColor Green

# ========== Bước 3: Kiểm tra mysql client ==========
Write-Host "`n[3/3] Dang import vao Aiven..." -ForegroundColor Cyan
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    Write-Host "`nKhong tim thay MySQL client trong PATH." -ForegroundColor Red
    Write-Host "Cai dat MySQL hoac dung MariaDB client." -ForegroundColor Yellow
    Write-Host "Hoac chay lenh sau thu cong:`n" -ForegroundColor Yellow
    $env:MYSQL_PWD = $DbPassword
    Write-Host "mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser --ssl-mode=REQUIRED < $tmpSchema" -ForegroundColor White
    Write-Host "mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser --ssl-mode=REQUIRED --database=$DbName < $tmpSeed`n" -ForegroundColor White
    exit 0
}

# Import schema
$env:MYSQL_PWD = $DbPassword
Write-Host "  Import schema..." -ForegroundColor Yellow
& mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser --ssl-mode=REQUIRED < $tmpSchema 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nLoi khi import schema!" -ForegroundColor Red
    exit 1
}

# Import seed
Write-Host "  Import seed..." -ForegroundColor Yellow
& mysql --default-character-set=utf8mb4 -h $DbHost -P $DbPort -u $DbUser --ssl-mode=REQUIRED --database=$DbName < $tmpSeed 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nLoi khi import seed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "HOAN THANH! Database da duoc import thanh cong." -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
