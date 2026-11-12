"use client";

import * as React from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";

/* ─── Mobile recipe data (from Stitch Screen 7 mobile) ─── */
const mobileRecipes = [
  {
    id: "bo-luc-lac",
    title: "Bò lúc lắc khoai tây vàng giòn",
    difficulty: "Dễ",
    difficultyType: "secondary" as const,
    time: "25p",
    rating: "4.8",
    kcal: "420 kcal",
    favorited: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN4xblL39Zl2Y83hgIYklBLDeKHnBKH4y43I90EGGRTmBO7dob-MK0INOoBifXZru9wdPMhpX3HeUjM0ccjqJwfNT8vnlDAKxx-jNHcKNNhX5r5mb9b0jv4hnzftQ81SXEbdi2FtT_d7Wzr0WxnDkDl7_wGsFFCq9kyaKhn8W7OaN0CGAHJaLfBRq83ZQ6qmkxe_waYlLfOVfTVNVo2d_sojtq71MJXArVlpv7e3L7",
    imageAlt:
      "Cận cảnh món bò lúc lắc xào cháy cạnh mềm mọng với ớt chuông xanh đỏ, hành tây vàng ươm và khoai tây chiên giòn rụm trên đĩa sứ mộc.",
  },
  {
    id: "canh-dua-chua",
    title: "Canh dưa chua bắp bò thanh mát",
    difficulty: "Dễ",
    difficultyType: "secondary" as const,
    time: "30p",
    rating: "4.7",
    kcal: "285 kcal",
    favorited: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSBR2O5jVLEw-F2oeX1VP9M1Po4nwtkbaWYE5ydj6-oe32djEZk8yiPf-_x7Zx73hQ1gwJT4Z96ZjQ5ZVDx87aDkqprFOPUTTVsWvGqhadUtcPKukn_EKgcJAWE57qS8kxJ3msnU4O_roWnjzJkLo6q4qjDPaVUegiVkj1q4DZgWXw1rmfUb9feKgvpaFn1F6MfWR_M39yuC6ne-vkr5cRmEI9tVVFOtXPsstemSYH",
    imageAlt:
      "Tô canh gân bò nấu dưa chua bốc khói nghi ngút, cà chua chín đỏ mọng, lát ớt tươi điểm xuyết trên nền bàn gỗ thông mộc mạc.",
  },
  {
    id: "bo-sot-vang-m",
    title: "Bò sốt vang quế hồi ăn kèm bánh mì",
    difficulty: "Vừa",
    difficultyType: "primary" as const,
    time: "45p",
    rating: "4.9",
    kcal: "510 kcal",
    favorited: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHQDlcKLVcILd-3oJ3uLppKH-EmkXpI3E1qwaRQI53EtcViNqYPBHAuxmIpY79NV4yLFs00SceR5OZIBOV_wXvO_iKPjor6lvjr9kO6sTgUSm3ca1Gpx_eudD9LTbLx1Eb00qDDTTh8NaQLQ_YomERdztXYXZm6xtrD9vYR_yCDnrdjLsVyT6sWLVChu5FqNlrIuQNmaDYupzaPRO8d2oRmhTgmJmRs_cnhTdbLwxm",
    imageAlt:
      "Món bò sốt vang sánh mịn màu nâu cánh gián đậm đà bày trong âu gốm sứ thủ công kèm vài ổ bánh mì giòn tan bên cạnh.",
  },
  {
    id: "goi-bap-bo",
    title: "Gỏi bắp bò bóp thấu chua ngọt",
    difficulty: "Dễ",
    difficultyType: "secondary" as const,
    time: "20p",
    rating: "4.6",
    kcal: "210 kcal",
    favorited: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpEtwosWutGwRrKgV4qORLyxMpebsbFgtuKgluzn5DUb6gifYX28f27KKIXMlD3YvaeW6pTvD1RWUE6GiEx9zgXbOFpKMUDqzdz-b9jw6VmX280Ji5PHA-UKlc2lCPx2FS4Ek8aVmvtCl5moSW4j8AfBi1wUFwM5HXj0Em9MHxuXWuVQYVsgx2iJvTCTpJ1KTbQU_ZpEmE9Z0cnGagfSVTTEFH9XblYnW3j1WuywNe",
    imageAlt:
      "Đĩa gỏi bắp bò bóp thấu bắp chuối, hành tây, ngò gai rắc đậu phộng rang vàng ruộm và mè rang thơm ngát.",
  },
];

