# Lộ trình hoàn thành phần Khánh và nghiệm thu RecipeHub

Ngày cập nhật2026-11-06. Đây là kế hoạch công việc đề xuất từ trạng thái đã kiểm chứng, thực hiện theo lệnh từng bước của Khánh. Khánh phụ trách backend/database/AWS, Khang và Linh phụ trách frontend; Linh phối hợp Jenkins/E2E. Thứ tự có thể điều chỉnh khi nhóm có ràng buộc mới.

## 1. Chốt phiên bản mã nguồn đang có

- Rà git status, diff và các file untracked. Kiểm tra secrets, tài liệu, dữ liệu mẫu và loại các file sinh tự động.
- Đồng bộ API_CONTRACT, BACKEND_HANDOFF, README và CHAT_HANDOFF_PROMPT với importer/review, Docker và baseline đã làm.
- Commit/push nhánh khanh_backend. Xác minh PR hiện có và nhánh tích hợp nhóm thống nhất trước merge.
- Gửi nhóm mã commit, cách chạy, biến môi trường cần cấu hình và lỗi còn mở. Mỗi thành viên tạo nhánh từ cùng bản tích hợp.
- Nghiệm thu khi máy thành viên lấy đúng commit có thể restore/build, chạy API và gọi system/health. Repo đã push đầy đủ, secrets được quản lý riêng.

## 2. Hoàn thiện dữ liệu mẫu và phạm vi dataset

- Khánh/nhóm kiểm tra nội dung5 món, khẩu phần, định lượng, thời gian và bước nấu. Chỉ ghi nhận nấu thử khi có thực nghiệm.
- Quyết định quyền sử dụng nội dung AI hỗ trợ, nguồn gốc văn bản/ảnh, nội dung ghi công và người duyệt. Chuẩn bị tài khoản Admin thật bằng bootstrap hiện có.
- Chọn nội dung đủ điều kiện, duyệt qua API có audit, kiểm tra Approved vẫn giữ Draft và chỉ publish khi quyết định công khai đã đủ bằng chứng.
- Rà các yêu cầu vùng miền, mẹo nấu, chi phí và provenance theo master dataset. Chốt trường nào thuộc bản nghiệm thu, thêm migration/API tương ứng khi được yêu cầu. Hiện các trường này chưa đầy đủ.
- Hoàn thiện mô tả riêng từng món, ảnh hợp lệ hoặc placeholder do dự án sở hữu. Dinh dưỡng/chi phí cần nguồn và cách tính, giữ trống khi thiếu căn cứ.
- Bổ sung alias nguyên liệu được review và quy tắc đơn vị. Có chính sách xử lý khác biệt dấu/viết hoa/từ đồng nghĩa và dữ liệu cũ.
- Nghiệm thu khi lô mẫu đủ chất lượng, nguồn/giấy phép truy vết được và xuất hiện đúng trên API công khai. Các món chưa đạt vẫn giữ trạng thái chờ.

## 3. Mở rộng importer và dữ liệu20→100→300

- Mở rộng từ lô đã rà soát, tránh biến thể trùng để đủ số lượng. Lưu dataset key ổn định, nguồn từng món và báo cáo chất lượng.
- Rà importer khi file lỗi, thiếu trường, trùng tên/key, slug conflict, nguyên liệu sai, ký tự tiếng Việt, hủy giữa chừng và chạy đồng thời. Dry-run có lỗi dễ đối chiếu theo món.
- Chốt nhu cầu CSV/batch/checkpoint và cập nhật dataset theo version. Bản hiện tại hỗ trợ JSON, một transaction cả lô tối đa300, thay đổi cùng key báo conflict. Chỉ bổ sung khả năng cần cho dữ liệu thực tế và master prompt đã chốt.
- Kiểm tra tác giả tồn tại và quyền/trạng thái tài khoản cho tác vụ nhập. Kiểm tra thay đổi thủ công sau import được bảo vệ theo chính sách.
- Mỗi mốc nhập kiểm tra số lượng, FK, số món thiếu nguyên liệu/bước, trùng slug/key, trạng thái nguồn và quyền hiển thị. Giữ bằng chứng nhập lại tạo0 bản ghi mới.
- Nghiệm thu khi số lượng cam kết đã đạt với chất lượng/nguồn kiểm chứng và báo cáo thực tế. Nếu thay đổi mục tiêu300 cần thống nhất với yêu cầu nghiệm thu.

## 4. Kiểm thử dữ liệu lớn và hiệu năng

