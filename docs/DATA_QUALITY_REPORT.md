# Kết quả lô dataset mẫu

## Bằng chứng ngày 2026-11-06

Khánh chạy importer trên recipehub_dev với tài khoản Khánh làm tác giả. Lượt đầu trả created=5, skipped=0. Lượt chạy lại trả created=0, skipped=5. Ảnh SELECT join Recipes/RecipeDatasetEntries hiển thị đủ5 món, tất cả Draft/Pending.

Ảnh đo sau nhập ghi database_bytes=10649600, recipes=6, ingredients=11, dataset_entries=5. Dung lượng là toàn database, bao gồm các schema khác tại thời điểm đo. Mốc trước đó10756096 byte và mốc sau10649600 byte được đo ở hai thời điểm, chưa có phép đo tách riêng dung lượng lô nhập. Chưa dùng chênh lệch này để suy ra chi phí lưu trữ mỗi công thức hoặc ngoại suy300 món.

## Chất lượng và trạng thái xuất bản

Năm món có dataset key riêng, nguyên liệu có đơn vị chuẩn và các bước nấu có thứ tự. Nội dung AI hỗ trợ biên soạn, đang chờ người kiểm chứng. Chưa xác nhận thực nghiệm nấu, quyền công khai hoặc nguồn tham khảo theo từng món. Các món giữ Draft/Pending. Lô này chưa có ảnh, thông tin dinh dưỡng hoặc chi phí đã xác minh.

## Kiểm thử kỹ thuật

### Mốc truy vấn danh sách ngày2026-11-06

Ảnh EXPLAIN ANALYZE do Khánh cung cấp trên recipehub_dev với6 recipes (1 Published,5 Draft). SELECT Id,Title,CreatedAt lọc Published, sắp CreatedAt DESC/Id và LIMIT20 dùng Index Scan IX_Recipes_Status_CreatedAt_Id, trả1 dòng. Planning Time2.295ms, Execution Time0.445ms. Execution buffers shared hit1/read1; planning buffers hit26/read4. Một lần đo phần lõi truy vấn, chưa bao gồm projection DTO đầy đủ, HTTP hoặc tải đồng thời. Chưa có cơ sở thêm/đổi index từ mốc nhỏ này.

### Mốc tìm kiếm full-text ngày2026-11-06

Cùng phạm vi trên, thêm SearchVector @@ websearch_to_tsquery('simple','trứng'). Plan dùng Index Scan IX_Recipes_Status_CreatedAt_Id theo Published rồi Filter full-text, Rows Removed by Filter1, kết quả0 dòng. Planning Time0.122ms, Execution Time0.036ms, execution shared hit2, planning shared hit1. Các số liệu được Khánh cung cấp qua hai ảnh. Đây là truy vấn không có kết quả trên tập nhỏ, chưa đại diện truy vấn có nhiều kết quả, khả năng GIN trên dữ liệu lớn hoặc độ trễ API.

### Dung lượng bảng và index ngày2026-11-06

Khánh cung cấp 4 ảnh màn hình DBeaver đo đạc thực tế 29 bảng public từ pg_statio_user_tables (lúc 16:17:54):

