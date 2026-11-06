# Nguồn dữ liệu và trạng thái quyền sử dụng

Ngày lập2026-11-05, cập nhật2026-11-06. Danh sách dưới đây là kế hoạch nguồn. Kết quả kiểm tra thực tế nằm ở mục cập nhật cuối tài liệu. Mỗi nội dung cần bản ghi nguồn/giấy phép riêng trước khi nhập và công khai.

- Điện máy XANH Vào bếp — https://www.dienmayxanh.com/vao-bep — nguồn tham khảo danh sách món và phương pháp. Quyền tái sử dụng văn bản/ảnh chờ xác minh.
- Cookbeo — https://www.cookbeo.com/ — nguồn tham khảo món gia đình. Quyền tái sử dụng văn bản/ảnh chờ xác minh.
- Wikibooks Cookbook — https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents — ứng viên công thức. Cần kiểm tra từng trang, phiên bản, ghi công và giấy phép. URL giấy phép được đề xuất trong yêu cầu là https://creativecommons.org/licenses/by-sa/4.0/.
- USDA FoodData Central — https://fdc.nal.usda.gov/ và https://fdc.nal.usda.gov/api-guide/ — ứng viên dữ liệu dinh dưỡng nguyên liệu. Cần đối chiếu định danh, trạng thái sống/chín, đơn vị và khẩu phần.
- TheMealDB — https://www.themealdb.com/api.php — ứng viên tham khảo cấu trúc và công thức. Điều khoản API và quyền hiển thị cần kiểm tra.
- Open Food Facts — https://world.openfoodfacts.org/ và https://openfoodfacts.github.io/openfoodfacts-server/api/ — ứng viên dữ liệu thực phẩm đóng gói. Giấy phép từng loại dữ liệu/ảnh cần kiểm tra.
- Wikimedia Commons — https://commons.wikimedia.org/ — ứng viên ảnh có ghi công/giấy phép riêng theo file.
- Openverse — https://openverse.org/ — công cụ tìm ảnh, cần kiểm tra trang gốc của từng ảnh.
- Unsplash — https://unsplash.com/ — điều khoản ảnh/API chờ xác minh.
- Pexels — https://www.pexels.com/ — điều khoản ảnh/API chờ xác minh.
- Nhóm RecipeHub — nội dung và ảnh nhóm tự tạo cần tên tác giả, ngày biên soạn, bằng chứng quyền và quyết định cho phép công khai. Các trường này được xác nhận trước nhập.

Source registry sẽ lưu source key, URL gốc, tác giả, loại nội dung, license identifier/URL, ngày kiểm tra, người kiểm tra, bằng chứng, nội dung ghi công và publication status. Publication status mặc định pending. Chỉ nội dung được review và chấp thuận mới chuyển allowed. Tình trạng này áp dụng riêng cho văn bản, ảnh và dữ liệu dinh dưỡng.

## Kết quả kiểm tra nguồn ngày2026-11-06

- Wikibooks Cookbook truy cập được. Footer của trang mục lục liên kết CC BY-SA4.0. Nội dung theo giấy phép này cần ghi công, liên kết giấy phép và nêu sửa đổi; nội dung chuyển thể cần tuân thủ ShareAlike. Chưa chọn trang công thức cụ thể hoặc kiểm tra giấy phép từng ảnh. Trang mục lục không được gán làm nguồn của5 bản nháp hiện tại. [Trang đã kiểm tra](https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents), [giấy phép](https://creativecommons.org/licenses/by-sa/4.0/).
- USDA FDC truy cập được. API Guide công bố dữ liệu FDC thuộc public domain/CC0 và đề nghị ghi nguồn. Đây là ứng viên dữ liệu dinh dưỡng, cần đối chiếu food ID, dữ liệu sống/chín và đơn vị trước khi tính. Chưa có số dinh dưỡng nào được nhập vào RecipeHub. [API Guide, mục Licensing](https://fdc.nal.usda.gov/api-guide/), [Data Documentation](https://fdc.nal.usda.gov/data-documentation/).
- Cookbeo truy cập được trang chủ. Link Bản quyền trỏ tới /license.html nhưng công cụ đọc trang này gặp Cache miss. Quyền tái xuất bản còn chờ xác minh. Chưa dùng văn bản hoặc ảnh Cookbeo cho lô nhập. [Trang chủ](https://www.cookbeo.com/), [trang điều khoản cần kiểm tra tiếp](https://www.cookbeo.com/license.html).
- Điện máy XANH Vào bếp bị timeout khi truy cập bằng công cụ trong lượt kiểm tra. Chưa xác minh điều khoản. [URL đã thử](https://www.dienmayxanh.com/vao-bep).

Các nguồn khác trong kế hoạch vẫn chờ xác minh. Năm món đã nhập có SourceType=AI-assisted draft, ReviewStatus=Pending. Việc đọc các trang trên diễn ra sau khi biên soạn/nhập lô mẫu. Không hồi tố gán các trang đó làm nguồn cho nội dung hiện có.
