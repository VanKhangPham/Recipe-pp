# Chạy backend bằng container

Chạy các lệnh dưới đây tại thư mục gốc repository trong PowerShell.

```powershell
docker build -f infrastructure/docker/backend.Dockerfile -t recipehub-api:local .
docker run --rm --name recipehub-api -p 127.0.0.1:8080:8080 --env-file .env.backend.local recipehub-api:local
```

Tạo `.env.backend.local` trên máy chạy container, điền cấu hình thực và giữ file ngoài Git. Mỗi dòng có dạng `Tên=Giá trị`. Cần `ASPNETCORE_ENVIRONMENT=Production`, `ConnectionStrings__DefaultConnection`, `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience` và `Cors__AllowedOrigins__0`. Đối chiếu cấu hình JWT với hướng dẫn auth trước khi chạy. Connection string dùng định dạng Npgsql và database dành cho môi trường tương ứng.

Kiểm tra `http://localhost:8080/health/live` và `http://localhost:8080/health/ready`. Readiness cần kết nối được database. Áp dụng migration đã review trước khi kiểm thử nghiệp vụ. Container khởi động API, việc áp dụng migration do người triển khai thực hiện riêng.

Image chạy bằng tài khoản ứng dụng tích hợp của .NET. Khi triển khai AWS, đặt API sau HTTPS reverse proxy, giữ cổng API ở mạng nội bộ và cấu hình origins theo frontend thực tế. Trước khi sử dụng refresh cookies trên production, kiểm chứng HTTPS, proxy headers và khả năng duy trì cookie/Data Protection qua lần restart.

Trạng thái ngày 2026-11-05 — Dockerfile đã được soạn. Máy làm việc hiện chưa có lệnh Docker khả dụng nên image chưa được build hoặc chạy thử. RecipeHub chưa có EC2 được xác nhận đã tạo. Các bước HTTPS, restart/reboot, logs và rollback cần được thực hiện trên máy đích trước nghiệm thu AWS.
