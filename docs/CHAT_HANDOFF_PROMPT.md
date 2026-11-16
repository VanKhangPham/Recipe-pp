# Prompt tiếp tục RecipeHub cho chat mới

Tôi là Khánh. Tôi sẽ gửi kèm master prompt dự án và master prompt Vietnamese Food Dataset nếu cần. Hãy dùng bản bàn giao dưới đây làm bối cảnh hiện tại, đối chiếu mã nguồn thực tế trước khi kết luận. Tiếp tục từ công việc đã làm, bảo toàn thay đổi đang có trong workspace. Ngày bàn giao2026-11-06, múi giờ Asia/Bangkok.

## 0. Mốc cập nhật mới nhất và cách tiếp tục theo lệnh

Mốc người dùng yêu cầu ghi nhớ là “tính từ đây, hãy nhớ tôi sẽ ra lệnh. Làm tiếp tục.” Mốc này ở sau khi container local đã được cập nhật và trước bước đo query plan trong DBeaver. Các kết quả dưới đây cập nhật trực tiếp cho trạng thái tiếp tục chat.

### Đã làm từ mốc này

- Tạo database/scripts/performance-baseline.sql với các SELECT/EXPLAIN ANALYZE chỉ đọc, gồm xác nhận dataset, danh sách Published, full-text và dung lượng bảng/index public.
- Khánh chạy truy vấn thống kê và cung cấp ảnh: recipehub_dev có6 recipes,1 Published,5 Draft.
- Query danh sách Published chọn Id/Title/CreatedAt, ORDER BY CreatedAt DESC/Id,LIMIT20: dùng Index Scan IX_Recipes_Status_CreatedAt_Id, trả1 dòng; Planning Time2.295ms,Execution Time0.445ms; execution buffers shared hit1/read1.
- Query tương tự thêm SearchVector @@ websearch_to_tsquery('simple','trứng'): dùng index Status/CreatedAt/Id rồi Filter full-text, loại1 dòng, trả0 dòng; Planning Time0.122ms,Execution Time0.036ms; execution buffers shared hit2. Chưa có bằng chứng query dùng GIN trong mốc này.
- Khánh đo pg_statio_user_tables với schemaname=public và cung cấp4 ảnh bao phủ29 bảng. Recipes table8192/index106496/total122880 byte; RecipeIngredients8192/49152/57344; RecipeSteps8192/32768/49152; RecipeDatasetEntries8192/32768/49152; Ingredients8192/32768/40960; Categories8192/32768/40960.
- Đã ghi các bằng chứng vào docs/DATA_QUALITY_REPORT.md. Mốc đo nhỏ đã hoàn tất. Trong các bước này chỉ có đo đọc và cập nhật tài liệu, chưa đổi index hoặc mở rộng dataset.

### Đang ở đâu

Khánh đang dùng DBeaver recipehub_dev Script-3, đã chạy xong câu đo kích thước bảng/index. Chưa cần chạy lại các câu đo đã hoàn thành. Năm món dataset vẫn Draft/Pending. Chưa có xác nhận của người duyệt về định lượng, nấu thử hoặc quyền công khai. Các thay đổi code và tài liệu sau commit4559168 còn cần kiểm tra/commit/push.

### Chuẩn bị làm theo lệnh tiếp theo

Ưu tiên rà soát nội dung/nguồn của5 món và quyết định lô mở rộng20 món. Cần bằng chứng người duyệt trước khi Approved. Sau khi mở rộng dữ liệu đại diện, đo lại query plan, dung lượng và tải API. Việc seed lớn, benchmark concurrency/p50/p95 và tối ưu index theo số liệu còn chờ thực hiện. Có thể chuẩn bị bàn giao mã/Git và các phần DevOps đã được ủy quyền khi người dùng ra lệnh tương ứng.

### Yêu cầu phối hợp phải giữ

