# API contract v1 — baseline cho Khánh, Khang và Linh

Tài liệu gồm cả thiết kế và API đã triển khai. Khang và Linh đối chiếu endpoint và kiểu dữ liệu với OpenAPI của nhánh backend đang chạy. Các ví dụ kiểm thử HTTP cho tìm kiếm, đánh giá, gợi ý và quản trị nằm trong lớp HandoffApiTests.

## Quy ước chung

- Base URL Development: `http://localhost:5194/api/v1`; frontend `http://localhost:3000`.
- JSON camelCase; IDs UUID; timestamps ISO 8601 UTC, ngày `YYYY-MM-DD`.
- Request không được tự chọn owner/UserId hoặc role. API lấy user từ token đã xác thực.
- GET public chỉ trả Published recipes và Visible reviews. Admin/chủ sở hữu dùng endpoint phù hợp để đọc Draft/Archived.
- Query danh sách: `page=1`, `pageSize=20`, page>=1, pageSize 1..100. Query sai trả 400, không âm thầm bỏ qua. Trang vượt cuối trả items rỗng.
- Sort whitelist, không nhận tên cột SQL trực tiếp. Luôn có Id tie-breaker.
- Success: 200 cho đọc/update, 201 + Location cho create, 204 cho delete/logout/idempotent favorite. Errors: 400 validation, 401 chưa đăng nhập, 403 thiếu role, 404 không tìm thấy/không thuộc quyền sở hữu, 409 trùng hoặc xung đột trạng thái, 429 giới hạn tần suất, 500 lỗi nội bộ không kèm stack trace.
- Lỗi chuẩn `application/problem+json`, gồm type/title/status/detail/instance và traceId; lỗi validation thêm errors theo tên trường. Không có envelope success chung bọc mọi DTO.

