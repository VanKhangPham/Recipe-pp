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

## 2026-11-06 — Docker được kiểm chứng trên Windows

Docker Desktop Linux Engine đã chạy. CLI tại C:\Users\ADMIN\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe. Build image recipehub-api:local từ backend.Dockerfile thành công.

Container recipehub-api-local chạy Production, bind127.0.0.1:8080, uid1654(app), kết nối lấy từ User Secrets ở runtime. Khóa JWT ngẫu nhiên chỉ phục vụ kiểm tra container local. Không lưu secrets vào image/repository. Liveness/readiness200 Healthy, system200, ingredients read200, Swagger404. Restart container và kiểm tra lại liveness/readiness đều200. Các kiểm tra này chỉ đọc DB.

Container còn chạy để Khánh xem trong Docker Desktop. Chưa kiểm chứng auth/cookies qua HTTPS trong container, Jenkins, AWS hoặc reboot Windows. Không dùng kết quả này làm nghiệm thu production.

## 2026-11-06 — Image cập nhật importer và review

Build recipehub-api:local từ mã hiện tại thành công. Image ID4359cd51acf098a7e18c2056ce54b5abb7a8001ab54134fc807bc71cea5419eb. Chạy dry-run trong image với thư mục data mount read-only trả5 drafts. Container Production tạm ở localhost8081 trả200 cho health/live,health/ready,system vàingredients read, sau đó đã tự dọn. Kết nối Neon lấy từ User Secrets vào environment runtime; không ghi database trong bước kiểm tra. Để dùng image này trên container8080 hiện có cần tạo lại container từ image mới. Chưa kiểm chứng HTTPS/auth trên container mới hoặc Jenkins/AWS.

## 2026-11-06 — Cập nhật container local tại8080

Container cũ đã dừng, được giữ tên recipehub-api-backup để quay lui. Container recipehub-api-local mới dùng image4359cd51acf098a7e18c2056ce54b5abb7a8001ab54134fc807bc71cea5419eb, bind127.0.0.1:8080. Liveness/readiness/system/ingredients đều200. Restart xong readiness tiếp tục200. Runtime environment được tái sử dụng kín đáo từ container local trước đó. Chưa kiểm chứng auth/HTTPS hoặc tự khởi động cùng máy. Không áp dụng migration hoặc nhập dữ liệu trong bước này.

## 2026-11-07 — Image `recipehub-api:d1bb66e` (ForwardedHeaders & DataProtection Persistence)

- Bổ sung `UseForwardedHeaders` (`X-Forwarded-For`, `X-Forwarded-Proto`), `DataProtection:KeysPath`, `infrastructure/nginx/recipehub.conf` và `infrastructure/docker/docker-compose.backend.yml`.
- Build image gắn đồng thời 2 tag `recipehub-api:local` và `recipehub-api:d1bb66e` (manifest `sha256:6f5cd2ba811c8f63eed3ed3abf641be1494bb5bc0f2d1d600f258a060aacde35`).
- Kiểm chứng chốt chặn bảo mật Production: khi truyền `Jwt__Key` 53 byte (< 64 byte), container từ chối khởi động đúng thiết kế; khi truyền `Jwt__Key` >= 64 byte UTF-8 và `DataProtection__KeysPath=/tmp/dpkeys`, container `recipehub-api-local` lên `Healthy` cho cả `/health/live` và `/health/ready` trên database Cloud Neon `198,3 MB`.
