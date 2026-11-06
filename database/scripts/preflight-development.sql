-- Read-only discovery before selecting the RecipeHub development database.
-- Does not create databases, schemas, tables or change transaction state.
-- Run each SELECT separately in DBeaver. Do not share credentials.

SELECT current_database() AS connected_database,
       current_schema() AS current_schema;

-- Lists databases on the connected Neon branch, not databases on other branches.
SELECT datname AS database_name
FROM pg_catalog.pg_database
WHERE NOT datistemplate
ORDER BY datname;

-- Tables in the current database only. Database names are not schema names.
SELECT schemaname AS schema_name, tablename AS table_name
FROM pg_catalog.pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND schemaname NOT LIKE 'pg_toast%'
ORDER BY schemaname, tablename;
