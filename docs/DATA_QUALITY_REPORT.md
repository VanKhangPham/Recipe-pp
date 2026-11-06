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

## Công việc còn lại

Đã xác nhận thủ công qua Swagger HTTPS: GET users/me/recipes trả200, totalCount5, tất cả là Draft của Khánh. GET chi tiết Cơm chiên trứng khi chủ món đã đăng nhập trả đúng summary,5 nguyên liệu và2 bước. Gọi cùng ID với khách trả404. Đây là bằng chứng đọc/phân quyền của lô mẫu.

Rà soát biên tập lô mẫu còn các việc cần người thực hiện: xác nhận định lượng/khẩu phần và thời gian của từng món, mô tả riêng thay placeholder chung, xác nhận nguồn biên soạn và người chịu trách nhiệm duyệt. Dữ liệu thời gian hiện là giá trị nháp, chưa có bằng chứng nấu thử. Các giá trị ảnh, giá tiền và dinh dưỡng còn trống. Cần quy trình cập nhật có kiểm soát vì importer hiện báo conflict khi đổi nội dung cùng DatasetKey, không ghi đè dữ liệu đã nhập.

- Rà soát nội dung và nguồn cho từng món, quyết định xuất bản có ghi nhận người duyệt.
- Kiểm tra quan hệ và thống kê kích thước riêng cho các bảng ứng dụng.
- Mở rộng20,100,300 món sau khi lô mẫu được rà soát.
- Đo query plans và tải API trên dữ liệu đại diện, lưu số liệu trước/sau khi tối ưu index.
- Chạy lại bộ test đầy đủ sau các thay đổi importer trước bàn giao phiên bản tiếp theo.
