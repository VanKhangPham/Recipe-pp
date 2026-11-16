# Authentication — chạy, kiểm thử và bàn giao frontend

## Trạng thái thực thi

Đã có API đăng ký, đăng nhập, refresh, logout, CSRF và hồ sơ. Dùng Identity password hashing/roles/lockout, JWT HS256 access token và refresh cookie. Không cần migration mới cho milestone này; sử dụng schema từ InitialIdentityAndRecipes đã được Khánh áp dụng vào recipehub_dev.

User registration chỉ cấp role User; không nhận role từ request. Role User được tạo khi đăng ký đầu tiên, trong transaction với advisory lock để tránh tranh chấp tạo role. Không seed tài khoản hoặc password Admin. Policy Admin đã đăng ký, chưa có các endpoint quản trị nghiệp vụ hoặc quy trình bootstrap Admin hoàn chỉnh.

## Chạy trên máy Khánh

1. Dừng API cũ trong Visual Studio bằng Shift+F5, build lại rồi chạy profile http.
2. ConnectionStrings:DefaultConnection tiếp tục lấy từ User Secrets hiện có, không sửa hoặc chia sẻ password.
3. Development chưa có Jwt:Key sẽ tự sinh signing key ngẫu nhiên trong bộ nhớ mỗi lần chạy. Có cảnh báo trong console; access tokens cũ mất hiệu lực khi restart. Không in giá trị key. Refresh tokens trong DB có thể lấy access token mới sau restart nhưng cần lấy lại CSRF token/cookie phù hợp.
4. Để giữ signing key ổn định, bổ sung Jwt:Key bằng một secret ngẫu nhiên mạnh dài ít nhất64 bytes UTF-8, chỉ trên máy/secret store; không dùng câu dễ đoán. Production bắt buộc key cấu hình, không có fallback. Issuer mặc định RecipeHub, audience RecipeHub.Web; đổi qua Jwt:Issuer/Jwt:Audience.
5. Development dùng HTTP localhost được; Production bắt buộc HTTPS cho cookie và cần cấu hình Nginx/forwarded headers, Data Protection key persistence và rate-limit proxy đúng trước deployment.

## Endpoint hiện có

- GET `/api/v1/auth/csrf`: 200 {requestToken}, cookie recipehub.csrf, no-store.
- POST `/api/v1/auth/register`: {email,password,displayName}; 201 UserProfile, duplicate409, validation400.
- POST `/api/v1/auth/login`: {email,password}; 200 TokenResponse + refresh cookie; sai thông tin hoặc đang lockout đều401 chung.
- POST `/api/v1/auth/refresh`: body rỗng, refresh cookie; 200 TokenResponse + cookie mới; invalid/expired/reused401.
- POST `/api/v1/auth/logout`: body rỗng, revoke refresh family và xóa cookie,204.
- GET `/api/v1/users/me`: Bearer JWT,200 UserProfile hoặc401.
- PUT `/api/v1/users/me`: Bearer JWT, {displayName},200 UserProfile; không cho tự đổi email/role qua DTO này.

Password12..128 ký tự, có hoa/thường/số/ký tự đặc biệt. DisplayName không chỉ có khoảng trắng. Email tối đa254. Login sai5 lần khóa15 phút; đúng password reset counter. Rate limit30 requests/phút/IP cho nhóm auth, gồm CSRF; vượt429. Rate limiter hiện trong bộ nhớ mỗi instance, không phải distributed rate limiter.

Access token15 phút và refresh token7 ngày hiện là lifetime cố định trong code. Refresh rotate một lần, DB lưu SHA-256 hash của token ngẫu nhiên64 bytes. Dùng lại token revoked thu hồi toàn bộ family, gồm token mới. Frontend cần single-flight refresh để không tự tạo hai request refresh đồng thời. Logout không lập tức hủy JWT access token đã phát hành; token có thể sống tối đa15 phút cộng clock skew30 giây. Khóa tài khoản chặn login/refresh và profile API; không coi đây là global JWT denylist.

## Hướng dẫn Khang/Linh tích hợp

