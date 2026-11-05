# Bàn giao backend RecipeHub

Ngày đối chiếu 2026-11-05. Khánh phụ trách backend/database/AWS, Khang phụ trách frontend công thức, Linh phụ trách frontend thực đơn/quản trị cùng Jenkins/E2E.

## Khởi chạy trên máy thành viên

1. Lấy đúng commit backend đã thống nhất từ GitHub. Tại thời điểm lập tài liệu, thay đổi còn ở workspace Khánh và chưa push.
2. Cài .NET 10 SDK, mở backend/RecipeHub.slnx. Đặt RecipeHub.Api làm startup project, chọn profile http.
3. Cấu hình Neon development bằng User Secrets theo backend/README.md. Mỗi máy cần cấu hình riêng. Thông tin bí mật được trao qua kênh riêng của nhóm.
4. Chạy API. Kiểm tra /health/live và /health/ready tại http://localhost:5194. Readiness yêu cầu kết nối DB và đủ migrations.
5. Mở /openapi/v1.json và RecipeHub.Api.http để kiểm tra route, payload và response. localhost luôn chỉ máy đang chạy trình duyệt. Khi frontend chạy trên máy khác, cần địa chỉ backend có thể truy cập và CORS phù hợp.

Frontend dùng base URL http://localhost:5194/api/v1 khi API chạy cùng máy. Cấu hình CORS cho origin frontend thực tế. Xem docs/testing/AUTH_GUIDE.md để tích hợp CSRF, cookies và bearer token. Access token giữ trong bộ nhớ. Bootstrap Admin theo hướng dẫn vận hành trong backend, dùng tài khoản riêng để thử phân quyền.

## Công việc Khang

- Làm API client dùng chung, xử lý Problem Details, phân trang và trạng thái loading/empty/error.
- Tích hợp đăng ký, đăng nhập, hồ sơ, danh sách/tìm kiếm/chi tiết công thức và form tạo/sửa.
- Tích hợp favorites và đánh giá. Lọc ingredientIds bằng tham số lặp lại.
- RecipeDetail chứa summary, vì vậy đọc summary.id và summary.title. Phản hồi danh sách có items/page/pageSize/totalCount/totalPages.
- Kiểm tra Draft chỉ hiển thị với chủ món hoặc Admin. DELETE công thức chuyển sang Archived.

## Công việc Linh

- Tích hợp thực đơn tuần, món theo ngày/bữa và khẩu phần. weekStart là thứ Hai, định dạng YYYY-MM-DD.
- Tích hợp sinh shopping list và chỉnh lượng/đánh dấu đã mua. Sinh lại trả danh sách hiện có, giữ các chỉnh sửa.
- Làm màn hình Admin users, catalog, recipes, reviews và analytics. Dùng tài khoản Admin và kiểm tra tài khoản User nhận403.
- Tích hợp recommendations với score và reasons từ API.
- Chuẩn bị Jenkins restore/build/tests rồi build image theo commit SHA, lưu báo cáo. Kiểm thử PostgreSQL thật là opt-in với credentials development/test được quản lý riêng.

## Bằng chứng kiểm thử và giới hạn

Bộ đầy đủ gần nhất đạt29/29 trước các endpoint catalog chi tiết mới. Các lượt HandoffApiTests sau đó đã kiểm tra catalog, ownership, cập nhật đồng thời, khóa tài khoản và readiness bằng PostgreSQL schema tạm. MealWorkflowTests đã xác minh quyền sở hữu, tính khẩu phần và sinh shopping list lặp lại.

Lỗi500 gián đoạn ở cập nhật công thức từng xuất hiện. Lượt chẩn đoán có hai cập nhật đồng thời và năm cập nhật liên tiếp đã đạt, nhưng chưa xác định nguyên nhân lỗi gián đoạn. Test logger hiện thu loại exception/SQLSTATE để hỗ trợ chẩn đoán. Đây là mục còn mở khi bàn giao.

Khánh còn phải hoàn thiện dataset/seed lớn, đo dung lượng và hiệu năng, kiểm chứng Docker, triển khai AWS/HTTPS, backup/restore và báo cáo cuối. Dockerfile đã soạn, image chưa được kiểm chứng trên máy này. Chưa có bằng chứng Jenkins hoặc EC2 RecipeHub chạy hoàn chỉnh.

## Quy trình phối hợp

Khang và Linh làm trên nhánh riêng, tạo pull request vào nhánh tích hợp nhóm thống nhất. Khánh bàn giao một commit cụ thể và cập nhật API_CONTRACT khi payload thay đổi. Mỗi lỗi tích hợp cần ghi method, URL, HTTP status và traceId cùng dữ liệu mẫu đã loại secrets. Chạy tests trước merge, dùng image gắn commit SHA để triển khai đúng phiên bản.
