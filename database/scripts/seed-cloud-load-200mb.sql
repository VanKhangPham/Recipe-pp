-- ============================================================================
-- RecipeHub Cloud Neon (recipehub_dev) — Curated Publication & ~200 MB Load Seed
-- Mục đích:
--   1. Duyệt (Approved) & Xuất bản (Published) 29 món Việt đại diện phủ đủ 7 danh mục
--      (nâng tổng số món Published lên 31 món cho giao diện Fullstack, giữ 270 món Draft/Pending).
--   2. Tạo 1 tài khoản chịu tải chuyên biệt (perf-load@recipehub.local) để không làm rác
--      danh sách Users trên trang Admin.
--   3. Sinh dữ liệu hoạt động thực tế (RecipeViews 30 ngày cho biểu đồ Analytics,
--      Favorites, ShoppingLists, ShoppingListItems, AuditLogs) tự động canh chỉnh
--      để tổng dung lượng database recipehub_dev trên Cloud Neon đạt đúng khoảng
--      180 MB – 220 MB (mục tiêu ~195–205 MB).
-- ============================================================================

DO $$
DECLARE
    v_db text := current_database();
    v_admin_id uuid;
    v_perf_user_id uuid := '11111111-2222-4333-8444-555555555555';
    v_target_bytes bigint := 196 * 1024 * 1024; -- ~196 MB (chính giữa ngưỡng 180-220 MB)
    v_current_bytes bigint;
    v_batch int := 0;
