# RecipeHub — Yêu cầu hệ thống

Trạng thái: baseline thiết kế Phase 1, chưa phải danh sách chức năng đã triển khai.

## Mục tiêu và phạm vi

Nhóm 3 người, 8 tuần. Modular Monolith và REST API; Next.js App Router/TypeScript ở frontend, ASP.NET Core .NET 10 ở backend, EF Core/Npgsql và Neon PostgreSQL ở tầng dữ liệu. Jenkins kiểm thử và đóng gói trước khi Khánh triển khai trên EC2 Amazon Linux 2023.

Database mục tiêu 180–220 MB gồm bảng và indexes; số bản ghi là dự kiến, không phải tiêu chí thay thế dung lượng thực đo. Ảnh chỉ lưu URL/object key, không lưu binary lớn trong PostgreSQL.

## Vai trò

- Khách: xem/tìm công thức công khai, xem đánh giá, đăng ký/đăng nhập.
- User: quản lý hồ sơ, sở thích, công thức của mình, yêu thích, đánh giá, thực đơn và danh sách mua sắm riêng.
- Admin: quản lý người dùng/danh mục/công thức, kiểm duyệt đánh giá và xem thống kê toàn hệ thống.
- Quyền sở hữu phải kiểm tra ở API, không chỉ ẩn nút trên frontend. Đăng ký không được tự chọn vai trò Admin.

## Yêu cầu chức năng và nghiệm thu

1. Identity: đăng ký email duy nhất; đăng nhập; refresh rotation; logout; hồ sơ và sở thích. Sai thông tin đăng nhập trả lỗi chung, không trả password hash hay refresh token qua DTO hồ sơ.
2. Recipes: danh sách công khai có phân trang; chi tiết; tạo/sửa/xóa thuộc quyền sở hữu hoặc Admin; nguyên liệu và bước nấu có thứ tự; bản nháp chỉ chủ sở hữu/Admin thấy.
3. Search: lọc tên/nội dung, nguyên liệu, danh mục, tags, thời gian; full-text search PostgreSQL, sort theo whitelist.
4. Ingredients/Categories: khách đọc; Admin quản lý danh mục nguyên liệu dùng chung; không xóa mục đang được tham chiếu.
5. Favorites: mỗi cặp user/recipe tối đa một bản ghi; thêm/xóa lặp lại không gây trùng.
6. Reviews: một đánh giá mỗi user/recipe, điểm nguyên 1–5, sửa/xóa bởi tác giả hoặc Admin. Chỉ hiển thị đánh giá đã được phép công khai.
7. MealPlanning: thực đơn tuần thuộc user, thêm món vào ngày/bữa, đổi khẩu phần; không truy cập thực đơn người khác.
8. ShoppingLists: sinh từ thực đơn, gộp cùng ingredient và unit, không tự cộng các đơn vị khác nhau; đánh dấu mua, sửa lượng. Sinh lại không tạo trùng; không âm thầm ghi đè các mục đã chỉnh tay.
9. Recommendations: scoring content-based theo nguyên liệu/danh mục/thời gian, sau đó bổ sung sở thích/yêu thích/lịch sử; có fallback cho người mới. Công khai công thức tính điểm, có ví dụ và tests; không gọi là mô hình đã huấn luyện.
10. Analytics/Admin: thống kê lượt xem, công thức phổ biến, yêu thích, hoạt động; chỉ Admin truy cập thống kê quản trị.

## Yêu cầu phi chức năng

- DTO, validation, HTTP status chuẩn, Problem Details, cancellation, giới hạn pageSize và rate limiting phù hợp.
- Logging có cấu trúc; không ghi password, bearer token, refresh token, connection string vào logs.
- Public recipe pages có SEO; giao diện responsive, nhãn form, bàn phím, loading/empty/error states.
- Unit tests xUnit; integration tests dùng PostgreSQL test riêng; Playwright kiểm thử các luồng chính.
- Health liveness tách readiness database. Đã có cả hai endpoint; readiness mới xác minh trường hợp thiếu cấu hình, chưa kết nối Neon thật.
- Jenkins phải chặn publish/deploy khi tests fail; image gắn commit SHA; có lưu báo cáo test.
- EC2 cần đo RAM thực tế trước khi đưa đủ container lên; không tự nâng instance hoặc phát sinh phí.
- HTTPS, secrets theo môi trường, backup và khôi phục cần được kiểm chứng trước khi tuyên bố hoàn thành.

## Dữ liệu seed và bằng chứng

Seed small/medium/large, chạy lại an toàn, batch inserts, FK hợp lệ; phân biệt dữ liệu thật/mô phỏng. Chỉ chọn dataset sau khi kiểm tra giấy phép. Đo `pg_database_size`, có giới hạn dừng, không seed tự động vào production. Không bịa kết quả hiệu năng, pipeline hoặc triển khai.

## Điều kiện hoàn thành toàn dự án

Core và advanced đã cam kết hoạt động qua frontend/API thật; Neon có quan hệ hợp lệ và đạt dung lượng; tests, Jenkins, Docker, AWS, HTTPS hoạt động; có tài liệu và bằng chứng thực nghiệm. Thiếu mục nào phải ghi rõ.

## Quyết định cần chốt trước module liên quan

- Neon project/database development, test, production và quyền truy cập.
- Nguồn dataset/giấy phép, nơi lưu ảnh và hạn mức.
- Domain/HTTPS, tài nguyên EC2 thực tế, registry và retention images.
- Chi tiết trải nghiệm duyệt công thức/đánh giá và quy trình khóa tài khoản.
- API auth baseline đề xuất nằm trong `../API_CONTRACT.md`; cần nhóm rà soát trước khi triển khai giao diện auth.