export function RecipesBrowseMobile() {
  const [searchQuery, setSearchQuery] = React.useState("món bò");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [showFilter, setShowFilter] = React.useState(true);
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({
    "bo-luc-lac": true,
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-surface">
      {/* ── Mobile Header ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(43,30,22,0.04)] pt-safe">
        <div className="h-16 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
              <Icon name="skillet" size={24} />
            </div>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              RecipeHub
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Tìm kiếm"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <Icon name="search" size={22} />
            </button>
            <button
              aria-label="Thông báo"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-primary relative transition-colors"
            >
              <Icon name="notifications" size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface">
        <div className="flex flex-col w-full relative">
          {/* ─ Top Search & Quick Control Bar ─ */}
          <section className="px-5 pt-2 pb-1 flex flex-col gap-2">
            {/* Active Search Bar */}
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
                <Icon name="search" size={20} />
              </div>
              <input
                className="w-full h-11 pl-10 pr-10 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface shadow-sm focus:outline-none focus:bg-surface-container-lowest"
                placeholder="Tìm kiếm công thức, nguyên liệu..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  aria-label="Xóa từ khóa"
                  className="absolute right-3 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center active:scale-95 transition-transform"
                  type="button"
                  onClick={() => setSearchQuery("")}
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>

            {/* Results Count & Action Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  42
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  công thức phù hợp
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Filter Trigger Button */}
                <button
                  className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium shadow-sm active:scale-95 transition-all"
                  type="button"
                  onClick={() => setShowFilter(true)}
                >
                  <Icon name="tune" size={18} />
                  <span>Bộ lọc (3)</span>
                </button>
                {/* View Mode Toggle (Grid/List) */}
                <div className="flex items-center bg-surface-container rounded-xl p-0.5">
                  <button
                    aria-label="Dạng lưới"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      viewMode === "grid"
                        ? "bg-surface-container-lowest text-primary shadow-xs"
                        : "text-on-surface-variant"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Icon name="grid_view" size={18} />
                  </button>
                  <button
                    aria-label="Dạng danh sách"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      viewMode === "list"
                        ? "bg-surface-container-lowest text-primary shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <Icon name="view_agenda" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ─ Horizontal Scrollable Active Filter Chips ─ */}
          <section className="w-full overflow-x-auto no-scrollbar py-2 px-5">
            <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
              {/* Chip 1: Vùng miền */}
              <div className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-xs">
                <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  Vùng:
                </span>
                <span className="font-medium">Miền Bắc</span>
                <button
                  aria-label="Xóa bộ lọc Miền Bắc"
                  className="w-4 h-4 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                  type="button"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
              {/* Chip 2: Thời gian */}
              <div className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-xs">
                <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  Thời gian:
                </span>
                <span className="font-medium">≤ 30 phút</span>
                <button
                  aria-label="Xóa bộ lọc Dưới 30 phút"
                  className="w-4 h-4 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                  type="button"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
              {/* Chip 3: Độ khó */}
              <div className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-xs">
                <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  Mức độ:
                </span>
                <span className="font-medium">Dễ</span>
                <button
                  aria-label="Xóa bộ lọc độ khó Dễ"
                  className="w-4 h-4 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                  type="button"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
              {/* Clear All Button */}
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-primary hover:bg-primary-fixed/20 font-body-sm text-body-sm font-medium transition-colors"
                type="button"
              >
                <span>Xóa tất cả</span>
              </button>
            </div>
          </section>

          {/* ─ Recipe Grid (2 Columns) ─ */}
          <section className="px-5 pt-1 pb-6">
            <div
              className={`grid ${
                viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"
              } gap-3 w-full`}
            >
              {mobileRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="flex flex-col bg-surface-container-lowest rounded-2xl p-2.5 shadow-sm relative group overflow-hidden"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
                    <Image
                      src={recipe.image}
                      alt={recipe.imageAlt}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Favorite Pin */}
                    <button
                      aria-label={
                        favorites[recipe.id] ? "Đã lưu món ăn" : "Lưu món ăn"
                      }
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition-transform ${
                        favorites[recipe.id]
                          ? "text-primary"
                          : "text-on-surface-variant"
                      }`}
                      type="button"
                      onClick={() => toggleFavorite(recipe.id)}
                    >
                      <Icon
                        name="favorite"
                        filled={!!favorites[recipe.id]}
                        size={18}
                      />
                    </button>
                    {/* Badge Duration */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-surface-dim/80 backdrop-blur-md text-on-surface font-label-mono-sm text-label-mono-sm flex items-center gap-1">
                      <Icon name="schedule" size={13} />
                      <span>{recipe.time}</span>
                    </div>
                  </div>
                  <div className="pt-2.5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm font-medium ${
                            recipe.difficultyType === "secondary"
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-primary-fixed text-on-primary-fixed-variant"
                          }`}
                        >
                          {recipe.difficulty}
                        </span>
                        <div className="flex items-center gap-0.5 text-primary">
                          <Icon name="star" filled size={14} />
                          <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">
                            {recipe.rating}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-title-md text-body-md font-semibold text-on-surface line-clamp-2 leading-tight">
                        {recipe.title}
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 flex items-center gap-1">
                      <Icon name="local_fire_department" size={14} />
                      <span>{recipe.kcal}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination / Load More CTA */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                className="w-full py-3.5 px-4 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-md text-body-md font-semibold shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                type="button"
              >
                <span>Xem thêm 38 công thức khác</span>
                <Icon name="expand_more" size={18} />
              </button>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Đang hiển thị 4 trên tổng số 42 món
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* ── Filter Bottom Sheet Drawer ── */}
      {showFilter && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end transition-opacity duration-300">
          {/* Semi-transparent Scrim */}
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setShowFilter(false)}
          />
          {/* Sheet Content Container */}
          <div className="relative w-full max-h-[751px] bg-surface-container-lowest rounded-t-3xl shadow-xl flex flex-col overflow-hidden pb-safe">
            {/* Drag Handle Pill */}
            <div className="w-full pt-3 pb-1 flex justify-center cursor-grab">
              <div className="w-12 h-1.5 rounded-full bg-outline-variant/60" />
            </div>
            {/* Drawer Header */}
            <div className="px-5 py-2 flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                Bộ lọc công thức
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="text-primary font-body-sm text-body-sm font-medium px-2 py-1 hover:underline"
                  type="button"
                >
                  Đặt lại
                </button>
                <button
                  aria-label="Đóng bộ lọc"
                  className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center active:scale-90 transition-transform"
                  type="button"
                  onClick={() => setShowFilter(false)}
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Options */}
            <div className="px-5 py-2 overflow-y-auto space-y-4 max-h-[512px]">
              {/* Nhóm Vùng miền */}
              <div className="flex flex-col gap-2">
                <label className="font-title-md text-body-md font-semibold text-on-surface">
                  Vùng miền ẩm thực
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className="py-2.5 px-3 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium shadow-xs flex items-center justify-center gap-1.5"
                    type="button"
                  >
                    <Icon name="check" size={16} />
                    <span>Miền Bắc</span>
                  </button>
                  <button
                    className="py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container transition-colors flex items-center justify-center"
                    type="button"
                  >
                    Miền Trung
                  </button>
                  <button
                    className="py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container transition-colors flex items-center justify-center"
                    type="button"
                  >
                    Miền Nam
                  </button>
                </div>
              </div>

              {/* Nhóm Thời gian nấu */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-title-md text-body-md font-semibold text-on-surface">
                    Thời gian nấu tối đa
                  </label>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-fixed">
                    ≤ 30 phút
                  </span>
                </div>
                {/* Custom Slider Rail */}
                <div className="relative py-2 flex items-center">
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-2/5" />
                  </div>
                  {/* Slider Thumb */}
                  <div className="absolute left-[40%] -translate-x-1/2 w-6 h-6 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center border-2 border-primary cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  <span>10 phút</span>
                  <span>30 phút</span>
                  <span>60+ phút</span>
                </div>
              </div>

              {/* Nhóm Chế độ ăn & Phong cách */}
              <div className="flex flex-col gap-2">
                <label className="font-title-md text-body-md font-semibold text-on-surface">
                  Chế độ ăn phù hợp
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3.5 py-2 rounded-full bg-secondary-container text-on-secondary-container font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-xs"
                    type="button"
                  >
                    <Icon name="eco" size={16} />
                    <span>Thanh đạm</span>
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-full bg-secondary-container text-on-secondary-container font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-xs"
                    type="button"
                  >
                    <Icon name="water_drop" size={16} />
                    <span>Ít dầu mỡ</span>
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-medium transition-colors"
                    type="button"
                  >
                    Món chay
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-medium transition-colors"
                    type="button"
                  >
                    Keto / Low-carb
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-medium transition-colors"
                    type="button"
                  >
                    Giàu Protein
                  </button>
                </div>
              </div>

              {/* Nhóm Dịp & Bữa ăn */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="font-title-md text-body-md font-semibold text-on-surface">
                  Bữa ăn
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low">
                    <input
                      defaultChecked
                      className="w-4 h-4 rounded text-primary accent-primary"
                      id="m-meal-dinner"
                      type="checkbox"
                    />
                    <label
                      className="font-body-sm text-body-sm text-on-surface font-medium cursor-pointer"
                      htmlFor="m-meal-dinner"
                    >
                      Cơm tối gia đình
                    </label>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low">
                    <input
                      className="w-4 h-4 rounded text-primary accent-primary"
                      id="m-meal-lunch"
                      type="checkbox"
                    />
                    <label
                      className="font-body-sm text-body-sm text-on-surface font-medium cursor-pointer"
                      htmlFor="m-meal-lunch"
                    >
                      Bữa trưa nhanh
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="p-5 bg-surface-container-lowest shadow-[0_-4px_16px_rgba(43,30,22,0.06)] flex items-center gap-3">
              <button
                className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-body-md text-body-md font-semibold shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                type="button"
                onClick={() => setShowFilter(false)}
              >
                <span>Áp dụng 42 kết quả</span>
                <Icon name="arrow_forward" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
