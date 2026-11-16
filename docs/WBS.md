# Kế hoạch 8 tuần và bàn giao

Đây là kế hoạch dự kiến, không phải tiến độ đã hoàn thành. Mỗi milestone có PR nhỏ, người khác review, tests phù hợp và cập nhật tài liệu. Không chuyển phase tự động khi chưa được xác nhận.

## Tuần 1 — Phase 1: nền tảng và thiết kế

- Khánh: backend skeleton, requirements, architecture, ERD và API baseline; cùng nhóm review auth/ownership và schema.
- Khang: rà soát API, wireframes, danh sách component và routes; kiểm tra công nghệ frontend.
- Linh: test plan, rà soát quyền truy cập Jenkins/GitHub/agents; xác định các màn hình thực đơn/admin.
- Nghiệm thu: backend build/tests, nhóm thống nhất API và trách nhiệm file. Phần tài liệu đã soạn cần nhóm review; frontend chưa được tạo trong phase này.

## Tuần 2 — Phase 2: persistence và môi trường chạy

- Khánh: chọn EF/Npgsql tương thích, DbContext, Identity schema, migrations review, Neon development/test, seed small.
- Khang: khởi tạo Next.js, layout, providers, API client và trang khung; sở hữu package/lockfile/root styles.
- Linh: Jenkins backend restore/build/tests, test plan, hỗ trợ Docker Compose sau khi thống nhất Dockerfiles.
- Bàn giao: schema và DB test hợp lệ, frontend gọi system endpoint, pipeline có báo cáo thật nếu truy cập Jenkins được.

## Tuần 3 — Identity và Recipes

- Khánh: register/login/refresh/logout, ownership/roles, ingredients/categories và recipe CRUD; unit/integration tests.
- Khang: login/register/profile, recipe listing/detail/create/edit; tích hợp API thật.
- Linh: nền Playwright, tests auth và quyền truy cập; dùng component Khang để dựng meal-planner.
- Nghiệm thu: đăng nhập và tạo/xem/sửa recipe chạy xuyên suốt; 401/403/404 được kiểm tra.

## Tuần 4 — Search và tương tác

- Khánh: full-text/filter/pagination, favorites/reviews, indexes; Dockerfile backend; bản EC2 tối thiểu sau tests.
- Khang: search/filter, favorites/reviews và Dockerfile frontend.
- Linh: tests luồng tìm kiếm/yêu thích, CI frontend, kiểm tra image publish với commit SHA.
- Nghiệm thu: giao diện dùng API thật; Jenkins fail chặn publish; Khánh kiểm tra bản staging và tài nguyên máy.

## Tuần 5 — Meal planning và quản trị

- Khánh: meal-plans, shopping-list transactions, ownership và analytics/admin endpoints.
- Khang: hoàn thiện UI công thức/hồ sơ, hỗ trợ component và accessibility; review UI của Linh.
- Linh: thực đơn tuần, shopping-list, dashboard/users/recipes/review moderation; tests phân quyền.
- Nghiệm thu: scale khẩu phần/gộp đơn vị đúng; không đọc dữ liệu của người khác; admin APIs có policy.

## Tuần 6 — Gợi ý và dữ liệu lớn

- Khánh: scoring recommendation, nguồn dataset được phép, seeder idempotent, kiểm tra dung lượng và indexes.
- Khang: responsive/SEO/hiệu năng các trang public và trạng thái lỗi.
- Linh: UI gợi ý, performance/integration tests, lưu kết quả thực nghiệm và xác minh dung lượng với Khánh.
- Nghiệm thu: minh bạch dữ liệu thật/mô phỏng, đo DB, không vượt quota, không có số liệu bịa.

## Tuần 7 — CI/CD và AWS

- Khánh: Nginx/HTTPS, environment secrets, readiness, backups, deployment/rollback và đo RAM EC2.
- Khang: sửa lỗi frontend, production config và smoke tests.
- Linh: hoàn thiện Jenkins tests → images → bàn giao SHA; chỉ thêm auto-deploy khi nhóm xác nhận; lưu reports và kiểm thử hồi quy.
- Nghiệm thu: triển khai online, HTTPS, DB hoạt động, rollback và restore có bằng chứng thực tế.

## Tuần 8 — Báo cáo và demo

- Khánh: chương kiến trúc/database/backend/AWS, bằng chứng schema/migrations và vận hành.
- Khang: chương frontend/UI/UX, screenshots và user guide.
- Linh: chương testing/CI/CD, reports/pipeline evidence và tổng hợp demo checklist.
- Cả nhóm: rà soát Definition of Done, công khai phần thiếu, demo từ dữ liệu kiểm thử đã chuẩn bị.

## Quy trình nhánh và Pull Request

- `main` giữ trạng thái tích hợp; không push trực tiếp, bật branch protection khi có quyền quản trị.
- Khánh: `codex/khanh-backend`; Khang: `codex/khang-frontend`; Linh: `codex/linh-planner-ci`. Khi công việc lớn nên tách nhánh theo feature từ main mới nhất.
- Commit công việc đang làm trước khi `git fetch origin` rồi `git merge origin/main`. Không force push nhánh dùng chung.
- PR nêu hành vi, file/module, cách kiểm tra, thay đổi contract/migration; cần một người review và checks đã cấu hình thành công. Chưa có checks Jenkins thì phải ghi rõ.
- Squash merge từng chức năng nhỏ. Sau merge, mọi người cập nhật main; xung đột phải đọc cả hai thay đổi và cùng chủ file xử lý.
- API thay đổi phải cập nhật contract và báo cho frontend; thay dependency frontend phối hợp với Khang; AWS scripts phối hợp với Khánh; Jenkinsfile phối hợp với Linh.