Khánh sẽ ra lệnh từng bước. Khi nhận “tiếp tục”, tiếp nối hạng mục hiện tại và cập nhật đúng kết quả. Khi Khánh chỉ gửi bằng chứng kết quả, ghi nhận kết quả thực tế và hướng dẫn thao tác kế tiếp của cùng hạng mục. Nêu rõ ứng dụng chạy lệnh, tab cần giữ/mở mới, kết nối và kết quả mong đợi. Hỏi rõ khi lệnh chưa đủ xác định để đổi hạng mục, duyệt/xuất bản dữ liệu hoặc triển khai lên máy đích. Không suy đoán xác nhận thay cho Khánh.

## 1. Dự án và phân công đã thống nhất

- RecipeHub — Smart Recipe & Meal Planning Platform, hướng đến món Việt, gia đình và sinh viên.
- Khánh phụ trách backend ASP.NET Core, database PostgreSQL/Neon và AWS. Khánh làm Docker backend trước trên máy Windows để bàn giao cách chạy cho nhóm.
- Khang phụ trách frontend Next.js/TypeScript, khởi tạo frontend, layout/API client dùng chung, đăng nhập/hồ sơ, công thức, tìm kiếm/lọc, favorites/reviews và giao diện public.
- Linh phụ trách frontend Meal Planner, Shopping List, recommendations, Admin Dashboard/Analytics, phối hợp Jenkins và E2E/QA. Việc cài đặt/chạy Jenkins của Linh chưa được xác nhận.
- Cả Khang và Linh đều làm frontend. Giữ phân công này khi đọc tài liệu dataset có ví dụ chia vai trò khác.
- Frontend có thể tích hợp API đã có song song khi Khánh tiếp tục dữ liệu và triển khai.

## 2. Workspace, Git và công cụ

- Workspace Windows là D:\ST23D\2026-2027\Dev-ops\Buoi15\Recipe-pp.
- Git remote là https://github.com/VanKhangPham/Recipe-pp.git.
- Nhánh hiện tại khanh_backend. Commit gần nhất4559168, tiêu đề Implement RecipeHub backend and handoff documentation. Người dùng đã push commit này và có ảnh GitHub xác nhận.
- GitHub từng hiện base main, compare khanh_backend và Able to merge. Chưa có bằng chứng PR đã merge.
- Nhiều thay đổi Swagger/dataset/importer/review/tài liệu sau commit này đang modified hoặc untracked. Chưa commit/push các thay đổi đó. Kiểm tra git status trước thao tác, không checkout/reset/ghi đè chúng.
- Visual Studio2026, .NET10, C#, solution backend/RecipeHub.slnx với Api, Application, Domain, Infrastructure, Tests.
- DBeaver Community26.2.4. Docker Desktop đang chạy Linux Engine.
- Docker CLI thực tế tại C:\Users\ADMIN\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe. PATH của terminal cũ có thể chưa nhận Docker.
- pg_dump/pg_restore trên Windows từng được tìm thấy bản17. Neon báo server18.6. Chuẩn bị client phù hợp trước backup/restore.

## 3. Cách giao tiếp và hướng dẫn thao tác

Khánh đang học từng bước. Mỗi lệnh phải nêu rõ chạy trong DBeaver, PowerShell, CMD hay Swagger. Khánh từng dán SQL vào PowerShell và lệnh $variable vào CMD. Tránh đưa nhiều khối lệnh khác môi trường liền nhau mà thiếu chỉ dẫn.

Với DBeaver, nói rõ giữ tab hiện tại hay mở tab mới, kết nối nào, câu nào cần bôi đen và phím chạy. Tab đang dùng là recipehub_dev Script-3. SELECT riêng dùng Ctrl+Enter. Migration có transaction/DO blocks chạy toàn file bằng Execute SQL Script/Alt+X. Không chạy lại toàn bộ tab tích lũy lịch sử SQL. Nêu kết quả mong đợi và chờ bằng chứng khi cần xác nhận thao tác người dùng.

