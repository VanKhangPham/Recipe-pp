"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
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

        {/* Retention Layer */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Card 1 */}
            <Link
              href="/recipes/1"
              className="bg-surface-container-lowest rounded-3xl p-space-sm shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] hover:-translate-y-1 transition-all flex flex-col gap-space-sm group border border-outline-variant/30"
            >
              <div className="w-full h-52 rounded-2xl overflow-hidden relative bg-surface-container">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf2pzGfxGkkq94jCsRNV5GZSLy__vRbmZp5a1LwRNRVDm1Ez3L_2Fekt3WkR-1_NCASFxWN0-Dxalu0l794KogZnOtTYbjdvpBTDwYf4UruX5t3EBDGKy5aSfpHnQEvoXqcVjYFjF1qBTR8ZI5OqNHawjNOXMr4DmAWFFmxy22yVAc9dQZxj8q2GtratTCiLBQbTgDIMv1X8cqgmRYgW-weDy5LKT7JjVuPbk9FKAB"
                  alt="Tô phở bò tái lăn"
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

            {/* Card 2 */}
            <Link
              href="/recipes/2"
              className="bg-surface-container-lowest rounded-3xl p-space-sm shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] hover:-translate-y-1 transition-all flex flex-col gap-space-sm group border border-outline-variant/30"
            >
              <div className="w-full h-52 rounded-2xl overflow-hidden relative bg-surface-container">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1oyabECgNKKet25slTqBRymk68BAMwNdvDdA752RUI817mmtxrw13b-Sqdk_gOkj02BMEvRJinO8EkuzA4ouvf5sWvnVLrIbVPh24BFCa8xu948_pLTT5mLt817bmO-NHWoIeIpXx13nagAAxiuiMCTDu7lRJCJCSykM-3La2THdOrpKIrSJ2r8bqejc9RHieFBzBFbvQ0kAO_svuhOjg983r6Nw9PBFakrBiu2Gv"
                  alt="Đĩa bún chả"
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

            {/* Card 3 */}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
