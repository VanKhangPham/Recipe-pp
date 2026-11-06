-- Read-only development measurements. Run individual SELECT/EXPLAIN blocks in DBeaver.
-- First confirm database_name = recipehub_dev before running the remaining queries.
SELECT current_database() AS database_name,
       clock_timestamp() AS measured_at,
       (SELECT count(*) FROM public."Recipes") AS recipes,
       (SELECT count(*) FROM public."Recipes" WHERE "Status" = 'Published') AS published_recipes,
       (SELECT count(*) FROM public."RecipeIngredients") AS ingredient_links;

-- Public recipe list: core filter/sort, without the full API DTO projection.
EXPLAIN (ANALYZE, BUFFERS)
SELECT "Id", "Title", "CreatedAt"
FROM public."Recipes"
WHERE "Status" = 'Published'
ORDER BY "CreatedAt" DESC, "Id"
LIMIT 20;

-- Full-text search: same simple text-search configuration as RecipeService.
EXPLAIN (ANALYZE, BUFFERS)
SELECT "Id", "Title", "CreatedAt"
FROM public."Recipes"
WHERE "Status" = 'Published'
  AND "SearchVector" @@ websearch_to_tsquery('simple', 'trứng')
ORDER BY "CreatedAt" DESC, "Id"
LIMIT 20;

-- Application table and index sizes, limited to public to exclude temporary test schemas.
SELECT relname AS table_name,
       pg_relation_size(relid) AS table_bytes,
       pg_indexes_size(relid) AS index_bytes,
       pg_total_relation_size(relid) AS total_bytes
FROM pg_catalog.pg_statio_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC;