| STT | Tên bảng (`table_name`) | Dung lượng bảng (`table_size`) | Dung lượng index (`index_size`) | Tổng dung lượng (`total_size`) |
|---|---|---|---|---|
| 1 | Recipes | 8192 bytes | 104 kB | 120 kB |
| 2 | RefreshTokens | 8192 bytes | 80 kB | 88 kB |
| 3 | MealPlanItems | 8192 bytes | 64 kB | 72 kB |
| 4 | ShoppingLists | 8192 bytes | 64 kB | 72 kB |
| 5 | AspNetUsers | 8192 bytes | 48 kB | 64 kB |
| 6 | ShoppingListItems | 8192 bytes | 48 kB | 56 kB |
| 7 | RecipeIngredients | 8192 bytes | 48 kB | 56 kB |
| 8 | MealPlans | 8192 bytes | 48 kB | 56 kB |
| 9 | RecipeSteps | 8192 bytes | 32 kB | 48 kB |
| 10 | RecipeDatasetEntries | 8192 bytes | 32 kB | 48 kB |
| 11 | AspNetRoles | 8192 bytes | 32 kB | 48 kB |
| 12 | Ingredients | 8192 bytes | 32 kB | 40 kB |
| 13 | AspNetUserRoles | 8192 bytes | 32 kB | 40 kB |
| 14 | Categories | 8192 bytes | 32 kB | 40 kB |
| 15 | RecipeCategories | 8192 bytes | 32 kB | 40 kB |
| 16 | Reviews | 0 bytes | 24 kB | 32 kB |
| 17 | RecipeImages | 0 bytes | 16 kB | 24 kB |
| 18 | AuditLogs | 0 bytes | 24 kB | 24 kB |
| 19 | AspNetRoleClaims | 0 bytes | 16 kB | 24 kB |
| 20 | RecipeViews | 0 bytes | 24 kB | 24 kB |
| 21 | AspNetUserLogins | 0 bytes | 16 kB | 24 kB |
| 22 | AspNetUserClaims | 0 bytes | 16 kB | 24 kB |
| 23 | __EFMigrationsHistory | 8192 bytes | 16 kB | 24 kB |
| 24 | UserPreferences | 0 bytes | 8192 bytes | 16 kB |
| 25 | RecipeTags | 0 bytes | 16 kB | 16 kB |
| 26 | AspNetUserTokens | 0 bytes | 8192 bytes | 16 kB |
| 27 | Tags | 0 bytes | 16 kB | 16 kB |
| 28 | Favorites | 0 bytes | 16 kB | 16 kB |
| 29 | NutritionFacts | 0 bytes | 8192 bytes | 8192 bytes |

Ghi chú phân tích: Kích thước relation PostgreSQL tại thời điểm đo có overhead cấp phát trang ban đầu (8192 bytes) và các khối index. Tỷ lệ index_size của bảng Recipes lớn gấp 13 lần table_size (104 kB vs 8 kB) do GIN full-text search index (`SearchVector`) và các composite indexes. Đây là số liệu mốc ban đầu (baseline) chuẩn xác để đối chiếu trước khi mở rộng lên 20, 100 và 300 công thức.

Dry-run C# đọc được5 món. DatasetImportTests đạt trên PostgreSQL18 tạm trong Docker, kiểm tra nhập lại, rollback khi xung đột cuối lô và chặn xuất bản Pending. Hai lượt trên Neon trước đó bị timeout trong fixture trước khi importer chạy. Lượt nhập development do Khánh thực hiện sau đó thành công như bằng chứng trên.

### Kết quả mở rộng mốc 20 món ngày 2026-11-06 (lúc 16:53:54 – 16:56:11)

Khánh chạy nhập `data/samples/vietnamese_recipes.batch20.json` trên `recipehub_dev`:
- Lượt 1: `Import completed: created=15, skipped=5.`
- Lượt 2 (kiểm tra idempotent): `Import completed: created=0, skipped=20.`

Bảng đối chiếu thực nghiệm giữa **Mốc 5 món dataset** và **Mốc 20 món dataset** trên `recipehub_dev` (từ ảnh DBeaver lúc 16:53:54 và 16:56:11):

