"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="w-full bg-surface-container-lowest rounded-3xl p-space-xl md:p-12 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] relative overflow-hidden border border-outline-variant/30">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-tertiary-fixed/40 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-label-mono-sm font-semibold">
                  <Icon name="lock" size={15} className="text-error" />
                  MÃ LỖI HTTP 403 • TRUY CẬP BỊ TỪ CHỐI
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                  #AUTH_RESTRICTED_PANTRY
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight">
                  Khu vực <span className="text-tertiary underline decoration-tertiary/30">bếp kín</span> — Dành riêng cho Bếp trưởng &amp; Quản trị!
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Bạn đang cố gắng mở ngăn tủ gia vị đặc biệt hoặc khu vực điều hành hệ thống. Để tiếp tục, tài khoản của bạn cần được gán quyền Bếp trưởng điều hành (Admin/Mod).
                </p>
              </div>

              {/* Permission Diagnosis Card */}
              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-3 max-w-xl border border-outline-variant/20">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-body-md text-body-md font-semibold flex items-center gap-2">
                    <Icon name="badge" size={20} className="text-tertiary" />
                    Tài khoản hiện thời: <span className="text-primary">Khách bếp (Guest/Reader)</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F4] text-[#78716C] font-label-mono-sm text-label-mono-sm font-semibold">
                    Không đủ quyền hạn
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Nếu bạn là quản trị viên hoặc biên tập viên công thức ẩm thực, vui lòng đăng xuất và đăng nhập bằng thông tin xác thực doanh nghiệp.
                </p>
              </div>

              {/* Action buttons for 403 */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <Link
                  href="/login"
                  className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm"
                >
                  <Icon name="vpn_key" size={18} />
                  <span>Đăng nhập với tài khoản Quản trị</span>
                </Link>
                <button
                  type="button"
                  onClick={() => alert("Đã gửi yêu cầu cấp quyền đến ban quản trị RecipeHub.")}
                  className="px-space-md py-3 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="contact_support" size={18} />
                  <span>Yêu cầu cấp quyền Bếp trưởng</span>
                </button>
                <Link
                  href="/"
                  className="px-space-md py-3 rounded-xl text-on-surface-variant hover:text-on-surface transition-all font-body-md text-body-md"
                >
                  Về trang chủ an toàn
                </Link>
              </div>
            </div>

            {/* Right 5 Cols: Visual Metaphor */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-surface-container-low p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden border border-outline-variant/20">
                <svg className="w-full h-full text-tertiary max-w-[320px] drop-shadow-md" viewBox="0 0 400 400">
                  <rect fill="#f4ece8" height="280" rx="16" stroke="#8e7166" strokeWidth="2.5" width="240" x="80" y="60" />
                  <rect fill="#ffffff" height="250" rx="10" stroke="#e2bfb2" strokeWidth="1.5" width="210" x="95" y="75" />
                  <line stroke="#eee7e3" strokeWidth="2" x1="95" x2="305" y1="155" y2="155" />
                  <line stroke="#eee7e3" strokeWidth="2" x1="95" x2="305" y1="235" y2="235" />
                  <circle cx="140" cy="115" fill="#ffdbce" r="14" />
                  <circle cx="200" cy="115" fill="#92f5a4" r="14" />
                  <circle cx="260" cy="115" fill="#cec5bf" r="14" />
                  <circle cx="200" cy="225" fill="#1e1b19" r="46" stroke="#ffb599" strokeWidth="2" />
                  <path d="M 180,205 V 170 A 20,20 0 0,1 220,170 V 205" fill="none" stroke="#ffb599" strokeLinecap="round" strokeWidth="8" />
                  <circle cx="200" cy="225" fill="#ffffff" r="8" />
                  <path d="M 197,227 L 195,245 H 205 L 203,227 Z" fill="#ffffff" />
                  <rect fill="#fee2e2" height="24" rx="6" width="160" x="120" y="280" />
                  <text fill="#b91c1c" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold" x="135" y="296">
                    KHU VỰC CẦN MẬT KHẨU
                  </text>
                </svg>
                <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  <Icon name="key_off" size={16} className="text-tertiary" />
                  <span>Ngăn tủ gia vị bảo mật • Cần khóa bếp trưởng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanatory Permission Roles Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="bg-surface-container-lowest rounded-2xl p-space-md flex flex-col gap-2 border border-outline-variant/30">
            <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">
              CẤP ĐỘ 01 • THÀNH VIÊN
            </span>
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Đầu bếp Gia đình
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Lưu món yêu thích, tạo kế hoạch bữa ăn tuần cá nhân, bình luận và đánh giá công thức công khai.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-space-md flex flex-col gap-2 border border-outline-variant/30">
            <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold">
              CẤP ĐỘ 02 • ĐỐI TÁC
            </span>
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Bếp trưởng Sáng tạo
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Đăng tải công thức kèm nhãn chứng thực, quản lý bình luận độc giả, xuất bản bộ sưu tập theo mùa.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-space-md flex flex-col gap-2 border border-outline-variant/30">
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-semibold">
              CẤP ĐỘ 03 • QUẢN TRỊ VIÊN
            </span>
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Điều hành RecipeHub
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Kiểm duyệt thực đơn cộng đồng, quản trị dữ liệu dinh dưỡng, xử lý báo cáo vi phạm bản quyền ẩm thực.
            </p>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
