$ErrorActionPreference = 'Continue'
$creds = @(
  @{ u='admin'; p='Admin@123' },
  @{ u='projectmanager'; p='Manager@123' },
  @{ u='technical'; p='Technical@123' }
)
foreach ($c in $creds) {
  $body = @{username=$c.u;password=$c.p} | ConvertTo-Json
  try {
    $r = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    Write-Host "$($c.u): $($r.StatusCode) - role=$($j.data.user.role_name) token=$($j.data.token.Substring(0,30))..."
  } catch {
    Write-Host "$($c.u): FAIL - $($_.Exception.Message)"
  }
}