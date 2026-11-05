# Backend — hướng dẫn cho Khánh

## 1. Công cụ và mở solution

Máy đã có SDK 10.0.402. `global.json` yêu cầu SDK 10.0.100 và cho phép các feature band .NET 10 mới hơn để các máy trong nhóm dùng được SDK tương thích.

Trong Visual Studio Installer, chọn Visual Studio 2026 → Modify → **ASP.NET and web development**.
Mở **Open a project or solution** → `backend/RecipeHub.slnx`.
Không tạo project mới bên ngoài repository; mọi người cùng dùng solution này.
Nhấn chuột phải `RecipeHub.Api` → **Set as Startup Project**.
Chọn profile `http`, nhấn Ctrl+F5 hoặc F5 để debug.
Profile HTTPS có sẵn; nếu dùng cần tin cậy development certificate bằng `dotnet dev-certs https --trust` trên máy cá nhân.

## 2. Các project

- `RecipeHub.Domain`: entities và quy tắc nghiệp vụ; không phụ thuộc project khác.
- `RecipeHub.Application`: use cases, DTOs, validation và interfaces; tham chiếu Domain.
- `RecipeHub.Infrastructure`: EF Core, Neon, Identity và các triển khai interfaces; tham chiếu Application.
- `RecipeHub.Api`: HTTP controllers và cấu hình dependency injection; tham chiếu Application và Infrastructure.
- `RecipeHub.Tests`: xUnit, kiểm thử API startup, system endpoint, OpenAPI, CORS, readiness và model PostgreSQL. Đã có integration tests opt-in chạy PostgreSQL thật trên schema tạm.

Đây là một ứng dụng triển khai chung. Các module nghiệp vụ sẽ được thêm dần trong các tầng, không tạo microservices riêng.

## 3. Chạy và kiểm thử

Từ thư mục gốc repository:

```powershell
dotnet restore backend/RecipeHub.slnx
dotnet build backend/RecipeHub.slnx --no-restore
dotnet test backend/RecipeHub.slnx --no-build
dotnet run --project backend/RecipeHub.Api --launch-profile http
```

API dùng `http://localhost:5194`; Next.js dự kiến `http://localhost:3000`.
CORS Development chỉ cho phép origin Next.js này. Nếu đổi cổng, cập nhật `Cors:AllowedOrigins`.
Production phải cấu hình origin thực tế; không bật wildcard.
Chưa có Swagger UI; `/openapi/v1.json` là tài liệu OpenAPI dạng JSON.

Trong Visual Studio: **Test → Test Explorer → Run All Tests**.
CI có thể dùng `dotnet test backend/RecipeHub.slnx --configuration Release --logger trx`.

## 4. Persistence và Neon

Đã thêm EF Core/Identity EF 10.0.13 và Npgsql provider 10.0.3. Restore và build đã xác nhận các dependencies tương thích.
`RecipeHubDbContext` chứa Identity, RefreshTokens, Recipes, RecipeSteps, RecipeImages, Ingredients, RecipeIngredients, Categories và RecipeCategories. Các module còn lại sẽ bổ sung qua migration sau.
Migration `InitialIdentityAndRecipes` đã tạo; Khánh đã áp dụng vào recipehub_dev và cung cấp ảnh migration history cùng16 bảng. Bộ tests auth cũng đã chạy migration trên schema tạm độc lập.
Không đưa connection string hay JWT key vào Git.
Để cấu hình Development: chuột phải `RecipeHub.Api` → **Manage User Secrets**, nhập trên máy cá nhân:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<NEON_HOST>;Port=5432;Database=<DEV_DATABASE>;Username=<DEV_USER>;Password=<PASSWORD>;SSL Mode=VerifyFull;Timeout=10;Command Timeout=30"
  }
}
```

Thay placeholders bằng thông tin database development. Đây là định dạng Npgsql, không dán nguyên URL `postgresql://...` vào cấu hình này. Xác minh host/database và chính sách TLS từ Neon trước sử dụng; không tắt xác minh TLS. Không gửi secrets vào chat. User Secrets nằm ngoài repository và không được mã hóa, chỉ dùng Development. Production dùng secret/environment của máy chủ.

`.env.example` chỉ liệt kê tên cấu hình; .NET hiện không tự đọc `.env`.
Không dùng database production để chạy integration tests hoặc seed thử nghiệm.

- `/health/live` trả200 khi API hoạt động, kể cả chưa cấu hình DB.
- `/health/ready` trả503 khi thiếu cấu hình hoặc không kết nối được DB; trả200 khi kết nối được và không có migration của ứng dụng đang chờ áp dụng. Migration đang chờ trả503. Kiểm tra dựa trên lịch sử EF, chưa phát hiện mọi thay đổi schema bằng SQL thủ công.
- API không tự tạo database, chạy migrations hoặc seed khi startup.
- Đã có endpoints đăng ký/đăng nhập/refresh/logout/CSRF và GET/PUT users/me. Role User tạo an toàn trong lần đăng ký đầu; đã có lệnh bootstrap Admin có kiểm tra thông tin tài khoản. Xem [hướng dẫn auth](../docs/testing/AUTH_GUIDE.md) để tích hợp, cấu hình JWT và chạy PostgreSQL tests có chủ đích.

