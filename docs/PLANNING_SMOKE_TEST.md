# Kiểm tra thực đơn và đi chợ

Chạy Backend bằng Visual Studio và Frontend bằng cửa sổ đang sử dụng. Sau thay đổi Backend, dừng phiên debug rồi F5 để nạp mã mới.

## 1. Tuần chưa có dữ liệu

Đăng nhập, mở `/meal-planner`, chuyển tuần trước/sau. Tuần chưa lưu phải hiện thông báo chưa có thực đơn. Visual Studio không dừng với ngoại lệ `Resource not found`. API GET tuần chưa có dữ liệu trả 404 là kết quả dự kiến, không tự tạo bản ghi.

## 2. Lưu và đọc lại

Chọn một món Published, ngày, bữa và 2 khẩu phần. Bấm Thêm món, chờ món xuất hiện rồi tải lại trình duyệt. Món phải còn đúng ngày/bữa/khẩu phần. Chuyển sang tuần khác rồi quay lại để đối chiếu. Bỏ món và tải lại để xác nhận đã bỏ.

## 3. Lưu nhanh

Mở chi tiết món có trên máy chủ, chỉnh khẩu phần và lưu vào thực đơn tuần này. Kiểm tra trong tuần hiện tại. Nút lập thực đơn để đi chợ chỉ chuyển trang và chọn sẵn món, người dùng vẫn phải bấm Thêm món.

## 4. Danh sách đi chợ

Chốt món và khẩu phần trước, bấm Tạo / mở danh sách đi chợ của tuần. Đánh dấu một nguyên liệu đã mua, chờ phản hồi rồi tải lại. Trạng thái phải còn. Bỏ đánh dấu và tải lại để đối chiếu.

Sau khi thay đổi thực đơn, bấm **Cập nhật nguyên liệu từ thực đơn** và xác nhận. Danh sách giữ nguyên mã, ghi chú và số lượng đã chỉnh tay của các nguyên liệu còn dùng. Số lượng tự tính được cập nhật theo khẩu phần mới. Khi số lượng thay đổi, trạng thái đã mua được bỏ để người dùng kiểm tra lại. Nguyên liệu không còn dùng được bỏ cùng ghi chú, theo xác nhận trước thao tác. Kiểm tra tải lại trang sau khi cập nhật. Nút Tạo / mở chỉ mở lại danh sách nếu đã tồn tại.

## 5. Tách dữ liệu tài khoản

Đăng xuất, đăng nhập tài khoản khác và mở cùng tuần. Không được thấy thực đơn/danh sách của tài khoản trước. Không dùng thao tác xóa hoặc khóa tài khoản để kiểm tra.

## 6. Ghi kết quả

Ghi ngày kiểm tra, tài khoản (không ghi mật khẩu), tuần, tên món, kết quả thực tế và ảnh nếu có lỗi. Chưa đánh dấu nghiệm thu đạt cho đến khi chạy đủ các bước trên bằng phiên đăng nhập thật.

Cảnh báo hydration có diff chỉ chứa `bis_skin_checked` cần kiểm tra lại bằng hồ sơ trình duyệt không có tiện ích sửa HTML.
