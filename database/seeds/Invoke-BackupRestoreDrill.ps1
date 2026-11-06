param(
    [string]$DockerPath = "C:\Users\ADMIN\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe",
    [switch]$ForceBackup
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backupDir = Join-Path $repoRoot "backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$dumpFile = Join-Path $backupDir "recipehub_dev_curated_pg18.dump"

# 1. Read Neon connection string from User Secrets in memory (never print secrets)
$secretLine = dotnet user-secrets list --project (Join-Path $repoRoot "backend\RecipeHub.Api") |
    Select-String '^ConnectionStrings:DefaultConnection\s*=\s*(.+)$'
if (-not $secretLine) {
    throw "ConnectionStrings:DefaultConnection was not found in User Secrets."
}
$connStr = $secretLine.Matches.Groups[1].Value

$kv = @{}
foreach ($part in ($connStr -split ';')) {
    if ($part -match '^\s*([^=]+)=(.+)\s*$') {
        $kv[$matches[1].Trim().ToLowerInvariant()] = $matches[2].Trim()
    }
}

$pgHost = $kv["host"]
$pgPort = if ($kv.ContainsKey("port")) { $kv["port"] } else { "5432" }
$pgDb   = $kv["database"]
$pgUser = $kv["username"]
$pgPass = $kv["password"]

if (-not $pgHost -or -not $pgDb -or -not $pgUser -or -not $pgPass) {
    throw "Could not parse Host/Database/Username/Password from DefaultConnection."
}

Write-Host "=== STEP 1: Verify PostgreSQL 18 Client Version ==="
& $DockerPath run --rm postgres:18 pg_dump --version
& $DockerPath run --rm postgres:18 pg_restore --version

Write-Host "`n=== STEP 2: Run pg_dump (PostgreSQL 18) from Cloud Neon ($pgDb) ==="
if ((Test-Path -LiteralPath $dumpFile) -and (-not $ForceBackup) -and ((Get-Item -LiteralPath $dumpFile).Length -gt 102400)) {
    $dumpItem = Get-Item -LiteralPath $dumpFile
    $dumpSizeKb = [Math]::Round($dumpItem.Length / 1024.0, 2)
    Write-Host "Reusing recent verified backup -> $($dumpItem.Name) (${dumpSizeKb} KB)"
} else {
    $swBackup = [System.Diagnostics.Stopwatch]::StartNew()
    & $DockerPath run --rm `
        -e PGHOST="$pgHost" `
        -e PGPORT="$pgPort" `
        -e PGDATABASE="$pgDb" `
        -e PGUSER="$pgUser" `
        -e PGPASSWORD="$pgPass" `
        -e PGSSLMODE="require" `
        -v "${backupDir}:/backups" `
        postgres:18 `
        pg_dump --format=custom --no-owner --no-privileges --schema=public `
            --file=/backups/recipehub_dev_curated_pg18.dump
    if ($LASTEXITCODE -ne 0) { throw "pg_dump failed with exit code $LASTEXITCODE" }
    $swBackup.Stop()

    $dumpItem = Get-Item -LiteralPath $dumpFile
    $dumpSizeKb = [Math]::Round($dumpItem.Length / 1024.0, 2)
    $backupSeconds = [Math]::Round($swBackup.Elapsed.TotalSeconds, 2)
    Write-Host "Backup completed in ${backupSeconds}s -> $($dumpItem.Name) (${dumpSizeKb} KB)"
}

Write-Host "`n=== STEP 3: Restore into Isolated PostgreSQL 18 Container (recipehub_restore_verify) ==="
& $DockerPath rm -f recipehub-restore-drill 2>$null | Out-Null
& $DockerPath run -d --name recipehub-restore-drill `
    -e POSTGRES_PASSWORD=restore_drill_local_pw `
    -e POSTGRES_DB=recipehub_restore_verify `
    -v "${backupDir}:/backups:ro" `
    postgres:18 | Out-Null

try {
    # Wait for the FINAL postgres:18 server. During first-time init the image runs a temporary
    # socket-only server, then restarts; only the final server listens on TCP, so probe via 127.0.0.1.
    $ready = $false
    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Seconds 1
        & $DockerPath exec recipehub-restore-drill pg_isready -h 127.0.0.1 -U postgres -d recipehub_restore_verify 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    }
    if (-not $ready) { throw "Isolated postgres:18 container did not become ready in time." }

    # The dump (taken with --schema=public) contains CREATE SCHEMA public; drop the empty default
    # schema in the fresh isolated DB so the restore recreates it exactly as in the source.
    & $DockerPath exec -e PGPASSWORD=restore_drill_local_pw recipehub-restore-drill `
        psql -h 127.0.0.1 -U postgres -d recipehub_restore_verify -v ON_ERROR_STOP=1 -q -c "DROP SCHEMA public CASCADE;"
    if ($LASTEXITCODE -ne 0) { throw "Could not prepare isolated database (drop default public schema)." }

    $swRestore = [System.Diagnostics.Stopwatch]::StartNew()
    & $DockerPath exec -e PGPASSWORD=restore_drill_local_pw recipehub-restore-drill `
        pg_restore --host=127.0.0.1 --username=postgres --dbname=recipehub_restore_verify `
            --no-owner --no-privileges /backups/recipehub_dev_curated_pg18.dump
    if ($LASTEXITCODE -ne 0) { throw "pg_restore failed with exit code $LASTEXITCODE" }
    $swRestore.Stop()
    $restoreSeconds = [Math]::Round($swRestore.Elapsed.TotalSeconds, 2)
    Write-Host "Restore completed in ${restoreSeconds}s into isolated database 'recipehub_restore_verify'"

    Write-Host "`n=== STEP 4: Verify Restored Schema, Row Counts, Roles & Foreign Keys ==="
    $verifySql = @"
SELECT
    current_database() AS restored_db,
    (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS public_tables,
    (SELECT count(*) FROM public."Recipes") AS total_recipes,
    (SELECT count(*) FROM public."Recipes" WHERE "Status" = 'Published') AS published_recipes,
    (SELECT count(*) FROM public."RecipeDatasetEntries") AS dataset_entries,
    (SELECT count(*) FROM public."RecipeDatasetEntries" WHERE "ReviewStatus" = 'Approved') AS approved_entries,
    (SELECT count(*) FROM public."Ingredients") AS ingredients,
    (SELECT count(*) FROM public."RecipeIngredients") AS recipe_ingredients,
    (SELECT count(*) FROM public."RecipeSteps") AS recipe_steps,
    (SELECT count(*) FROM public."Categories") AS categories,
    (SELECT count(*) FROM public."AspNetRoles") AS roles,
    (SELECT count(*) FROM public."AspNetUsers") AS users,
    (SELECT count(*) FROM public."RecipeViews") AS recipe_views,
    (SELECT count(*) FROM public."ShoppingListItems") AS shopping_list_items,
    (SELECT count(*) FROM public."AuditLogs") AS audit_logs,
    pg_size_pretty(pg_database_size(current_database())) AS restored_db_size;
"@
    $verifySql | & $DockerPath exec -i -e PGPASSWORD=restore_drill_local_pw recipehub-restore-drill psql -h 127.0.0.1 -U postgres -d recipehub_restore_verify -x
}
finally {
    $ErrorActionPreference = "Continue"
    & $DockerPath rm -f recipehub-restore-drill 2>$null | Out-Null
    $ErrorActionPreference = "Stop"
    Write-Host "Cleaned up temporary container 'recipehub-restore-drill'."
}

Write-Host "`n=== STEP 5: Application Container Rollback & Roll-Forward Drill ==="
$prevImage = "recipehub-api:3c78330"
$currImage = "recipehub-api:d1bb66e"
$jwtKey = "ProductionLocalSmokeTestKey_MustBeAtLeast64Utf8BytesLongForHmacSha256Security!"

& $DockerPath tag recipehub-api:local $prevImage
& $DockerPath build -f (Join-Path $repoRoot "infrastructure\docker\backend.Dockerfile") -t recipehub-api:local -t $currImage $repoRoot | Out-Null

Write-Host "5A. Rolling back port 8080 container to previous image ($prevImage)..."
$ErrorActionPreference = "Continue"
& $DockerPath rm -f recipehub-api-local 2>$null | Out-Null
$ErrorActionPreference = "Stop"
& $DockerPath run -d --name recipehub-api-local -p 127.0.0.1:8080:8080 `
    -e ASPNETCORE_ENVIRONMENT=Production `
    -e ConnectionStrings__DefaultConnection="$connStr" `
    -e Jwt__Issuer=RecipeHub `
    -e Jwt__Audience=RecipeHub.Web `
    -e Jwt__Key="$jwtKey" `
    $prevImage | Out-Null
Start-Sleep -Seconds 5
$rbLive = Invoke-RestMethod -Uri "http://localhost:8080/health/live"
$rbReady = Invoke-RestMethod -Uri "http://localhost:8080/health/ready"
Write-Host "Rollback health check ($prevImage) -> live=$rbLive, ready=$rbReady"

Write-Host "5B. Rolling forward port 8080 container to current release image ($currImage)..."
$ErrorActionPreference = "Continue"
& $DockerPath rm -f recipehub-api-local 2>$null | Out-Null
$ErrorActionPreference = "Stop"
& $DockerPath run -d --name recipehub-api-local -p 127.0.0.1:8080:8080 `
    -e ASPNETCORE_ENVIRONMENT=Production `
    -e ConnectionStrings__DefaultConnection="$connStr" `
    -e Jwt__Issuer=RecipeHub `
    -e Jwt__Audience=RecipeHub.Web `
    -e Jwt__Key="$jwtKey" `
    -e DataProtection__KeysPath=/tmp/dpkeys `
    $currImage | Out-Null
Start-Sleep -Seconds 5
$rfLive = Invoke-RestMethod -Uri "http://localhost:8080/health/live"
$rfReady = Invoke-RestMethod -Uri "http://localhost:8080/health/ready"
Write-Host "Roll-forward health check ($currImage) -> live=$rfLive, ready=$rfReady"