- Giữ baseline6 món đã đo. Chọn tập truy vấn đại diện gồm full-text có/không kết quả, danh sách, nhiều nguyên liệu, category/tag, sort rating/time, recommendations và analytics.
- Dùng dữ liệu tương tác mô phỏng ở database test riêng, có nhận diện và quy trình dọn. Bao phủ favorites/reviews/views/meal plans/shopping lists mà không đưa đánh giá giả lên giao diện thật.
- Kiểm tra hạn mức Neon và ngân sách trước tăng dữ liệu. Mục tiêu180–220MB là tải thử nghiệm, phân biệt rõ với dữ liệu curated.300 công thức có thể nhỏ hơn nhiều.
- Đo số dòng, kích thước bảng/index, query plans và tải API. Ghi môi trường, version, cấu hình, dữ liệu, concurrency, số lượt, warm/cold, lỗi và p50/p95.
- Thống nhất ngưỡng chấp nhận với nhóm trước khi kết luận đạt. Tách độ trễ SQL, network và toàn HTTP. So sánh nhiều lượt dưới cùng điều kiện.
- Chỉ thay index/query khi thấy điểm nghẽn qua số liệu. Đo lại trước/sau, kiểm tra chi phí ghi và dung lượng. Không ép sử dụng GIN chỉ để có hình query plan.
- Nghiệm thu khi có báo cáo số liệu tái lập, truy vấn/tải đạt ngưỡng thống nhất và các thay đổi được kiểm thử hồi quy.

## 5. Chốt độ ổn định và bảo mật backend

- Kiểm tra lỗi500 gián đoạn nếu tái xuất hiện bằng traceId/exception/SQLSTATE đã loại secrets. Theo dõi timeout Neon riêng với lỗi nghiệp vụ.
- Rà race conditions của publish/review/archive, khóa tài khoản/refresh, thay child collections và nhập dữ liệu. Kiểm tra rollback, nhập lặp và phục hồi sau lỗi.
- Kiểm tra quyền sở hữu/role, JWT hết hạn/sai, lockout, logout/refresh reuse, CSRF/origin, CORS, rate limit, validation/null/giới hạn input và cache dữ liệu riêng.
- Rà việc trả lỗi và logging production. Không để lộ stack trace/secrets hoặc khóa bảo mật Development trong production.
- Chạy bộ tests trên đúng commit bàn giao và PostgreSQL tương thích. Bổ sung regression test theo lỗi thực tế.36/36 là mốc hiện có, cần ghi số thực tế sau thay đổi.
- Nghiệm thu khi các luồng đã cam kết đạt, còn lỗi được phân loại rõ, lỗi chặn nghiệm thu đã xử lý và có báo cáo từ đúng phiên bản.

## 6. Tích hợp frontend song song

- Khang làm auth/profile/recipes/search/favorites/reviews và API client chung. Linh làm planner/shopping/recommendations/admin/analytics.
- Khánh cung cấp OpenAPI/DTO, sample request, account User/Admin dùng development, quy tắc lỗi và dữ liệu demo hợp lệ. Secrets trao qua kênh riêng.
- Khánh xử lý lỗi API/CORS/cookie/timezone/pagination khi frontend tích hợp, cập nhật contract có thông báo cho người dùng endpoint.
- Nhóm chạy các luồng đăng ký→đăng nhập→tạo/sửa/tìm món→favorite/review→thực đơn→shopping list, cùng admin moderation/analytics và kiểm tra quyền.
- Khang/Linh phụ trách responsive/loading/empty/error/accessibility và Playwright frontend. Khánh hỗ trợ dữ liệu/endpoint để E2E tái lập.
- Nghiệm thu khi thao tác trên frontend thật có phản hồi và dữ liệu đúng, kể cả tài khoản thường/khách/người sở hữu/Admin.

## 7. Docker và Jenkins

- Giữ bản build Docker đã kiểm chứng. Chốt cách tạo lại container bằng secrets môi trường và image theo commit SHA, thay local tag trong bản triển khai chính thức.
- Hoàn thiện cấu hình proxy/HTTPS, forwarded headers theo trusted proxy, JWT ổn định và Data Protection persistence theo mô hình triển khai. Kiểm tra auth/cookies qua restart/recreate.
- Xây pipeline Jenkins cùng Linh: checkout→restore→build→tests→báo cáo→build image→smoke test→publish registry. PostgreSQL test riêng hoặc container tạm, credentials được Jenkins quản lý.
- Tests fail phải chặn publish/deploy. Lưu reports và liên kết commit/image. Tách việc chạy PR không tin cậy khỏi quyền publish secrets.
- Kiểm tra agent, Docker permissions, registry, retention images và quy trình chạy từ máy thành viên. Chỉ gọi pipeline hoàn chỉnh khi có Jenkins run thực tế.
- Nghiệm thu khi một commit đã chạy pipeline thành công, báo cáo truy cập được và image đúng SHA được phát hành. Có bằng chứng fail tests chặn bước sau.

