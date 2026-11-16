-- Read-only. Run against the intended database, never assume its name.
SELECT current_database() AS database_name,
       pg_database_size(current_database()) AS size_bytes,
       pg_size_pretty(pg_database_size(current_database())) AS size_display,
       round(pg_database_size(current_database()) / 1024.0 / 1024.0, 2) AS size_mib;

SELECT schemaname, relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_with_indexes,
       pg_size_pretty(pg_relation_size(relid)) AS table_size,
       pg_size_pretty(pg_indexes_size(relid)) AS indexes_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
