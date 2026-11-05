# Tiến độ RecipeHub

## 2026-11-04 — Khởi tạo bộ khung backend cho Khánh

### Phạm vi

Chuẩn bị solution .NET chạy được và hướng dẫn Visual Studio. Đây là một phần khởi tạo; chưa hoàn thành toàn bộ Phase 1 trong master prompt (requirements đầy đủ, ERD, use cases, WBS và API contract nghiệp vụ còn thiếu).

### Đã thực hiện

- Tiếp tục từ bốn project net10.0 có sẵn trong thư mục làm việc.
- Giữ hướng tham chiếu Domain ← Application ← Infrastructure; API tham chiếu Application và Infrastructure.
- Thêm Controllers, Problem Details, OpenAPI Development, liveness và cấu hình CORS.
- Thêm project xUnit với 6 trường hợp kiểm thử qua host API thực tế trong bộ nhớ.
- Thêm `.gitignore`, `.env.example`, `global.json` và hướng dẫn backend.
- Không sửa frontend, không chạy migrations, không kết nối Neon hoặc AWS.
- Không commit hoặc push GitHub.

### Lệnh và kết quả thực tế

SDK kiểm tra được: 10.0.402. Máy có Visual Studio Community trong `Microsoft Visual Studio/18/Community`; chưa kiểm tra workload bằng Visual Studio Installer.

```powershell
dotnet restore backend/RecipeHub.slnx --packages .nuget/packages --verbosity minimal
dotnet build backend/RecipeHub.slnx --no-restore --configuration Release
dotnet test backend/RecipeHub.slnx --no-build --configuration Release --logger trx
git diff --check
```

- Restore: thành công.
- Build Release: thành công, 0 warnings, 0 errors.
- xUnit: 6 passed, 0 failed, 0 skipped.
- Kiểm thử bao gồm: liveness không cần database, system endpoint, OpenAPI Development/Production và CORS cho origin hợp lệ/không hợp lệ.
- Test report `.trx` được sinh trong `backend/RecipeHub.Tests/TestResults/` và được bỏ qua bởi Git.
- Git diff check: không có lỗi khoảng trắng; có thông báo chuẩn hóa LF/CRLF trên Windows.

Trong môi trường agent, restore/build cần chạy với quyền công cụ mở rộng do giới hạn truy cập mạng và tiến trình. Kiểm thử đã chạy thành công sau khi cho phép. Chưa kiểm tra bằng trình duyệt hoặc thao tác F5 trong Visual Studio.

### Tiếp theo và phân công

- Khánh: xác nhận solution mở/chạy được trong Visual Studio; thiết kế ERD, API contract rồi thêm EF Core/Npgsql và Neon.
- Khang: giao diện chung, tài khoản và công thức; thống nhất cấu trúc DTO với Khánh trước tích hợp.
- Linh: giao diện thực đơn/quản trị và Jenkins; có thể dùng các lệnh build/test đã xác minh làm nền cho pipeline.
- AWS: thực hiện sau khi có bản ứng dụng phù hợp để đóng gói và kiểm thử; chưa có thao tác cloud hoặc phát sinh chi phí.

Trạng thái: **Completed** cho bộ khung backend; **Partial** cho Phase 1 của toàn dự án.

## 2026-11-04 — Thiết kế nền tảng cho phần việc Khánh

### Mục tiêu và kết quả

Hoàn thiện baseline tài liệu Phase 1 để backend và frontend phát triển theo cùng hợp đồng. Không triển khai Phase 2 hoặc sửa mã nguồn API trong lượt này.

- Thêm requirements và tiêu chí nghiệm thu theo module.
- Thêm architecture, ranh giới project/modules, vận hành và luồng CI/CD.
- Thêm ERD Mermaid, data dictionary, cardinality, unique/check constraints, delete rules, indexes và kế hoạch full-text search.
- Bổ sung RefreshTokens cùng FamilyId/rotation/revoke, mô tả các bảng Identity phụ trợ.
- Thêm API contract v1 cho auth, recipe, danh mục, favorites/reviews, meal-planning, shopping-list, recommendations và admin; phân biệt rõ API hiện có với API dự kiến.
- Thêm use cases, 3 sequence diagrams, WBS 8 tuần, quy trình Git/PR và hướng dẫn Windows.
- Tạo script SQL chỉ đọc kiểm tra dung lượng database và thư mục giữ chỗ cho seed/infrastructure/testing/deployment/report.
- Cập nhật README liên kết tài liệu. Frontend do Khang/Linh phụ trách, chưa khởi tạo.

