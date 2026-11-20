# Báo Cáo Nghiệm Thu Cuối Cùng — RecipeHub (`v1.0.0`)

- **Ngày nghiệm thu:** `2026-11-20`
- **URL triển khai chính thức (HTTPS):** `https://recipehub-bepviet.duckdns.org` *(Let's Encrypt TLS 1.2/1.3, HTTP/2, HSTS, tự chuyển hướng HTTP -> HTTPS & tự động gia hạn)*
- **Repository:** `https://github.com/VanKhangPham/Recipe-pp` (nhánh `main`, tag `v1.0.0`)
- **Phạm vi:** Fullstack Web Application (Next.js 16 + ASP.NET Core .NET 10 + Nginx 1.27), Cơ sở dữ liệu đám mây **AWS RDS PostgreSQL 18 (15.20 GB, 1,091 công thức tiếng Việt có ảnh thật)**, Triển khai **AWS EC2 (Sydney `ap-southeast-2`)**, và **Jenkins CI/CD tự động 6 stage trên VMware Ubuntu**.

---

## 1. Kiến Trúc Hệ Thống Đã Triển Khai

| Lớp | Thành phần | Cấu hình thực tế đã xác minh |
|---|---|---|
| **Reverse Proxy** | `recipehub-gateway` (`nginx:1.27-alpine`) | Cổng `80/443`, `server_tokens off`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, bảo vệ `/health/ready` chỉ cho loopback & mạng nội bộ VPC/Docker |
| **Frontend** | `recipehub-frontend` (**Next.js 16.4.5**, React 19, TypeScript, Turbopack) | Cổng nội bộ `127.0.0.1:3000`, `NODE_OPTIONS="--max-old-space-size=1536"`, `NEXT_PUBLIC_RESTORE_SESSION=true`, hiển thị ảnh trực tiếp `images.unoptimized=true` |
| **Backend API** | `recipehub-api` (**ASP.NET Core .NET 10**, EF Core 10, Npgsql) | Cổng nội bộ `127.0.0.1:8080`, JWT Bearer + Refresh Token Rotation + HttpOnly Cookie (`SameSite=Lax`, `SameAsRequest`) + CSRF `X-CSRF-TOKEN` + Rate Limiting + Trusted `ForwardedHeaders` (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) |
| **Cloud Compute** | AWS EC2 `recipehub-ec2` (`t3.small`, Ubuntu 24.04 LTS, `ap-southeast-2`) | 2 vCPU, 2 GiB RAM + 2 GiB Swap, 30 GiB gp3 (trống 16 GB / 53%), Security Group mở cổng `22, 80, 443` |
| **Cloud Database** | AWS RDS `recipehub-db` (**PostgreSQL 18.3**, `db.t4g.micro`, `ap-southeast-2`) | 60 GiB gp3 (autoscale tới 100 GiB), Private VPC (Security Group `recipehub-rds-sg` **chỉ mở cổng `5432` cho `recipehub-ec2-sg`**), SSL bắt buộc (`SSL Mode=Require`) |
| **CI/CD Server** | Jenkins (`jenkins/jenkins:lts-jdk21`) trên VMware Ubuntu 22.04.5 LTS | RAM 4 GB, 2 CPU, Agent SSH riêng `recipehub-docker-agent` (`1 executor`, `-Xmx256m`), giữ nguyên 100% container/volume/credential dự án cũ |

---

## 2. Dữ Liệu Thực Tế & Kiểm Thử Quy Mô 15.20 GB Trên AWS RDS

### 2.1. Di chuyển dữ liệu & Kho công thức 100% tiếng Việt kèm ảnh thật
- **Di chuyển từ Neon -> AWS RDS Sydney:** Dump `33 MB` (`pg_dump` PostgreSQL 18) từ `recipehub_dev` và restore sạch vào `recipehub` trên AWS RDS (`301` công thức gốc, `96` nguyên liệu, `15` tài khoản, `3` EF Core migrations).
- **Làm giàu & Việt hóa toàn bộ kho món ăn (`import_real_recipes_and_images.py` + `translate_recipes_to_vietnamese.py`):**
  - Xuất bản và làm sạch toàn bộ **301 công thức Việt Nam** gốc (ưu tiên hiển thị đầu trang chủ, gán ảnh món ăn HTTPS thực tế vào `RecipeImages`).
  - Nhập thêm **790 công thức thực tế kèm ảnh thật độ phân giải cao** từ nguồn API mở hợp pháp **TheMealDB** và Việt hóa toàn bộ **772 tên món**, **942 nguyên liệu + đơn vị đo**, **4,698 bước nấu** và mô tả theo ẩm thực từng quốc gia.
  - **Tổng kết dữ liệu công thức thực tế:**
    - `published_recipes`: **1,091 / 1,091 (100%)**
    - `recipes_with_images`: **1,091 / 1,091 (100%)**
    - `total_ingredients`: **1,041 nguyên liệu**
    - `total_steps`: **5,455 bước chế biến**
    - `total_categories`: **9 danh mục**

### 2.2. Kiểm chứng quy mô cơ sở dữ liệu **15.20 GB** trên AWS RDS (`db.t4g.micro`)
- Sử dụng `database/scripts/seed-rds-15gb.sh` (tận dụng **`uuidv7()`** bản địa của PostgreSQL 18 + `OccurredAt` đơn điệu giúp 3 chỉ mục B-tree trên `AuditLogs` ghi tuần tự vào trang cuối, đạt tốc độ `6–8 giây / 250,000 dòng` mà không gây nghẽn RAM `1 GB` của `db.t4g.micro`).
- **Kết quả đo trực tiếp từ PostgreSQL trên AWS RDS (`2026-11-20`):**
  - `db_total_size`: **`15 GB` (`15.20 GB`)**
  - `AuditLogs`: **`35,325,006` dòng** (`15 GB` tổng = `11 GB` table + `4,023 MB` indexes)
  - `ShoppingListItems`: `15 MB` (`11 MB` table + `4,824 kB` indexes)
  - `Recipes`: `3,776 kB` (`1,984 kB` table + `1,752 kB` indexes, gồm GIN `SearchVector`)
  - `RecipeIngredients`: `3,216 kB` | `RecipeViews`: `3,056 kB` | `RecipeSteps`: `2,168 kB` | `RecipeImages`: `512 kB`

---

## 3. Hiệu Năng & Tài Nguyên Thực Tế Sau Triển Khai (Ở Mốc 15.20 GB)

### 3.1. Độ trễ HTTP thực tế qua Nginx -> .NET 10 -> AWS RDS Sydney (`15.20 GB`)

| Endpoint | HTTP Status | Độ trễ thực tế | Kích thước phản hồi | Ghi chú |
|---|---:|---:|---:|---|
| `GET /health/live` | `200` | **`1.33 ms`** | `7 B` | Liveness probe backend |
| `GET /health/ready` | `200` | **`171.11 ms`** | `7 B` | Readiness probe kết nối AWS RDS `15.20 GB` |
| `GET /api/v1/recipes?page=1&pageSize=20` | `200` | **`112.95 ms`** | `32,242 B` | Đã loại bỏ N+1 (trả kèm nguyên liệu trong 1 request) |
| `GET /api/v1/recipes?Q=trứng` | `200` | **`58.13 ms`** | `33,199 B` | Tìm kiếm Full-Text GIN index trên `1,091` công thức |
| `GET /` (Next.js 16 SSR) | `200` | **`4.60 ms`** | `32,503 B` | Trang chủ thiết kế lại kèm Hero & bộ lọc nhanh |

### 3.2. Tài nguyên thực tế trên AWS EC2 (`t3.small`)
- **Tổng RAM tiêu thụ 3 container:** **~288 MiB** (`recipehub-api`: `175.4 MiB`, `recipehub-frontend`: `102.4 MiB`, `recipehub-gateway`: `9.98 MiB`).
- **RAM hệ thống khả dụng:** `1.0 – 1.3 GiB` trống / `1.9 GiB`, Swap `0 B – 244 MiB` / `2.0 GiB`.
- **Ổ đĩa EC2:** `13 GB / 29 GB` (`47%`, còn trống **`16 GB`**).

---

## 4. Kết Quả Kiểm Thử Tự Động (Phân Biệt Rõ Passed & Skipped)

| Bộ kiểm thử | Môi trường chạy | Kết quả thực tế |
|---|---|---|
| **Backend xUnit + PostgreSQL tích hợp** (`RECIPEHUB_RUN_POSTGRES_TESTS=1`) | Local Windows (.NET 10 SDK + PostgreSQL cô lập schema) | **41 passed, 0 failed, 0 skipped** (auth, lockout, refresh rotation/reuse, CSRF, role Admin, recipe concurrency, meal plan, shopping list, dataset import) |
| **Backend xUnit trong Jenkins CI** (`mcr.microsoft.com/dotnet/sdk:10.0`) | VMware Jenkins Agent (`recipehub-docker-agent`) | **26 passed, 0 failed, 15 skipped** *(15 bài opt-in PostgreSQL được bỏ qua có chủ đích trong CI không DB; không tính skipped là passed)* |
| **Frontend Quality Gates** (`node:20-bookworm-slim`) | Local & VMware Jenkins Agent | **ESLint:** `0 errors` (`2` font warnings), **TypeScript (`tsc --noEmit`):** `0 errors`, **Unit Tests (`node --test`):** **18 passed, 0 failed** |
| **Container Smoke Tests** | VMware Jenkins Agent (container cô lập, không chiếm cổng host) | `recipehub-api` `/health/live` -> `200 Healthy`; `recipehub-frontend` `/` -> `HTTP 200` |

---

## 5. Pipeline CI/CD Jenkins & Bảo Mật

- **Pipeline 6 Stage trong [Jenkinsfile](../../Jenkinsfile):**
  1. `Checkout Verification` (agent `recipehub-docker-agent`)
  2. `Backend Build & Unit Tests (.NET 10)` (containerized, cache NuGet riêng, archive `backend_tests.trx`)
  3. `Frontend Lint, Typecheck & Unit Tests (Node 20)` (containerized, cache npm riêng, giới hạn heap `1536 MB`)
  4. `Build Docker Images (Sequential)` (build tuần tự `recipehub-api` rồi `recipehub-frontend` an toàn cho 4 GB RAM)
  5. `Container Smoke Tests` (kiểm thử sống cả 2 image trước khi deploy)
  6. `Deploy to AWS EC2 & Verify Health` (SSH bằng `sshUserPrivateKey` + `-o IdentitiesOnly=yes`, kiểm tra `/health/live`, `/health/ready`, `/`, và **tự động Rollback** về `PREV_COMMIT` nếu kiểm tra sức khỏe thất bại)
- **Quản lý bí mật & Tự động kích hoạt:**
  - `0` secret trong source code; khóa SSH lưu trong Jenkins Credentials riêng (`recipehub-ubuntu-agent-ssh`, `recipehub-ec2-ssh`), host lưu trong biến toàn cục `RECIPEHUB_EC2_HOST`.
  - Kích hoạt tự động bằng **Poll SCM (`H/2 * * * *`)** vượt mạng VMware NAT ổn định (đã xác minh tự động chạy xanh các build `#6`, `#8`, `#9`, `#10`).

---

## 6. Vận Hành, Sao Lưu & Diễn Tập Rollback

- **Tự khởi động sau reboot:** Đã cấu hình và bật `recipehub.service` (`systemctl is-enabled` -> **`enabled`**).
- **Sao lưu AWS RDS hằng đêm (`02:00` sáng):**
  - Cronjob `/home/ubuntu/recipehub/backup_nightly.sh` đã chạy kiểm chứng tạo bản backup `33 MB` tại `/var/backups/recipehub/`.
  - Sau khi mở rộng DB lên `15.20 GB`, script đã tự động bổ sung `--exclude-table-data='public."AuditLogs"'` để bảo vệ ổ đĩa `16 GB` trống của EC2 (sao lưu toàn bộ dữ liệu nghiệp vụ thật ~vài chục MB lên EC2, còn dữ liệu `15.20 GB` được bảo vệ bằng **AWS RDS Automated Backup / Snapshot**).
- **Diễn tập Rollback thực tế trên AWS EC2 (`2026-11-20`):**
  - Rollback `45ed71b` -> `4a5891c`: `live=Healthy | ready=Healthy`.
  - Roll-forward `4a5891c` -> `45ed71b` (`main`): `live=Healthy | ready=Healthy`.

---

## 7. Chứng Chỉ HTTPS & Quản Trị Chi Phí Cloud

- **Domain & HTTPS (Đã hoàn tất):** Đã gắn tên miền miễn phí **`https://recipehub-bepviet.duckdns.org`** (DuckDNS) kèm chứng chỉ **Let's Encrypt** tự động gia hạn hằng ngày (`03:00` sáng), bật **TLS 1.2/1.3, HTTP/2, HSTS**, tự chuyển hướng `HTTP -> HTTPS` (`301`) và truyền `X-Forwarded-Proto: https` để ASP.NET Core tự động gắn cờ **`Secure`** cho Cookie xác thực & CSRF.
- **Chi phí Cloud:** Sử dụng AWS EC2 `t3.small` và RDS `db.t4g.micro` trong hạn mức AWS Credit tại `ap-southeast-2`; khi tạm dừng và khởi động lại EC2, chỉ cần cập nhật IP mới trên DuckDNS và biến `RECIPEHUB_EC2_HOST` trên Jenkins.
