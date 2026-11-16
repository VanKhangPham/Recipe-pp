# Quy trình Backup, Restore Database (PostgreSQL 18) và Rollback Container

Tài liệu này hướng dẫn quy trình sao lưu, khôi phục dữ liệu PostgreSQL 18.6 và quay lui (rollback) phiên bản container Backend theo **Mục 9** của [`docs/KHANH_COMPLETION_PLAN.md`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/docs/KHANH_COMPLETION_PLAN.md).

---

## 1. Công cụ & Nguyên tắc Bảo mật
- **Tương thích phiên bản**: Server Cloud Neon chạy **PostgreSQL 18.6**, do đó bắt buộc dùng `pg_dump` và `pg_restore` **phiên bản 18.x** (chạy trực tiếp từ container chính thức `postgres:18` để không phụ thuộc bản `pg_dump` 17 cài rời trên máy).
- **Bảo mật file backup**:
  - Thư mục `backups/` và các đuôi `*.dump`, `*.bak` đã được chặn trong [`.gitignore`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/.gitignore).
  - Tuyệt đối không commit file `.dump` lên Git vì chứa bảng `AspNetUsers` và `RefreshTokens`.
- **Không ghi đè môi trường đang chạy khi diễn tập**: Mọi bài kiểm tra khôi phục (`pg_restore`) phải chạy vào database cách ly (`recipehub_restore_verify`).

---

## 2. Chạy Diễn tập Tự động (Backup → Restore cách ly → Kiểm tra số dòng → Rollback Container)

Tại thư mục gốc `D:\ST23D\2026-2027\Dev-ops\Buoi15\Recipe-pp`, mở **PowerShell** (khi Docker Desktop đang chạy) và thực thi:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\database\seeds\Invoke-BackupRestoreDrill.ps1
```

Script [`database/seeds/Invoke-BackupRestoreDrill.ps1`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/database/seeds/Invoke-BackupRestoreDrill.ps1) thực hiện 5 bước tự động:
1. Kiểm tra phiên bản `pg_dump --version` và `pg_restore --version` (PostgreSQL 18).
2. Chạy `pg_dump --format=custom --no-owner --no-privileges --schema=public` (backup **đầy đủ** schema + dữ liệu, gồm cả dữ liệu tải lớn) từ `recipehub_dev` trên Cloud Neon ra file nén `backups/recipehub_dev_curated_pg18.dump` và đo thời gian sao lưu.
3. Khởi tạo container `postgres:18` độc lập (`recipehub-restore-drill`), chờ server chính sẵn sàng qua TCP (`pg_isready -h 127.0.0.1`, tránh nhầm server tạm lúc khởi tạo), nạp file `.dump` vào database cách ly `recipehub_restore_verify` bằng `pg_restore` và đo thời gian khôi phục (RTO).
4. Truy vấn đối chiếu toàn bộ 29 bảng trong `public` (`total_recipes = 301`, `published_recipes = 23`, `dataset_entries = 300`, `ingredients = 96`, `recipe_ingredients = 1783`, `recipe_steps = 613`, `categories = 7`, `roles = 2`, `users = 3`), sau đó tự động dọn container test.
5. Thực hiện diễn tập **Rollback** container `recipehub-api-local` về image ổn định trước đó (`4359cd51...`), kiểm tra `/health/live` & `/health/ready` (`Healthy`), rồi **Roll-forward** trở lại phiên bản hiện hành (`recipehub-api:d1bb66e`).

---

## 3. Lệnh Rollback Thủ công khi Vận hành (AWS EC2 / Local Docker)

Khi phiên bản mới gặp sự cố sau khi triển khai, quay lui về image theo mã commit SHA ổn định trước đó:

```powershell
docker rm -f recipehub-api
docker run -d --name recipehub-api --restart unless-stopped `
  -p 127.0.0.1:8080:8080 `
  --env-file .env.backend.local `
  -v recipehub_dpkeys:/var/lib/recipehub/dpkeys `
  recipehub-api:<PREVIOUS_COMMIT_SHA>
curl -f http://localhost:8080/health/ready
```

---

## 4. Bằng chứng Diễn tập Thực nghiệm ngày 2026-11-07 (Lúc 01:47 – 02:00)

Khánh đã chạy [`database/seeds/Invoke-BackupRestoreDrill.ps1`](file:///D:/ST23D/2026-2027/Dev-ops/Buoi15/Recipe-pp/database/seeds/Invoke-BackupRestoreDrill.ps1) trong PowerShell với kết quả thực tế:

1. **Phiên bản công cụ PostgreSQL 18**:
   - `pg_dump (PostgreSQL) 18.6 (Debian 18.6-1.pgdg13+2)`
   - `pg_restore (PostgreSQL) 18.6 (Debian 18.6-1.pgdg13+2)`
2. **Kết quả Sao lưu (`pg_dump -Fc` từ Cloud Neon `recipehub_dev` `198,3 MB`)**:
   - Thời gian sao lưu qua mạng: **`32,35 giây`** (lượt đầu `40,54 giây`).
   - Kích thước file nén custom archive (`recipehub_dev_curated_pg18.dump`): **`32.791,37 KB` (~32,02 MB)**.
3. **Kết quả Khôi phục cách ly (`pg_restore` vào container `postgres:18` độc lập `recipehub_restore_verify`)**:
   - Thời gian khôi phục toàn bộ 29 bảng, PK/FK/indexes và ~650.000 bản ghi (**RTO**): **`3,95 giây`** (lượt trước `3,97 giây`).
4. **Bảng đối chiếu số lượng bản ghi sau khi Restore (`recipehub_restore_verify` vs Cloud Neon `recipehub_dev`)**:

| Chỉ số kiểm tra | Cloud Neon (`recipehub_dev`) | DB Khôi phục cách ly (`recipehub_restore_verify`) | Trạng thái |
|---|---|---|---|
| Số bảng `public` (`BASE TABLE`) | 29 | **29** | Khớp 100% |
| `Recipes` (Tổng / `Published`) | 301 / 23 | **301 / 23** | Khớp 100% |
| `RecipeDatasetEntries` (Tổng / `Approved`) | 300 / 22 | **300 / 22** | Khớp 100% |
| `Ingredients` | 96 | **96** | Khớp 100% |
| `RecipeIngredients` | 1.783 | **1.783** | Khớp 100% |
| `RecipeSteps` | 613 | **613** | Khớp 100% |
| `Categories` | 7 | **7** | Khớp 100% |
| `AspNetRoles` / `AspNetUsers` | 2 / 14 | **2 / 14** | Khớp 100% |
| `RecipeViews` | 18.400 | **18.400** | Khớp 100% |
| `ShoppingListItems` | 50.001 | **50.001** | Khớp 100% |
| `AuditLogs` | 575.004 | **575.004** | Khớp 100% |
| Dung lượng DB sau khôi phục (`restored_db_size`) | 198,3 MB | **188 MB** *(đã nén gọn dead tuples)* | Hợp lệ |

5. **Kết quả Diễn tập Rollback & Roll-Forward Container (`port 8080`)**:
   - Rollback về `recipehub-api:3c78330`: `live=Healthy, ready=Healthy`.
   - Roll-forward lên `recipehub-api:d1bb66e`: `live=Healthy, ready=Healthy`.