## 5. Review migration offline

Từ thư mục repository:

```powershell
dotnet tool restore
dotnet build backend/RecipeHub.slnx --configuration Release
dotnet ef migrations has-pending-model-changes --project backend/RecipeHub.Infrastructure --startup-project backend/RecipeHub.Infrastructure --configuration Release --no-build
dotnet ef migrations script 0 InitialIdentityAndRecipes --idempotent --project backend/RecipeHub.Infrastructure --startup-project backend/RecipeHub.Infrastructure --configuration Release --no-build --output database/scripts/initial-identity-recipes.sql
```

Design-time factory chỉ cấu hình provider, không đọc secrets hoặc chứa connection string. Vì vậy tạo migration/SQL không cần Neon; `database update` qua factory này không có kết nối mặc định. Runtime API mới đọc cấu hình từ User Secrets/environment.

SQL tại `database/scripts/initial-identity-recipes.sql` đã được Khánh chạy qua DBeaver trên recipehub_dev; không cần chạy lại từng đoạn. Khi áp dụng ở môi trường mới: xác định DB development/test riêng, kiểm tra bảng trùng tên, review SQL và quyền. Không tạo các bảng ứng dụng bằng tay trước migration. Không áp dụng script vào schema `learning` hoặc database có dữ liệu khi chưa có kế hoạch phù hợp. Bảng mặc định nằm trong schema public.

Tests có model/SQL/unique indexes/delete rules, HTTP startup/JWT/CSRF và opt-in PostgreSQL auth integration tests với schema tạm. Đã chạy auth tests trên Neon thật; chưa có kiểm thử đầy đủ cho recipe CRUD, duplicate slug, FK nghiệp vụ hoặc kết quả full-text search.

## 6. Thứ tự công việc tiếp theo

1. Chốt ERD và hợp đồng API với Khang/Linh.
2. Cấu hình Neon development bằng secrets trên máy Khánh.
3. Review và áp dụng migration đầu tiên trên DB test/development đã xác định; kiểm thử PostgreSQL thật.
4. Identity, đăng ký/đăng nhập/phân quyền và tests.
5. CRUD công thức, tìm kiếm, yêu thích và đánh giá.
6. Thực đơn, mua sắm, gợi ý và thống kê.
7. Docker và AWS; Linh chạy Jenkins trước khi Khánh triển khai images đã kiểm thử.

Backend đã có API auth, công thức, catalog, favorites/reviews, thực đơn, shopping list, gợi ý và quản trị cùng kiểm thử PostgreSQL. Xem docs/BACKEND_HANDOFF.md ở thư mục gốc repository để biết trạng thái nghiệm thu và các việc còn mở.

## 7. Nguồn công nghệ

- .NET 10 / Visual Studio 2026: https://learn.microsoft.com/en-us/dotnet/core/install/windows
- .NET SDK và Visual Studio tương thích: https://learn.microsoft.com/en-us/dotnet/core/porting/versioning-sdk-msbuild-vs
- Npgsql EF provider: https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/10.0.3
- Identity EF: https://www.nuget.org/packages/Microsoft.AspNetCore.Identity.EntityFrameworkCore/10.0.13

## Gửi thử API trong Visual Studio

Mở `backend/RecipeHub.Api/RecipeHub.Api.http`, chạy RecipeHub.Api bằng profile http rồi chọn Send Request phía trên từng khối. Các khối health, catalog và tìm kiếm chạy được trước khi đăng nhập. Đối chiếu ID nguyên liệu với catalog. Với chi tiết công thức, dùng ID trả về từ danh sách hoặc trường summary.id sau khi tạo món.

Các khối cần đăng nhập yêu cầu access token hợp lệ. Giữ giá trị thật trong bản sao `.http` ở ngoài repository hoặc cấu hình biến riêng của HTTP client. File trong Git chỉ chứa placeholders. Không gửi token thật vào commit hoặc ảnh chụp. Dùng tài khoản Admin thật cho hai khối quản trị.

Danh sách ingredientIds được truyền bằng tham số lặp lại như `?ingredientIds=id1&ingredientIds=id2`. Trạng thái Draft dùng để thử tạo món cá nhân. API review/gợi ý công khai cần món Published. Mỗi khối là một yêu cầu độc lập và người dùng chủ động chọn gửi, nên khối POST tạo món chỉ gửi khi muốn tạo thêm dữ liệu.