### Xác minh

- Kiểm tra lại cây file, trạng thái Git, liên kết tài liệu local và whitespace.
- Script SQL chưa chạy vì chưa có kết nối PostgreSQL; schema/constraints chưa được xác minh bằng migrations hoặc DB thực tế.
- Mermaid là source trong Markdown, chưa render kiểm tra bằng công cụ Mermaid.
- Không chạy lại build/xUnit vì lượt này chỉ bổ sung tài liệu và script SQL đọc dữ liệu; kết quả mã nguồn gần nhất vẫn là build Release 0 lỗi/0 warnings và 6/6 tests ở mục trước.
- Chưa commit/push, chưa kết nối Neon, chưa truy cập Jenkins hay AWS.

### Cách sử dụng và bước tiếp theo

Mở README để điều hướng. Khang/Linh đọc API_CONTRACT.md trước khi tích hợp UI. Khánh rà soát DATABASE_DESIGN.md trước khi viết EF configuration.

Quyết định còn cần xác nhận: baseline auth/cookie/CSRF, ERD và dữ liệu bắt buộc của recipe, tài khoản/DB Neon development và test, nguồn dataset/media, registry và tài nguyên EC2. Không gửi secrets vào chat hoặc Git.

Sau khi nhóm xác nhận thiết kế, Phase 2 của Khánh là chọn EF Core/Npgsql tương thích, triển khai entities/DbContext/Identity, tạo và review migration đầu tiên; chỉ áp dụng vào database đã xác định rõ. Khang dựng frontend; Linh chuẩn bị tests/Jenkins và nhận UI từ nền Khang.

Trạng thái: **Completed** cho baseline tài liệu và bộ khung Phase 1 trong repository; nhóm cần review các quyết định trước khi bắt đầu Phase 2. Các tính năng nghiệp vụ, DB thực tế, frontend và deployment vẫn chưa hoàn thành.

## 2026-11-04 — Phase 2, milestone persistence ban đầu

### Mục tiêu và phạm vi

Thêm EF Core/Npgsql và Identity stores, tạo schema nền tảng để review offline. Không coi đây là hoàn thành toàn bộ Phase 2 hoặc authentication nghiệp vụ.

### Đã thực hiện

- Domain: Recipe, RecipeStep, RecipeImage, Ingredient, RecipeIngredient, Category, RecipeCategory.
- Infrastructure: ApplicationUser/RefreshToken, RecipeHubDbContext, Fluent mappings, IdentityCore DI và design-time factory không có connection string.
- Tạo unique/check constraints, precision numeric, delete rules, indexes, generated tsvector có trọng số và GIN index.
- Package cố định: EF Core/Identity EF/EF Design/dotnet-ef 10.0.13, Npgsql EF provider 10.0.3. Restore/build thành công; công cụ không dùng bản preview.
- API: UserSecretsId, đăng ký infrastructure; liveness không phụ thuộc DB, readiness kiểm tra CanConnect và trả503 khi thiếu cấu hình/DB không truy cập được.
- Tạo migration `InitialIdentityAndRecipes`, snapshot và SQL idempotent `database/scripts/initial-identity-recipes.sql` để review.
- Tests: thêm kiểm tra model SQL/unique/delete rules và HTTP readiness, tổng cộng10 tests.
- Cập nhật README, hướng dẫn local secrets/Neon và trạng thái thiết kế.

### Lệnh đã chạy và kết quả

```powershell
dotnet restore backend/RecipeHub.slnx --packages .nuget/packages
dotnet tool restore
dotnet build backend/RecipeHub.slnx --no-restore --configuration Release
dotnet ef migrations add InitialIdentityAndRecipes --project backend/RecipeHub.Infrastructure --startup-project backend/RecipeHub.Infrastructure --configuration Release --no-build --output-dir Persistence/Migrations
dotnet ef migrations script 0 InitialIdentityAndRecipes --idempotent --project backend/RecipeHub.Infrastructure --startup-project backend/RecipeHub.Infrastructure --configuration Release --no-build --output database/scripts/initial-identity-recipes.sql
dotnet ef migrations has-pending-model-changes --project backend/RecipeHub.Infrastructure --startup-project backend/RecipeHub.Infrastructure --configuration Release --no-build
dotnet test backend/RecipeHub.slnx --no-build --configuration Release --logger trx
```

