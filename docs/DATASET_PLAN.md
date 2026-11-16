# Kế hoạch Vietnamese Home Cooking Dataset

## Trạng thái đối chiếu ngày 2026-11-05

Solution có Api, Application, Domain, Infrastructure và Tests, cùng target net10.0. Đã kiểm tra Recipe, NutritionFacts, model EF, API DTO và thư mục database/seeds. Backend có CRUD/search, các bảng công thức và quan hệ, unique slug, GIN full-text và index lọc. Thư mục seeds hiện chỉ có .gitkeep. Chưa có importer hoặc dataset đã được duyệt.

Đợt kiểm thử backend đầy đủ gần nhất đạt34/34 với PostgreSQL schema tạm. Kết quả này xác minh backend, còn dataset/importer sẽ cần kiểm thử riêng khi triển khai.

## Phạm vi dữ liệu

Mở rộng theo ba mốc20,100,300 công thức đã rà soát. Mục tiêu300 phân bổ theo một nhóm chính cho mỗi món để tránh đếm trùng: thịt/gà/vịt60, cá/tôm/hải sản50, canh45, rau/củ/quả40, trứng/đậu hũ30, cơm/cháo/bún/mì40, chay25 và khác10. Một món vẫn có thể gắn nhiều category trên giao diện.

Các món dưới đây là danh sách biên tập, cần bổ sung công thức, định lượng, người kiểm chứng và quyền sử dụng trước xuất bản.

## Danh sách50 món đầu tiên

1. Thịt kho trứng
2. Thịt kho tiêu
3. Thịt rang cháy cạnh
4. Thịt luộc
5. Sườn xào chua ngọt
6. Sườn rim nước mắm
7. Thịt băm hấp trứng
8. Gà kho gừng
9. Gà chiên nước mắm
10. Gà luộc
11. Vịt kho gừng
12. Bò xào hành tây
13. Cá kho tộ
14. Cá kho tiêu
15. Cá chiên sả
16. Cá sốt cà chua
17. Tôm rim mặn ngọt
18. Tôm rang
19. Mực xào dứa
20. Nghêu hấp sả
21. Canh chua cá
22. Canh rau ngót thịt băm
23. Canh bí đỏ nấu tôm
24. Canh bí xanh thịt băm
25. Canh mồng tơi nấu cua
26. Canh cải xanh thịt băm
27. Canh bầu nấu tôm
28. Canh khổ qua nhồi thịt
29. Canh khoai mỡ
30. Canh cà chua trứng
31. Rau muống xào tỏi
32. Rau muống luộc
33. Cải thìa xào nấm
34. Cải ngọt luộc
35. Bắp cải luộc
36. Bắp cải xào cà rốt
37. Đậu que xào tỏi
38. Su su xào trứng
39. Giá xào hẹ
40. Cà tím nướng mỡ hành
41. Trứng chiên hành
42. Trứng sốt cà chua
43. Đậu hũ sốt cà chua
44. Đậu hũ kho nấm
45. Đậu hũ nhồi thịt
46. Cơm chiên trứng
47. Cháo gà
48. Cháo thịt băm
49. Bún chay
50. Nấm kho tiêu

## Schema và quyền xuất bản cần bổ sung

Tái sử dụng Title, Description, Servings, PrepMinutes, CookMinutes, Difficulty, RecipeSteps, RecipeIngredients, Categories, Tags, RecipeImages và NutritionFacts. Giữ nguyên tên API hiện hành, ánh xạ tên trường dataset qua importer.

Đề xuất bảng metadata một-một với Recipes, lưu DatasetKey duy nhất, Region, Tips, EstimatedCostVnd nullable, nguồn/giấy phép văn bản và ảnh, trạng thái kiểm chứng, IsOriginal, IsSynthetic và PublicationAllowed mặc định false. Dinh dưỡng có nguồn cùng cơ sở tính theo khẩu phần. Ảnh có metadata riêng theo từng ảnh khi một món có nhiều nguồn. Chi phí cần nguồn, ngày tham chiếu và khẩu phần tương ứng.

