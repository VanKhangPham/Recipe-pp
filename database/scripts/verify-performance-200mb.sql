-- ============================================================================
-- RecipeHub Cloud Neon (recipehub_dev) — ~200 MB Size & Query Plan Verification
-- Chạy từng câu lệnh trong DBeaver bằng cách bôi đen từng khối và nhấn Ctrl + Enter
-- ============================================================================

-- KHỐI 1: Thống kê dung lượng 29 bảng và index ở mốc ~200 MB
SELECT
    relname AS table_name,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_indexes_size(relid)) AS index_size,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_total_relation_size(relid) AS total_bytes
FROM pg_statio_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC, relname;

-- KHỐI 2: EXPLAIN (ANALYZE, BUFFERS) — Truy vấn danh sách món Published (Mốc 301 món / 31 Published)
EXPLAIN (ANALYZE, BUFFERS)
SELECT r."Id", r."Title", r."CreatedAt"
FROM public."Recipes" r
WHERE r."Status" = 'Published'
ORDER BY r."CreatedAt" DESC, r."Id"
LIMIT 20;

-- KHỐI 3: EXPLAIN (ANALYZE, BUFFERS) — Tìm kiếm Full-Text Search có kết quả thực ("trứng")
EXPLAIN (ANALYZE, BUFFERS)
SELECT r."Id", r."Title", r."CreatedAt"
FROM public."Recipes" r
WHERE r."Status" = 'Published'
  AND r."SearchVector" @@ websearch_to_tsquery('simple'::regconfig, 'trứng')
ORDER BY r."CreatedAt" DESC, r."Id"
LIMIT 20;

-- KHỐI 4: EXPLAIN (ANALYZE, BUFFERS) — Thống kê Top 10 món xem nhiều nhất trong 30 ngày (Admin Analytics trên ~24.000 lượt xem)
EXPLAIN (ANALYZE, BUFFERS)
SELECT r."Id", r."Title", count(*) AS view_count
FROM public."RecipeViews" v
JOIN public."Recipes" r ON r."Id" = v."RecipeId"
WHERE v."ViewedAt" >= now() - interval '30 days'
GROUP BY r."Id", r."Title"
ORDER BY count(*) DESC, r."Id"
LIMIT 10;

-- ============================================================================
-- (TÙY CHỌN DỰ PHÒNG - KHÔNG CHẠY KHI ĐANG ĐO TẢI 200 MB)
-- Nếu sau này muốn rút phần tải giả lập về lại 12 MB mà giữ nguyên 301 món Việt:
-- DELETE FROM public."AuditLogs" WHERE "EntityType" = 'PerfLoadBenchmarkEntity_VietnameseRecipeCatalog_Simulation';
-- DELETE FROM public."ShoppingLists" WHERE "UserId" = '11111111-2222-4333-8444-555555555555';
-- DELETE FROM public."RecipeViews" WHERE "UserId" = '11111111-2222-4333-8444-555555555555';
-- VACUUM FULL ANALYZE;
-- ============================================================================