- Build cuối: 0 warnings, 0 errors.
- Model/snapshot: không có thay đổi chưa được migration ghi nhận.
- xUnit cuối:10 passed,0 failed,0 skipped. Đây là model/provider và HTTP in-memory tests, không phải PostgreSQL integration tests.
- Đã kiểm tra SQL sinh ra có FK delete rules, unique indexes, generated column và GIN.
- Lần build đầu thiếu framework reference cho health checks; đã sửa bằng Microsoft.AspNetCore.App và build lại thành công. Một số lần kiểm tra quyền công cụ hết thời gian; thử lại đã chạy thành công, không còn bước kiểm thử bị chặn vì quyền.

### Chạy và bàn giao

Khánh mở solution và chạy profile http như trước. Chưa có connection string vẫn chạy system/liveness; readiness503 là dự kiến. Cấu hình Neon development trong Manage User Secrets trên project API theo backend/README.md; không gửi secrets vào chat/Git.

Linh có thể tiếp tục dùng lệnh build/test hiện tại cho CI mà chưa cần DB; tests PostgreSQL thật cần DB test riêng khi bổ sung. Khang tiếp tục frontend theo API contract; hiện chưa có API auth/recipes thật để tích hợp.

### Giới hạn và bước tiếp theo

- Không tạo/kết nối/sửa database cloud; chưa chạy migration SQL hoặc seed; chưa kiểm tra constraints/full-text trên PostgreSQL thật.
- Readiness chỉ kiểm tra kết nối, không chứng minh schema đúng hoặc đủ migrations.
- Identity stores không đồng nghĩa đã có JWT/login/refresh; role seed và auth endpoints còn thiếu.
- UserPreferences, Tags, NutritionFacts, Favorites, Reviews, RecipeViews, meal-planning/shopping-list và AuditLogs bổ sung ở migrations sau.
- Frontend, Docker, Jenkins thực tế, AWS và commit/push vẫn chưa thực hiện.
- Khánh cần xác định Neon development/test và review SQL trước bước áp dụng schema; sau đó viết DB integration tests, rồi auth và recipe CRUD.

Trạng thái: **Completed** cho milestone persistence offline; **Partial** cho Phase 2 do chưa có Neon/test DB và các hạng mục môi trường còn lại.

## Bàn giao từ chat học PostgreSQL — Khánh cung cấp

Thông tin dưới đây do Khánh báo cáo đã có ảnh xác nhận ở chat PostgreSQL; agent backend chưa kiểm tra trực tiếp Neon/DBeaver hoặc nhận các ảnh đó trong lượt này.

- DBeaver Community26.2.4 đã kết nối trực tiếp Neon PostgreSQL18.6 qua port5432, SSL mode require, không SSH tunnel.
- Neon organization Khánh, project my-first-project, region Singapore, Free plan; hạn mức cụ thể chưa xác minh.
- Branch mặc định có tên production, database neondb, role neondb_owner. Đây là môi trường đang dùng học; tên branch không chứng minh đã triển khai RecipeHub production. Chưa chốt DB development/test cho ứng dụng.
- Schema learning có bảng recipes thực hành và2 dòng Trứng chiên(2 khẩu phần), Canh rau(4 khẩu phần); đã SELECT/sort/filter. Không đưa UUID/dữ liệu học vào seed ứng dụng.
- Bài UPDATE trong transaction rồi ROLLBACK chưa xác nhận thực hiện. Không giả định có transaction mở hay đã kết thúc; nếu tiếp tục phải kiểm tra trong đúng tab/kết nối DBeaver. Chưa xác nhận SQL editor đã được lưu file.
- Chưa chạy migration RecipeHub hoặc seed lớn. Không dùng learning làm schema ứng dụng, không tạo lại bảng học bằng EF.
- SSL require là trạng thái DBeaver người dùng báo cáo; không đồng nhất với VerifyFull trong hướng dẫn backend. TLS cho Npgsql cần xác minh riêng trước kết nối, không hạ chính sách âm thầm.
- EC2 và GearHost SQL Server từng được nhắc thuộc GenZFashion; không dùng làm bằng chứng hạ tầng RecipeHub và không tự triển khai RecipeHub lên EC2 đó.

Đã kiểm tra lại mã nguồn local sau bàn giao: EF Core/Identity10.0.13, Npgsql provider10.0.3, DbContext/entities, initial migration/snapshot và endpoint readiness đều có. Bản bàn giao cũ ghi chưa có persistence/6 tests đã lỗi thời; kết quả chạy gần nhất trong chat backend là10/10 tests, chưa chạy lại ở lượt tiếp nhận này.