Chủ động làm phần code/kiểm tra được ủy quyền. Phân biệt rõ đã thực hiện, chỉ đề xuất và chưa kiểm chứng. Không yêu cầu gửi password/token/connection string có mật khẩu vào chat. Không in secrets vào logs hoặc commit. Có thể dùng User Secrets cục bộ một cách kín đáo cho thao tác đã được ủy quyền.

## 4. Backend đã triển khai

- JWT, ASP.NET Core Identity, register/login, refresh rotation/reuse detection, logout, CSRF/origin validation, lockout, GET/PUT users/me và preferences.
- Access token15 phút, refresh7 ngày theo cấu hình code đã triển khai. Kiểm tra lại trước sửa.
- JWT hợp lệ còn được kiểm tra trạng thái tài khoản qua auth service. Tài khoản khóa bị chặn trên API cần đăng nhập. Mở khóa cho phép token còn hạn dùng lại, refresh đã thu hồi cần đăng nhập lại.
- Recipe CRUD, Draft/Published/Archived, owner/Admin, danh sách cá nhân/quản trị, PostgreSQL full-text search và filters/sort/pagination.
- Catalog ingredients/categories/tags có read/detail và Admin write. GET chi tiết đã khớp Location của POST.
- Favorites, reviews, review moderation và views.
- Meal Planner theo tuần, kiểm tra quyền sở hữu, ngày/bữa/khẩu phần.
- Shopping List sinh từ thực đơn, gộp theo ingredient+unit, tính khẩu phần, sinh lại trả list hiện có, sửa lượng/trạng thái mua.
- Content-based recommendations có score/reasons/fallback. Chưa đánh giá chất lượng trên tập lớn.
- Admin users, lock/unlock, catalog, recipes, reviews, analytics theo ngày UTC và audit logs. Có lệnh bootstrap Admin, chưa xác nhận Khánh đã bootstrap tài khoản Admin thật.
- Problem Details, validation, cancellation, CORS whitelist, rate limiting, health/live và health/ready. Readiness kiểm tra kết nối và pending EF migrations.
- Các truy vấn có index nền gồm GIN full-text, unique và composite indexes. Chưa có bằng chứng benchmark/tối ưu dữ liệu lớn.

Dependencies chính đã có JwtBearer, Microsoft.AspNetCore.OpenApi, Swashbuckle.AspNetCore.SwaggerUI, Npgsql EF provider, EF Core/Design, Identity EF, xUnit/Test SDK/Mvc.Testing. Chưa cần tự thêm Redis/RabbitMQ/Hangfire/Elasticsearch/ML.NET/Kubernetes/MediatR/AutoMapper. Playwright frontend dự kiến dùng npm.

## 5. Swagger và cách chạy đã được xác nhận

- Visual Studio đặt RecipeHub.Api làm startup project, dùng profile https.
- HTTPS https://localhost:7082/swagger/index.html; HTTP http://localhost:5194/swagger/index.html. OpenAPI Development tại /openapi/v1.json.
- Người dùng đã trust development HTTPS certificate.
- Swagger tự lấy CSRF token cho auth POST cùng origin. Interceptor dùng Promise, xử lý request.method thiếu bằng GET.
- OpenAPI mô tả Bearer cho endpoint protected và optional Bearer cho GET recipes/{id}, để Swagger gửi token khi xem Draft.
- Authorize nhận chuỗi accessToken. Nếu restart/tải lại cần kiểm tra token còn hiệu lực. Xem kết quả tại Server response/Response body. Example Value là mẫu schema.
- API RecipeDetail có trường summary chứa thông tin món, cùng ingredients,steps,tags,images,nutrition,publishedAt,updatedAt.
- Bộ lọc ingredientIds dùng query parameter lặp lại, ví dụ ingredientIds=id1&ingredientIds=id2.

