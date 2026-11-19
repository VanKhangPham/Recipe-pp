import type { Metadata } from "next";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeHub - Nền Tảng Công Thức & Kế Hoạch Bữa Ăn Thông Minh",
  description:
    "Hơn 3.500 công thức gia đình Việt được kiểm chứng. Tự do tìm kiếm nguyên liệu, lên thực đơn tuần và tạo danh sách đi chợ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className="h-full"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Outfit:wght@400;500;600;700;800&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-[100dvh] flex flex-col bg-background font-body-md text-body-md text-on-surface antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