Lượt tiếp nhận chỉ cập nhật tiến độ, không đọc secrets, không kết nối Neon, không sửa code nghiệp vụ và không áp dụng migration.

## Chuẩn bị xác định database development

Khánh cho biết chưa rõ đã có DB riêng hay chưa, chat PostgreSQL chủ yếu chạy SQL thực hành. Vì vậy chưa giả định recipehub_dev tồn tại hoặc tự chọn neondb để áp dụng schema.

- Thêm `database/scripts/preflight-development.sql`: SELECT database/schema hiện tại, danh sách DB trên branch và bảng trong DB hiện tại. Chưa chạy trên Neon.
- Thêm `docs/deployment/NEON_DEVELOPMENT_SETUP.md`: từng bước xác minh, chọn database, cấu hình User Secrets và kiểm tra kết nối.
- Chưa tạo database, không sửa learning, không kết nối bằng credentials, không chạy migration/seed.
- Không chạy lại build/tests vì chỉ thêm SQL chỉ đọc và tài liệu; kết quả backend gần nhất vẫn10/10 tests đạt.
- Cần kết quả SELECT từ DBeaver để chọn đúng môi trường trước bước phụ thuộc.

## 2026-11-04 — Kết nối Neon và milestone Authentication

### Bằng chứng người dùng và trạng thái database

- Khánh đã tạo recipehub_dev, kết nối DBeaver và SELECT current_database xác nhận đúng tên.
- Đã nhập thông tin thực vào User Secrets tại máy; ban đầu còn placeholders gây Unhealthy, đã sửa; Khánh báo readiness Healthy.
- Khánh cung cấp ảnh history với migration20261104152010_InitialIdentityAndRecipes, version10.0.13 và kết quả16 bảng trong public.
- Không tạo lại bảng học hoặc áp dụng lại migration trên public trong lượt triển khai auth.

### Mã nguồn đã thêm/sửa

- Application/Identity: request validation, DTO hồ sơ/token, IAuthService/IAccessTokenIssuer và AuthException.
- Infrastructure/Identity/AuthService: register transaction, default User role an toàn với advisory lock, Identity password hashing, failed-attempt lockout, login, refresh rotation/reuse detection/family revocation, logout và hồ sơ.
- API/Identity: JWT signing/validation, CSRF/origin filter, Problem Details mapping, rate limiting và policy Admin.
- API Controllers: csrf/register/login/refresh/logout và GET/PUT users/me.
- Program/DI: authentication/authorization/rate limiting, credentialed CORS whitelist và traceId trong Problem Details.
- Tests: isolated test factory, HTTP/JWT/CSRF/role/rate-limit tests và PostgreSQL schema fixture opt-in.
- Docs: AUTH_GUIDE, cập nhật API contract, README và trạng thái schema.

### Các lệnh và kết quả thực tế

```powershell
dotnet restore backend/RecipeHub.slnx --packages .nuget/packages
dotnet build backend/RecipeHub.slnx --no-restore --configuration Release
dotnet test backend/RecipeHub.slnx --no-build --configuration Release --logger trx
dotnet ef migrations has-pending-model-changes --project backend/RecipeHub.Infrastructure --startup-project backend/RecipeHub.Infrastructure --configuration Release --no-build
```

- Build cuối:0 warnings,0 errors.
- Lượt PostgreSQL bật RECIPEHUB_RUN_POSTGRES_TESTS=1:22 passed,0 failed,0 skipped, gồm6 integration tests thật và16 tests lúc đó. Đã migrate schema tạm recipehub_test_<random> trong recipehub_dev, không public/learning; fixture dọn schema sau lượt chạy, exit code0.
- Sau đó bổ sung5 tests JWT/role: lượt cuối mặc định21 passed,0 failed,6 skipped (27 tổng).6 tests DB mặc định opt-in nên không chạy lại khi chưa bật flag; kết quả DB ở lượt trước vẫn là bằng chứng thực tế, không tính skipped là passed.
- Các PostgreSQL cases đã đạt: HTTP register/login/profile, hash/default role, weak password/duplicate email, lockout5 lần, rotation/reuse, concurrent refresh, logout/expiry.
- Các HTTP/JWT cases đã đạt: không có/sai/hết hạn JWT, sai issuer/audience/signature, User403/Admin200 qua test-only endpoint, CSRF/origin, cookie flags/no refresh JSON, validation và rate limit429.
- EF snapshot không có thay đổi, không cần migration mới.
- Đã sửa các lỗi phát hiện trong quá trình build/tests: metadata validation positional record, thời điểm đọc JWT configuration trong test host và namespace test hosting. Không còn lỗi ở bản kiểm tra cuối.

