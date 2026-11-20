#!/usr/bin/env bash
# ==============================================================================
# RecipeHub AWS RDS PostgreSQL 18 — Safe 15 GB Scale Seeder
# ------------------------------------------------------------------------------
# - Uses PostgreSQL 18 native uuidv7() + monotonic OccurredAt so all 3 B-tree
#   indexes on AuditLogs append sequentially (zero random B-tree thrashing on
#   db.t4g.micro 1 GB RAM).
# - Commits independently every 500,000 rows (~225 MB/batch) so WAL stays tiny
#   and progress is 100% resumable.
# - Automatically updates /home/ubuntu/recipehub/backup_nightly.sh to exclude
#   AuditLogs data from local EC2 pg_dump so EC2's 17 GB disk never fills up.
# ==============================================================================
set -euo pipefail

TARGET_GB="${1:-15}"
# Add 100 MB safety margin above target GB so pg_size_pretty cleanly displays >= 15 GB
TARGET_BYTES=$(( TARGET_GB * 1024 * 1024 * 1024 + 100 * 1024 * 1024 ))
BATCH_ROWS=500000

if [ ! -f /home/ubuntu/.backup.env ]; then
  echo "ERROR: /home/ubuntu/.backup.env not found." >&2
  exit 1
fi
# shellcheck disable=SC1091
source /home/ubuntu/.backup.env

run_psql() {
  docker run --rm -i \
    -e PGPASSWORD="$PGPASSWORD" \
    -e PGSSLMODE=require \
    postgres:18-alpine \
    psql -v ON_ERROR_STOP=1 -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" "$@"
}

# 1. Protect EC2 local disk: ensure nightly pg_dump excludes benchmark AuditLogs data
if [ -f /home/ubuntu/recipehub/backup_nightly.sh ] && ! grep -q "exclude-table-data" /home/ubuntu/recipehub/backup_nightly.sh; then
  echo "[Setup] Updating /home/ubuntu/recipehub/backup_nightly.sh to exclude AuditLogs data (protecting EC2 disk)..."
  sed -i 's|--no-owner --no-privileges|--no-owner --no-privileges --exclude-table-data='\''public."AuditLogs"'\''|' /home/ubuntu/recipehub/backup_nightly.sh
fi

# 2. Ensure dedicated perf-load user exists
run_psql -q <<'SQL'
INSERT INTO public."AspNetUsers" (
    "Id", "DisplayName", "CreatedAt", "UpdatedAt",
    "UserName", "NormalizedUserName", "Email", "NormalizedEmail",
    "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
    "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled", "AccessFailedCount"
)
VALUES (
    '11111111-2222-4333-8444-555555555555',
    'Performance Load Bot',
    now() - interval '30 days',
    now(),
    'perf-load@recipehub.local',
    'PERF-LOAD@RECIPEHUB.LOCAL',
    'perf-load@recipehub.local',
    'PERF-LOAD@RECIPEHUB.LOCAL',
    true,
    'AQAAAAIAAYagAAAAELoadTestPlaceholderHashOnlyNotForInteractiveLogin==',
    'PERF-LOAD-SECURITY-STAMP-2026',
    'PERF-LOAD-CONCURRENCY-STAMP-2026',
    false, false, true, 0
)
ON CONFLICT ("Id") DO NOTHING;
SQL

CURRENT_BYTES=$(run_psql -t -A -c "SELECT pg_database_size(current_database());")
echo "[Start] Current DB size: $(awk -v b="$CURRENT_BYTES" 'BEGIN { printf "%.2f GB", b/1073741824 }') / Target: ${TARGET_GB}.10 GB"

BATCH=0
START_EPOCH=$(date +%s)

while [ "$CURRENT_BYTES" -lt "$TARGET_BYTES" ]; do
  BATCH=$((BATCH + 1))
  B_START=$(date +%s)

  run_psql -q <<SQL
SET synchronous_commit = off;
SET work_mem = '32MB';
INSERT INTO public."AuditLogs" ("Id", "ActorUserId", "Action", "EntityType", "EntityId", "OccurredAt")
SELECT
    uuidv7(),
    '11111111-2222-4333-8444-555555555555'::uuid,
    left('RECIPEHUB_15GB_TELEMETRY_AUDIT_ACTION_STREAM_BATCH_' || lpad('${BATCH}', 4, '0') || '_ROW_' || lpad(gs::text, 7, '0') || '_AWS_RDS_SYDNEY_VERIFIED_OK', 100),
    left('RecipeHub.Production.Analytics.CatalogTelemetryEventStream.Partition_' || lpad(((gs % 64) + 1)::text, 2, '0') || '.RecipeAuditRecord_v1', 100),
    left('entity-ref-b' || lpad('${BATCH}', 4, '0') || '-' || md5('${BATCH}:' || gs::text) || '-' || md5('r:' || gs::text), 100),
    now() + (gs * interval '1 microsecond')
FROM generate_series(1, ${BATCH_ROWS}) AS gs;
SQL

  CURRENT_BYTES=$(run_psql -t -A -c "SELECT pg_database_size(current_database());")
  B_END=$(date +%s)
  ELAPSED=$((B_END - START_EPOCH))
  BATCH_SEC=$((B_END - B_START))
  PCT=$(awk -v c="$CURRENT_BYTES" -v t="$TARGET_BYTES" 'BEGIN { printf "%.1f", (c*100.0)/t }')
  CUR_GB=$(awk -v c="$CURRENT_BYTES" 'BEGIN { printf "%.2f", c/1073741824 }')
  echo "[Batch $(printf '%03d' "$BATCH")] Size: ${CUR_GB} GB (${PCT}%) | Batch: ${BATCH_SEC}s | Elapsed: ${ELAPSED}s"

  if [ "$BATCH" -ge 120 ]; then
    echo "Reached safety batch cap (120). Stopping."
    break
  fi
done

echo "[Finalize] Running ANALYZE on AuditLogs and printing final DB report..."
run_psql <<'SQL'
ANALYZE public."AuditLogs";

SELECT
    current_database() AS database_name,
    pg_size_pretty(pg_database_size(current_database())) AS db_total_size,
    ROUND(pg_database_size(current_database()) / (1024.0 * 1024.0 * 1024.0), 2) AS db_total_gb,
    (SELECT count(*) FROM public."Recipes" WHERE "Status" = 'Published') AS published_recipes,
    (SELECT count(DISTINCT "RecipeId") FROM public."RecipeImages") AS recipes_with_images,
    (SELECT count(*) FROM public."AuditLogs") AS total_audit_logs;

SELECT
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_indexes_size(relid)) AS index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
SQL
