#!/usr/bin/env python3
"""
RecipeHub Authentic Photo Alignment & Homepage Ordering Script
--------------------------------------------------------------
1. Reorders the homepage so dishes with 1-to-1 authentic real dish photographs
   (prioritizing Vietnamese, Thai, Chinese, Japanese, Malaysian, Filipino dishes
   — all already translated into Vietnamese) appear FIRST.
2. Replaces all mismatched photos on the 301 text-only Vietnamese recipes
   (removing pastries/tacos/cheese/desserts) with strictly keyword-matched
   savory Asian dish photographs already verified in RecipeImages.
"""

import os
import subprocess
import sys


def load_env_file(path: str) -> dict[str, str]:
    values: dict[str, str] = {}
    if not os.path.exists(path):
        return values
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            values[k.strip()] = v.strip().strip('"').strip("'")
    return values


SQL_SCRIPT = r"""
BEGIN;

-- 1. Build clean, savory, keyword-matched Asian photo pools from authentic 1-to-1 TheMealDB photos
CREATE TEMP TABLE tmp_clean_pools (pool text, idx int, url text);

INSERT INTO tmp_clean_pools (pool, idx, url)
WITH src AS (
    SELECT
        r."Title" AS title,
        r."Description" AS descr,
        ri."Url" AS url
    FROM public."Recipes" r
    JOIN public."RecipeImages" ri ON ri."RecipeId" = r."Id" AND ri."Position" = 0
    WHERE r."Slug" LIKE 'themealdb-%'
      AND r."Description" NOT ILIKE '%Tráng miệng%'
      AND r."Title" NOT ILIKE '%bánh%'
      AND r."Title" NOT ILIKE '%taco%'
      AND r."Title" NOT ILIKE '%pizza%'
      AND r."Title" NOT ILIKE '%burger%'
      AND r."Title" NOT ILIKE '%phô mai%'
      AND r."Title" NOT ILIKE '%dâu%'
),
tagged AS (
    SELECT 'soup' AS pool, url FROM src
      WHERE title ~* '(súp|canh|phở|hầm|cà ri|laksa|miso|nước dùng)'
    UNION ALL
    SELECT 'egg' AS pool, url FROM src
      WHERE title ~* '(trứng|ốp la|frittata|shakshuka|trứng bác|trứng cuộn)'
        AND title NOT ILIKE '%bánh%'
    UNION ALL
    SELECT 'noodle' AS pool, url FROM src
      WHERE title ~* '(mì|bún|phở|miến|hoành thánh|pad thai|ramen|chow mein|u-đông|udon)'
    UNION ALL
    SELECT 'rice' AS pool, url FROM src
      WHERE title ~* '(cơm|cháo|risotto|biryani|paella|cơm chiên)'
    UNION ALL
    SELECT 'seafood' AS pool, url FROM src
      WHERE descr ILIKE '%Hải sản%' OR title ~* '(tôm|cá|mực|cua|hải sản|hàu|sò)'
    UNION ALL
    SELECT 'chicken' AS pool, url FROM src
      WHERE (descr ILIKE '%Thịt gà%' OR title ~* '(gà|vịt)')
        AND descr ~* '(Việt Nam|Thái Lan|Trung Hoa|Nhật Bản|Malaysia|Philippines|Ấn Độ)'
    UNION ALL
    SELECT 'beef' AS pool, url FROM src
      WHERE (descr ILIKE '%Thịt bò%' OR title ~* 'bò')
        AND descr ~* '(Việt Nam|Thái Lan|Trung Hoa|Nhật Bản|Malaysia|Philippines)'
    UNION ALL
    SELECT 'pork' AS pool, url FROM src
      WHERE (descr ILIKE '%Thịt heo%' OR title ~* '(thịt heo|sườn|xá xíu|thịt lợn|thịt kho)')
    UNION ALL
    SELECT 'veg' AS pool, url FROM src
      WHERE (descr ~* '(Món chay|Thuần chay|Món ăn kèm)' OR title ~* '(rau|nấm|đậu phụ|đậu hũ|cải|bông cải|cà tím|salad|xào)')
        AND title NOT ILIKE '%khoai tây chiên%'
        AND title NOT ILIKE '%phô mai%'
    UNION ALL
    SELECT 'asian_savory' AS pool, url FROM src
      WHERE descr ~* '(Việt Nam|Thái Lan|Trung Hoa|Nhật Bản|Malaysia|Philippines)'
),
dedup AS (
    SELECT DISTINCT pool, url FROM tagged
)
SELECT
    pool,
    row_number() OVER (PARTITION BY pool ORDER BY url) - 1 AS idx,
    url
FROM dedup;

-- 2. Reassign every text-only Vietnamese recipe's photo strictly by Vietnamese dish keyword
WITH pool_counts AS (
    SELECT pool, count(*)::int AS cnt FROM tmp_clean_pools GROUP BY pool
),
vn_targets AS (
    SELECT
        r."Id" AS recipe_id,
        CASE
            WHEN r."Title" ~* '(canh|súp|lẩu)' THEN 'soup'
            WHEN r."Title" ~* '(bún|phở|mì|miến|hủ tiếu)' THEN 'noodle'
            WHEN r."Title" ~* '(cơm|cháo|xôi)' THEN 'rice'
            WHEN r."Title" ~* '(tôm|cá|mực|ngao|nghêu|sò|cua|ốc|hải sản)' THEN 'seafood'
            WHEN r."Title" ~* '(trứng)' THEN 'egg'
            WHEN r."Title" ~* '(gà|vịt|ngan)' THEN 'chicken'
            WHEN r."Title" ~* '(bò)' THEN 'beef'
            WHEN r."Title" ~* '(thịt|sườn|ba chỉ|giò|chả|heo|lợn)' THEN 'pork'
            WHEN r."Title" ~* '(đậu hũ|đậu phụ|nấm|chay|rau|cải|mướp|bầu|bí|su su|đậu que|măng|cà tím|khổ qua)' THEN 'veg'
            ELSE 'asian_savory'
        END AS desired_pool,
        row_number() OVER (ORDER BY r."Title", r."Id") - 1 AS rn
    FROM public."Recipes" r
    WHERE r."Slug" NOT LIKE 'themealdb-%'
),
resolved AS (
    SELECT
        vt.recipe_id,
        COALESCE(pc.pool, 'asian_savory') AS actual_pool,
        vt.rn
    FROM vn_targets vt
    LEFT JOIN pool_counts pc ON pc.pool = vt.desired_pool AND pc.cnt > 0
)
UPDATE public."RecipeImages" ri
SET "Url" = tp.url
FROM resolved res
JOIN pool_counts pc ON pc.pool = res.actual_pool
JOIN tmp_clean_pools tp ON tp.pool = res.actual_pool AND tp.idx = (res.rn % pc.cnt)
WHERE ri."RecipeId" = res.recipe_id
  AND ri."Position" = 0;

-- 3. Order homepage so 100% authentic 1-to-1 photographed dishes appear FIRST:
--    Priority 1: Vietnamese, Thai, Chinese, Japanese, Malaysian, Filipino dishes (1-to-1 real photos, Vietnamese text)
--    Priority 2: Other 1-to-1 photographed international dishes (Vietnamese text)
--    Priority 3: 301 curated Vietnamese home dishes (now with strictly matched savory Asian photos)
WITH ranked AS (
    SELECT
        "Id",
        row_number() OVER (
            ORDER BY
                CASE
                    WHEN "Slug" LIKE 'themealdb-%' AND "Description" ILIKE '%Ẩm thực Việt Nam%' THEN 1
                    WHEN "Slug" LIKE 'themealdb-%' AND "Description" ~* 'Ẩm thực (Thái Lan|Trung Hoa|Nhật Bản|Malaysia|Philippines)' THEN 2
                    WHEN "Slug" LIKE 'themealdb-%' AND "Description" NOT ILIKE '%Tráng miệng%' THEN 3
                    WHEN "Slug" LIKE 'themealdb-%' THEN 4
                    ELSE 5
                END,
                "Title",
                "Id"
        ) AS rk
    FROM public."Recipes"
    WHERE "Status" = 'Published'
)
UPDATE public."Recipes" r
SET "CreatedAt" = now() - (ranked.rk * interval '1 second'),
    "PublishedAt" = COALESCE(r."PublishedAt", now() - (ranked.rk * interval '1 second'))
FROM ranked
WHERE r."Id" = ranked."Id";

COMMIT;
ANALYZE public."Recipes", public."RecipeImages";

SELECT "Title", left("Description", 65) AS descr, left(ri."Url", 65) AS img
FROM public."Recipes" r
JOIN public."RecipeImages" ri ON ri."RecipeId" = r."Id" AND ri."Position" = 0
WHERE r."Status" = 'Published'
ORDER BY r."CreatedAt" DESC
LIMIT 12;
"""


def main() -> int:
    env_file = load_env_file("/home/ubuntu/.backup.env")
    db_host = os.environ.get("DB_HOST") or env_file.get("DB_HOST")
    db_user = os.environ.get("DB_USER") or env_file.get("DB_USER", "postgres")
    db_name = os.environ.get("DB_NAME") or env_file.get("DB_NAME", "recipehub")
    pg_pass = os.environ.get("PGPASSWORD") or env_file.get("PGPASSWORD")

    if not db_host or not pg_pass:
        print("ERROR: Missing DB_HOST or PGPASSWORD.", file=sys.stderr)
        return 1

    cmd = [
        "docker", "run", "--rm", "-i",
        "-e", f"PGPASSWORD={pg_pass}",
        "-e", "PGSSLMODE=require",
        "postgres:18-alpine",
        "psql", "-v", "ON_ERROR_STOP=1",
        "-h", db_host, "-U", db_user, "-d", db_name,
    ]
    proc = subprocess.run(cmd, input=SQL_SCRIPT, text=True)
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())
