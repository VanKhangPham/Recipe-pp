# RecipeHub — Smart Recipe & Meal Planning Platform

Nền tảng công thức và lập thực đơn. Repository chung cho nhóm ba thành viên.

## Phân công

- **Khánh:** Backend ASP.NET Core, Neon PostgreSQL và triển khai AWS.
- **Khang:** Frontend Next.js, giao diện chung và chức năng công thức.
- **Linh:** Frontend thực đơn/quản trị, Jenkins và kiểm thử E2E.

## Bắt đầu backend

Yêu cầu: .NET 10 SDK; Visual Studio 2026 với workload **ASP.NET and web development** nếu dùng IDE.

Mở `backend/RecipeHub.slnx`, đặt `RecipeHub.Api` làm startup project và chạy profile `http`.

Hoặc chạy trong terminal tại thư mục repository:

```powershell
dotnet restore backend/RecipeHub.slnx
dotnet build backend/RecipeHub.slnx --no-restore
dotnet test backend/RecipeHub.slnx --no-build
dotnet run --project backend/RecipeHub.Api --launch-profile http
```

- Thông tin API: http://localhost:5194/api/v1/system
- Liveness: http://localhost:5194/health/live
- Database readiness: http://localhost:5194/health/ready (503 nếu chưa cấu hình/kết nối được DB)
- OpenAPI JSON (Development): http://localhost:5194/openapi/v1.json

Hướng dẫn chi tiết: [backend/README.md](backend/README.md).
Auth và bàn giao frontend: [docs/testing/AUTH_GUIDE.md](docs/testing/AUTH_GUIDE.md).

## Bắt đầu Frontend (Next.js 16 + React 19)

Yêu cầu: Node.js 20+ và npm.

```powershell
cd frontend
npm install
npm run dev
```

- Giao diện người dùng: http://localhost:3000
- Bảng điều khiển quản trị (Admin): http://localhost:3000/admin

## Chạy Fullstack bằng Docker Compose

Khởi chạy đồng thời 3 container (`recipehub-api`, `recipehub-frontend`, `recipehub-gateway` Nginx):

```powershell
docker compose up -d --build
```

## Tài liệu thiết kế & Báo cáo kiểm định

- [Yêu cầu và tiêu chí nghiệm thu](docs/requirements/REQUIREMENTS.md)
- [Kiến trúc hệ thống](docs/ARCHITECTURE.md)
- [ERD, data dictionary, indexes và delete rules](database/documentation/DATABASE_DESIGN.md)
- [API contract](docs/API_CONTRACT.md)
- [Báo cáo kiểm định dữ liệu, hiệu năng 198.3 MB & Sao lưu phục hồi](docs/DATA_QUALITY_REPORT.md)
- [Hướng dẫn triển khai AWS EC2 & Vận hành Production](docs/DEPLOYMENT_AWS_GUIDE.md)
- [Lộ trình hoàn thành & Nghiệm thu](docs/KHANH_COMPLETION_PLAN.md)
- [Tiến độ và bằng chứng kiểm tra](docs/PROGRESS.md)

## Trạng thái hiện tại (Cập nhật 16/11/2026)

- **Backend & Database:** Hoàn thiện 100% các API nghiệp vụ (Auth, Recipes, Importer, Meal Planner, Shopping List, Reviews, Favorites, Admin & Analytics). Cơ sở dữ liệu Cloud Neon PostgreSQL 18.6 (`recipehub_dev`) đã nạp **301 công thức ẩm thực Việt** (23 công khai, 278 chờ duyệt), **96 nguyên liệu chuẩn hóa**, cùng **198.3 MB dữ liệu kiểm thử tải** (`575.004` AuditLogs, `50.001` ShoppingListItems, `18.400` RecipeViews).
- **Frontend:** Hợp nhất thành công nhánh `khang_frontend` vào `main`, kết nối trực tiếp Live API với Backend và Cloud Neon.
- **DevOps (Docker, Jenkins, Backup, AWS):** Đã đóng gói `backend.Dockerfile`, `frontend.Dockerfile`, `docker-compose.yml`, `Jenkinsfile` (6 stages CI/CD) và diễn tập thành công `pg_dump` / `pg_restore` 100% không mất dữ liệu.

Bàn giao backend cho nhóm: [docs/BACKEND_HANDOFF.md](docs/BACKEND_HANDOFF.md).