| Chỉ số đo | Mốc 5 món dataset (6 recipes tổng) | Mốc 20 món dataset (21 recipes tổng) | Nhận xét kỹ thuật |
|---|---|---|---|
| `RecipeDatasetEntries` (`Pending`) | 5 (`5 Pending`) | 20 (`20 Pending`) | Giữ nguyên trạng thái `Draft/Pending` cho cả 20 món |
| `Recipes` (tổng số dòng) | 6 | 21 | Không trùng `Slug` hoặc `DatasetKey` |
| `Ingredients` (nguyên liệu gốc) | 11 | 33 | Chuẩn hóa tên tái sử dụng 33 nguyên liệu cho 113 liên kết (~3,42 lần/nguyên liệu) |
| `RecipeIngredients` (liên kết) | 24 | 113 | Đầy đủ FK hợp lệ tới `Recipes` và `Ingredients` |
| `RecipeSteps` (bước nấu) | 12 | 53 | Thứ tự `Position` hợp lệ |
| `Categories` / `RecipeCategories` | 4 / 5 | 7 / 20 | 7 nhóm món Việt gắn đủ cho 20 công thức dataset |
| Tổng dung lượng bảng `Recipes` | 120 kB | 152 kB | Tăng +32 kB (cấp phát thêm trang index/data) |
| Tổng dung lượng bảng `RecipeIngredients` | 56 kB | 88 kB | Tăng +32 kB |
| Tổng dung lượng bảng `RecipeSteps` | 48 kB | 80 kB | Tăng +32 kB |
| Tổng dung lượng bảng `Ingredients` | 40 kB | 40 kB | 33 bản ghi vẫn nằm gọn trong trang 8 KB ban đầu + 32 KB index |

### Nghiệm thu duyệt nguồn, xuất bản và tìm kiếm Full-Text (lúc 23:55 – 00:03)

Khánh đã kiểm chứng toàn bộ chu trình duyệt và xuất bản công khai trên `recipehub_dev`:
1. **Duyệt nguồn Admin (`PATCH /api/v1/admin/dataset/30adf757-5662-4b45-9353-85d91aad2dd3/review`):**
   - Kết quả `200 OK` (lúc 23:55:06): `datasetKey = trung-chien-hanh`, `status = Approved`, `sourceName = "Nhóm RecipeHub biên soạn và rà soát"`, `sourceUrl = null`, `licenseIdentifier = "CC-BY-4.0"`.
2. **Xuất bản công thức (`PUT /api/v1/recipes/30adf757-5662-4b45-9353-85d91aad2dd3`):**
   - Kết quả `200 OK` (lúc 23:58:31): chuyển `status = Published`, cập nhật mô tả riêng tiếng Việt, giữ đủ 4 nguyên liệu (`Trứng gà`, `Hành lá`, `Dầu ăn`, `Muối`), 2 bước nấu và danh mục `Trứng và đậu hũ`.
3. **Tìm kiếm công khai (`GET /api/v1/recipes?Q=trứng`):**
   - Kết quả `200 OK`: PostgreSQL Full-Text Search (`SearchVector`) trả về món **Trứng chiên hành** đã xuất bản; 19 món dataset còn lại giữ `Draft / Pending` làm hàng đợi duyệt cho màn hình Admin.

### Kết quả mở rộng mốc 100 món và 300 món trên Cloud Neon (`recipehub_dev`) ngày 2026-11-07 (lúc 00:47 – 00:56)

Khánh chạy nhập `data/samples/vietnamese_recipes.batch100.json` và `data/samples/vietnamese_recipes.batch300.json` trực tiếp lên Cloud Neon (`recipehub_dev`):
- **Mốc 100 món**:
  - Lượt 1: `Import completed: created=80, skipped=20.`
  - Lượt 2 (kiểm tra idempotent): `Import completed: created=0, skipped=100.`
- **Mốc 300 món**:
  - Lượt 1: `Import completed: created=200, skipped=100.`
  - Lượt 2 (kiểm tra idempotent): `Import completed: created=0, skipped=300.`

Bảng đối chiếu thực nghiệm qua 4 mốc tăng trưởng (**5 món → 20 món → 100 món → 300 món dataset**) trên Cloud Neon (`recipehub_dev`):