BEGIN
    IF v_db <> 'recipehub_dev' THEN
        RAISE EXCEPTION 'Script này chỉ được chạy trên recipehub_dev (hiện tại: %)', v_db;
    END IF;

    -- Lấy Admin ID để ghi nhận duyệt bài
    SELECT "Id" INTO v_admin_id
    FROM public."AspNetUsers"
    WHERE "NormalizedEmail" = 'ADMIN@RECIPEHUB.LOCAL'
    LIMIT 1;

    -- 1. Tạo tài khoản chịu tải chuyên biệt (nếu chưa có)
    INSERT INTO public."AspNetUsers" (
        "Id", "DisplayName", "CreatedAt", "UpdatedAt",
        "UserName", "NormalizedUserName", "Email", "NormalizedEmail",
        "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
        "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled", "AccessFailedCount"
    )
    VALUES (
        v_perf_user_id,
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
        false,
        false,
        true,
        0
    )
    ON CONFLICT ("Id") DO NOTHING;

    -- 2. Duyệt & Xuất bản 29 món Việt tiêu biểu trải đều 7 danh mục
    --    (Cùng với 'trung-chien-hanh' và 1 món test có sẵn => Tổng cộng 31 món Published)
    WITH target_keys AS (
        SELECT unnest(ARRAY[
            -- 4 món còn lại trong lô 5 món gốc
            'canh-ca-chua-trung',
            'rau-muong-xao-toi',
            'dau-hu-sot-ca-chua',
            'com-chien-trung',
            -- 15 món trong lô 20 món
            'thit-kho-trung',
            'suon-xao-chua-ngot',
            'ga-kho-gung',
            'bo-xao-hanh-tay',
            'ca-kho-to',
            'tom-rim-man-ngot',
            'canh-bi-do-thit-bam',
            'canh-rau-ngot-thit-bam',
            'canh-chua-ca',
            'bap-cai-luoc',
            'su-su-xao-toi',
            'dau-que-xao-thit',
            'chao-ga',
            'mi-xao-trung',
            'dau-hu-kho-nam',
            -- 10 món đặc sắc bổ sung từ lô 100 món
            'thit-kho-tieu',
            'ga-chien-nuoc-mam',
            'bo-xao-bong-cai',
            'muc-xao-dua-ca',
            'tom-hap-sa',
            'canh-suon-non-nau-bap',
            'canh-kho-qua-nhoi-thit',
            'bun-thit-xao',
            'trung-cuon-rau-cu',
            'nam-dui-ga-kho-tieu'
        ]) AS dkey
    )
    UPDATE public."RecipeDatasetEntries" d
    SET "ReviewStatus" = 'Approved',
        "SourceName" = 'Nhóm RecipeHub biên soạn và rà soát',
        "SourceUrl" = NULL,
        "LicenseIdentifier" = 'CC-BY-4.0'
    FROM target_keys tk
    WHERE d."DatasetKey" = tk.dkey
      AND d."ReviewStatus" <> 'Approved';

    UPDATE public."Recipes" r
    SET "Status" = 'Published',
        "PublishedAt" = COALESCE(r."PublishedAt", now() - interval '7 days'),
        "UpdatedAt" = now()
    FROM public."RecipeDatasetEntries" d
    WHERE r."Id" = d."RecipeId"
      AND d."ReviewStatus" = 'Approved'
      AND r."Status" <> 'Published';

    -- 3. Tạo dữ liệu Favorites mẫu cho các món Published để trang Analytics có Top Favorited
    INSERT INTO public."Favorites" ("UserId", "RecipeId", "CreatedAt")
    SELECT v_perf_user_id, r."Id", now() - (row_number() OVER (ORDER BY r."Id") || ' hours')::interval
    FROM public."Recipes" r
    WHERE r."Status" = 'Published'
    ON CONFLICT ("UserId", "RecipeId") DO NOTHING;

    IF v_admin_id IS NOT NULL THEN
        INSERT INTO public."Favorites" ("UserId", "RecipeId", "CreatedAt")
        SELECT v_admin_id, r."Id", now() - (row_number() OVER (ORDER BY r."Title") || ' hours')::interval
        FROM public."Recipes" r
        WHERE r."Status" = 'Published'
        LIMIT 15
        ON CONFLICT ("UserId", "RecipeId") DO NOTHING;
    END IF;

    -- 4. Sinh ~24.000 lượt xem (RecipeViews) phân bố đều trong 30 ngày gần nhất cho các món Published
    --    (Phục vụ biểu đồ Admin Analytics 30 ngày & kiểm thử index IX_RecipeViews_RecipeId_ViewedAt)
    IF (SELECT count(*) FROM public."RecipeViews" WHERE "UserId" = v_perf_user_id) < 20000 THEN
        INSERT INTO public."RecipeViews" ("Id", "UserId", "RecipeId", "ViewedAt")
        SELECT
            gen_random_uuid(),
            v_perf_user_id,
            p."Id",
            now() - ((gs % 30) || ' days')::interval - ((gs % 86400) || ' seconds')::interval
        FROM generate_series(1, 800) AS gs
        CROSS JOIN (
            SELECT "Id" FROM public."Recipes" WHERE "Status" = 'Published' LIMIT 30
        ) p;
    END IF;

    -- 5. Sinh 2.500 ShoppingLists và ~50.000 ShoppingListItems cho tài khoản perf-load
    --    (Kiểm thử bảng ShoppingLists/ShoppingListItems mà không ảnh hưởng tài khoản Khánh/Admin)
    IF (SELECT count(*) FROM public."ShoppingLists" WHERE "UserId" = v_perf_user_id) < 2000 THEN
        WITH ins_lists AS (
            INSERT INTO public."ShoppingLists" ("Id", "UserId", "MealPlanId", "Name", "CreatedAt", "UpdatedAt")
            SELECT
                gen_random_uuid(),
                v_perf_user_id,
                NULL,
                '[PERF-LOAD] Danh sách đi chợ tuần #' || gs,
                now() - ((gs % 180) || ' days')::interval,
                now() - ((gs % 180) || ' days')::interval
            FROM generate_series(1, 2500) AS gs
            RETURNING "Id"
        ),
        top_ings AS (
            SELECT "Id", "DefaultUnit", row_number() OVER (ORDER BY "NormalizedName") AS rn
            FROM public."Ingredients"
            LIMIT 20
        )
        INSERT INTO public."ShoppingListItems" (
            "Id", "ShoppingListId", "IngredientId", "Quantity", "Unit",
            "IsPurchased", "IsManuallyEdited", "Note"
        )
        SELECT
            gen_random_uuid(),
            l."Id",
            i."Id",
            (i.rn * 50)::numeric(12,3),
            i."DefaultUnit",
            (i.rn % 2 = 0),
            false,
            '[PERF-LOAD] Định lượng chuẩn bị nguyên liệu kiểm thử tải lớn cho thực đơn gia đình Việt Nam'
        FROM ins_lists l
        CROSS JOIN top_ings i;
    END IF;

    -- 6. Bơm dữ liệu AuditLogs theo từng lô (mỗi lô 25.000 bản ghi) và đo pg_database_size()
    --    tự động dừng ngay khi dung lượng database recipehub_dev đạt ~196 MB (trong khoảng 180–220 MB)
    v_current_bytes := pg_database_size(current_database());
    WHILE v_current_bytes < v_target_bytes AND v_batch < 25 LOOP
        v_batch := v_batch + 1;

        INSERT INTO public."AuditLogs" (
            "Id", "ActorUserId", "Action", "EntityType", "EntityId", "OccurredAt"
        )
        SELECT
            gen_random_uuid(),
            v_perf_user_id,
            'PERF_LOAD_BENCHMARK_EVENT_BATCH_' || v_batch || '_SEQ_' || (gs % 1000),
            'PerfLoadBenchmarkEntity_VietnameseRecipeCatalog_Simulation',
            'perf-load-entity-reference-' || md5(gs::text || '-' || v_batch::text),
            now() - ((gs % 365) || ' days')::interval - ((gs % 86400) || ' seconds')::interval
        FROM generate_series(1, 25000) AS gs;

        v_current_bytes := pg_database_size(current_database());
    END LOOP;
END $$;

-- Cập nhật thống kê planner cho toàn bộ các bảng vừa nạp
ANALYZE;

-- Kiểm tra ngay kết quả sau khi chạy
SELECT
    current_database() AS database_name,
    pg_size_pretty(pg_database_size(current_database())) AS db_total_size,
    pg_database_size(current_database()) AS db_total_bytes,
    ROUND(pg_database_size(current_database()) / (1024.0 * 1024.0), 2) AS db_total_mb,
    (SELECT count(*) FROM public."Recipes") AS total_recipes,
    (SELECT count(*) FROM public."Recipes" WHERE "Status" = 'Published') AS published_recipes,
    (SELECT count(*) FROM public."RecipeDatasetEntries" WHERE "ReviewStatus" = 'Approved') AS approved_dataset_entries,
    (SELECT count(*) FROM public."RecipeViews") AS total_recipe_views,
    (SELECT count(*) FROM public."ShoppingLists") AS total_shopping_lists,
    (SELECT count(*) FROM public."ShoppingListItems") AS total_shopping_list_items,
    (SELECT count(*) FROM public."AuditLogs") AS total_audit_logs;