### Chạy và bàn giao

Khánh dừng process cũ, build/chạy lại RecipeHub.Api profile http. Không cần mở tab SQL hoặc chạy migration. Development có signing key tạm ngẫu nhiên khi thiếu Jwt:Key; restart vô hiệu access tokens cũ. Production bắt buộc key cấu hình mạnh và HTTPS.

Khang đọc docs/testing/AUTH_GUIDE.md, dùng credentials include, lấy CSRF token và gửi X-CSRF-TOKEN cho auth POST; giữ access JWT trong bộ nhớ. Linh dùng các lệnh tests mặc định cho CI, bật PostgreSQL tests với credentials development/test được quản lý riêng khi sẵn sàng.

### Giới hạn và bước tiếp theo

- Chưa có admin account/bootstrap hoặc các endpoint quản trị nghiệp vụ; policy role mới được kiểm thử qua controller chỉ có trong test assembly.
- Logout thu hồi refresh family, không lập tức hủy JWT đã phát hành; lifetime15 phút + skew30 giây. Cấu hình proxy/rate limit và Data Protection persistence phải hoàn thiện trước production.
- Lifetime access/refresh hiện cố định15 phút/7 ngày, chưa có cấu hình đổi lifetime.
- Chưa chạy đăng ký tài khoản người dùng thật trên public; toàn bộ test data ở schema tạm đã dọn.
- Chưa có recipe CRUD/search API, frontend, Jenkins thực tế, Docker/AWS hay commit/push.
- Bước tiếp theo sau review milestone auth: ingredients/categories read và recipe CRUD, ownership policies, pagination và PostgreSQL integration tests tương ứng.

Trạng thái: **Completed** cho milestone Authentication cơ bản có kiểm thử PostgreSQL; **Partial** cho Phase 2/tổng dự án. Dừng trước milestone nghiệp vụ tiếp theo để Khánh review.

## 2026-11-05 — Kiểm thử nghiệp vụ và chuẩn bị container

- Lượt Release với RECIPEHUB_RUN_POSTGRES_TESTS=1 đạt 29 passed, 0 failed, 0 skipped. Test PostgreSQL dùng schema tạm và có kiểm tra schema trước khi ghi.
- HandoffApiTests kiểm thử HTTP tìm kiếm món Published, sort rating, gợi ý nguyên liệu, tạo/ẩn đánh giá, User403, Admin đọc users/reviews/analytics.
- Đã sửa truy vấn sắp xếp trước projection và nhóm ngày thống kê bằng DateOnly để khắc phục lỗi EF/PostgreSQL.
- Đã soạn infrastructure/docker/backend.Dockerfile, .dockerignore và docs/deployment/BACKEND_CONTAINER.md. Docker chưa khả dụng trên máy nên chưa build/run image.
- Phần AWS còn cần EC2 RecipeHub, HTTPS, cấu hình secrets, migration trên môi trường đích, smoke test, restart/reboot và rollback thực tế.
- Mã nguồn đang ở workspace, chưa push. Những mục cũ ghi chưa có API nghiệp vụ trong nhật ký phản ánh thời điểm trước đó.

## 2026-11-05 — Hoàn thiện API cập nhật công thức

- RecipeService từ chối phần tử null trong ingredients/steps/images bằng lỗi validation.
- Sửa lỗi EF nhận sai trạng thái bản ghi con khi thay thế bước nấu/nguyên liệu/ảnh. Khai báo rõ dữ liệu con mới bằng AddRange.
- Đọc lại recipe sau khóa FOR UPDATE; thao tác archive dùng transaction và cùng khóa bản ghi.
- Kiểm thử HTTP cập nhật title/steps và archive đã đạt trên PostgreSQL schema tạm.
- Bổ sung kiểm tra hai HTTP PUT đồng thời và đối chiếu title với bước nấu của bản ghi cuối. Kết quả lượt này sẽ ghi sau khi hoàn tất.
- Kết quả lượt kiểm thử đồng thời: 1 passed, 0 failed, 0 skipped. Cả hai HTTP PUT thành công; tiêu đề và bước nấu cuối thuộc cùng bản sửa, nguyên liệu không bị nhân đôi. Chưa kiểm chứng tải lớn hoặc nhiều máy chủ.

## 2026-11-05 — File thao tác API cho Visual Studio