| Chỉ số đo | Mốc 5 món (6 recipes) | Mốc 20 món (21 recipes) | Mốc 100 món (101 recipes) | Mốc 300 món (301 recipes) | Nhận xét kỹ thuật |
|---|---|---|---|---|---|
| `RecipeDatasetEntries` (Tổng / `Approved`) | 5 / 0 | 20 / 0 | 100 / 1 | 300 / 1 (`trung-chien-hanh`) | Giữ nguyên trạng thái `Approved` và `Published` của món đã duyệt khi nạp bù |
| `Recipes` (`Published` / `Draft` / Tổng) | 1 / 5 / 6 | 1 / 20 / 21 | 2 / 99 / 101 | 2 / 299 / 301 | Không trùng `Slug` hoặc `DatasetKey` |
| `Ingredients` (nguyên liệu gốc) | 11 | 33 | 84 | 96 | 96 nguyên liệu chuẩn hóa dùng chung cho 1.785 liên kết (~18,59 lần/nguyên liệu) |
| `RecipeIngredients` (liên kết) | 24 | 113 | 585 | 1.785 | 1.782 liên kết từ dataset + 3 từ món test ban đầu |
| `RecipeSteps` (bước nấu) | 12 | 53 | 214 | 614 | 612 bước từ dataset + 2 từ món test ban đầu |
| `Categories` / `RecipeCategories` | 4 / 5 | 7 / 20 | 7 / 100 | 7 / 300 | Phủ đủ 7 danh mục món Việt chuẩn |
| Tổng dung lượng toàn DB (`recipehub_dev`) | ~10,16 MB | ~10,5 MB | 11 MB | 12 MB | Tăng ổn định theo số lượng bản ghi và trang index trên Cloud Neon |
| Tổng dung lượng bảng `Recipes` | 120 kB | 152 kB | 264 kB | 576 kB | Bao gồm GIN `SearchVector` và B-tree indexes cho 301 công thức |
| Tổng dung lượng bảng `RecipeIngredients` | 56 kB | 88 kB | 232 kB | 536 kB | 1.785 liên kết nguyên liệu có composite PK/FK indexes |
| Tổng dung lượng bảng `RecipeSteps` | 48 kB | 80 kB | 104 kB | 272 kB | 614 bước nấu có thứ tự |
| Tổng dung lượng bảng `RecipeDatasetEntries` | 48 kB | 48 kB | 88 kB | 160 kB | 300 bản ghi metadata & SHA-256 `ContentHash` |
| Tổng dung lượng bảng `Ingredients` | 40 kB | 40 kB | 40 kB | 40 kB | 96 nguyên liệu chuẩn hóa vẫn nằm gọn trong 1 trang heap 8 KB + 32 KB index |

### Kết quả kiểm thử dữ liệu lớn 198,3 MB và `EXPLAIN (ANALYZE, BUFFERS)` trên Cloud Neon (`recipehub_dev`) ngày 2026-11-07 (lúc 01:10 – 01:13)

Khánh đã chạy script [`database/scripts/seed-cloud-load-200mb.sql`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/database/scripts/seed-cloud-load-200mb.sql) và [`database/scripts/verify-performance-200mb.sql`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/database/scripts/verify-performance-200mb.sql) trực tiếp trên Cloud Neon (`recipehub_dev`, tab `Script-6`):
- **Tổng dung lượng database (`recipehub_dev`)**: **`198 MB` (`198,3 MB`)** — nằm chính giữa ngưỡng mục tiêu **180–220 MB**.
- **Số lượng công thức công khai (`Published` / `Approved`)**: **23 công thức `Published`** (`22` công thức dataset `Approved` + `1` công thức test ban đầu), giữ **278 công thức `Draft / Pending`** làm hàng đợi duyệt cho trang Admin.
- **Thiết kế cách ly UI**: Toàn bộ dữ liệu tải lớn được gắn với duy nhất 1 tài khoản chịu tải chuyên biệt (`perf-load@recipehub.local`, UUID `11111111-2222-4333-8444-555555555555`), giúp giữ sạch 100% danh sách món ăn công khai, bình luận công khai và dữ liệu cá nhân của Khánh / Admin khi gộp code Fullstack.