1. Auth requests dùng fetch `credentials: 'include'`; origin Development http://localhost:3000 đã được whitelist với CORS credentials.
2. GET /auth/csrf, giữ requestToken trong bộ nhớ.
3. POST register/login/refresh/logout gửi header X-CSRF-TOKEN cùng token đó. Không thêm Authorization header vào luồng auth/CSRF này; token CSRF gắn với principal và phải nhất quán giữa bước cấp/validate.
4. Login/refresh JSON chỉ chứa accessToken, tokenType, expiresIn, user. Refresh token chỉ nằm trong cookie HttpOnly, SameSite=Lax, Path=/api/v1/auth. JavaScript không đọc refresh cookie.
5. Giữ JWT trong bộ nhớ và gắn Authorization: Bearer vào các API bảo vệ như /users/me. Không tự dùng localStorage cho refresh token.
6. Khi401, chỉ cho một request refresh đang chạy; retry request gốc tối đa một lần. Nếu refresh401 thì xóa access token và chuyển login, không lặp vô hạn.
7. Lấy lại CSRF khi khởi động ứng dụng hoặc đổi trạng thái auth; tách API client auth khỏi client tự gắn Bearer.
8. Logout cũng cần CSRF. Khi đăng xuất, xóa access token trong bộ nhớ phía client sau khi xử lý response.

Ví dụ login (cần tài khoản đã đăng ký):

```typescript
const base = process.env.NEXT_PUBLIC_API_URL; // ví dụ http://localhost:5194/api/v1
const csrfResponse = await fetch(`${base}/auth/csrf`, { credentials: 'include' });
if (!csrfResponse.ok) throw new Error('Không lấy được CSRF token');
const { requestToken } = await csrfResponse.json();
const response = await fetch(`${base}/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': requestToken },
  body: JSON.stringify({ email, password }) // lấy từ form, không hardcode
});
if (!response.ok) {
  // Parse Problem Details và hiển thị lỗi; không log password/token.
  throw new Error('Đăng nhập thất bại');
}
const session = await response.json(); // accessToken giữ trong bộ nhớ
```

Chưa có Swagger UI hoặc trang form test chạy trên browser trong milestone này. Mở /auth/login bằng address bar là GET và không phải cách gọi endpoint POST.

## Chạy kiểm thử

Từ thư mục repository:

```powershell
dotnet build backend/RecipeHub.slnx --configuration Release
dotnet test backend/RecipeHub.slnx --no-build --configuration Release --logger trx
```

Mặc định không đọc credentials để chạy PostgreSQL tests; các tests đó báo skipped rõ ràng. HTTP/JWT/CSRF tests dùng fake IAuthService để tách kiểm tra HTTP khỏi persistence.

Bật tests PostgreSQL thật có chủ đích trên môi trường development/test:

```powershell
$env:RECIPEHUB_RUN_POSTGRES_TESTS = '1'
try {
  dotnet test backend/RecipeHub.slnx --no-build --configuration Release --logger trx
} finally {
  Remove-Item Env:RECIPEHUB_RUN_POSTGRES_TESTS -ErrorAction SilentlyContinue
}
```

Tests lấy connection từ biến RECIPEHUB_POSTGRES_CONNECTION (Jenkins Credentials) hoặc User Secrets API trên máy cá nhân. Không đặt connection string trong command arguments/logs. Chỉ chấp nhận database recipehub_dev hoặc tên kết thúc _test. Fixture tạo schema riêng recipehub_test_<random>, áp dụng migration trong schema này, chạy tests rồi DROP chính schema nó tạo. Không migrate/xóa dữ liệu public hoặc learning. Role test cần quyền CREATE schema, quota dùng chung với database/branch.

Nếu process bị kill, cleanup có thể không chạy; kiểm tra schema recipehub_test_* sót trước khi xóa đúng schema đã xác định. Không tự drop toàn bộ schemas theo wildcard. CI song song nên dùng database test riêng và quản lý secrets tương ứng.

Tests PostgreSQL bao gồm HTTP register/login/profile, password hash/default role, weak password/duplicate email, lockout, refresh rotation/reuse/concurrency, logout và expired token. Đây là kiểm thử thực tế trên PostgreSQL, không phải EF InMemory.

## Nguồn

- Antiforgery MVC: https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-10.0
- JWT validation: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication?view=aspnetcore-10.0

## 2026-11-05 — Trạng thái tài khoản khi xác thực JWT

Sau khi xác minh chữ ký và thời hạn JWT, API kiểm tra tài khoản qua IAuthService.GetProfileAsync. Tài khoản đã bị khóa hoặc đã bị xóa nhận lỗi xác thực ở các endpoint cần đăng nhập. JWT cần sub là UUID hợp lệ. Việc kiểm tra dùng database mỗi yêu cầu có JWT, gồm truy vấn hồ sơ/quyền hiện tại. Yêu cầu đã vượt qua kiểm tra trước thời điểm admin khóa có thể hoàn tất. Mở khóa cho phép JWT chưa hết hạn dùng lại; refresh token đã thu hồi vẫn cần đăng nhập lại.
