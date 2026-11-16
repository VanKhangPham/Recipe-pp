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

## Tài liệu thiết kế Phase 1

- [Yêu cầu và tiêu chí nghiệm thu](docs/requirements/REQUIREMENTS.md)
- [Kiến trúc](docs/ARCHITECTURE.md)
- [ERD, data dictionary, indexes và delete rules](database/documentation/DATABASE_DESIGN.md)
- [API contract đề xuất cho frontend/backend](docs/API_CONTRACT.md)
- [Use cases và sequence diagrams](docs/diagrams/USE_CASES.md)
- [Kế hoạch 8 tuần và phân công](docs/WBS.md)
- [Chuẩn bị Windows/Visual Studio](docs/WINDOWS_SETUP.md)
- [Tiến độ và bằng chứng kiểm tra](docs/PROGRESS.md)

Tài liệu contract/schema mô tả thiết kế cần nhóm review, không có nghĩa các endpoint/bảng đã được triển khai.

## Trạng thái

Đã có bộ khung backend, EF Core/Npgsql/Identity stores và migration đầu tiên cho tài khoản/công thức/nguyên liệu/danh mục. Khánh đã áp dụng migration trên recipehub_dev và cung cấp ảnh xác nhận.
Đã có API auth và hồ sơ. Khánh đã xác nhận readiness Healthy, migration history và16 bảng trong recipehub_dev; tests auth đã chạy qua PostgreSQL với schema tạm riêng. Chưa có API nghiệp vụ công thức, frontend, Docker, Jenkins hoặc triển khai AWS.
Liveness chỉ kiểm tra tiến trình API, không kiểm tra database.

Bàn giao backend cho nhóm: [docs/BACKEND_HANDOFF.md](docs/BACKEND_HANDOFF.md).
