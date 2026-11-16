"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Tổng quan",
      href: "/admin",
      icon: "space_dashboard",
      exact: true,
      badge: null,
      badgeColor: "",
    },
    {
      title: "Quản lý công thức",
      href: "/admin/recipes",
      icon: "menu_book",
      exact: false,
      badge: "14",
      badgeColor: "bg-primary-container text-on-primary-container",
    },
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
      icon: "group",
      exact: false,
      badge: null,
      badgeColor: "",
    },
    {
      title: "Danh mục & Nguyên liệu",
      href: "/admin/categories",
      icon: "category",
      exact: false,
      badge: null,
      badgeColor: "",
    },
    {
      title: "Bình luận & Báo cáo",
      href: "/admin/reports",
      icon: "flag",
      exact: false,
      badge: "3",
      badgeColor: "bg-error text-on-error",
    },
    {
      title: "Cài đặt hệ thống",
      href: "/admin/settings",
      icon: "settings",
      exact: false,
      badge: null,
      badgeColor: "",
    },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/admin") return "Bảng điều khiển tổng quan";
    if (pathname.startsWith("/admin/recipes/")) return "Duyệt công thức (Chi tiết)";
    if (pathname.startsWith("/admin/recipes")) return "Quản lý công thức";
    if (pathname.startsWith("/admin/users")) return "Quản lý người dùng";
    if (pathname.startsWith("/admin/categories")) return "Danh mục & Nguyên liệu";
    if (pathname.startsWith("/admin/reports")) return "Bình luận & Báo cáo vi phạm";
    if (pathname.startsWith("/admin/settings")) return "Cài đặt hệ thống & An ninh";
    return "Quản trị";
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* Fixed Admin Dark Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-inverse-surface text-inverse-on-surface z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-tertiary-container/20">
            <Link href="/admin" className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <Icon name="restaurant_menu" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-surface-container-lowest leading-none">
                  RecipeHub
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary-fixed-dim uppercase tracking-wider mt-0.5">
                  Quản trị hệ thống
                </span>
              </div>
            </Link>
            <button
              className="p-1 rounded-lg text-tertiary-fixed-dim hover:text-surface-container-lowest hover:bg-tertiary-container/30 transition-colors cursor-pointer"
              type="button"
              aria-label="Thu gọn thanh điều hướng"
            >
              <Icon name="menu_open" size={20} />
            </button>
          </div>

          {/* Subheader info */}
          <div className="px-space-md py-space-sm">
            <div className="px-space-sm py-1.5 flex items-center justify-between">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-tertiary-fixed-dim tracking-wider">
                Bảng điều hành
              </span>
              <span className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-secondary-fixed-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
                v2.4.0
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex-1 px-space-sm space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-space-md py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-on-primary font-title-md shadow-sm"
                      : "text-tertiary-fixed-dim hover:bg-tertiary-container/30 hover:text-surface-container-lowest"
                  }`}
                >
                  <div className="flex items-center gap-space-md">
                    <Icon name={item.icon} size={20} />
                    <span className="font-body-md text-body-md">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm ${
                        isActive
                          ? "bg-on-primary text-primary font-semibold"
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-space-md border-t border-tertiary-container/20 flex flex-col gap-space-sm">
          <Link
            href="/"
            className="flex items-center justify-between px-space-md py-2 rounded-xl text-tertiary-fixed-dim hover:bg-tertiary-container/30 hover:text-surface-container-lowest transition-all"
          >
            <div className="flex items-center gap-space-sm">
              <Icon name="open_in_new" size={18} />
              <span className="font-body-sm text-body-sm">Xem trang người dùng</span>
            </div>
            <Icon name="north_east" size={16} />
          </Link>

          {/* Current Admin Account Card */}
          <div className="p-space-sm rounded-xl bg-tertiary-container/20 flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Icon name="person" size={18} className="text-on-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm font-semibold text-surface-container-lowest truncate">
                  Lê Hoàng Phúc
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary-fixed-dim truncate">
                  Quản trị viên cấp cao
                </span>
              </div>
            </div>
            <button
              className="p-1 text-tertiary-fixed-dim hover:text-surface-container-lowest transition-colors cursor-pointer"
              type="button"
              aria-label="Tùy chọn tài khoản"
            >
              <Icon name="expand_more" size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container (offset by sidebar width 72) */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
            <Icon name="dns" size={18} />
            <span>Hệ thống quản trị</span>
            <Icon name="chevron_right" size={14} />
            <span className="font-title-md text-on-surface font-semibold">
              {getBreadcrumbTitle()}
            </span>
          </div>

          <div className="w-96">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-outline flex items-center">
                <Icon name="search" size={18} />
              </span>
              <input
                className="w-full pl-9 pr-16 py-2 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                placeholder="Tìm kiếm người dùng, công thức, mã ID..."
                type="text"
              />
              <kbd className="absolute right-3 px-1.5 py-0.5 rounded font-label-mono-sm text-label-mono-sm bg-surface-container text-on-surface-variant border border-outline-variant/50">
                Ctrl+K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden xl:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Máy chủ ổn định</span>
            </div>

            <div className="flex items-center gap-space-xs">
              <Link
                href="/admin/recipes?filter=pending"
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-medium flex items-center gap-1 transition-colors"
              >
                <Icon name="task_alt" size={16} />
                <span>Duyệt nhanh</span>
              </Link>
              <button
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
                type="button"
                onClick={() => alert("Đang xuất báo cáo tổng hợp hệ thống...")}
              >
                <Icon name="file_download" size={16} />
                <span>Xuất báo cáo</span>
              </button>
            </div>

            <div className="relative">
              <Link
                href="/admin/reports"
                className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative block"
                title="Thông báo cảnh báo"
              >
                <Icon name="notifications" size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
              </Link>
            </div>

            <div className="h-5 w-px bg-outline-variant/50" />

            <div className="flex items-center gap-space-sm pl-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Icon name="person" size={18} className="text-on-primary" />
              </div>
              <Icon name="expand_more" size={18} className="text-on-surface-variant" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="w-full flex-1 pt-16 bg-surface px-space-lg py-space-lg">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="w-full bg-surface-container-low py-space-md px-space-lg text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-md">
              <span className="font-label-mono-sm text-label-mono-sm">
                © 2025 RecipeHub Platform. Bản quyền nội bộ.
              </span>
              <span className="hidden md:inline font-label-mono-sm text-label-mono-sm">•</span>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Uptime 99.98%
              </span>
            </div>
            <div className="flex items-center gap-space-lg font-label-mono-sm text-label-mono-sm text-tertiary">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Chính sách bảo mật
              </Link>
              <Link href="/admin/settings" className="hover:text-primary transition-colors">
                Nhật ký cập nhật
              </Link>
              <Link href="/admin/settings" className="hover:text-primary transition-colors">
                Trung tâm hỗ trợ kỹ thuật
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </React.Suspense>
  );
}