#### 1. Thống kê Top 10 bảng lớn nhất ở mốc `198,3 MB` (ảnh DBeaver lúc 01:12:52)

| Hạng | Tên bảng (`table_name`) | Số dòng (`approx_rows`) | Dung lượng bảng (`table_size`) | Dung lượng index (`index_size`) | Tổng dung lượng (`total_size`) |
|---|---|---|---|---|---|
| 1 | `AuditLogs` | 575.004 | 132 MB | 34 MB | **166 MB** |
| 2 | `ShoppingListItems` | 50.001 | 10 MB | 6.408 kB | **17 MB** |
| 3 | `RecipeViews` | 18.400 | 1.520 kB | 2.040 kB | **3.592 kB** |
| 4 | `Recipes` | 301 | 192 kB | 360 kB | **584 kB** |
| 5 | `ShoppingLists` | 2.501 | 312 kB | 200 kB | **544 kB** |
| 6 | `RecipeIngredients` | 1.783 | 168 kB | 336 kB | **536 kB** |
| 7 | `RecipeSteps` | 613 | 136 kB | 104 kB | **272 kB** |
| 8 | `RecipeDatasetEntries` | 300 | 64 kB | 72 kB | **168 kB** |
| 9 | `RecipeCategories` | 300 | 24 kB | 80 kB | **128 kB** |
| 10 | `RefreshTokens` | 13 | 8.192 bytes | 80 kB | **88 kB** |

*(Tổng số bản ghi trên toàn database đạt **~649.900 dòng**, `ANALYZE` toàn bộ bảng hoàn tất trong `0,417 giây`).*

#### 2. Đối chiếu Query Plan (`EXPLAIN (ANALYZE, BUFFERS)`) giữa Baseline (6 món / 10 MB) và Tải lớn (301 món / 198,3 MB)

| Truy vấn | Mốc Baseline (6 recipes, 1 Published, ~10,16 MB) | Mốc Tải lớn (301 recipes, 23 Published, 198,3 MB) | Phân tích kỹ thuật |
|---|---|---|---|
| **Full-Text Search** (`Status = 'Published' AND SearchVector @@ websearch_to_tsquery('simple', 'trứng')`) | `Index Scan` trên `IX_Recipes_Status_CreatedAt_Id` + `Filter` (0 dòng trả về, `0,036 ms`, `shared hit=2`) | **`Bitmap Heap Scan`** kết hợp **`BitmapAnd`** giữa B-tree `Status` và **GIN Index `SearchVector`** (`rows=5`, `Heap Blocks: exact=4`, `Buffers: shared hit=8 read=2`, **`actual time=1,532 ms`**) | Khi bảng `Recipes` tăng lên 301 dòng (24 trang heap), bộ tối ưu PostgreSQL 18 tự động kích hoạt **GIN Index (`SearchVector`)** kết hợp `BitmapAnd`, chỉ đọc đúng 4 trang heap chứa 5 món trứng thay vì quét toàn bảng |
| **Admin Analytics 30 ngày** (`RecipeViews` JOIN `Recipes` GROUP BY `Id, Title` ORDER BY `count(*) DESC LIMIT 10`) | Chưa có dữ liệu `RecipeViews` (0 dòng) | `Hash Join` (`18.400 dòng`) → `HashAggregate` (`23 nhóm`, `Memory: 48 kB`) → `top-N heapsort` (`Memory: 26 kB`), `Buffers: shared hit=214`, **`actual time=9,970 ms`** | Gom nhóm 18.400 lượt xem trong 30 ngày hoàn toàn trong bộ nhớ đệm (`shared hit=214`, 0 disk read) dưới **10 ms**, không cần thêm index phụ |