## 6. Lỗi và kiểm thử

Đã sửa lỗi projection/sort EF và analytics nhóm ngày UTC. Đã sửa cập nhật bản ghi con bị EF nhận nhầm trạng thái, bổ sung AddRange cho children mới. Đã tái hiện và sửa lỗi tracked RecipeCategory trùng khóa khi dùng lại DbContext sau ExecuteDelete bằng detach children cũ đúng recipe trước thay thế. Các mutation cập nhật/archive dùng transaction và row lock, đọc lại sau lock.

Lỗi500 HTTP gián đoạn trước đây chưa có stack trace để chứng minh cùng nguyên nhân với lỗi tracking. Những lượt tái hiện sau đó đạt. Có TestErrorLogger thu exception type, SQLSTATE và stack trace, tránh ghi message/state có thể chứa secrets. Hai lượt test importer trên Neon sau đó thất bại ở fixture do timeout kết nối/đọc metadata trước importer. Đây là bằng chứng timeout của các lượt đó, chưa đủ để hồi tố nguyên nhân mọi500 trước đây.

Kết quả đầy đủ gần nhất sau importer/review là36 passed,0 failed,0 skipped trên PostgreSQL18 tạm trong Docker,19 giây. Trước đó từng có34/34 trên Neon. Tests PostgreSQL là opt-in RECIPEHUB_RUN_POSTGRES_TESTS=1, nhận RECIPEHUB_POSTGRES_CONNECTION hoặc User Secrets. Fixture giới hạn recipehub_dev/tên kết thúc _test, tạo schema ngẫu nhiên, kiểm tra schema trước ghi và dọn sau. Docker test tạm đã được dọn. Không dùng skipped làm passed.

## 7. Database thực tế và dữ liệu đã nhập

- Neon project my-first-project, Singapore, Free plan theo bằng chứng người dùng. Hạn mức cụ thể chưa kiểm chứng.
- Database ứng dụng recipehub_dev, schema public. neondb và schema learning phục vụ học riêng. Giữ dữ liệu học khi tiếp tục dự án.
- User Secrets ID recipehub-api-development, connection key ConnectionStrings:DefaultConnection. Không đưa giá trị secrets vào chat.
- Migrations đã được người dùng xác nhận áp dụng trên development:
  1. 20261104152010_InitialIdentityAndRecipes
  2. 20261104170933_AddPlanningSocialAndAdministration
  3. 20261106071147_AddRecipeDatasetEntries
- RecipeDatasetEntries liên kết1–1 với Recipes, unique DatasetKey, ContentHash, SourceType, SourceName/SourceUrl/LicenseIdentifier nullable, ReviewStatus Pending/Approved/Rejected, ImportedAt.
- Tài khoản Khánh đã đăng ký qua Swagger, UUID96fa8c23-a1af-4199-a0e7-82cd170dc150. Trước đó có11 tài khoản Integration user cũ trong public. Chưa xác minh chúng đã được dọn. Không xóa dữ liệu cũ khi chưa đối chiếu quan hệ.
- Lô5 món đã nhập thành công vào public do Khánh chạy CLI: created=5,skipped=0. Chạy lại trả created=0,skipped=5.
- Các món là Trứng chiên hành, Canh cà chua trứng, Rau muống xào tỏi, Đậu hũ sốt cà chua, Cơm chiên trứng. Tất cả Draft/Pending, source AI-assisted draft, chưa duyệt công khai hoặc nấu kiểm chứng.
- Ảnh DBeaver xác nhận tổng6 recipes,11 ingredients,5 dataset entries. Năm món có23 ingredient links và11 steps.
- Dung lượng trước10756096 byte; sau10649600 byte. Là toàn database hai thời điểm, chưa thể quy chênh lệch cho lô nhập hoặc ngoại suy300 món.
- Swagger đã xác nhận users/me/recipes trả200,totalCount5 và tác giả Khánh. Chi tiết Cơm chiên trứng ID70f4835c-49f8-41cf-9ec3-d1f6d5ca5070 trả đúng5 ingredients,2 steps khi chủ món đăng nhập. Khách gọi cùng ID nhận404.

