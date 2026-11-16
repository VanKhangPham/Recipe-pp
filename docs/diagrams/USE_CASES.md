# Use cases và sequence baseline

Mermaid flowchart biểu diễn các actor/use case; các sơ đồ mô tả thiết kế, không khẳng định chức năng đã chạy.

```mermaid
flowchart LR
    G[Khách] --> SEARCH([Tìm / lọc công thức])
    G --> DETAIL([Xem công thức công khai])
    G --> AUTH([Đăng ký / đăng nhập])
    U[User] --> SEARCH
    U --> DETAIL
    U --> PROFILE([Hồ sơ / sở thích])
    U --> CRUD([Quản lý công thức của mình])
    U --> FAV([Yêu thích / đánh giá])
    U --> PLAN([Lập thực đơn tuần])
    U --> SHOP([Sinh / cập nhật danh sách mua sắm])
    U --> REC([Nhận gợi ý])
    A[Admin] --> ADMIN([Quản lý người dùng / danh mục])
    A --> MOD([Quản lý công thức / kiểm duyệt đánh giá])
    A --> ANALYTICS([Xem thống kê])
    SHOP -. dựa trên .-> PLAN
```

## UC-01 — Đăng nhập

Điều kiện: có tài khoản hoạt động. Thành công: nhận access token ngắn hạn và refresh cookie; không lưu raw refresh token trong DB. Thất bại: thông báo chung, rate limiting và không ghi secrets vào logs.

```mermaid
sequenceDiagram
    actor U as User
    participant F as Next.js
    participant A as API Identity
    participant D as Neon
    U->>F: Nhập email/password
    F->>A: POST /auth/login
    A->>D: Identity kiểm tra tài khoản/password hash
    alt Hợp lệ
        A->>D: Lưu refresh token hash
        A-->>F: 200 access token + HttpOnly cookie
        F-->>U: Điều hướng vào ứng dụng
    else Không hợp lệ
        A-->>F: 401 Problem Details
        F-->>U: Thông báo đăng nhập thất bại
    end
```

## UC-02 — Tạo công thức

Điều kiện: User đăng nhập. Server lấy AuthorId từ token, validate toàn bộ dữ liệu và quyền; transaction bảo đảm không có recipe thiếu children khi lỗi.

```mermaid
sequenceDiagram
    participant F as Frontend Khang
    participant A as Recipes API
    participant S as Application
    participant D as Neon
    F->>A: POST /recipes + Bearer
    A->>S: DTO và authenticated UserId
    S->>D: Kiểm tra ingredient/category/tag IDs
    alt Dữ liệu hợp lệ
        S->>D: Transaction lưu recipe và children
        D-->>S: Commit
        S-->>A: RecipeDetail
        A-->>F: 201 + Location
    else Sai dữ liệu
        A-->>F: 400 validation Problem Details
    end
```

## UC-03 — Sinh danh sách mua sắm

Điều kiện: thực đơn thuộc user; mỗi recipe có servings và lượng hợp lệ. Chỉ cộng cùng ingredient/unit; không cộng g với ml. Gọi lại trả danh sách đã có.

```mermaid
sequenceDiagram
    participant F as Frontend Linh
    participant A as Shopping API
    participant D as Neon
    F->>A: PUT /meal-plans/id/shopping-list
    A->>D: Đọc thực đơn theo id + UserId
    alt Không thuộc user hoặc không tồn tại
        A-->>F: 404
    else Đã có danh sách
        A-->>F: 200 danh sách hiện có
    else Chưa có danh sách
        A->>A: Scale servings và group ingredient/unit
        A->>D: Transaction lưu list + items, unique MealPlanId
        A-->>F: 201 danh sách mới
    end
```

Concurrent generation phải dựa unique constraint và xử lý xung đột để đọc lại list đã tạo; không chỉ kiểm tra bằng một SELECT rồi INSERT thiếu bảo vệ.
