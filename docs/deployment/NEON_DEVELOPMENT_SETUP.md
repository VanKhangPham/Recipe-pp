# Neon development — kiểm tra trước khi kết nối backend

## Trạng thái bàn giao

Khánh đã xác nhận ở chat học PostgreSQL: Neon project my-first-project, branch mặc định tên production, database neondb và schema learning. Tên branch production không có nghĩa RecipeHub đã triển khai production. Chưa xác nhận có database recipehub_dev hoặc database test riêng.

Backend đã có EF model và migration offline. Không cài lại ORM hoặc tạo các bảng ứng dụng bằng SQL tay. Bước đầu chỉ kiểm tra môi trường.

## Bước 1 — Kiểm tra bằng DBeaver

Mở SQL editor cho kết nối Neon đang dùng. Bôi đen và chạy từng SELECT trong `database/scripts/preflight-development.sql` bằng Ctrl+Enter:

1. `connected_database` xác định database của kết nối hiện tại.
2. Danh sách database hiển thị các DB trong branch đang kết nối; không liệt kê DB thuộc branch khác.
3. Danh sách bảng chỉ thuộc database hiện tại; xem learning/public là hai schema khác nhau.

Không chứa password/token/connection string trong kết quả. Chỉ cần cung cấp tên database và schema/bảng để quyết định bước tiếp theo. Không chạy lại INSERT cũ. Nếu editor báo transaction đang lỗi, dừng và xác định bài transaction trước; không tự COMMIT để né lỗi.

## Bước 2 — Chọn database ứng dụng

Sau khi đọc kết quả, ưu tiên database development riêng tên recipehub_dev để tách các bảng học. Chưa tạo DB trong lượt chuẩn bị này. Kiểm tra hạn mức tài khoản Neon trước thao tác tạo và không chọn dịch vụ/gói trả phí. Nếu muốn dùng neondb, phải ghi rõ quyết định, kiểm tra public chưa có bảng trùng và giữ nguyên learning; không coi database học là production.

Database là cấp chứa schemas; tạo schema learning không phải tạo database mới. Tạo thêm database trên cùng branch cũng không tách riêng tài nguyên compute/quota của branch và không thay thế một môi trường test độc lập.

## Bước 3 — Kết nối backend sau khi đã chọn DB

Trong Visual Studio, mở Manage User Secrets của RecipeHub.Api theo backend/README.md. Nhập credentials tại máy cá nhân, không gửi vào chat. Dùng host/database đúng môi trường đã chọn; backend hướng dẫn TLS VerifyFull, không đồng nhất với cấu hình require hiện có trong DBeaver.

Chạy API và kiểm tra `/health/live`, `/health/ready`. Readiness200 chỉ chứng minh kết nối, chưa chứng minh migration đã áp dụng. Không chạy SQL migration cho tới khi xác định đúng DB và review script.

## Nguồn chính thức

- Neon quản lý database: https://neon.com/docs/manage/databases
- Npgsql SSL modes: https://www.npgsql.org/doc/api/Npgsql.SslMode.html