#### 3. Kết quả đo độ trễ HTTP API (`Cold / Warm p50 / Warm p95`) trên DB `198,3 MB` (lúc 01:17)

Khánh chạy [`database/seeds/Measure-ApiPerformance.ps1`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/database/seeds/Measure-ApiPerformance.ps1) từ máy local (`https://localhost:7082`, .NET 10 Kestrel) kết nối trực tiếp tới Cloud Neon Singapore (`recipehub_dev` – `198,3 MB`), mỗi endpoint thực hiện 1 lượt Cold + 20 lượt Warm liên tiếp:

| Endpoint | Cold (`ms`) | Warm Min (`ms`) | **Warm p50 (`ms`)** | **Warm p95 (`ms`)** | Warm Avg (`ms`) | Warm Max (`ms`) | Lỗi / Số lượt |
|---|---|---|---|---|---|---|---|
| `GET /api/v1/recipes (Page 1, 20 items)` | `3050,34` | `104,16` | **`120,61`** | **`130,60`** | `120,95` | `182,95` | `0 / 20` |
| `GET /api/v1/recipes?Q=trứng (Full-Text)` | `126,76` | `92,48` | **`97,15`** | **`107,28`** | `97,34` | `110,62` | `0 / 20` |
| `GET /api/v1/categories` | `70,53` | `47,70` | **`50,88`** | **`55,16`** | `51,46` | `56,37` | `0 / 20` |
| `GET /api/v1/ingredients` | `144,02` | `86,09` | **`92,16`** | **`100,68`** | `92,53` | `102,02` | `0 / 20` |

**Nhận xét hiệu năng HTTP**:
- Lượt `Cold` đầu tiên của `GET /api/v1/recipes` (`3050,34 ms`) bao gồm chi phí khởi tạo kết nối TLS 1.3 + Npgsql connection pool từ Việt Nam sang AWS ap-southeast-1 (Singapore) và biên dịch biểu thức EF Core lần đầu.
- Khi connection pool đã ấm (`Warm`), toàn bộ 4 endpoint đọc dữ liệu trên DB `198,3 MB` đều đạt **`p50` từ `50,88 ms` đến `120,61 ms`** và **`p95` dưới `131 ms`** (trong đó ~40–45 ms là độ trễ mạng khứ hồi Việt Nam ↔ Singapore), tỷ lệ lỗi **0%**.

## Công việc còn lại

Đã xác nhận thủ công qua Swagger HTTPS: GET users/me/recipes trả200, totalCount5, tất cả là Draft của Khánh. GET chi tiết Cơm chiên trứng khi chủ món đã đăng nhập trả đúng summary,5 nguyên liệu và2 bước. Gọi cùng ID với khách trả404. Đây là bằng chứng đọc/phân quyền của lô mẫu.

Rà soát biên tập lô mẫu còn các việc cần người thực hiện: xác nhận định lượng/khẩu phần và thời gian của từng món, mô tả riêng thay placeholder chung, xác nhận nguồn biên soạn và người chịu trách nhiệm duyệt. Dữ liệu thời gian hiện là giá trị nháp, chưa có bằng chứng nấu thử. Các giá trị ảnh, giá tiền và dinh dưỡng còn trống. Cần quy trình cập nhật có kiểm soát vì importer hiện báo conflict khi đổi nội dung cùng DatasetKey, không ghi đè dữ liệu đã nhập.

- Rà soát nội dung và nguồn cho từng món, quyết định xuất bản có ghi nhận người duyệt.
- Kiểm tra quan hệ và thống kê kích thước riêng cho các bảng ứng dụng.
- Mở rộng20,100,300 món sau khi lô mẫu được rà soát.
- Đo query plans và tải API trên dữ liệu đại diện, lưu số liệu trước/sau khi tối ưu index.
- Chạy lại bộ test đầy đủ sau các thay đổi importer trước bàn giao phiên bản tiếp theo.
