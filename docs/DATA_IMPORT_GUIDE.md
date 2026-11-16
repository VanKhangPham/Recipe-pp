# Nhập lô công thức nháp

Importer C# hiện đọc JSON cùng cấu trúc data/samples/vietnamese_recipes.sample.json. Hỗ trợ tối đa300 món mỗi lần, chỉ Draft với source.review=pending và publicationAllowed=false. SourceType lưu nguồn biên soạn AI hỗ trợ từ file. Nội dung và định lượng cần người rà soát trước xuất bản.

## Dry-run trên Windows

Tại thư mục gốc repository trong PowerShell, chạy:

```powershell
$sample = (Resolve-Path .\data\samples\vietnamese_recipes.sample.json).Path
dotnet run --project backend/RecipeHub.Api --configuration Release --no-launch-profile -- --dataset $sample
```

Resolve-Path cung cấp đường dẫn tuyệt đối vì dotnet run dùng thư mục project làm working directory. Dry-run kiểm tra file và báo số món. Bước này chưa cần thao tác DBeaver.

## Ghi vào database development

Sau khi kiểm thử schema tạm đạt, xác nhận connection string development trong User Secrets và UUID của tài khoản tác giả. Tài khoản phải tồn tại. Lệnh ghi chủ động gồm --apply và --author:

```powershell
dotnet run --project backend/RecipeHub.Api --configuration Release --launch-profile http -- --dataset $sample --apply --author UUID_TAC_GIA
```

Lệnh hoàn tất rồi thoát, không mở HTTP server. Database được giới hạn recipehub_dev hoặc tên kết thúc _test. Migration AddRecipeDatasetEntries phải được áp dụng trước. Tham số UUID_TAC_GIA phải được thay bằng UUID thật của tài khoản được chọn.

## Nhập lại và xử lý lỗi

Một lần nhập dùng một transaction cho cả file. Advisory lock đồng bộ giữa các tiến trình importer. DatasetKey trùng và hash nội dung giống được bỏ qua. DatasetKey trùng nhưng nội dung thay đổi gây lỗi và rollback cả lô. Importer giữ nội dung người dùng đã sửa, không cập nhật lại công thức đã nhập.

Nguyên liệu được trim, Unicode normalize, gộp khoảng trắng và ánh xạ qua bảng từ đồng nghĩa tiếng Việt (`CanonizeIngredient`: ví dụ `thịt lợn` → `Thịt heo`, `đậu phụ` → `Đậu hũ`, `rau mùi` → `Ngò rí`, `mùi tàu` → `Ngò gai`, `mì chính` → `Bột ngọt`, `hành khô` → `Hành tím`, `hành hoa` → `Hành lá`, `cơm nguội` → `Cơm đã nấu`...) trước khi đối chiếu `NormalizedName`. Công thức có thể khai báo trường `description` tùy chọn (tối đa 2000 ký tự); nếu không có thì giữ câu mô tả mặc định của bản nháp và không làm đổi `ContentHash` của 5 món mẫu ban đầu. Danh mục dùng slug ổn định tạo từ tên, dành riêng cho dataset. Các bản nháp chưa có ảnh và dinh dưỡng. Quyền xuất bản dataset được chặn tại service khi ReviewStatus chưa Approved.

## Mở rộng mốc 20 món (`vietnamese_recipes.batch20.json`)

File `data/samples/vietnamese_recipes.batch20.json` chứa 20 món Việt theo kế hoạch trong `docs/DATASET_PLAN.md` (giữ nguyên 5 món mẫu đầu để `skipped=5` và thêm 15 món mới ở trạng thái `Draft/pending` có `description` riêng).

Kiểm tra dry-run trong PowerShell:

```powershell
$batch20 = (Resolve-Path .\data\samples\vietnamese_recipes.batch20.json).Path
dotnet run --project backend/RecipeHub.Api --configuration Release --no-launch-profile -- --dataset $batch20
```

Ghi vào `recipehub_dev` (chỉ chạy khi người dùng chủ động nhập với UUID tác giả hợp lệ):

```powershell
$batch20 = (Resolve-Path .\data\samples\vietnamese_recipes.batch20.json).Path
dotnet run --project backend/RecipeHub.Api --configuration Release --launch-profile http -- --dataset $batch20 --apply --author UUID_TAC_GIA
```

Khi đã có 5 món mẫu trước đó trên `recipehub_dev`, kết quả mong đợi của lần nhập lô 20 món là `Import completed: created=15, skipped=5.` và chạy lại lần hai trả `Import completed: created=0, skipped=20.`.

## Kiểm tra bằng DBeaver sau khi thực sự nhập

Giữ tab kiểm tra ở recipehub_dev, thêm và chạy riêng SELECT này:

```sql
SELECT d."DatasetKey", r."Title", r."Status", d."ReviewStatus"
FROM public."RecipeDatasetEntries" d
JOIN public."Recipes" r ON r."Id" = d."RecipeId"
ORDER BY d."DatasetKey";
```

Sau lô mẫu đầu tiên, mong đợi5 dòng Draft/Pending. Chỉ thực hiện kiểm tra sau khi lệnh --apply được chạy thành công.

## API duyệt nguồn dataset

PATCH /api/v1/admin/dataset/{recipeId}/review yêu cầu Admin, body gồm status(Pending/Approved/Rejected), sourceName, sourceUrl(nullable HTTPS), licenseIdentifier. Approved yêu cầu sourceName và licenseIdentifier có nội dung đã được người duyệt kiểm chứng. API kiểm tra dữ liệu đầu vào, quyết định xác minh nguồn thuộc người thực hiện.

Response gồm recipeId,datasetKey,status,sourceName,sourceUrl,licenseIdentifier. Duyệt nguồn giữ Draft cho món chưa xuất bản; xuất bản sau đó dùng PUT recipes có quyền owner/Admin. Thu hồi duyệt của món Published đưa món về Draft trong cùng transaction. AuditLogs ghi actor, action DatasetReview<Status>, recipeId và thời điểm.

Năm món mẫu hiện còn Pending và chưa có bằng chứng duyệt nguồn. Chưa dùng endpoint này để approve dữ liệu development. Giai đoạn tiếp theo cần rà soát nội dung và điều kiện sử dụng, chuẩn bị tài khoản Admin hợp lệ trước khi duyệt thật.
