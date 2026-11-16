param(
    [string]$BaseUrl = "https://localhost:7082",
    [int]$Iterations = 20
)

$ErrorActionPreference = "Stop"

# Allow self-signed development certificate in Windows PowerShell 5.1
add-type @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustAllCertsPolicy : ICertificatePolicy {
    public bool CheckValidationResult(
        ServicePoint srvPoint, X509Certificate certificate,
        WebRequest request, int certificateProblem) {
        return true;
    }
}
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls13

$endpoints = @(
    @{ Name = "GET /health/ready"; Path = "/health/ready" },
    @{ Name = "GET /api/v1/recipes (Page 1, 20 items)"; Path = "/api/v1/recipes?Page=1&PageSize=20" },
    @{ Name = "GET /api/v1/recipes?Q=trứng (Full-Text)"; Path = "/api/v1/recipes?Q=tr%E1%BB%A9ng&Page=1&PageSize=20" },
    @{ Name = "GET /api/v1/categories"; Path = "/api/v1/categories" },
    @{ Name = "GET /api/v1/ingredients"; Path = "/api/v1/ingredients" }
)

function Get-Percentile([double[]]$sorted, [double]$p) {
    if ($sorted.Count -eq 0) { return 0 }
    $idx = [int][Math]::Ceiling(($p / 100.0) * $sorted.Count) - 1
    if ($idx -lt 0) { $idx = 0 }
    if ($idx -ge $sorted.Count) { $idx = $sorted.Count - 1 }
    return [Math]::Round($sorted[$idx], 2)
}

$results = @()

foreach ($ep in $endpoints) {
    $url = "$($BaseUrl.TrimEnd('/'))$($ep.Path)"

    # 1. Cold / First request
    $swCold = [System.Diagnostics.Stopwatch]::StartNew()
    $coldStatus = 0
    try {
        $resp = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 15
        $coldStatus = [int]$resp.StatusCode
    } catch {
        $coldStatus = -1
    }
    $swCold.Stop()
    $coldMs = [Math]::Round($swCold.Elapsed.TotalMilliseconds, 2)

    # 2. Warm requests
    $latencies = [System.Collections.Generic.List[double]]::new()
    $errors = 0
    for ($i = 1; $i -le $Iterations; $i++) {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        try {
            $r = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 15
            $sw.Stop()
            if ([int]$r.StatusCode -ge 200 -and [int]$r.StatusCode -lt 300) {
                $latencies.Add($sw.Elapsed.TotalMilliseconds)
            } else {
                $errors++
            }
        } catch {
            $sw.Stop()
            $errors++
        }
    }

    $sorted = @($latencies | Sort-Object)
    $p50 = Get-Percentile $sorted 50
    $p95 = Get-Percentile $sorted 95
    $min = if ($sorted.Count -gt 0) { [Math]::Round($sorted[0], 2) } else { 0 }
    $max = if ($sorted.Count -gt 0) { [Math]::Round($sorted[$sorted.Count - 1], 2) } else { 0 }
    $avg = if ($sorted.Count -gt 0) { [Math]::Round((($sorted | Measure-Object -Average).Average), 2) } else { 0 }

    $results += [pscustomobject]@{
        Endpoint   = $ep.Name
        ColdMs     = $coldMs
        WarmMinMs  = $min
        WarmP50Ms  = $p50
        WarmP95Ms  = $p95
        WarmAvgMs  = $avg
        WarmMaxMs  = $max
        Iterations = $Iterations
        Errors     = $errors
    }
}

$results | Format-Table -AutoSize
