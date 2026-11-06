# Chuẩn bị môi trường Windows

## Khánh — backend/database/AWS

- Visual Studio 2026 Community, workload **ASP.NET and web development**, .NET 10 SDK tương thích bản Visual Studio đang dùng.
- Git, DBeaver; Docker Desktop khi bắt đầu đóng gói (kiểm tra WSL2/virtualization).
- PostgreSQL trên Neon, không cần cài PostgreSQL server trên máy để theo thiết kế cloud.
- AWS SSH key, Neon connection string và registry tokens giữ ngoài repository; chưa cần cấp để đọc/soạn Phase 1.
- AWS CLI chỉ cần khi quy trình vận hành yêu cầu; không cần để viết backend.

Kiểm tra bằng terminal:

```powershell
dotnet --version
dotnet --list-sdks
git --version
docker --version
docker compose version
docker info
```

`docker --version` chỉ chứng minh CLI tồn tại, không chứng minh daemon đang chạy. DBeaver: mở Help → About để xem phiên bản; thử kết nối Neon sau khi có database và credentials. Bật TLS theo hướng dẫn Neon tại thời điểm kết nối; không tắt xác minh TLS để né lỗi.

Visual Studio: Help → About để xem phiên bản; Visual Studio Installer → Modify để kiểm tra workload. Mở `backend/RecipeHub.slnx`, startup `RecipeHub.Api`, profile `http`, Ctrl+F5. API: http://localhost:5194/api/v1/system.

Chạy build/tests từ thư mục repository theo `backend/README.md`. Nếu dùng HTTPS local: `dotnet dev-certs https --trust` trên máy cá nhân.

## Khang/Linh — frontend và CI

Node.js LTS và package manager theo lockfile frontend khi Khang khởi tạo; không tạo nhiều loại lockfile. Kiểm tra:

```powershell
node --version
npm --version
git --version
```

Playwright browsers và dependencies cần cài trên máy/CI phù hợp khi test suite đã có. Jenkins trong Docker không tự có SDK, browsers hoặc Docker daemon; Linh phải kiểm tra thực tế trước viết pipeline.

## Kết quả đã quan sát trên máy Khánh

- .NET SDK 10.0.402 và Visual Studio Community trong thư mục phiên bản18.
- Git 2.56.0.windows.2, Node.js v24.22.0.
- Workload Visual Studio, Docker daemon, DBeaver, Neon và AWS chưa được xác minh.
- Không tự nâng cấp/cài thêm công cụ khi chưa cần cho milestone hiện tại.