## 8. Dataset/importer/review đang có

- data/samples/vietnamese_recipes.sample.json chứa5 bản nháp AI hỗ trợ, source.review=pending,publicationAllowed=false. Khẩu phần2. Chưa có ảnh/dinh dưỡng/chi phí đã xác minh. Description chung hiện là bản nháp chờ kiểm chứng.
- database/seeds/Test-RecipeDataset.ps1 kiểm tra file. Đã sửa lỗi bọc ConvertFrom-Json bằng @() trên Windows PowerShell5.1, đã chạy đạt cả powershell.exe và pwsh.exe.
- DatasetImporter C# nằm trong Infrastructure/Recipes. CLI trong Api, mặc định dry-run với --dataset, ghi khi có --apply --author. JSON tối đa300 món, giữ Draft/pending. Chỉ nhận DB recipehub_dev hoặc _test.
- Cả lô dùng transaction/advisory lock. Cùng dataset key/hash bỏ qua, thay đổi nội dung cùng key gây conflict và rollback cả lô. Giữ các chỉnh sửa người dùng, chưa có workflow update dataset theo version.
- Chuẩn hóa nguyên liệu hiện trim/Unicode/lowercase, unit whitelist. Alias thịt heo/thịt lợn còn cần registry.
- PATCH /api/v1/admin/dataset/{recipeId}/review yêu cầu Admin. Body status,sourceName,sourceUrl,licenseIdentifier. Approved yêu cầu tên nguồn và mã giấy phép, sourceUrl null hoặc HTTPS. Không tự duyệt5 món thật. Duyệt nguồn giữ Draft, publish dùng API recipe riêng. Thu hồi duyệt Published đưa về Draft. Audit ghi actor/time/action. Kiểm tra quyền publish nằm trong khóa recipe để đồng bộ với review.
- Lệnh dry-run từ PowerShell thư mục gốc:

```powershell
$sample = (Resolve-Path .\data\samples\vietnamese_recipes.sample.json).Path
dotnet run --project backend/RecipeHub.Api --configuration Release --no-launch-profile -- --dataset $sample
```

Đường dẫn tuyệt đối tránh dotnet run đổi working directory. Chỉ thêm --apply --author khi người dùng chủ động nhập đúng database/author.

## 9. Nguồn và quyền sử dụng

Mục tiêu20→100→300 món Việt chất lượng. Danh sách50 món đầu trong DATASET_PLAN. Không tạo dữ liệu trùng vô nghĩa để đạt180–220MB. Tương tác mô phỏng phải nhận diện rõ và tách môi trường thử nghiệm.

Đã kiểm tra trang Wikibooks mục lục liên kết CC BY-SA4.0, chưa chọn/kiểm tra từng công thức/ảnh. USDA FDC API Guide công bố CC0, dùng làm ứng viên dinh dưỡng sau khi đối chiếu food ID và sống/chín/khẩu phần. Cookbeo mở được trang chủ, trang license chưa đọc được. Điện máy XANH timeout. Các nguồn khác trong master dataset prompt chưa kiểm chứng đầy đủ.

Việc kiểm tra các nguồn trên diễn ra sau khi biên soạn lô mẫu. Không gán chúng làm nguồn của5 bản nháp hiện tại. Cần người duyệt nội dung, quyền sử dụng, ảnh và ghi công theo từng món. Không tự ghi Approved/Original/được phép công khai khi thiếu bằng chứng.

## 10. Docker, Jenkins và AWS