## 8. AWS, database production và HTTPS

- Chốt tài khoản AWS,region,ngân sách,domain/HTTPS,registry và cấu hình môi trường. RecipeHub cần tài nguyên đích riêng được xác nhận, phân biệt GenZFashion.
- Tạo EC2 với tài nguyên phù hợp, cấu hình SSH/key, security group, cập nhật hệ điều hành và Docker. Giới hạn cổng public theo mô hình reverse proxy.
- Chốt Neon production/development và quyền database. Cấu hình secrets ngoài Git, TLS, connection limits và migrations được review trước triển khai.
- Triển khai image đã qua Jenkins, cấu hình reverse proxy/domain/chứng chỉ, forwarded headers và trusted proxy. Kiểm tra auth/cookies/CORS từ frontend thật.
- Cấu hình restart policy/service, log rotation, health monitoring, thông báo lỗi cần thiết. Đo RAM/CPU/disk khi đầy đủ dịch vụ hoạt động.
- Nghiệm thu khi truy cập domain HTTPS được, API/E2E đạt, container lên lại sau reboot và có logs theo traceId. Ghi chi phí/tài nguyên thực tế.

## 9. Backup, restore và rollback

- Dùng pg_dump/pg_restore tương thích PostgreSQL18. Chọn vị trí backup, mã hóa/quyền truy cập, retention và lịch chạy theo yêu cầu.
- Backup chứa cả dữ liệu và schema cần thiết. Thử restore vào database cách ly, đối chiếu số dòng, FK, tài khoản/role và API. Không ghi đè production khi diễn tập.
- Quy định mục tiêu mất dữ liệu/thời gian phục hồi với nhóm. Chỉ công bố đạt sau đo thực tế.
- Lưu phiên bản image trước và cấu hình liên quan. Thử rollback image, kiểm tra tương thích migration/schema. Có kế hoạch phục hồi dữ liệu khi schema đổi không tương thích.
- Nghiệm thu khi có file backup hợp lệ, restore diễn tập thành công và bằng chứng rollback ứng dụng cùng hướng dẫn vận hành.

## 10. Bàn giao cuối và hoàn thành dự án

- Tổng hợp hướng dẫn cài/chạy, cấu hình, schema/migrations, API, nguồn dữ liệu, pipeline/deploy/backup/rollback, lỗi đã biết và phân công.
- Chụp ảnh UI,API,DBeaver,tests,Jenkins,Docker,HTTPS và restore theo phiên bản nghiệm thu. Giữ credentials ngoài ảnh.
- Tổng hợp báo cáo unit/integration/E2E/security/performance, quy mô dataset/dung lượng và giới hạn còn lại. Không tính tests skipped thành passed.
- Chuẩn bị tài khoản demo, dữ liệu demo đã được phép công khai và kịch bản đi hết luồng chính. Diễn tập nhóm trên môi trường triển khai.
- Nhóm hoàn thiện báo cáo cuối, đối chiếu master prompt/rubric và xử lý mọi thiếu sót chặn nghiệm thu. Tag phiên bản cuối trên Git sau khi kiểm tra.
- Phần Khánh hoàn thành khi backend/database/deploy/vận hành đã có bằng chứng, frontend tích hợp đạt và tài liệu bàn giao đủ cho thành viên khác thực hiện. Hoàn thành toàn dự án còn phụ thuộc các đầu việc frontend và báo cáo của cả nhóm.

## Bước thực hiện gần nhất

1. Rà và chuẩn bị commit/push bản code đang có để nhóm lấy đúng phiên bản.
2. Khánh xác nhận cách rà nội dung/quyền của5 món và tài khoản Admin trước duyệt thật.
3. Mở rộng lô20 đã kiểm chứng, sau đó tăng100/300 và đo lại.
4. Linh/Khang tích hợp frontend và chuẩn bị Jenkins song song.

Mỗi bước cần cập nhật PROGRESS và CHAT_HANDOFF_PROMPT với kết quả thực tế, việc chưa đạt và thao tác kế tiếp của Khánh.
