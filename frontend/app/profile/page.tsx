"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

export default function PersonalProfilePage() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full px-margin-mobile lg:px-margin py-space-md lg:py-space-lg flex flex-col gap-space-lg">
            {/* Breadcrumb & Top Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <nav className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  <Link className="hover:text-primary transition-colors" href="/">
                    Trang chủ
                  </Link>
                  <span className="text-outline/40">/</span>
                  <span className="text-outline">Tài khoản của tôi</span>
                  <span className="text-outline/40">/</span>
                  <span className="text-primary font-medium">Hồ sơ cá nhân &amp; Thống kê</span>
                </nav>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold mt-1">
                  Hồ sơ cá nhân &amp; Hành trình ẩm thực
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                  Theo dõi thói quen nấu nướng gia đình, mức độ hoàn thành mục tiêu dinh dưỡng và dấu ấn ẩm thực của bạn trên RecipeHub.
                </p>
              </div>
              <div className="flex items-center gap-space-sm self-start md:self-auto">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    triggerToast("Đã sao chép liên kết hồ sơ vào bộ nhớ tạm!");
                  }}
                  className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium shadow-sm hover:bg-surface-container-low transition-all cursor-pointer"
                  type="button"
                >
                  <Icon name="share" className="text-[18px]" />
                  <span>Chia sẻ hồ sơ</span>
                </button>
                <Link
                  className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm font-medium transition-all"
                  href="/settings"
                >
                  <Icon name="settings" className="text-[18px]" />
                  <span className="hidden sm:inline">Cài đặt tài khoản</span>
                </Link>
              </div>
            </div>

            {/* Personal Profile Card Module */}
            <div className="w-full bg-surface-container-lowest rounded-3xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] overflow-hidden">
              {/* Ambient Banner */}
              <div
                className="relative w-full h-48 md:h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvl25Etc-8lHVN64R-i6zHpTIxx8xZRhe08HEsAL2NkVox6WfF_owJYBHUfZWgnSLfANtt2MWabiyRxNShz-ZoJheawZ_qsIrwiv_Uw6BRJJsidyrxySHIFeUCTZyD0-mW9tIQeUAuXzmyqy1-Q0qigc-915upA7MOY8pbxMyfsokM4dbEUA6xu-DptDIhvSEVbsSCxydiceOMDMMprBBNvVgTKTQ7C9e8z9gU5iUU')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-on-background/20 to-transparent" />
                <button
                  onClick={() => triggerToast("Chức năng cập nhật ảnh bìa đang chuẩn bị...")}
                  aria-label="Thay đổi ảnh bìa"
                  className="absolute top-4 right-4 flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-body-sm text-body-sm shadow-md hover:bg-surface transition-all cursor-pointer"
                  type="button"
                >
                  <Icon name="photo_camera" className="text-[18px] text-primary" />
                  <span className="text-xs font-medium">Thay đổi ảnh bìa</span>
                </button>
              </div>

              {/* Main Profile Body */}
              <div className="px-space-md md:px-space-xl pb-space-lg pt-0 relative">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md -mt-16 md:-mt-20 mb-space-md">
                  {/* Avatar + Titles */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-space-md">
                    <div className="relative group">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-surface-container-lowest shadow-xl relative overflow-hidden">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBosLFvy-wdW5dFUysUOF9h9YAM0nA1v_uJIRZqVcpSylNX6Rk0sB9w30dNB3uFBAdIi0rAhZiSrDSapEVPHrDATVniuubpFzN43rUrd5AE_LuxVyYr_JplOy9ySaqkma_wotScL58LEtJVi2tuZpg6tkmwLc8_uv5XLwiC1Hjr7UHKiIOZSToIkhZUqr2AkT4_Qn0Po2Iitk9XYlSwnRwqa9nkQ8-9uH0H2IjFjD4X"
                          alt="Nguyễn Thu Hà"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => triggerToast("Chức năng đổi ảnh đại diện...")}
                        aria-label="Đổi ảnh đại diện"
                        className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                        type="button"
                      >
                        <Icon name="photo_camera" className="text-[18px]" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 pb-1">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                          Nguyễn Thu Hà (Bếp Mẹ Ba)
                        </h2>
                        <span className="inline-flex items-center text-secondary" title="Thành viên tích cực 3 năm">
                          <Icon name="verified" className="text-[20px]" />
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-mono-sm text-[11px] font-semibold tracking-wide">
                          Đầu bếp tinh hoa
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-sm text-outline font-label-mono-sm text-label-mono-sm">
                        <span className="text-on-surface font-medium">@bepmeba</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          thuha.bepmeba@gmail.com
                          <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-semibold">
                            Đã xác thực
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Action CTAs */}
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <Link
                      href="/settings"
                      className="flex items-center gap-space-xs py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium shadow-[0_8px_16px_-4px_rgba(163,57,0,0.25)] transition-all active:scale-[0.98]"
                    >
                      <Icon name="edit_note" className="text-[18px]" />
                      <span>Chỉnh sửa thông tin cá nhân</span>
                    </Link>
                    <Link
                      className="flex items-center gap-space-xs px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm font-medium transition-all"
                      href="/authors/bep-me-ba"
                    >
                      <Icon name="visibility" className="text-[18px]" />
                      <span>Xem trang công khai</span>
                    </Link>
                  </div>
                </div>

                {/* Bio & Micro Metadata Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md pt-space-xs">
                  <div className="lg:col-span-7 flex flex-col justify-between gap-space-sm">
                    <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                      “Người gìn giữ hương vị cơm nhà Nam Bộ &amp; món kho truyền thống. Nấu ăn bằng tình yêu thương và sự tỉ mỉ cho mỗi bữa cơm quây quần.”
                    </p>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-space-md text-on-surface-variant font-body-sm text-body-sm pt-1">
                      <div className="flex items-center gap-1.5">
                        <Icon name="location_on" className="text-[18px] text-primary" />
                        <span>Bến Tre &amp; TP. Hồ Chí Minh</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="calendar_month" className="text-[18px] text-tertiary" />
                        <span>Gia nhập: 15/10/2021 (3 năm đồng hành)</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-center gap-1.5">
                    <div className="flex items-center gap-2 text-primary font-label-mono-sm text-label-mono-sm uppercase tracking-wider font-semibold">
                      <Icon name="soup_kitchen" className="text-[16px]" />
                      <span>Khẩu vị gia đình yêu thích</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface font-medium">
                      Thích món kho đậm đà, ít ngọt, vị cay thanh, ưu tiên nhiều rau xanh luộc &amp; canh mát lành mỗi ngày.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cooking Stats & Highlights (4 Key Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
              {/* Metric 1 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_12px_24px_-10px_rgba(28,25,23,0.05)] hover:-translate-y-0.5 transition-all flex items-start justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider font-medium">
                    Mâm cơm đã nấu
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                      168
                    </span>
                    <span className="font-body-sm text-body-sm text-outline font-normal">bữa</span>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium flex items-center gap-1 mt-1">
                    <Icon name="trending_up" className="text-[14px]" />
                    +14 mâm trong tháng này
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                  <Icon name="skillet" className="text-[24px]" />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_12px_24px_-10px_rgba(28,25,23,0.05)] hover:-translate-y-0.5 transition-all flex items-start justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider font-medium">
                    Công thức chia sẻ
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                      28
                    </span>
                    <span className="font-body-sm text-body-sm text-outline font-normal">món</span>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                    <span className="text-primary font-semibold">14.8K</span> theo dõi •{" "}
                    <span className="text-primary font-semibold">125.4K</span> lưu
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary shadow-sm flex-shrink-0">
                  <Icon name="menu_book" className="text-[24px]" />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_12px_24px_-10px_rgba(28,25,23,0.05)] hover:-translate-y-0.5 transition-all flex items-start justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider font-medium">
                    Món ngon yêu thích
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                      42
                    </span>
                    <span className="font-body-sm text-body-sm text-outline font-normal">công thức</span>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                    Phân loại trong 5 bộ sưu tập
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                  <Icon name="favorite" className="text-[24px]" />
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_12px_24px_-10px_rgba(28,25,23,0.05)] hover:-translate-y-0.5 transition-all flex items-start justify-between gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider font-medium">
                    Thời gian tiết kiệm
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
                      18.5
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-normal">giờ</span>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium flex items-center gap-1 mt-1">
                    Nhờ Lên lịch &amp; Đi chợ thông minh
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container shadow-sm flex-shrink-0">
                  <Icon name="electric_bolt" className="text-[24px]" />
                </div>
              </div>
            </div>

            {/* Visual Analytics: Cooking Habits & Nutrition Insights (Asymmetric Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              {/* Left Column: Activity Heatmap (7 cols) */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-space-md md:p-space-lg rounded-3xl shadow-[0_16px_32px_-12px_rgba(28,25,23,0.05)] flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                      Tần suất nấu cơm nhà theo tuần
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline">
                      Bảng hoạt động 12 tuần gần nhất (Sáng • Trưa • Tối)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container px-3 py-1 rounded-full text-secondary font-label-mono-sm text-[12px] font-semibold">
                    <Icon name="check_circle" className="text-[16px]" />
                    <span>Tự nấu tại nhà: 86%</span>
                  </div>
                </div>

                {/* Heatmap Grid Container */}
                <div className="w-full overflow-x-auto pb-2">
                  <div className="min-w-[540px] flex flex-col gap-2">
                    <div className="flex text-outline font-label-mono-sm text-[11px] justify-between px-6">
                      <span>Tuần 1</span>
                      <span>Tuần 3</span>
                      <span>Tuần 6</span>
                      <span>Tuần 9</span>
                      <span>Hiện tại</span>
                    </div>

                    {/* Heatmap Blocks: 7 Days (rows) x 12 Weeks (columns) */}
                    <div className="grid grid-cols-12 gap-1.5 pt-1">
                      {/* 12 weeks with various intensity classes */}
                      {[
                        ["bg-primary/20", "bg-primary", "bg-primary-container", "bg-primary", "bg-primary/20", "bg-primary", "bg-primary"],
                        ["bg-primary-container", "bg-primary", "bg-primary", "bg-surface-container-high", "bg-primary-container", "bg-primary", "bg-primary"],
                        ["bg-primary", "bg-primary", "bg-primary/20", "bg-primary-container", "bg-primary", "bg-primary", "bg-primary"],
                        ["bg-surface-container-high", "bg-primary-container", "bg-primary", "bg-primary", "bg-primary", "bg-primary", "bg-primary"],
                        ["bg-primary", "bg-primary", "bg-primary", "bg-primary-container", "bg-primary/20", "bg-primary", "bg-primary"],
                        ["bg-primary", "bg-primary-container", "bg-primary", "bg-primary", "bg-primary", "bg-primary", "bg-primary"],
                        ["bg-primary-container", "bg-primary", "bg-primary", "bg-surface-container-high", "bg-primary", "bg-primary", "bg-primary"],
                        ["bg-primary", "bg-primary", "bg-primary", "bg-primary-container", "bg-primary", "bg-primary", "bg-primary"],
                        ["bg-primary/20", "bg-primary-container", "bg-primary", "bg-primary", "bg-primary-container", "bg-primary", "bg-primary"],
                        ["bg-primary", "bg-primary", "bg-primary", "bg-primary", "bg-primary", "bg-primary", "bg-primary"],
                        ["bg-primary-container", "bg-primary", "bg-primary", "bg-primary", "bg-primary/20", "bg-primary", "bg-primary"],
                        ["bg-primary", "bg-primary", "bg-primary", "bg-primary-container", "bg-primary", "bg-surface-container", "bg-surface-container"],
                      ].map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1.5">
                          {week.map((color, dIdx) => (
                            <div key={dIdx} className={`w-full h-4 rounded-sm ${color}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend & Encouragement Note */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pt-space-md mt-space-md border-t border-surface-container-high">
                  <div className="flex items-center gap-2 text-outline font-label-mono-sm text-[11px]">
                    <span>Ít</span>
                    <span className="w-3 h-3 rounded-sm bg-surface-container-high" />
                    <span className="w-3 h-3 rounded-sm bg-primary/20" />
                    <span className="w-3 h-3 rounded-sm bg-primary-container" />
                    <span className="w-3 h-3 rounded-sm bg-primary" />
                    <span>Nhiều (3 bữa/ngày)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary font-medium flex items-center gap-1.5">
                    <Icon name="favorite" className="text-[18px]" />
                    Tự hào vì sức khỏe cả gia đình!
                  </p>
                </div>
              </div>

              {/* Right Column: Nutrition & Regional Palette Insights (5 cols) */}
              <div className="lg:col-span-5 bg-surface-container-lowest p-space-md md:p-space-lg rounded-3xl shadow-[0_16px_32px_-12px_rgba(28,25,23,0.05)] flex flex-col justify-between gap-space-md">
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                    Cơ cấu dinh dưỡng &amp; Khẩu vị
                  </h3>
                  <p className="font-body-sm text-body-sm text-outline">
                    Tỉ lệ phân bổ các món khoái khẩu trong tháng
                  </p>
                </div>

                {/* SVG Donut Chart & Category Breakdown */}
                <div className="flex items-center gap-space-md">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container-high"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="35, 100"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="28, 100"
                        strokeDashoffset="-35"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-tertiary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="22, 100"
                        strokeDashoffset="-63"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-primary-fixed-dim"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="15, 100"
                        strokeDashoffset="-85"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-label-mono-lg text-label-mono-lg font-bold text-on-surface">35%</span>
                      <span className="font-label-mono-sm text-[10px] text-outline">Món kho</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-space-sm flex-1 font-body-sm text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-on-surface">Món kho (35%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-on-surface">Canh (28%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                      <span className="text-on-surface">Rau &amp; Gỏi (22%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim" />
                      <span className="text-on-surface">Cuốn/Bánh (15%)</span>
                    </div>
                  </div>
                </div>

                {/* Regional Distribution Bar */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <div className="flex items-center justify-between text-body-sm font-medium text-on-surface">
                    <span>Dấu ấn 3 miền:</span>
                    <span className="font-label-mono-sm text-outline text-[12px]">
                      Nam 65% • Trung 20% • Bắc 15%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-container">
                    <div className="h-full bg-primary" style={{ width: "65%" }} />
                    <div className="h-full bg-tertiary" style={{ width: "20%" }} />
                    <div className="h-full bg-primary-fixed-dim" style={{ width: "15%" }} />
                  </div>
                </div>

                {/* Nutrient Average Strip */}
                <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-space-sm rounded-2xl text-center">
                  <div className="flex flex-col">
                    <span className="font-label-mono-sm text-[11px] text-outline">Năng lượng tb</span>
                    <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">480 kcal</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-mono-sm text-[11px] text-outline">Chất đạm tb</span>
                    <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">32 g</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-mono-sm text-[11px] text-outline">Chất xơ tb</span>
                    <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary">6 g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cooking Milestones & Badges System */}
            <div className="w-full bg-surface-container-lowest p-space-md md:p-space-lg rounded-3xl shadow-[0_16px_32px_-12px_rgba(28,25,23,0.05)] flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                      Dấu ấn &amp; Huy hiệu ẩm thực
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-bold">
                      Cấp độ 6
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline mt-0.5">
                    Cấp bậc hiện tại: <span className="text-on-surface font-medium">Đầu bếp truyền lửa</span> (Tích lũy từ lượt chia sẻ công thức và chuỗi ngày nấu cơm nhà)
                  </p>
                </div>

                {/* XP Progress Bar */}
                <div className="flex flex-col gap-1.5 w-full md:w-72">
                  <div className="flex items-center justify-between font-label-mono-sm text-[12px]">
                    <span className="text-on-surface font-medium">2.450 / 3.000 XP</span>
                    <span className="text-primary font-semibold">Còn 550 XP lên Cấp 7</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "81.6%" }} />
                  </div>
                </div>
              </div>

              {/* Badges Grid (5 Bespoke Badges) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-md pt-space-xs">
                {/* Badge 1: Vua Món Kho */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between gap-space-sm group hover:bg-surface-container transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                      <Icon name="local_fire_department" className="text-[26px]" />
                    </div>
                    <div className="flex text-primary">
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold leading-snug">Vua món kho</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Đã hoàn thành xuất sắc 50 món kho truyền thống chuẩn vị.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold self-start">
                    Đã mở khóa
                  </span>
                </div>

                {/* Badge 2: Gia Đình Sum Vầy */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between gap-space-sm group hover:bg-surface-container transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary shadow-sm">
                      <Icon name="groups" className="text-[26px]" />
                    </div>
                    <div className="flex text-primary">
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold leading-snug">
                      Gia đình sum vầy
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Nấu đủ 30 bữa tối liên tiếp ấm cúng tại gian bếp nhà.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold self-start">
                    Đã mở khóa
                  </span>
                </div>

                {/* Badge 3: Bậc Thầy Đi Chợ */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between gap-space-sm group hover:bg-surface-container transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container shadow-sm">
                      <Icon name="shopping_cart_checkout" className="text-[26px]" />
                    </div>
                    <div className="flex text-primary">
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                      <span className="text-outline/30">★</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold leading-snug">
                      Bậc thầy đi chợ
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Tiết kiệm 20% chi phí với Danh sách mua sắm thông minh.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold self-start">
                    Đã đạt cấp 2
                  </span>
                </div>

                {/* Badge 4: Tác Giả Truyền Cảm Hứng */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between gap-space-sm group hover:bg-surface-container transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                      <Icon name="flare" className="text-[26px]" />
                    </div>
                    <div className="flex text-primary">
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                      <Icon name="star" className="text-[16px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold leading-snug">
                      Truyền cảm hứng
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Có ít nhất 1 công thức đạt hơn 10.000 lượt lưu nấu thử.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold self-start">
                    Đã mở khóa
                  </span>
                </div>

                {/* Badge 5: Chinh Phục 3 Miền (In Progress) */}
                <div className="bg-surface-container-low/70 p-space-md rounded-2xl flex flex-col justify-between gap-space-sm relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-outline shadow-sm">
                      <Icon name="public" className="text-[26px]" />
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold">24 / 30</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold leading-snug">
                      Chinh phục 3 miền
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Nấu ít nhất 10 món đặc sản mỗi miền Bắc - Trung - Nam.
                    </p>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Cooking Log Section */}
            <div className="w-full bg-surface-container-lowest p-space-md md:p-space-lg rounded-3xl shadow-[0_16px_32px_-12px_rgba(28,25,23,0.05)] flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                    Món ăn &amp; Nhật ký nấu gần đây
                  </h3>
                  <p className="font-body-sm text-body-sm text-outline">
                    Ghi chép hành trình thực hiện mâm cơm tuần này của gia đình
                  </p>
                </div>
                <button
                  onClick={() => triggerToast("Đang mở nhật ký bếp đầy đủ...")}
                  className="flex items-center gap-1.5 text-primary hover:text-primary-container font-body-sm text-body-sm font-semibold transition-colors self-start sm:self-auto cursor-pointer"
                  type="button"
                >
                  <span>Xem toàn bộ nhật ký bếp</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>

              {/* Log Entries Stack */}
              <div className="flex flex-col gap-space-md">
                {/* Log 1: Hôm qua */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md flex-1">
                    <div
                      className="w-20 h-20 rounded-2xl bg-cover bg-center flex-shrink-0 shadow-sm"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNpBmaT3fwRFsx8D9G1aMe1lpAFprs33qgi_m2hTgH3aan6eJ0vStSu8PHIvVLywaSH58ctpO99b9colrIr-gbmgiSEXdo1uDtRbE5enUkQxQWiXesWIzpzg9aH0ebSMU_-t6mo78wikjb82LNIbMslOXaInJkgy7c2BMVydXsucVz-8_KVZjqWkNPST9fjxCGsxZIhlV-Ha2AAaglXM4FBVEETE8sI1HcX2wqNP_y')`,
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-mono-sm text-[11px] font-bold">
                          Hôm qua (Tối 20/05)
                        </span>
                        <span className="font-label-mono-sm text-[12px] text-outline">• 3 món • 55 phút nấu</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Mâm cơm Nam Bộ: Cá lóc kho tộ + Canh chua cá lóc + Rau muống xào tỏi
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                        “Đánh giá gia đình: 5/5 sao - Nước cá kho keo quánh rất ngon, chấm rau muống luộc rất vừa miệng.”
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm self-end lg:self-center">
                    <button
                      onClick={() => triggerToast("Đang tải ghi chú nấu ăn...")}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface transition-colors shadow-sm cursor-pointer"
                      type="button"
                    >
                      Xem ghi chú
                    </button>
                    <Link
                      href="/recipes/ca-loc-kho-to/cook"
                      className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm"
                    >
                      Nấu lại món này
                    </Link>
                  </div>
                </div>

                {/* Log 2: 18/05 */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md flex-1">
                    <div
                      className="w-20 h-20 rounded-2xl bg-cover bg-center flex-shrink-0 shadow-sm"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCvs9jiWEfo6mPaYInlEeRX5RVid4b10ICZGFX3AShED3DajvIPcXjyv2Y-yOCB6tvEGd0MkwwbUyNhNkWJdY7J3zXLXVV5CkMzMt0rbcMQZoQjhgWbH1e1_JcCgcn0DfKr6ChyyIj_ffTYhe5vXZkMGHopzzASQJRCznwaUGuct8DjBZoJ4QQCmuaRzoHmJIG2VSdunQcV2Zbicsrk3iVDdw2SUgisYtuOg_si2TV')`,
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-[11px] font-semibold">
                          18/05 (Trưa)
                        </span>
                        <span className="font-label-mono-sm text-[12px] text-outline">• Món đổi vị cuối tuần • 45 phút</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Bún chả nướng than hoa Hà Nội
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Chả viên ướp hành khô nướng thơm lừng, nước mắm dấm tỏi ớt chua ngọt vừa vặn. Cả nhà ăn sạch đĩa bún!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm self-end lg:self-center">
                    <button
                      onClick={() => triggerToast("Đang tải ghi chú nấu ăn...")}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface transition-colors shadow-sm cursor-pointer"
                      type="button"
                    >
                      Xem ghi chú
                    </button>
                    <button
                      onClick={() => triggerToast("Đã mở công cụ chia sẻ ảnh!")}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                      type="button"
                    >
                      Chia sẻ ảnh
                    </button>
                  </div>
                </div>

                {/* Log 3: 16/05 */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md flex-1">
                    <div
                      className="w-20 h-20 rounded-2xl bg-cover bg-center flex-shrink-0 shadow-sm"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYMhpl_hittNz7egjgJtwEgsGr5k8YyFbFWq64rRjes9uEk55FB6HwIhwxXwNc11jo5Df3pOl-04C-D4LRFvn-wi6Dr06LqCldMGbD9shVxMqmyWlWlwD_K2deX54ApEpOqNLiHipDQZBfUx361O22uewXXRmUC9TcWbtab7JklqwKFDQsrhr0eMs8asBFsEMu0iuGxhe00oE6MAYIu6pfkdk1lmIxShLn4-SYjfle')`,
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-[11px] font-semibold">
                          16/05 (Tối)
                        </span>
                        <span className="font-label-mono-sm text-[12px] text-outline">• Mâm cơm thanh mát ngày nắng • 40 phút</span>
                      </div>
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                        Canh cua đồng mồng tơi + Cà pháo muối chua + Thịt rang cháy cạnh
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Gạch cua đóng tảng béo ngậy, thịt ba chỉ rang giòn cạnh ăn kèm cà giòn tan. Món ăn cứu cánh cho ngày oi ả.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm self-end lg:self-center">
                    <button
                      onClick={() => triggerToast("Đang tải ghi chú nấu ăn...")}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface transition-colors shadow-sm cursor-pointer"
                      type="button"
                    >
                      Xem ghi chú
                    </button>
                    <button
                      onClick={() => triggerToast("Đã lưu công thức vào bộ sưu tập!")}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                      type="button"
                    >
                      Lưu công thức
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TOAST THÔNG BÁO */}
          <div
            className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${
              toastMessage ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-on-surface text-on-primary shadow-xl">
              <Icon name="check_circle" className="text-secondary-fixed text-[20px]" />
              <span className="font-body-sm text-body-sm">{toastMessage}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