- Docker Desktop Linux đã build image recipehub-api:local thành công.
- Container recipehub-api-local tại127.0.0.1:8080 đã được tạo lại từ image mới trước mốc ở mục0. Liveness/readiness/system/ingredients đều200, restart xong readiness200. Container cũ đã dừng được giữ tên recipehub-api-backup-adf2cbd3 làm bản quay lui. Phiên bản trước từng được kiểm chứng non-root uid1654. Kiểm tra lại trạng thái khi bắt đầu chat mới.
- Image mới nhất có ID4359cd51acf098a7e18c2056ce54b5abb7a8001ab54134fc807bc71cea5419eb. Chạy dry-run5 món trong image bằng data mount read-only đã đạt.
- Container Production tạm từ image mới ở8081 đã đọc Neon và trả200 cho4 endpoint health/system/ingredients, rồi đã dọn. Sau đó container8080 đã được cập nhật thành công như dòng trên.
- Runtime credentials lấy kín đáo từ User Secrets sang environment. Khóa JWT random local test. Chưa chứng minh auth/HTTPS/Data Protection persistence qua container recreate.
- Chưa có Jenkinsfile hoặc pipeline thực tế được kiểm chứng. Chưa push image registry. Nhóm chưa xác nhận nơi cài Jenkins.
- Chưa tạo/triển khai EC2 riêng RecipeHub theo bằng chứng hiện có. EC2/SQL Server GearHost của GenZFashion là dự án khác. Không triển khai RecipeHub vào đó khi chưa có quyết định.
- AWS/HTTPS production,logs,reboot,backup/restore,rollback còn cần thực hiện. Cần kiểm tra chi phí/hạn mức trước tạo tài nguyên.

## 11. Việc tiếp theo cần ưu tiên

Lộ trình nghiệm thu đầy đủ phần Khánh và các phụ thuộc nhóm nằm trong docs/KHANH_COMPLETION_PLAN.md. Mỗi chặng có đầu việc và điều kiện hoàn thành. Đây là kế hoạch đề xuất, chưa được tính là đã triển khai. Tiếp tục theo lệnh của Khánh và đối chiếu trạng thái thực tế.

1. Kiểm tra workspace hiện tại, giữ các thay đổi chưa commit. Đọc PROGRESS theo thứ tự ngày để tránh dùng trạng thái cũ.
2. Rà source/content của5 món và chuẩn bị quy trình duyệt thật có tài khoản Admin. Không tự chốt nội dung đã nấu thử hoặc quyền sử dụng.
3. Đồng bộ hướng dẫn bàn giao và commit/push bản Swagger/dataset/importer/review/Docker đã kiểm chứng lên khanh_backend sau kiểm tra secrets/diff. Xác minh PR/main thực tế.
4. Hoàn thiện alias nguyên liệu, mô tả riêng, provenance/ảnh và quy trình cập nhật dataset khi cần. Mở rộng20→100→300 món sau review. Importer hiện chỉ hỗ trợ lô nháp pending.
5. Dùng baseline nhỏ đã đo ở mục0 để so sánh khi dữ liệu tăng. Đo query plan trên tập đại diện, tải API và báo cáop50/p95/lỗi. Còn thiếu benchmark dữ liệu lớn và số liệu trước/sau tối ưu index.
6. Container local đã cập nhật. Kiểm tra trạng thái thực tế trước bước DevOps tiếp theo, hoàn thiện HTTPS/auth/Data Protection và chuẩn bị pipeline Jenkins với người phụ trách. Restart local đã đạt như mục10.
7. Triển khai AWS sau khi có thông tin máy đích,domain/HTTPS và ngân sách. Kiểm chứng backup/restore và rollback.
8. Phối hợp frontend,Khang/Linh,ảnh minh chứng,báo cáo test và demo cuối.

## 12. Tài liệu cần đọc

Các tên dưới đây tính từ workspace gốc đã nêu:

- docs/PROGRESS.md — nhật ký kết quả và hạn chế từng lượt.
- docs/KHANH_COMPLETION_PLAN.md — lộ trình từ mã hiện tại đến nghiệm thu toàn dự án.
- docs/BACKEND_HANDOFF.md, docs/API_CONTRACT.md, backend/README.md.
- docs/testing/AUTH_GUIDE.md, backend/RecipeHub.Api/RecipeHub.Api.http.
- docs/DATASET_PLAN.md, docs/DATA_SOURCES_AND_LICENSES.md.
- docs/DATA_IMPORT_GUIDE.md, docs/DATA_QUALITY_REPORT.md.
- docs/deployment/BACKEND_CONTAINER.md và infrastructure/docker/backend.Dockerfile.
- database/scripts/check-size.sql, performance-baseline.sql, add-recipe-dataset-entries.sql và các EF migrations.

## 13. Cập nhật thực tế đến ngày 2026-11-07 (Đã hoàn thành Mục 1–5, 7, 9 của Khánh)

- **Bootstrap Admin & Duyệt nguồn / Xuất bản thật (Mục 2)**: Đã tạo tài khoản Admin `admin@recipehub.local` (`fea6e3a3-bb7d-41fb-931a-31ab16f5bb49`), duyệt và xuất bản 23 món công khai (`22` món dataset `Approved` + `1` món test ban đầu), giữ 278 món `Draft / Pending`.
- **Mở rộng Dataset 20 → 100 → 300 món Việt trên Cloud Neon (Mục 3)**: Đã tạo `vietnamese_recipes.batch20.json`, `batch100.json`, `batch300.json`, bổ sung từ điển chuẩn hóa `DatasetImporter.CanonizeIngredient`, nạp đủ 300 món lên `recipehub_dev` (`total_recipes = 301`, `total_ingredients = 96`, `ingredient_links = 1783`, `total_steps = 613`, `categories = 7`).
- **Kiểm thử dữ liệu lớn 198,3 MB & Hiệu năng trên Cloud Neon (Mục 4)**: Đã nạp tải đạt `198,3 MB` (`AuditLogs = 575.004`, `ShoppingListItems = 50.001`, `RecipeViews = 18.400`), đo `EXPLAIN (ANALYZE, BUFFERS)` xác nhận `BitmapAnd` + GIN `SearchVector` (`1,532 ms`) và `HashAggregate` 18.400 lượt xem (`9,970 ms`), đo HTTP API `p50/p95` (`p50 = 50,88–120,61 ms`, `p95 < 131 ms`, `0%` lỗi).
- **Docker, Proxy & Backup/Restore PostgreSQL 18.6 (Mục 7 & Mục 9)**: Đã thêm `UseForwardedHeaders`, `DataProtection:KeysPath`, `infrastructure/nginx/recipehub.conf`, `infrastructure/docker/docker-compose.backend.yml`, `database/seeds/Invoke-BackupRestoreDrill.ps1` và hoàn tất diễn tập `pg_dump` 18.6 (`32,35s`, `32,79 MB`) → `pg_restore` 18.6 (`3,95s`, khớp 100% cả 29 bảng & ~650.000 dòng, `restored_db_size = 188 MB`) cùng Rollback/Roll-forward container cổng `8080` (`Healthy`).
- **Phần còn lại**: Chờ Khang & Linh hoàn thành Frontend + Jenkins/E2E để Khánh gộp thành bản Fullstack (Mục 6 & Mục 10) và triển khai lên AWS EC2 + HTTPS (Mục 8) khi có máy đích.

Hãy bắt đầu bằng kiểm tra trạng thái mã nguồn/Git và đối chiếu các việc còn mở. Báo ngắn gọn việc đang xử lý, làm tiếp phần có thể thực hiện ngay, chỉ yêu cầu Khánh thao tác khi cần thông tin hoặc bằng chứng thực tế. Nêu rõ môi trường cho mọi lệnh và kết quả mong đợi.
