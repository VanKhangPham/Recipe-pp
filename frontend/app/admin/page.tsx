"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export default function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = React.useState<"7d" | "30d" | "90d">("7d");
  const [approvedItems, setApprovedItems] = React.useState<{ [key: string]: boolean }>({});
  const [rejectedItems, setRejectedItems] = React.useState<{ [key: string]: boolean }>({});

  const handleApprove = (id: string) => {
    setApprovedItems((prev) => ({ ...prev, [id]: true }));
  };

  const handleReject = (id: string) => {
    setRejectedItems((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg">
      {/* Header Bar / Page Title */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-primary-fixed text-on-primary-fixed font-semibold tracking-wide uppercase">
              Trung tâm chỉ huy
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Đồng bộ thời gian thực
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Bảng điều khiển tổng quan (Dashboard)
          </h1>
          <p className="font-body-md text-body-md text-tertiary max-w-3xl">
            Theo dõi chỉ số tăng trưởng người dùng, lưu lượng truy cập công thức và điều hành luồng kiểm duyệt nội dung thời gian thực.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Date Range Selector */}
          <div className="relative inline-flex items-center">
            <button
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container transition-all cursor-pointer"
              type="button"
            >
              <Icon name="calendar_today" size={18} className="text-tertiary" />
              <span className="font-medium">Hôm nay, 24/05/2024</span>
              <Icon name="expand_more" size={18} className="text-tertiary" />
            </button>
          </div>

          {/* Sync Button */}
          <button
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container transition-all cursor-pointer"
            type="button"
            onClick={() => alert("Dữ liệu đã được làm mới đồng bộ!")}
          >
            <Icon name="sync" size={18} className="text-tertiary transition-transform active:rotate-180" />
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
              Vừa cập nhật 30s trước
            </span>
          </button>

          {/* Primary Action: Export */}
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-title-md text-title-md shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            type="button"
            onClick={() => alert("Đang kết xuất báo cáo PDF/Excel...")}
          >
            <Icon name="download" size={18} />
            <span>Xuất báo cáo PDF/Excel</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards Row (4 key metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1: New Users */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-tertiary tracking-wider font-medium">
                Người dùng mới
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                <Icon name="person_add" size={18} />
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-sm">
              <span className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                12.840
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-medium">
                <Icon name="trending_up" size={14} />
                +18.4%
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-end justify-between border-t border-surface-container/60">
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm text-tertiary">Phân loại định danh</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                9.420 Khách • 3.420 Đã xác thực
              </span>
            </div>
            {/* Sparkline */}
            <svg className="w-20 h-7 text-secondary" fill="none" viewBox="0 0 80 28">
              <path
                d="M2 24 L14 18 L26 21 L38 12 L50 16 L62 8 L78 3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M2 24 L14 18 L26 21 L38 12 L50 16 L62 8 L78 3 L78 28 L2 28 Z"
                fill="currentColor"
                fillOpacity="0.1"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Active Recipes */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-tertiary tracking-wider font-medium">
                Công thức hoạt động
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                <Icon name="menu_book" size={18} />
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-sm">
              <span className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                4.520
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-medium">
                <Icon name="arrow_upward" size={14} />
                +86 món mới
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-end justify-between border-t border-surface-container/60">
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm text-tertiary">Tình trạng lưu trữ</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                4.150 Đã xuất bản • 370 Bản nháp
              </span>
            </div>
            <svg className="w-20 h-7 text-primary" fill="none" viewBox="0 0 80 28">
              <path
                d="M2 22 L14 20 L26 15 L38 17 L50 10 L62 12 L78 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M2 22 L14 20 L26 15 L38 17 L50 10 L62 12 L78 4 L78 28 L2 28 Z"
                fill="currentColor"
                fillOpacity="0.1"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Moderation Queue (High Priority!) */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden border border-primary/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed-dim/30 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-primary font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Chờ duyệt khẩn cấp
              </span>
              <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-primary-container text-on-primary-container font-medium">
                TB: 42 phút
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-sm">
              <span className="font-headline-lg text-headline-lg tracking-tight text-primary font-bold">
                14
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Cần xử lý trong ngày • 4 tài khoản mới
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container/60">
            <Link
              className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline"
              href="/admin/recipes?filter=pending"
            >
              <span>Vào hàng duyệt ngay</span>
              <Icon name="arrow_forward" size={16} />
            </Link>
            <span className="font-label-mono-sm text-label-mono-sm text-outline">
              Ưu tiên cao
            </span>
          </div>
        </div>

        {/* Card 4: Pageviews & Engagement */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-tertiary tracking-wider font-medium">
                Lượt xem &amp; Tương tác
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                <Icon name="visibility" size={18} />
              </div>
            </div>
            <div className="mt-space-sm flex items-baseline gap-space-sm">
              <span className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                248.600
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-medium">
                +24.2%
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-sm flex items-end justify-between border-t border-surface-container/60">
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm text-tertiary">Chuyển đổi thực đơn</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                84.200 lưu Kế hoạch &amp; Đi chợ
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <Icon name="shopping_cart_checkout" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Analytics Section (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* Left: Growth & Traffic Area Chart (8 cols) */}
        <div className="xl:col-span-8 p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Xu hướng tăng trưởng tài khoản &amp; Lượt xem công thức
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Dữ liệu phân tích đa tầng từ lượt xem trang, người dùng định danh và luồng kế hoạch bữa ăn.
                </p>
              </div>
              {/* Time filter tabs */}
              <div className="inline-flex p-1 rounded-xl bg-surface-container font-label-mono-sm text-label-mono-sm">
                <button
                  type="button"
                  onClick={() => setTimeFilter("7d")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timeFilter === "7d"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-tertiary hover:text-on-surface"
                  }`}
                >
                  7 ngày
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("30d")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timeFilter === "30d"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-tertiary hover:text-on-surface"
                  }`}
                >
                  30 ngày
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter("90d")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timeFilter === "90d"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-tertiary hover:text-on-surface"
                  }`}
                >
                  90 ngày
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-space-md mt-space-md pt-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  Lưu lượng khách truy cập (Guest)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  Người dùng đăng ký mới
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-fixed-dim" />
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  Lượt tạo kế hoạch ăn
                </span>
              </div>
            </div>
          </div>

          {/* Precision Vector Path Area Chart */}
          <div className="relative mt-space-lg w-full h-72">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">
              <defs>
                <linearGradient id="primaryAreaGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#cc4900" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#cc4900" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="secondaryAreaGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#006d30" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#006d30" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Reference Gridlines */}
              <line stroke="#eee7e3" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="20" y2="20" />
              <line stroke="#eee7e3" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="80" y2="80" />
              <line stroke="#eee7e3" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="140" y2="140" />
              <line stroke="#eee7e3" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" />
              {/* Secondary Line / Area: Plan Creates */}
              <path
                d="M0,190 C110,180 180,165 260,170 C340,175 420,130 500,140 C580,150 660,110 740,95 L800,90 L800,220 L0,220 Z"
                fill="url(#secondaryAreaGrad)"
              />
              <path
                d="M0,190 C110,180 180,165 260,170 C340,175 420,130 500,140 C580,150 660,110 740,95 L800,90"
                fill="none"
                stroke="#006d30"
                strokeWidth="2.5"
              />
              {/* Primary Area: Pageviews / Guest Traffic */}
              <path
                d="M0,140 C100,125 180,95 270,115 C360,135 440,70 520,80 C600,90 680,35 740,40 L800,32 L800,220 L0,220 Z"
                fill="url(#primaryAreaGrad)"
              />
              <path
                d="M0,140 C100,125 180,95 270,115 C360,135 440,70 520,80 C600,90 680,35 740,40 L800,32"
                fill="none"
                stroke="#cc4900"
                strokeWidth="3"
              />
              {/* Active Marker Dot on Peak Day (approx x=580) */}
              <line opacity="0.6" stroke="#cc4900" strokeDasharray="2 2" strokeWidth="1.5" x1="580" x2="580" y1="20" y2="220" />
              <circle cx="580" cy="85" fill="#ffffff" r="5" stroke="#cc4900" strokeWidth="3" />
              <circle cx="580" cy="145" fill="#ffffff" r="4" stroke="#006d30" strokeWidth="2.5" />
            </svg>
            {/* Tooltip overlay card placed over peak point */}
            <div className="absolute top-4 left-[64%] -translate-x-1/2 p-space-sm rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl pointer-events-none hidden md:block">
              <div className="font-label-mono-sm text-label-mono-sm text-tertiary-fixed-dim">Thứ Tư, 22/05/2024</div>
              <div className="mt-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-2 font-label-mono-sm text-label-mono-sm">
                  <span className="w-2 h-2 rounded-full bg-primary-fixed" />
                  <span className="font-medium text-white">18.240 lượt xem</span>
                </div>
                <div className="flex items-center gap-2 font-label-mono-sm text-label-mono-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                  <span className="font-medium text-secondary-fixed-dim">245 tài khoản mới</span>
                </div>
                <div className="flex items-center gap-2 font-label-mono-sm text-label-mono-sm">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-tertiary-fixed-dim">1.410 lưu kế hoạch</span>
                </div>
              </div>
            </div>
          </div>
          {/* X-Axis Labels */}
          <div className="flex items-center justify-between pt-space-sm text-tertiary font-label-mono-sm text-label-mono-sm border-t border-surface-container">
            <span>18/05 (T7)</span>
            <span>19/05 (CN)</span>
            <span>20/05 (T2)</span>
            <span>21/05 (T3)</span>
            <span className="text-primary font-bold">22/05 (T4 - Cao điểm)</span>
            <span>23/05 (T5)</span>
            <span>24/05 (Hôm nay)</span>
          </div>
        </div>

        {/* Right: Cuisine Distribution & Diets Donut (4 cols) */}
        <div className="xl:col-span-4 p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                Cơ cấu &amp; Phân bổ ẩm thực
              </h2>
              <Icon name="pie_chart" size={20} className="text-tertiary" />
            </div>
            <p className="font-body-sm text-body-sm text-tertiary mt-1">
              Tỷ lệ công thức theo 3 miền &amp; chế độ dinh dưỡng đặc biệt.
            </p>
            {/* Donut Visualization */}
            <div className="relative my-space-md flex items-center justify-center">
              <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
                {/* Circumference: ~377 (r=60) */}
                {/* Nam Bo 42% -> 158.3 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#cc4900"
                  strokeDasharray="158.3 377"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeWidth="22"
                />
                {/* Mien Bac 31% -> 116.8 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#8e7166"
                  strokeDasharray="116.8 377"
                  strokeDashoffset="-162"
                  strokeLinecap="round"
                  strokeWidth="22"
                />
                {/* Mien Trung 18% -> 67.8 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#006d30"
                  strokeDasharray="67.8 377"
                  strokeDashoffset="-283"
                  strokeLinecap="round"
                  strokeWidth="22"
                />
                {/* Chay & Eat Clean 9% -> 33.9 */}
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="60"
                  stroke="#ffb599"
                  strokeDasharray="33.9 377"
                  strokeDashoffset="-354"
                  strokeLinecap="round"
                  strokeWidth="22"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">4.520</span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase">Tổng món</span>
              </div>
            </div>
            {/* Legend & Percentages */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <span className="text-on-surface font-medium">Ẩm thực Nam Bộ</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  42% (1.898)
                </span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                  <span className="text-on-surface font-medium">Món ngon miền Bắc</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  31% (1.401)
                </span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="text-on-surface font-medium">Đặc sản miền Trung</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  18% (813)
                </span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim" />
                  <span className="text-on-surface font-medium">Chay &amp; Eat Clean</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  9% (408)
                </span>
              </div>
            </div>
          </div>
          {/* Highlight Banner */}
          <div className="mt-space-md p-space-sm rounded-xl bg-surface-container flex items-start gap-2.5 text-on-surface">
            <Icon name="tips_and_updates" size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="font-body-sm text-body-sm">
              <span className="font-semibold text-primary">Điểm tin tuần:</span> Món kho và canh thanh mát chiếm{" "}
              <span className="font-semibold">58%</span> nhu cầu tìm kiếm khi thời tiết bước vào cao điểm nắng hè.
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Operational Queue & Moderation Action Banner */}
      <section className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-md" id="urgent-queue">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
              <Icon name="assignment_late" size={20} />
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-2 font-semibold">
                Hàng chờ kiểm duyệt công thức cần xử lý khẩn cấp
                <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-error text-on-error font-semibold">
                  14 bài nộp
                </span>
              </h2>
              <p className="font-body-sm text-body-sm text-tertiary">
                Cam kết xử lý nhanh trong vòng 60 phút để đảm bảo trải nghiệm tác giả và chất lượng thư viện.
              </p>
            </div>
          </div>
          <Link
            className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline"
            href="/admin/recipes?filter=pending"
          >
            <span>Xem toàn bộ 14 bài</span>
            <Icon name="chevron_right" size={16} />
          </Link>
        </div>

        {/* Urgent Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          {/* Item 1: Fish Claypot (Trust Account) */}
          <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="px-2.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-semibold flex items-center gap-1">
                  <Icon name="verified" size={14} />
                  Duyệt nhanh (Uy tín)
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">14 phút trước</span>
              </div>
              <div className="flex gap-space-sm">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6fctWMX57QDkPj2Zvz-yu9PiVzdzEz2-dQuezNZtAcWWmU303d1rfc3svLv-UNi55EauoCcPX5Uee4jevEVvw4iU4_SHM3ZEEiXUeVWWLRDULiLT5Fqa_I1UsG3R4v4z3SfQoEKrmTF9nrhDvK4iDJGcQ5FS5i3oFmxaA9D2kyGXd4KvotfjKVgb0YJB7-FSXdfzWLpdANzWzBMkcNWf9ggfSuhsGHYHAVNbgf1uj"
                    alt="Cá bống kho tiêu gừng sắn dây"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold line-clamp-1">
                    Cá bống kho tiêu gừng sắn dây
                  </h3>
                  <p className="font-body-sm text-body-sm text-tertiary mt-0.5">
                    Tác giả: <span className="font-medium text-on-surface">Bếp Mẹ Ba</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                      Đầu bếp tinh hoa
                    </span>
                    <span className="text-tertiary text-[10px]">•</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                      28 công thức đã duyệt
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Món cá bống đầm nước lợ làm sạch ướp nước màu đường dừa, tiêu đen Phú Quốc giã dập và gừng bánh tẻ già...
              </p>
            </div>
            <div className="mt-space-md pt-space-sm border-t border-surface-variant/40 flex items-center gap-space-sm">
              <Link
                href="/admin/recipes/item-1"
                className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-highest transition-colors text-center"
              >
                Xem chi tiết
              </Link>
              {approvedItems["item-1"] ? (
                <span className="flex-1 py-1.5 px-3 rounded-lg bg-secondary text-on-secondary font-body-sm text-body-sm font-medium text-center flex items-center justify-center gap-1">
                  <Icon name="done_all" size={16} />
                  Đã phê duyệt
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApprove("item-1")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:opacity-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Icon name="check" size={16} />
                  Phê duyệt ngay
                </button>
              )}
            </div>
          </div>

          {/* Item 2: Bun Cha (New Account - Verification Required) */}
          <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="px-2.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-primary-fixed text-on-primary-fixed font-semibold flex items-center gap-1">
                  <Icon name="policy" size={14} />
                  Cần thẩm định ảnh
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">28 phút trước</span>
              </div>
              <div className="flex gap-space-sm">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZG5ea177uuHYh9y7NWQQ0L8p_xVTaXSC-EmgjTuCeq8S213LAjA1sLbo_w7QsGyA8aamWl6oxgt0A5INyHyjdvk1z7w38aKwQ15j2yFmxqgJppzazDNw1oTmtwh-5VPej5mwOREaciawZlkIu0gEw5cot7FGm8QXtqcvkQ-hFunAZEgDb0OmWrW3hosZtYIwjW7ALtf2jHudgji98gMQj8UPDtUOuiOxp44YeiHHM"
                    alt="Bún chả nướng than hoa gia truyền"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold line-clamp-1">
                    Bún chả nướng than hoa gia truyền
                  </h3>
                  <p className="font-body-sm text-body-sm text-tertiary mt-0.5">
                    Tác giả: <span className="font-medium text-on-surface">Lê Hoàng Hải</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Tài khoản mới</span>
                    <span className="text-tertiary text-[10px]">•</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-secondary">Đã xác thực email</span>
                  </div>
                </div>
              </div>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Công thức chả viên và chả miếng kẹp que tre nướng than củi theo chuẩn phố cổ Hà Nội, ướp mật mía và hành tăm...
              </p>
            </div>
            <div className="mt-space-md pt-space-sm border-t border-surface-variant/40 flex items-center gap-space-sm">
              <Link
                href="/admin/recipes/item-2"
                className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-highest transition-colors text-center"
              >
                Xem &amp; Thẩm định
              </Link>
              {rejectedItems["item-2"] ? (
                <span className="py-1.5 px-3 rounded-lg bg-error text-on-error font-body-sm text-body-sm font-medium text-center">
                  Đã từ chối
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleReject("item-2")}
                  className="py-1.5 px-3 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm font-medium hover:opacity-90 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Icon name="close" size={16} />
                  Từ chối
                </button>
              )}
            </div>
          </div>

          {/* Item 3: Lotus Seed Sweet Soup (New Account) */}
          <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="px-2.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-tertiary font-medium flex items-center gap-1">
                  <Icon name="hourglass_top" size={14} />
                  Chờ duyệt lần đầu
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">41 phút trước</span>
              </div>
              <div className="flex gap-space-sm">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6C5DwbmZmV0W-5JDVOdY2Dmjur0xO6K26FhJ16m7Tt9sb7uvAQXgbSfazIZfHDlNtjWQ9vI4Hf61uIBUows79izB7jnPPbnZHtIiG33u22sZ0595KNuhwTfoV5oRPwVyhefJyiW4zf8W-jJ8tfRoLvSX9VizAtvYDfhMWK3HGFvOqKiziCKWjKgfk7sSvCngaVc2ldJdR4nRWd3S1HHEiEOyzLjOQIMnOPGUlwDSD"
                    alt="Chè hạt sen long nhãn trân châu"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold line-clamp-1">
                    Chè hạt sen long nhãn trân châu
                  </h3>
                  <p className="font-body-sm text-body-sm text-tertiary mt-0.5">
                    Tác giả: <span className="font-medium text-on-surface">Minh Trang</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Tài khoản mới</span>
                    <span className="text-tertiary text-[10px]">•</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-primary">Bài nộp đầu tiên</span>
                  </div>
                </div>
              </div>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Hạt sen Huế ninh mềm đường phèn thanh khiết bọc trong cùi nhãn lồng Hưng Yên dày cùi, thơm thoang thoảng hoa bưởi...
              </p>
            </div>
            <div className="mt-space-md pt-space-sm border-t border-surface-variant/40 flex items-center gap-space-sm">
              <Link
                href="/admin/recipes/item-3"
                className="w-full py-1.5 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-highest transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <Icon name="visibility" size={16} />
                Kiểm tra nội dung &amp; dinh dưỡng
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Lower Modules (6 cols + 6 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* Left: Top Trending Recipes (6 cols) */}
        <div className="xl:col-span-6 p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
              <div>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Bảng xếp hạng công thức thịnh hành
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Các món ăn được quan tâm và lưu kế hoạch tuần nhiều nhất 7 ngày qua.
                </p>
              </div>
              <button
                className="p-1 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
                aria-label="Lọc xếp hạng"
              >
                <Icon name="filter_list" size={20} />
              </button>
            </div>
            {/* Table Container */}
            <div className="mt-space-md overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase tracking-wider border-b border-surface-container">
                    <th className="pb-2.5 font-medium">Hạng</th>
                    <th className="pb-2.5 font-medium">Món ăn &amp; Tác giả</th>
                    <th className="pb-2.5 font-medium text-right">Lượt xem</th>
                    <th className="pb-2.5 font-medium text-center">Đánh giá</th>
                    <th className="pb-2.5 font-medium text-right">Lưu tuần</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm divide-y divide-surface-container">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-label-mono-sm text-label-mono-sm font-bold text-primary">#1</td>
                    <td className="py-3">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-semibold text-on-surface truncate">Canh chua cá lóc miền Tây</span>
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary truncate">
                          Bếp Mẹ Ba • 45 phút
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                      18.420
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-0.5 font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                        <Icon name="star" size={14} />
                        4.9
                      </span>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                      42.1%
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-label-mono-sm text-label-mono-sm font-bold text-primary">#2</td>
                    <td className="py-3">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-semibold text-on-surface truncate">Thịt kho hột vịt nước dừa</span>
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary truncate">
                          Bếp Mẹ Ba • 60 phút
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                      15.280
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-0.5 font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                        <Icon name="star" size={14} />
                        4.9
                      </span>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                      38.5%
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-label-mono-sm text-label-mono-sm font-bold text-on-surface-variant">#3</td>
                    <td className="py-3">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-semibold text-on-surface truncate">
                          Bún chả quạt Hà Nội nước mắm ấm
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary truncate">
                          Bếp Cô Lan • 50 phút
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                      13.910
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-0.5 font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                        <Icon name="star" size={14} />
                        4.8
                      </span>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                      31.0%
                    </td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 font-label-mono-sm text-label-mono-sm font-bold text-on-surface-variant">#4</td>
                    <td className="py-3">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-semibold text-on-surface truncate">
                          Gỏi cuốn tôm thịt tương đậu phộng
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary truncate">
                          Bếp Chú Năm • 30 phút
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                      11.450
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-0.5 font-label-mono-sm text-label-mono-sm text-primary font-semibold">
                        <Icon name="star" size={14} />
                        4.8
                      </span>
                    </td>
                    <td className="py-3 text-right font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                      26.4%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-space-sm border-t border-surface-container flex items-center justify-between mt-space-md">
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
              Hiển thị 4 trên 50 món dẫn đầu
            </span>
            <Link className="font-body-sm text-body-sm text-primary font-medium hover:underline" href="/admin/recipes">
              Xem danh sách xếp hạng đầy đủ
            </Link>
          </div>
        </div>

        {/* Right: Real-time Audit Log & Alerts (6 cols) */}
        <div className="xl:col-span-6 p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
              <div>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Nhật ký hoạt động &amp; Cảnh báo hệ thống
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Luồng giám sát tự động các sự kiện vận hành và an ninh thời gian thực.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container font-label-mono-sm text-label-mono-sm text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Trực tiếp
              </span>
            </div>

            {/* Event Feed */}
            <div className="mt-space-md space-y-space-sm">
              {/* Event 1: Spam Report */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="report" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm font-semibold text-error">
                      Báo cáo bình luận vi phạm
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">2 phút trước</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Người dùng <span className="font-medium text-on-surface">@thuhaxinh</span> vừa báo cáo bình luận quảng cáo spam trên bài viết #1042.
                  </p>
                </div>
                <Link
                  href="/admin/reports"
                  className="shrink-0 px-2 py-1 rounded-md bg-surface-container text-on-surface font-label-mono-sm text-label-mono-sm font-medium hover:bg-surface-variant transition-colors"
                >
                  Xử lý
                </Link>
              </div>

              {/* Event 2: Approval */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="verified_user" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Phê duyệt hàng loạt
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">15 phút trước</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Quản trị viên <span className="font-medium text-on-surface">Trần Nam</span> vừa phê duyệt xuất bản 5 công thức mới thuộc danh mục &ldquo;Món chay thanh tịnh&rdquo;.
                  </p>
                </div>
              </div>

              {/* Event 3: Email Campaign */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="mail" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Bản tin gợi ý mâm cơm
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">32 phút trước</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Hệ thống tự động gửi 1.250 email nhắc mâm cơm cuối tuần cho nhóm thành viên đăng ký nhận tin.
                  </p>
                </div>
              </div>

              {/* Event 4: Postgres Backup */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="database" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Sao lưu CSDL định kỳ
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">1 giờ trước</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Hoàn tất sao lưu cơ sở dữ liệu PostgreSQL định kỳ (Dung lượng 4.2 GB, Trạng thái: An toàn &amp; Mã hóa).
                  </p>
                </div>
              </div>

              {/* Event 5: Guest Migration */}
              <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="sync_alt" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Chuyển đổi tài khoản Khách
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">2 giờ trước</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    142 người dùng Guest thực hiện chuyển đổi thành công sang tài khoản chính thức qua luồng &ldquo;Gộp dữ liệu&rdquo;.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-space-sm border-t border-surface-container flex items-center justify-between mt-space-md">
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
              Lưu trữ nhật ký hệ thống: 90 ngày
            </span>
            <Link className="font-body-sm text-body-sm text-primary font-medium hover:underline" href="/admin/settings">
              Mở toàn bộ Audit Log
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom System Health & Anti-Spam Status Widget */}
      <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <Icon name="health_and_safety" size={22} />
          </div>
          <div>
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Chỉ số vận hành hạ tầng &amp; An ninh nội dung
            </h3>
            <p className="font-body-sm text-body-sm text-tertiary">
              Hệ thống bảo vệ đa lớp kết hợp xác thực đám mây Cloudflare và bộ lọc từ khóa nhạy cảm.
            </p>
          </div>
        </div>
        {/* Operational Chips */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="px-3.5 py-1.5 rounded-xl bg-surface-container flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-tertiary">Xác thực email:</span>
            <span className="font-label-mono-sm text-label-mono-sm text-secondary font-bold">94.2%</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-surface-container flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-tertiary">Phản hồi vi phạm:</span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-bold">&lt; 15 phút</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-surface-container flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-tertiary">Chống Spam Turnstile:</span>
            <span className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-secondary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Bật 100%
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-surface-container flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-tertiary">API .NET 10:</span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-bold">Uptime 99.98%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
