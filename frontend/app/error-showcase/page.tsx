"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ErrorShowcasePage() {
  const [activeCode, setActiveCode] = React.useState<"404" | "403" | "500">("404");
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Interactive Error State Switcher / Subnav Bar */}
      <div className="w-full bg-surface-container-low shadow-[0_12px_28px_-10px_rgba(30,27,25,0.04)] px-gutter py-space-md z-30 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <Icon name="troubleshoot" size={20} />
            </div>
            <div>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider block">
                Môi trường thử nghiệm &amp; Thiết kế hệ thống
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Bộ Trang Trạng Thái Lỗi (HTTP Error Canvas)
              </span>
            </div>
          </div>

          {/* Segmented Control Switcher */}
          <div className="inline-flex p-1.5 bg-surface-container rounded-2xl shadow-inner gap-1" id="errorTabNav">
            <button
              type="button"
              onClick={() => setActiveCode("404")}
              className={`px-space-md py-2 rounded-xl font-label-mono-sm text-label-mono-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeCode === "404"
                  ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeCode === "404" ? "bg-primary animate-pulse" : "bg-primary"}`} />
              <span>HTTP 404 • Không tìm thấy</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCode("403")}
              className={`px-space-md py-2 rounded-xl font-label-mono-sm text-label-mono-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeCode === "403"
                  ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span>HTTP 403 • Bị từ chối</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCode("500")}
              className={`px-space-md py-2 rounded-xl font-label-mono-sm text-label-mono-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeCode === "500"
                  ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-error" />
              <span>HTTP 500 • Sự cố máy chủ</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN ERROR VIEW CONTAINER */}
      <div className="w-full px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          {/* SECTION 1: ERROR 404 */}
          {activeCode === "404" && (
            <section className="flex flex-col gap-space-xl transition-all duration-300">
              {/* Hero Asymmetric Module */}
              <div className="w-full bg-surface-container-lowest rounded-3xl p-space-xl md:p-12 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] relative overflow-hidden border border-outline-variant/30">
                <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
                  {/* Left 7 Cols */}
                  <div className="lg:col-span-7 flex flex-col gap-space-md">
                    <div className="flex flex-wrap items-center gap-space-sm">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                        <Icon name="search_off" size={15} />
                        MÃ LỖI HTTP 404 • KHÔNG TÌM THẤY TRANG
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                        #MISSING_ROUTE_OR_RECIPE
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight">
                        Món này hình như <span className="text-primary underline decoration-primary/30 decoration-wavy">chưa lên mâm</span> hoặc đã đổi thực đơn!
                      </h1>
                      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                        Rất tiếc, liên kết bạn vừa bấm không tồn tại, món ăn đã được tác giả gỡ xuống, hoặc đường dẫn đã thay đổi trong đợt cập nhật gia vị ẩm thực mới.
                      </p>
                    </div>

                    {/* Quick Search Tool */}
                    <div className="bg-surface-container-low p-2 rounded-2xl flex flex-col sm:flex-row items-stretch gap-2 max-w-xl mt-space-sm shadow-sm border border-outline-variant/20">
                      <div className="flex items-center gap-2 px-space-md py-2 flex-1 text-on-surface">
                        <Icon name="soup_kitchen" size={22} className="text-primary" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Thử gõ: Phở bò Hà Nội, Canh chua, Bò kho..."
                          className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline"
                        />
                      </div>
                      <Link
                        href={`/recipes?q=${encodeURIComponent(searchQuery || "Phở")}`}
                        className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>Tìm món thay thế</span>
                        <Icon name="arrow_forward" size={18} />
                      </Link>
                    </div>

                    {/* Navigation Escape Paths */}
                    <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                      <Link
                        href="/"
                        className="px-space-lg py-2.5 rounded-xl bg-on-surface text-surface font-body-md text-body-md font-medium hover:bg-inverse-surface transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Icon name="home" size={18} />
                        <span>Quay về Trang chủ</span>
                      </Link>
                      <Link
                        href="/recipes"
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5"
                      >
                        <Icon name="local_dining" size={18} className="text-primary" />
                        <span>Xem kho công thức nổi bật</span>
                      </Link>
                      <Link
                        href="/shopping-list"
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5"
                      >
                        <Icon name="checklist" size={18} className="text-secondary" />
                        <span>Kiểm tra danh sách đã lưu</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right 5 Cols: Visual Culinary Metaphor */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md aspect-square rounded-3xl bg-surface-container-low p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden group border border-outline-variant/20">
                      <svg className="w-full h-full text-outline-variant max-w-[320px] drop-shadow-md" viewBox="0 0 400 400">
                        <circle cx="200" cy="200" fill="#f4ece8" r="165" stroke="#e2bfb2" strokeDasharray="4 6" strokeWidth="3" />
                        <circle cx="200" cy="200" fill="#ffffff" r="130" stroke="#e2bfb2" strokeWidth="1.5" />
                        <circle cx="200" cy="200" fill="#fff8f5" r="120" />
                        <path d="M120,200 A80,80 0 0,1 280,200" fill="none" stroke="#ffdbce" strokeLinecap="round" strokeWidth="4" />
                        <g className="transform transition-transform duration-700 group-hover:scale-105">
                          <rect fill="#ffffff" height="155" rx="10" stroke="#e2bfb2" strokeWidth="1.5" transform="rotate(-9 200 200)" width="130" x="135" y="125" />
                          <rect fill="#ffdad6" height="20" rx="4" transform="rotate(-9 200 200)" width="90" x="155" y="150" />
                          <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold" transform="rotate(-9 200 200)" x="165" y="164">
                            404 TRỐNG ĐĨA
                          </text>
                          <line stroke="#cec5bf" strokeLinecap="round" strokeWidth="2" transform="rotate(-9 200 200)" x1="155" x2="235" y1="185" y2="185" />
                          <line stroke="#cec5bf" strokeLinecap="round" strokeWidth="2" transform="rotate(-9 200 200)" x1="155" x2="220" y1="200" y2="200" />
                          <line stroke="#cec5bf" strokeLinecap="round" strokeWidth="2" transform="rotate(-9 200 200)" x1="155" x2="240" y1="215" y2="215" />
                          <line stroke="#cec5bf" strokeLinecap="round" strokeWidth="2" transform="rotate(-9 200 200)" x1="155" x2="195" y1="230" y2="230" />
                        </g>
                        <path d="M 90,160 C 85,140 105,130 115,145 C 120,165 95,175 90,160 Z" fill="#006d30" opacity="0.85" />
                        <path d="M 295,230 C 310,215 320,230 315,245 C 305,260 285,245 295,230 Z" fill="#006d30" opacity="0.85" />
                        <path d="M 125,270 C 135,260 145,265 140,275 C 135,285 120,280 125,270 Z" fill="#a33900" />
                        <circle cx="275" cy="140" fill="#a33900" r="4" />
                        <circle cx="265" cy="155" fill="#a33900" r="3" />
                      </svg>
                      <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/80 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <Icon name="dinner_dining" size={16} className="text-primary" />
                        <span>Đĩa sạch trơn • Chờ thực đơn mới cập bến</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retention Layer: "Có thể bạn đang tìm những món ngon này?" */}
              <div className="flex flex-col gap-space-md">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase font-semibold tracking-wider">
                      Gợi ý phục hồi thực đơn
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Có thể bạn đang tìm những món ngon nổi bật này?
                    </h2>
                  </div>
                  <Link
                    href="/recipes"
                    className="hidden sm:inline-flex items-center gap-1 text-primary hover:text-primary-container font-body-md text-body-md font-medium transition-colors"
                  >
                    <span>Xem toàn bộ 1.250+ công thức</span>
                    <Icon name="chevron_right" size={18} />
                  </Link>
                </div>

                {/* 3 Recommended Recipe Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Card 1: Phở Bò Tái Lăn */}
                  <Link
                    href="/recipes/1"
                    className="bg-surface-container-lowest rounded-3xl p-space-sm shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] hover:-translate-y-1 transition-all flex flex-col gap-space-sm group border border-outline-variant/30"
                  >
                    <div className="w-full h-52 rounded-2xl overflow-hidden relative bg-surface-container">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf2pzGfxGkkq94jCsRNV5GZSLy__vRbmZp5a1LwRNRVDm1Ez3L_2Fekt3WkR-1_NCASFxWN0-Dxalu0l794KogZnOtTYbjdvpBTDwYf4UruX5t3EBDGKy5aSfpHnQEvoXqcVjYFjF1qBTR8ZI5OqNHawjNOXMr4DmAWFFmxy22yVAc9dQZxj8q2GtratTCiLBQbTgDIMv1X8cqgmRYgW-weDy5LKT7JjVuPbk9FKAB"
                        alt="Tô phở bò tái lăn Hà Nội"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-mono-sm text-label-mono-sm text-primary font-semibold shadow-sm">
                        Món Quốc Hồn
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1">
                        <Icon name="star" size={14} /> 4.9 (428)
                      </span>
                    </div>
                    <div className="p-space-xs flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors font-semibold">
                          Phở Bò Tái Lăn Hà Nội Chuẩn Vị
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                          Nước dùng ninh xương bò 12 tiếng cùng quế hồi thảo quả thơm nồng, thịt bò thăn xào lửa lớn ngọt mềm.
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-transparent text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" size={16} /> 60 phút
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">Trung bình</span>
                        <span className="flex items-center gap-1">
                          <Icon name="local_fire_department" size={16} className="text-primary" /> 580 kcal
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Card 2: Bún Chả Nướng Than Hoa */}
                  <Link
                    href="/recipes/2"
                    className="bg-surface-container-lowest rounded-3xl p-space-sm shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] hover:-translate-y-1 transition-all flex flex-col gap-space-sm group border border-outline-variant/30"
                  >
                    <div className="w-full h-52 rounded-2xl overflow-hidden relative bg-surface-container">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1oyabECgNKKet25slTqBRymk68BAMwNdvDdA752RUI817mmtxrw13b-Sqdk_gOkj02BMEvRJinO8EkuzA4ouvf5sWvnVLrIbVPh24BFCa8xu948_pLTT5mLt817bmO-NHWoIeIpXx13nagAAxiuiMCTDu7lRJCJCSykM-3La2THdOrpKIrSJ2r8bqejc9RHieFBzBFbvQ0kAO_svuhOjg983r6Nw9PBFakrBiu2Gv"
                        alt="Đĩa bún chả Hà Nội nướng than hoa"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-mono-sm text-label-mono-sm text-primary font-semibold shadow-sm">
                        Đặc Sản Thủ Đô
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1">
                        <Icon name="star" size={14} /> 4.8 (312)
                      </span>
                    </div>
                    <div className="p-space-xs flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors font-semibold">
                          Bún Chả Nướng Than Hoa Phố Cổ
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                          Chả băm cuộn lá xương sông và chả miếng ba chỉ ướp sốt caramen đậm đà, nướng than hồng thơm nức mũi.
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-transparent text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" size={16} /> 45 phút
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">Dễ làm</span>
                        <span className="flex items-center gap-1">
                          <Icon name="local_fire_department" size={16} className="text-primary" /> 620 kcal
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Card 3: Canh Chua Cá Lóc Đồng */}
                  <Link
                    href="/recipes/3"
                    className="bg-surface-container-lowest rounded-3xl p-space-sm shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] hover:-translate-y-1 transition-all flex flex-col gap-space-sm group border border-outline-variant/30"
                  >
                    <div className="w-full h-52 rounded-2xl overflow-hidden relative bg-surface-container">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA06_dTW0YOzAot4ucZgwaPIz3GJXmiOrIaoKjutcVcMU835I105KfW8JBpSUteY3tkzQIrFY5K8JftPT3SHNDJCmO-XV8HHy8o11yitgOKjmLvYenq6cglJpBiQnqOVvlGXgX_1qqI9LqchkjfiRymUmS76IJQrFPRzD99R5irTVbDkWf-Cock9p1ahiO1BK3jEiL4ixpendNm6-DDlEGnDcJUs0hwJIsFf1zaEyia"
                        alt="Nồi canh chua cá lóc đồng"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-mono-sm text-label-mono-sm text-primary font-semibold shadow-sm">
                        Vị Miền Tây
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1">
                        <Icon name="star" size={14} /> 4.9 (510)
                      </span>
                    </div>
                    <div className="p-space-xs flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors font-semibold">
                          Canh Chua Cá Lóc Đồng Miền Tây
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                          Vị chua dịu của me dốt, giòn thanh bạc hà cùng thớ thịt cá lóc đồng săn chắc chấm nước mắm ớt cay xé lưỡi.
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-transparent text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" size={16} /> 35 phút
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">Dễ làm</span>
                        <span className="flex items-center gap-1">
                          <Icon name="local_fire_department" size={16} className="text-primary" /> 340 kcal
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: ERROR 403 */}
          {activeCode === "403" && (
            <section className="flex flex-col gap-space-xl transition-all duration-300">
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
                      <h2 className="font-display-hero text-display-hero text-on-surface tracking-tight">
                        Khu vực <span className="text-tertiary underline decoration-tertiary/30">bếp kín</span> — Dành riêng cho Bếp trưởng &amp; Quản trị!
                      </h2>
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

                  {/* Right 5 Cols: Visual Metaphor - Locked Spice Cabinet */}
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
            </section>
          )}

          {/* SECTION 3: ERROR 500 */}
          {activeCode === "500" && (
            <section className="flex flex-col gap-space-xl transition-all duration-300">
              <div className="w-full bg-surface-container-lowest rounded-3xl p-space-xl md:p-12 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] relative overflow-hidden border border-outline-variant/30">
                <div className="absolute -right-24 -top-24 w-96 h-96 bg-error-container/50 rounded-full blur-3xl pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
                  {/* Left 7 Cols */}
                  <div className="lg:col-span-7 flex flex-col gap-space-md">
                    <div className="flex flex-wrap items-center gap-space-sm">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">
                        <Icon name="mode_heat" size={15} />
                        MÃ LỖI HTTP 500 • LỖI HỆ THỐNG MÁY CHỦ
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-error font-mono">
                        ID: #ERR_RECIPE_50291
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h2 className="font-display-hero text-display-hero text-on-surface tracking-tight">
                        Bếp lửa đang <span className="text-error underline decoration-error/30">quá nhiệt!</span> Đội kỹ sư đang khẩn trương nêm nếm lại.
                      </h2>
                      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                        Hệ thống xử lý tính toán calo và điều phối công thức đang gặp trục trặc kỹ thuật tạm thời. Đừng lo lắng, dữ liệu thực đơn và nguyên liệu đã lưu của bạn vẫn tuyệt đối an toàn trên máy khách.
                      </p>
                    </div>

                    {/* Diagnostic Telemetry Card */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2 max-w-xl font-label-mono-sm text-label-mono-sm border border-outline-variant/20">
                      <div className="flex items-center justify-between text-on-surface">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                          Trạng thái cụm máy chủ: <strong className="text-error font-semibold">Tải bất thường (Database Peak 99.4%)</strong>
                        </span>
                        <span className="text-secondary font-semibold">Uptime 99.98%</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div className="bg-error h-full rounded-full w-5/6" />
                      </div>
                      <div className="flex items-center justify-between text-tertiary pt-1">
                        <span>Vùng dữ liệu: ap-southeast-1 (TP. Hồ Chí Minh)</span>
                        <span>Thời gian tự phục hồi ước tính: ~2 phút</span>
                      </div>
                    </div>

                    {/* Action buttons for 500 */}
                    <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Icon name="replay" size={18} />
                        <span>Tải lại trang ngay (F5)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert("Hệ thống kiểm tra: Cụm máy chủ đang khởi động lại.")}
                        className="px-space-md py-3 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Icon name="vital_signs" size={18} />
                        <span>Kiểm tra trạng thái hệ thống</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert("Đã gửi báo cáo lỗi kỹ thuật #ERR_RECIPE_50291 tới ban quản trị.")}
                        className="px-space-md py-3 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Icon name="bug_report" size={18} />
                        <span>Báo cáo sự cố cho ban quản trị</span>
                      </button>
                    </div>
                  </div>

                  {/* Right 5 Cols: Visual Metaphor - Simmering Pot Overheat */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md aspect-square rounded-3xl bg-surface-container-low p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden border border-outline-variant/20">
                      <svg className="w-full h-full text-error max-w-[320px] drop-shadow-md" viewBox="0 0 400 400">
                        <ellipse cx="200" cy="310" fill="#e9e1dd" rx="120" ry="20" />
                        <path d="M 140,310 Q 155,270 170,310 Q 185,260 200,310 Q 215,260 230,310 Q 245,275 260,310 Z" fill="#cc4900" opacity="0.9" />
                        <path d="M 160,310 Q 180,280 200,310 Q 220,280 240,310 Z" fill="#ffb599" />
                        <rect fill="#33302d" height="130" rx="16" width="180" x="110" y="160" />
                        <path d="M 85,190 C 85,175 110,175 110,190" fill="none" stroke="#615b56" strokeLinecap="round" strokeWidth="8" />
                        <path d="M 315,190 C 315,175 290,175 290,190" fill="none" stroke="#615b56" strokeLinecap="round" strokeWidth="8" />
                        <ellipse cx="200" cy="160" fill="#cc4900" rx="90" ry="16" />
                        <path d="M 130,165 Q 120,200 135,210 Q 145,190 145,165" fill="#a33900" />
                        <path d="M 240,165 Q 260,210 245,230 Q 230,200 235,165" fill="#a33900" />
                        <line stroke="#cec5bf" strokeLinecap="round" strokeWidth="6" x1="220" x2="280" y1="170" y2="80" />
                        <ellipse cx="220" cy="170" fill="none" rx="14" ry="24" stroke="#cec5bf" strokeWidth="3" transform="rotate(-35 220 170)" />
                        <path d="M 160,130 Q 150,90 170,70" fill="none" stroke="#a8a29e" strokeDasharray="4 6" strokeLinecap="round" strokeWidth="4" />
                        <path d="M 200,120 Q 215,80 195,50" fill="none" stroke="#a8a29e" strokeDasharray="4 6" strokeLinecap="round" strokeWidth="4" />
                        <rect fill="#ba1a1a" height="26" rx="6" width="110" x="145" y="240" />
                        <text fill="#ffffff" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold" x="156" y="258">
                          QUÁ TẢI 100°C
                        </text>
                      </svg>
                      <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <Icon name="heat" size={16} className="text-error" />
                        <span>Nồi súp đang trào • Kỹ sư đang giảm lửa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Preparedness Info Card */}
              <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <Icon name="offline_pin" size={26} />
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                      Chế độ nấu ăn ngoại tuyến (Offline Cook Mode)
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Kế hoạch tuần và danh sách nguyên liệu đi chợ đã lưu trong bộ nhớ máy của bạn vẫn sẵn sàng truy cập bình thường.
                    </p>
                  </div>
                </div>
                <Link
                  href="/shopping-list"
                  className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md shrink-0"
                >
                  Mở Danh Sách Ngoại Tuyến
                </Link>
              </div>
            </section>
          )}

          {/* Bottom System Reference Specification Guide */}
          <div className="w-full bg-surface-container-low rounded-2xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
              <Icon name="auto_stories" size={18} className="text-primary" />
              <span>
                Tiêu chuẩn UX RecipeHub: Đảm bảo khách truy cập không gặp ngõ cụt (Zero Dead-Ends), luôn có lối thoát về Trang chủ hoặc Món đề xuất.
              </span>
            </div>
            <div className="flex items-center gap-space-md font-label-mono-sm text-label-mono-sm text-tertiary">
              <span>Hệ quy chiếu: Warm Culinary Modernism</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <span>Phiên bản: v2.4-stable</span>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
