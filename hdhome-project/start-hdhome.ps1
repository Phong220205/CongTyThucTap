$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot

function Test-LocalPort([int]$port) {
  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $task = $client.ConnectAsync('127.0.0.1', $port)
    return $task.Wait(800) -and $client.Connected
  } catch {
    return $false
  } finally {
    $client.Dispose()
  }
}

$mariaDbExe = 'C:\xampp\mysql\bin\mysqld.exe'
$mariaDbConfig = Join-Path $projectRoot '.mariadb\data\my.ini'
$bundledNode = 'C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$systemNode = Get-Command node.exe -ErrorAction SilentlyContinue
$nodeExe = if ($systemNode) { $systemNode.Source } elseif (Test-Path $bundledNode) { $bundledNode } else { $null }

if (-not (Test-Path $mariaDbExe) -or -not (Test-Path $mariaDbConfig)) {
  throw 'MariaDB XAMPP or the HDHOME .mariadb data directory was not found.'
}
if (-not $nodeExe) {
  throw 'Node.js was not found. Install Node.js 20 or newer.'
}

if (-not (Test-LocalPort 3307)) {
  Start-Process -FilePath $mariaDbExe `
    -ArgumentList "--defaults-file=$mariaDbConfig", '--bind-address=127.0.0.1' `
    -WorkingDirectory (Join-Path $projectRoot '.mariadb') `
    -WindowStyle Hidden
}

for ($attempt = 0; $attempt -lt 10 -and -not (Test-LocalPort 3307); $attempt++) {
  Start-Sleep -Seconds 1
}
if (-not (Test-LocalPort 3307)) { throw 'MariaDB could not start on port 3307.' }

if (-not (Test-LocalPort 5000)) {
  Start-Process -FilePath $nodeExe `
    -ArgumentList (Join-Path $projectRoot 'backend\server.js') `
    -WorkingDirectory (Join-Path $projectRoot 'backend') `
    -WindowStyle Hidden
}

if (-not (Test-LocalPort 5173)) {
  $viteScript = Join-Path $projectRoot 'frontend\node_modules\vite\bin\vite.js'
  if (-not (Test-Path $viteScript)) { throw 'Frontend dependencies are missing. Run npm install in frontend.' }
  Start-Process -FilePath $nodeExe `
    -ArgumentList $viteScript, '--host', '0.0.0.0', '--port', '5173' `
    -WorkingDirectory (Join-Path $projectRoot 'frontend') `
    -WindowStyle Hidden
}

Write-Host 'HDHOME is ready:' -ForegroundColor Green
Write-Host '  Website : http://127.0.0.1:5173'
Write-Host '  Backend : http://127.0.0.1:5000/api'
Write-Host '  MariaDB : 127.0.0.1:3307'