- Thêm RecipeHub.Api.http với health, catalog, search, detail, personal recipes, tạo Draft, reviews, recommendations và admin reads.
- Sửa hợp đồng ingredientIds theo model binding thực tế dùng query parameters lặp lại.
- File HTTP chứa placeholders. Chưa gửi POST từ file này lên public. Đây là thay đổi ví dụ/tài liệu; kiểm thử backend gần nhất vẫn 29/29.

## 2026-11-05 — API chi tiết nguyên liệu

- Thêm GET /api/v1/ingredients/{id} trong CatalogController, IRecipeService và RecipeService. Public read, DTO id/name/defaultUnit, không tìm thấy trả404.
- Location từ POST ingredients có endpoint GET tương ứng. Đã cập nhật API_CONTRACT và file HTTP.
- HandoffApiTests trên schema PostgreSQL tạm đạt 1 passed, 0 failed, 0 skipped, gồm đọc đúng nguyên liệu và ID không tồn tại trả404. Chưa chạy lại toàn bộ suite sau thay đổi này.

## 2026-11-05 — Hoàn thiện đường dẫn chi tiết catalog

- Thêm GET categories/{id}, tags/{id} công khai, cùng GET admin/categories/{id}, admin/tags/{id} có policy Admin để khớp Location khi tạo.
- Dùng projection AsNoTracking, DTO NamedItem và lỗi NotFound hiện có.
- Build Release đạt 0 warnings, 0 errors. Chưa chạy HTTP/PostgreSQL cho bốn endpoint mới. Không có thay đổi model/migration.

## 2026-11-05 — Xác minh catalog qua HTTP

- Kiểm thử tạo categories/tags bằng Admin, đọc theo Location, đọc công khai, ID không tồn tại404, anonymous admin401, User admin403.
- Lượt đầu dừng ở PUT recipe trước catalog do500; chưa thu được nguyên nhân lỗi này. Bật error logging trong test host, lượt chạy lại hoàn tất 1 passed, 0 failed, 0 skipped gồm các kiểm tra catalog. Không coi lỗi gián đoạn đã được chẩn đoán hoặc khắc phục.
- Cần theo dõi lỗi500 gián đoạn khi cập nhật công thức. Không thay đổi public hoặc migration.

## 2026-11-05 — Chẩn đoán lỗi cập nhật gián đoạn

- TestErrorLogger được đăng ký qua ConfigureTestServices để thu thập loại exception và SQLSTATE khi test server log lỗi; không thu message/connection string.
- Thêm 5 lần HTTP PUT liên tiếp sau cập nhật đồng thời. Lượt này hoàn tất 1 passed, 0 failed, 0 skipped trong 2m52s. Không tái hiện lỗi500, chưa xác định nguyên nhân và chưa tuyên bố sửa lỗi gián đoạn.

## 2026-11-05 — Tái hiện riêng lỗi cập nhật

- Thêm RecipeUpdateTests chạy12 HTTP PUT trên cùng công thức có đủ ingredients/steps/images/categories/tags. Mỗi response kiểm tra đúng title và đúng một bản ghi mỗi nhóm con.
- Kết quả: 1 passed,0 failed,0 skipped (1m54s). Không tái hiện500. Chưa có bằng chứng để quy lỗi cho Neon, timeout, EF hoặc transaction.
- TestErrorLogger ghi category, exception types, SQLSTATE và stack trace, loại bỏ message và formatted state. Chỉ dùng trong test host.
- Lỗi500 gián đoạn vẫn mở. Chưa đổi retry/pooling/timeout để tránh che nguyên nhân.

## 2026-11-05 — Sửa lỗi tracking khi thay dữ liệu con

- Tái hiện thất bại trước bản sửa: dùng cùng service/DbContext để tạo rồi cập nhật công thức có category/tag gây InvalidOperationException do RecipeCategory cùng composite key vẫn đang được theo dõi sau ExecuteDelete.
- RecipeService detach đúng các child entities của công thức trước bulk delete và thay collection. Giữ transaction và row lock hiện có.
- Sau bản sửa RecipeUpdateTests đạt2/2, gồm cập nhật lặp cùng context và12 HTTP PUT có đủ child collections,0 skipped.
- Đây là nguyên nhân xác định cho trường hợp tracking đã tái hiện. Chưa có stack trace của500 HTTP gián đoạn cũ để chứng minh hai lỗi cùng nguyên nhân. Giữ diagnostics để tiếp tục xác minh nếu lỗi đó tái xuất hiện.