PaginationResponse<T>:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalCount": 0,
  "totalPages": 0
}
```

Validation example:

```json
{
  "type": "about:blank",
  "title": "Validation failed",
  "status": 400,
  "errors": { "title": ["Title is required."] },
  "traceId": "request-correlation-id"
}
```

## Authentication — baseline cần nhóm rà soát trước khi code

- JWT access token gửi `Authorization: Bearer ...`, frontend giữ trong bộ nhớ. Refresh token không lưu localStorage và không trả JSON; cookie HttpOnly, SameSite=Lax, Path=/api/v1/auth, Secure trong Production. Development HTTP chỉ được phép cookie không Secure trong Development.
- Deployment cùng origin qua Nginx là phương án mặc định. Nếu frontend chuyển host khác, phải review lại cookie, CORS credentials và CSRF trước triển khai.
- Frontend gọi auth với `credentials: include`; API đã bật AllowCredentials với origin whitelist cụ thể. Luồng auth/CSRF không gửi Bearer; Bearer chỉ gửi cho các API bảo vệ.
- Refresh token ngẫu nhiên mạnh, lưu hash ở DB, rotate nguyên tử; token cũ dùng lại thu hồi family. Lifetime hiện cố định trong code: access15 phút, refresh7 ngày; chưa có cấu hình đổi lifetime. Chỉ token chưa hết hạn và user đang hoạt động được refresh. Frontend phải single-flight refresh.
- Với login/register/refresh/logout, dùng ASP.NET Core Antiforgery: frontend gọi GET /auth/csrf với credentials, nhận requestToken, gửi header X-CSRF-TOKEN khi POST; antiforgery cookie HttpOnly do server quản lý. Kiểm tra Origin theo whitelist, không chấp nhận Origin lạ. CORS đơn thuần không thay thế CSRF. Token cần cấp lại sau khi đổi trạng thái đăng nhập; request /auth/csrf phải Cache-Control: no-store.
- Logout revoke refresh session và xóa cookie đúng Path/options; JWT đã cấp có thể còn hiệu lực tối đa thời gian sống trừ khi bổ sung kiểm tra session/security stamp. Khóa user phải chặn đăng nhập/refresh, thiết kế rõ hiệu lực token hiện hữu.
- Đã có middleware JWT, cookie, refresh rotation và CSRF. Development có thể dùng key ngẫu nhiên trong bộ nhớ nếu thiếu Jwt:Key; Production bắt buộc cấu hình key mạnh. Chưa có quy trình bootstrap Admin hoặc các API quản trị.

Endpoints:

- `GET /auth/csrf` — public; 200 {requestToken}, cấp antiforgery cookie, không cache. Frontend lấy token khi mở ứng dụng và sau login/logout.
- `POST /auth/register` — public; body email (max254), password (12..128), displayName (1..100). Password policy dự kiến gồm chữ hoa/thường/số/ký tự đặc biệt. Thành công 201 UserProfile, không tự login; email trùng 409. Không nhận role.
- `POST /auth/login` — public, rate limited; body email/password. 200 TokenResponse + refresh cookie. Sai thông tin hoặc khóa tạm đều401 chung, không lộ trạng thái tài khoản; rate limit request trả429 và Retry-After khi limiter cung cấp.
- `POST /auth/refresh` — cookie và bảo vệ CSRF; body rỗng. 200 TokenResponse + cookie mới; token không hợp lệ 401 và xóa cookie.
- `POST /auth/logout` — cookie và bảo vệ CSRF; idempotent 204, revoke nếu còn session hợp lệ.
- `GET /users/me` — User; 200 UserProfile.
- `PUT /users/me` — User; body displayName; 200 UserProfile. Đổi email/password có luồng riêng, chưa nằm trong DTO cập nhật này.
- `GET /users/me/preferences`, `PUT /users/me/preferences` — User; arrays dietaryPreferences/allergens và preferredMaxCookingMinutes nullable >0.

TokenResponse: `{ accessToken, tokenType: "Bearer", expiresIn: 900, user: UserProfile }`.
UserProfile: `{ id, email, displayName, roles: ["User"], createdAt }`.
PublicAuthor: `{ id, displayName }` — không có email/roles.

## Recipes — ưu tiên triển khai sau auth

- `GET /recipes` — public; page/pageSize, q (1..200 nếu có), categoryId, tagId, ingredientIds (tham số lặp lại, ví dụ ingredientIds=id1&ingredientIds=id2, tối đa20), maxTotalMinutes (>0), difficulty, sort. Ingredient filter mặc định yêu cầu có tất cả ingredientIds. Sort: newest (default), rating, cookingTime; sort rating chỉ tính Visible reviews. 200 PaginationResponse<RecipeSummary>.
- `GET /recipes/{id}` — public nếu Published, owner/Admin có thể xem Draft; 200 RecipeDetail hoặc 404.
- `GET /users/me/recipes` — User; thêm status filter; 200 paginated summaries gồm cả bản nháp của mình.
- `POST /recipes` — User; RecipeWriteRequest; 201 RecipeDetail và Location.
- `PUT /recipes/{id}` — owner/Admin; thay toàn bộ nội dung từ RecipeWriteRequest; 200 RecipeDetail. Cập nhật nguyên liệu/bước/join trong transaction; referenced IDs không tồn tại trả400, không tạo âm thầm.
- `DELETE /recipes/{id}` — owner/Admin; archive thay vì hard delete; 204 kể cả đã archive; không tồn tại/không sở hữu 404. Recipe archived bị loại khỏi danh sách public, giữ tham chiếu thực đơn.

RecipeSummary: id, title, slug, description (rút gọn tối đa300), coverImageUrl nullable, author PublicAuthor, servings, prepMinutes, cookMinutes, totalMinutes, difficulty, averageRating nullable, reviewCount, categories [{id,name,slug}], createdAt. DTO owner list thêm status; không đưa trạng thái favorite theo user vào public cache.

RecipeWriteRequest example (IDs cần lấy từ API thật):

```json
{
  "title": "Cơm rau củ",
  "description": "Bữa trưa đơn giản",
  "servings": 2,
  "prepMinutes": 10,
  "cookMinutes": 20,
  "difficulty": "Easy",
  "status": "Draft",
  "ingredients": [
    { "ingredientId": "11111111-1111-4111-8111-111111111111", "quantity": 200, "unit": "g", "note": null, "position": 1 }
  ],
  "steps": [ { "position": 1, "instruction": "Sơ chế nguyên liệu.", "durationMinutes": 10 } ],
  "categoryIds": [],
  "tagIds": [],
  "images": []
}
```

Validation: title 1..200 trim, description <=5000, servings1..100, prep/cook0..1440, difficulty Easy/Medium/Hard, status Draft/Published (archive qua DELETE), ingredients1..100, quantity>0 và tối đa3 chữ số thập phân, steps1..100, instruction1..5000, position liên tục bắt đầu1 và không trùng. Images tối đa10, position bắt đầu0, URL HTTPS tuyệt đối <=2048, altText<=200. CategoryIds/tagIds không trùng, mỗi loại tối đa20. Unit whitelist ban đầu g/kg/ml/l/tsp/tbsp/piece; không suy ra quy đổi mật độ. Server sinh slug; thay title không tự đổi slug hiện có.

RecipeDetail chứa trường summary (ví dụ đọc summary.id và summary.title), cùng các trường ingredients [{id,ingredientId,ingredientName,quantity,unit,note,position}], steps [{id,position,instruction,durationMinutes}], tags, images, nutrition nullable (theo khẩu phần), publishedAt và updatedAt. Status chỉ trả khi chính sách truy cập cho phép. Danh sách con sắp theo position.

## Nguyên liệu, danh mục và tags

- `GET /ingredients?q=&page=&pageSize=` — public; 200 PaginationResponse<{id,name,defaultUnit}>.
- `POST /ingredients`, `PUT /ingredients/{id}`, `DELETE /ingredients/{id}` — Admin; body name/defaultUnit; create201, update200, delete204, đang tham chiếu409.
- `GET /categories`, `GET /tags` — public; 200 array {id,name,slug}; danh mục nhỏ, chưa phân trang.
- `POST|PUT|DELETE /admin/categories[/{id}]`, `/admin/tags[/{id}]` — Admin; name và slug unique; đang tham chiếu409 khi xóa.

## Yêu thích và đánh giá

- `GET /users/me/favorites` — User, paginated RecipeSummary.
- `PUT /users/me/favorites/{recipeId}` — User; body rỗng, idempotent204; recipe phải Published.
- `DELETE /users/me/favorites/{recipeId}` — User; idempotent204, không cần recipe còn public.
- `GET /recipes/{recipeId}/reviews` — public; paginated Visible ReviewResponse, sort mới nhất.
- `POST /recipes/{recipeId}/reviews` — User; {rating,comment}; 201; duplicate409. Rating integer1..5, comment<=2000. Baseline review mới Visible, Admin có thể Hidden; nếu chọn pre-moderation thì nhóm đổi contract trước frontend.
- `PUT /reviews/{id}` — author/Admin; cùng body; 200.
- `DELETE /reviews/{id}` — author/Admin; 204.

ReviewResponse: id, recipeId, author PublicAuthor, rating, comment, createdAt, updatedAt. Review ẩn không được tính vào averageRating/reviewCount public.

## Thực đơn và danh sách mua sắm

- `GET /meal-plans?weekStart=YYYY-MM-DD` — User; thứ Hai, 200 MealPlan hoặc404 khi chưa tạo.
- `POST /meal-plans` — User; {weekStart}; 201 hoặc409 nếu tuần đã có.
- `POST /meal-plans/{id}/items` — owner; {recipeId,plannedDate,mealType,servings}; 201. MealType Breakfast/Lunch/Dinner/Snack, ngày trong tuần, recipe Published; mỗi bữa có thể nhiều món.
- `PUT /meal-plans/{id}/items/{itemId}` — owner; cùng body; 200.
- `DELETE /meal-plans/{id}/items/{itemId}` — owner; 204.
- `PUT /meal-plans/{id}/shopping-list` — owner; sinh idempotent, body rỗng; 201 lần đầu/200 nếu đã có, giữ nguyên danh sách cũ khi gọi lại. Không âm thầm regenerate sau khi thực đơn đổi; refresh sẽ có luồng xác nhận riêng ở milestone sau.
- `GET /shopping-lists` — owner; paginated list summaries.
- `GET /shopping-lists/{id}` — owner; 200 ShoppingList.
- `PATCH /shopping-lists/{id}/items/{itemId}` — owner; quantity>0, isPurchased, note<=300, ít nhất một field; 200 item. Sửa quantity đánh dấu IsManuallyEdited.

MealPlan: id, weekStart, items[{id,recipeId,recipeTitle,plannedDate,mealType,servings}].
ShoppingList: id, name, mealPlanId nullable, items[{id,ingredientId,ingredientName,quantity,unit,isPurchased,note}].
Sinh quantity = recipeIngredient.quantity * mealPlanItem.servings / recipe.servings; cộng theo IngredientId+Unit, làm tròn lên3 chữ số thập phân sau khi cộng. Recipe archived đang nằm trong thực đơn vẫn có thể dùng nội dung còn lưu để sinh list.

## Gợi ý và quản trị

- `GET /recommendations?ingredientIds=&categoryId=&maxTotalMinutes=&limit=10` — public; limit1..50, fallback Published phổ biến khi không có tín hiệu. 200 array {recipe: RecipeSummary, score, reasons[]}.
- `GET /users/me/recommendations?limit=10` — User; bổ sung sở thích/favorites/views, không trả trùng recipe.
- `GET /recipes/{id}/similar?limit=10` — public; không gồm chính recipe đầu vào.
- `GET /admin/analytics?from=&to=` — Admin; UTC khoảng [from,to), from<to, tối đa366 ngày; DTO tổng users/recipes, views trong khoảng, popular recipes, daily activity. Cần chốt chi tiết metric trước Recharts; chưa có số liệu thật.
- `GET /admin/users` — Admin; paginated UserProfile có trạng thái khóa.
- `PATCH /admin/users/{id}/status` — Admin; {isLocked}; 200; không tự khóa mình hoặc khóa Admin cuối cùng,409 nếu vi phạm.
- `GET /admin/recipes?status=&page=&pageSize=` — Admin; đọc mọi trạng thái; sửa/archive dùng API recipes có policy Admin.
- `GET /admin/reviews?moderationStatus=&page=&pageSize=` — Admin; paginated review có moderationStatus.
- `PATCH /admin/reviews/{id}/moderation` — Admin; {status: "Visible"|"Hidden"}; 200.

Không xây CRUD quyền Admin tùy ý trong giao diện giai đoạn đầu. Bootstrap Admin qua quy trình vận hành bảo mật, không hardcode mật khẩu.

## Thứ tự bàn giao

1. Khánh triển khai auth + ingredients/categories + recipe read/write.
2. Khang nối form và danh sách/chi tiết theo contract đã được review; mock tách riêng trong Development trong thời gian chờ.
3. Khánh triển khai meal-planning/shopping-list/admin; Linh nối UI và viết tests tương ứng.
4. Mọi thay đổi contract phải cập nhật file này và thông báo cho người dùng endpoint trước merge. OpenAPI từ code sau triển khai là nguồn kiểm tra hợp đồng thực thi.

### Chi tiết nguyên liệu

`GET /ingredients/{id}` là endpoint công khai, trả IngredientDto gồm id, name, defaultUnit. ID không tồn tại trả404. Location của POST /ingredients trỏ đến endpoint này.

### Chi tiết danh mục và tag

`GET /categories/{id}` và `GET /tags/{id}` công khai trả NamedItem gồm id, name, slug. ID không tồn tại trả404. `GET /admin/categories/{id}` và `GET /admin/tags/{id}` trả cùng DTO và yêu cầu quyền Admin; đây là các đường dẫn Location của API tạo tương ứng.

### Duyệt nguồn dataset

PATCH /admin/dataset/{recipeId}/review yêu cầu Admin. Body {status,sourceName,sourceUrl,licenseIdentifier}; status Pending/Approved/Rejected. Approved yêu cầu tên nguồn và mã giấy phép. SourceUrl null hoặc URL HTTPS tuyệt đối.200 DatasetReviewDto,400 validation,404 khi recipe/metadata không tồn tại. Approved giữ nguyên trạng thái món; thu hồi duyệt đưa món Published về Draft. Audit ghi người duyệt và thời điểm. Việc xác minh nguồn do người duyệt chịu trách nhiệm.