Migration mới được review và kiểm thử trên schema tạm trước khi áp dụng database development. Dữ liệu cũ cần giá trị mặc định an toàn. Quyền xuất bản phải được kiểm tra tại service, bao gồm cập nhật và các đường đọc Published.

## Cấu trúc importer dự kiến

Parser/validator trong Application, triển khai nhập EF trong Infrastructure, entry point CLI trong Api để tận dụng solution hiện có. Hỗ trợ JSON trước, bổ sung CSV khi có nhu cầu. Dry-run chỉ đọc file, chuẩn hóa và xuất lỗi kèm số dòng hoặc dataset key. Bước ghi yêu cầu database đích development/test và tác giả hợp lệ.

DatasetKey ổn định để nhận diện lần nhập lại, hash nội dung để phát hiện thay đổi. Khi trùng bản ghi do người dùng sửa, importer báo xung đột. Mỗi batch có transaction, thống kê created/skipped/conflicted/failed. Duy trì checkpoint chỉ sau commit. Nguyên liệu có alias được review, unit theo whitelist hiện có. Chưa quy đổi g sang ml khi thiếu hệ số phù hợp.

## Năm món cho lô biên soạn đầu

Trứng chiên hành, canh cà chua trứng, rau muống xào tỏi, đậu hũ sốt cà chua và cơm chiên trứng. Tạo bản nháp độc lập, kiểm tra định lượng/khẩu phần, thời gian, bước nấu và an toàn thực phẩm. Nội dung AI hỗ trợ được ghi trạng thái cần người review. Nhóm xác nhận người biên soạn và quyền công khai trước khi gán IsOriginal hoặc PublicationAllowed.

## Đo dung lượng và hiệu năng

**Mốc trước khi nhập ngày 2026-11-06.** Đo bằng truy vấn chỉ đọc trên Neon `recipehub_dev`, schema `public`. Dung lượng toàn database là **10.756.096 byte** (khoảng 10,26 MiB). Có 1 công thức, 1 nguyên liệu, 0 danh mục và 0 tag. Lịch sử EF ghi nhận `20261104152010_InitialIdentityAndRecipes` và `20261104170933_AddPlanningSocialAndAdministration`, cùng phiên bản 10.0.13. Dùng cùng phạm vi và đơn vị byte khi đo lại sau import.

Lưu baseline bằng database/scripts/check-size.sql trước nhập. Nhập20 công thức rồi kiểm tra FK, trùng slug/dataset key, quyền xuất bản và API. Sau mỗi mốc100/300, đo lại tổng dung lượng và bảng/index. Ba trăm công thức có thể chưa đạt180–220MB. Dữ liệu tương tác mô phỏng phục vụ tải cần môi trường test riêng và dấu nhận diện.

Dùng EXPLAIN (ANALYZE, BUFFERS) với truy vấn SELECT đại diện sau ANALYZE. Đo tìm kiếm, lọc nguyên liệu/danh mục, phân trang, recommendations và analytics ở các mốc dữ liệu. Báo cáo dataset size, số lượt, concurrency, p50/p95 và lỗi. Chỉ thêm hoặc đổi index khi có query plan và số liệu trước/sau. Kiểm tra hạn mức Neon và ngân sách lưu trữ trước tăng dữ liệu.

## Điều kiện chuyển giai đoạn

Hoàn tất kiểm chứng nguồn và chọn quyền sử dụng cho lô mẫu. Review metadata/migration, rồi triển khai dry-run/importer và chạy trên schema tạm. Sau khi kiểm thử đạt, xác nhận database development đích và lô dữ liệu được phép nhập. Báo cáo chất lượng dùng số liệu đo thực tế. Bước hiện tại là kế hoạch, các lần nhập và đo hiệu năng còn chờ triển khai.
