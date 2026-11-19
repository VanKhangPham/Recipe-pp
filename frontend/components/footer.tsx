"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low py-space-xl">
      <div className="w-full px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-xl">
          {/* Brand & Vision (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name="skillet" size={22} />
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
                Recipe<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Nền tảng công thức ẩm thực mở và xây dựng thực đơn cá nhân hóa. Chúng tôi ủng hộ việc
              nấu nướng tự do, không rào cản dữ liệu, kết nối tình yêu gian bếp gia đình và cảm hứng sống lành mạnh.
            </p>
            <div className="flex items-center gap-space-sm">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm">
                <Icon name="verified" size={14} />
                <span>Mở Tự Do</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                <Icon name="lock_open" size={14} />
                <span>Không Rào Cản</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Khám phá */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface">
              Khám phá &amp; Lập kế hoạch
            </span>
            <div className="flex flex-col gap-2.5 mt-space-xs">
              <Link
                href="/recipes"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Kho công thức cộng đồng
              </Link>
              <Link
                href="/meal-planner"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Kế hoạch bữa ăn tuần
              </Link>
              <Link
                href="/shopping-list"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Đi chợ thông minh
              </Link>
              <Link
                href="/recipes"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Chế độ nấu rảnh tay
              </Link>
            </div>
          </div>

          {/* Quick Links: Hỗ trợ & Pháp lý */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface">
              Hỗ trợ &amp; Pháp lý
            </span>
            <div className="flex flex-col gap-2.5 mt-space-xs">
              <Link
                href="/ingredient-search"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Tìm món theo nguyên liệu
              </Link>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Điều khoản sử dụng
              </a>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Liên hệ &amp; Phản hồi
              </a>
              <a
                href="#"
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
              >
                Hướng dẫn đóng góp
              </a>
            </div>
          </div>

          {/* Kitchen Timer Widget Preview */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface">
              Bộ đếm bếp
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Đang tối ưu thời gian nấu ăn thực tế trực tiếp trên màn hình bàn bếp của bạn.
            </p>
            <div className="flex items-center gap-2 p-3 bg-surface-container rounded-xl shadow-sm">
              <Icon name="timer" size={20} className="text-primary" />
              <span className="font-label-mono-lg text-label-mono-lg text-on-surface font-medium">
                00:00:00
              </span>
              <span className="font-body-sm text-body-sm text-secondary font-semibold ml-auto">
                Sẵn sàng
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 RecipeHub. Bản quyền thuộc về cộng đồng đầu bếp gia đình.
          </p>
          <div className="flex items-center gap-space-md font-body-sm text-body-sm">
            <span className="flex items-center gap-1">
              <Icon name="eco" size={16} className="text-secondary" />
              Bền vững &amp; Tự nhiên
            </span>
            <span className="flex items-center gap-1">
              <Icon name="local_dining" size={16} className="text-primary" />
              Chuẩn mực ẩm thực Việt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
