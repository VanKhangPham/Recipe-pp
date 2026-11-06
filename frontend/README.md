# RecipeHub – Frontend

Frontend của **RecipeHub – Smart Recipe & Meal Planning Platform**.
Thư mục này (`frontend/`) chứa nền tảng frontend dùng chung, tài khoản và các chức năng công thức. Các trang thực đơn, mua sắm, gợi ý và quản trị do Linh phát triển trên cùng nền tảng này.

> Trạng thái: **Milestone 1 – nền tảng**. Chưa có trang nghiệp vụ nào ngoài trang chủ sơ bộ và kiểm tra kết nối API.

## Công nghệ

| Hạng mục | Lựa chọn |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | React, TypeScript, Tailwind CSS |
| Component | shadcn/ui (thư viện nền: **Base UI**, preset: **Nova** – Lucide / Geist) |
| Form | React Hook Form + Zod |
| Data fetching | TanStack Query |
| Package manager | npm |

Phiên bản chính xác xem trong `package.json` và `package-lock.json`.

## Yêu cầu môi trường

- Node.js bản LTS (tối thiểu 20.9)
- npm
- Backend .NET 10 đang chạy ở Development (cổng `5194`) nếu muốn kiểm tra kết nối API

## Cài đặt và chạy

```bash
cd frontend
npm install
copy .env.example .env.local      # macOS/Linux: cp .env.example .env.local
npm run dev
```

Mở http://localhost:3000.

> Backend chỉ cho phép CORS từ `http://localhost:3000` trong Development, vì vậy hãy giữ frontend ở cổng 3000.

## Biến môi trường

| Biến | Mô tả | Ví dụ |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL gốc của backend | `http://localhost:5194` |

- Chỉ commit `.env.example`. **Không commit** `.env.local` hay bất kỳ secret nào.
- Mọi biến có tiền tố `NEXT_PUBLIC_` sẽ lộ ra trình duyệt, vì vậy không đặt khóa bí mật vào đây.

## Các lệnh

| Lệnh | Tác dụng |
| --- | --- |
| `npm run dev` | Chạy môi trường phát triển |
| `npm run lint` | Kiểm tra ESLint |
| `npx tsc --noEmit` | Kiểm tra kiểu TypeScript |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build production |

Trước khi tạo pull request, chạy lần lượt `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## Kiểm tra kết nối backend

Trang chủ có component `ApiStatus` gọi `GET /api/v1/system`.

- Backend đang chạy: hiển thị dữ liệu trả về.
- Backend tắt hoặc lỗi: hiển thị thông báo lỗi và nút "Thử lại". Frontend **không** dùng dữ liệu giả để thay thế.

Backend hiện chỉ có `GET /api/v1/system`, `GET /health/live` và `/openapi/v1.json` (Development). Các API nghiệp vụ và đăng nhập **chưa tồn tại** tại thời điểm viết tài liệu này; hãy xác minh lại trên repo trước khi tích hợp.

## Cấu trúc thư mục

```
frontend/
├── app/                 # Route, layout, loading.tsx, error.tsx (App Router)
├── components/
│   ├── ui/              # Component shadcn/ui (sinh bằng CLI)
│   └── shared/          # Component dùng chung: header, footer, ApiStatus...
├── features/            # Mã theo tính năng (auth/, recipes/, meal-planner/...)
├── services/            # API client và hàm gọi API
├── hooks/               # Custom hooks dùng chung
├── providers/           # Provider toàn cục (QueryProvider...)
├── types/               # Kiểu TypeScript dùng chung
└── .env.example
```


### Component

- Component shadcn/ui thêm bằng CLI: `npx shadcn@latest add <tên>`. Dùng thư viện nền **Base UI**.
- Lưu ý với Base UI: khi muốn biến Button thành link, dùng prop `render` thay cho `asChild` thường thấy trong ví dụ viết cho Radix.
- Component dùng chung nhiều trang đặt ở `components/shared/`. Code riêng của một tính năng đặt trong `features/<tên>/`.
- Component cần state, hook hoặc sự kiện trình duyệt phải có `"use client"` ở đầu file.

### Form

- Dùng React Hook Form kết hợp Zod (`@hookform/resolvers/zod`). Schema đặt cạnh form trong `features/`.

### Đặt tên

- File component: `kebab-case.tsx`; component export: `PascalCase`.
- Hook bắt đầu bằng `use`.

## Route

Route đề xuất, cần thống nhất trước khi tạo trang:

| Phụ trách | Route |
| --- | --- |
| Khang | `/`, `/login`, `/register`, `/profile`, `/recipes`, `/recipes/[id]`, `/recipes/new`, `/recipes/[id]/edit` |
| Linh | `/meal-planner`, `/shopping-list`, `/recommendations`, `/admin` và các trang con |

Không tạo trùng trang quản lý công thức của người dùng (Khang) với trang quản trị công thức (Linh, dưới `/admin`).

## Kết quả kiểm tra Milestone 1

> Điền kết quả thực tế sau khi chạy.

- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] Kết nối `GET /api/v1/system` thành công khi backend chạy
- [ ] Hiển thị đúng trạng thái lỗi khi backend tắt

