"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { RecipesBrowseMobile } from "@/components/mobile/recipes-browse-mobile";
import { useRecipes, RecipeDataStatus } from "@/lib/context/recipes-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { Recipe } from "@/lib/types";

function RecipesPageInner() {

  const searchParams = useSearchParams();
  const { recipes } = useRecipes();
  const { isFavorited, toggleFavorite } = useFavorites();

  // Search & Filter State
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialRegion = searchParams.get("region") || "";

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [selectedRegion, setSelectedRegion] = React.useState<string>(initialRegion);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string[]>(["Dễ làm", "Trung bình"]);
  const [selectedDiet, setSelectedDiet] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState("popular");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = React.useState(9);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const nextState = toggleFavorite(recipe.id, recipe);
    if (nextState) {
      showToast(`Đã chọn yêu thích "${recipe.title}".`);
    } else {
      showToast(`Đã chọn bỏ yêu thích "${recipe.title}".`);
    }
  };

  const activeFilters = [
    selectedRegion ? { label: "Ẩm thực", value: selectedRegion, clear: () => setSelectedRegion("") } : null,
    selectedCategory ? { label: "Danh mục", value: selectedCategory, clear: () => setSelectedCategory("") } : null,
    selectedTime ? { label: "Thời gian", value: selectedTime, clear: () => setSelectedTime("") } : null,
    selectedDiet ? { label: "Chế độ ăn", value: selectedDiet, clear: () => setSelectedDiet("") } : null,
    searchQuery ? { label: "Từ khóa", value: searchQuery, clear: () => setSearchQuery("") } : null,
  ].filter(Boolean) as { label: string; value: string; clear: () => void }[];

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedRegion("");
    setSelectedTime("");
    setSelectedDifficulty(["Dễ làm", "Trung bình", "Cầu kỳ"]);
    setSelectedDiet("");
    showToast("Đã xóa tất cả bộ lọc");
  };

  // Filter & Sort Logic
  const filteredRecipes = React.useMemo(() => {
    return recipes.filter((r) => {
      // 1. Keyword search (title, description, ingredients, tags, author)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchAuthor = r.author.name.toLowerCase().includes(q);
        const matchTags = r.tags?.some((t) => t.toLowerCase().includes(q));
        const matchIngredients = r.ingredients?.some((i) => i.name.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchAuthor && !matchTags && !matchIngredients) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory && r.category !== selectedCategory) {
        return false;
      }

      // 3. Region filter
      if (selectedRegion && !r.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }

      // 4. Time filter
      if (selectedTime === "< 15 phút" && r.cookTimeMinutes > 15) return false;
      if (selectedTime === "15 - 30 phút" && (r.cookTimeMinutes < 15 || r.cookTimeMinutes > 30)) return false;
      if (selectedTime === "Dưới 30 phút" && r.cookTimeMinutes > 30) return false;
      if (selectedTime === "30 - 60 phút" && (r.cookTimeMinutes < 30 || r.cookTimeMinutes > 60)) return false;
      if (selectedTime === "> 60 phút" && r.cookTimeMinutes <= 60) return false;

      // 5. Difficulty filter
      if (selectedDifficulty.length > 0 && !selectedDifficulty.includes(r.difficulty)) {
        return false;
      }

      // 6. Diet filter
      if (selectedDiet && !r.dietTags?.includes(selectedDiet as Recipe["dietTags"][number])) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.bookmarksCount - a.bookmarksCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "quickest") return a.cookTimeMinutes - b.cookTimeMinutes;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0;
    });
  }, [recipes, searchQuery, selectedCategory, selectedRegion, selectedTime, selectedDifficulty, selectedDiet, sortBy]);

  const displayedRecipes = filteredRecipes.slice(0, visibleCount);

  return (
    <>
      <RecipeDataStatus />
      {/* ═══════ MOBILE LAYOUT ═══════ */}
      <div className="md:hidden">
        <RecipesBrowseMobile />
      </div>

      {/* ═══════ DESKTOP LAYOUT ═══════ */}
      <div className="hidden md:flex w-full min-h-[100dvh] flex-col bg-background text-on-surface">
        <Navbar />

        {/* Dynamic Notification Toast Container */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
            <Icon name="bookmark_added" size={20} className="text-secondary-fixed" />
            <span className="font-body-md text-body-md">{toastMsg}</span>
          </div>
        )}

        <main className="w-full flex-1 bg-background">
          <div className="w-full px-gutter py-space-lg flex flex-col gap-space-lg">
            {/* Breadcrumb & Page Overview Header */}
            <section className="flex flex-col gap-space-sm">
              <nav aria-label="Đường dẫn trang" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Icon name="home" size={16} />
                  <span>Trang chủ</span>
                </Link>
                <span className="text-tertiary-fixed-dim select-none">/</span>
                <span className="text-on-surface font-medium">Khám phá công thức</span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-space-xs">
                <div className="flex flex-col gap-1 max-w-3xl">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Khám phá <span className="text-primary font-headline-lg text-headline-lg">{filteredRecipes.length}+</span> công thức chuẩn vị gia đình
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Kho lưu trữ mở các bữa cơm ấm cúng, tinh hoa ẩm thực ba miền và thực đơn dưỡng sinh được đúc kết từ hàng nghìn gian bếp Việt yêu nghề.
                  </p>
                </div>

                {/* Live Pantry Suggestion Quick CTA Button */}
                <Link
                  href="/ingredient-search"
                  className="inline-flex items-center gap-2 self-start lg:self-auto px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors text-body-md font-medium shadow-sm"
                >
                  <Icon name="kitchen" size={20} className="text-secondary" />
                  <span>Tìm món theo tủ lạnh</span>
                  <Icon name="arrow_forward" size={16} className="text-tertiary" />
                </Link>
              </div>
            </section>

            {/* Main In-Page Search & Filter Toolbar Deck */}
            <section className="flex flex-col gap-space-md p-space-md md:p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Integrated Search Bar with icon & clear button */}
                <div className="relative flex-1 flex items-center">
                  <Icon name="search" size={22} className="text-outline absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo nguyên liệu, tên món, đầu bếp (vd: sườn non, nấm rơm, bún bò)..."
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Xóa từ khóa"
                      className="absolute right-3 p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <Icon name="close" size={18} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Đang lọc ${filteredRecipes.length} công thức phù hợp`)}
                  className="inline-flex items-center justify-center gap-2 px-space-lg py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-md text-body-md font-medium shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Icon name="tune" size={20} />
                  <span>Lọc kết quả ({filteredRecipes.length})</span>
                </button>
              </div>

              {/* Active Filters Tag Strip */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container-high/60">
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase tracking-wider mr-1">
                    Bộ lọc đang áp dụng:
                  </span>
                  {activeFilters.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-body-sm text-body-sm group hover:bg-surface-variant transition-colors"
                    >
                      <span className="text-tertiary">{f.label}:</span>
                      <strong className="font-medium text-on-surface">{f.value}</strong>
                      <button
                        type="button"
                        onClick={f.clear}
                        aria-label={`Xóa bộ lọc ${f.label}`}
                        className="p-0.5 rounded-full text-outline hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="font-body-sm text-body-sm text-primary hover:text-primary-container font-semibold ml-2 underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all cursor-pointer"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}
            </section>

            {/* Results Count Bar & Layout/Sort Controls */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md py-1">
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-on-surface">
                  Tìm thấy <span className="text-primary font-bold">{filteredRecipes.length}</span> công thức phù hợp
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                  Hiển thị {Math.min(displayedRecipes.length, filteredRecipes.length)} / {filteredRecipes.length}
                </span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Sort Control Dropdown */}
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                    <Icon name="swap_vert" size={16} />
                    Sắp xếp:
                  </span>
                  <select
                    aria-label="Sắp xếp danh sách công thức"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-body-sm text-body-sm font-semibold text-on-surface focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="newest">Mới cập nhật</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="quickest">Nhanh nhất (Thời gian)</option>
                  </select>
                </div>

                {/* Layout Mode Toggle */}
                <div aria-label="Chế độ hiển thị danh sách" className="flex items-center bg-surface-container p-1 rounded-xl shadow-inner" role="group">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Hiển thị dạng lưới"
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-surface-container-lowest text-primary shadow-sm"
                        : "text-tertiary hover:text-on-surface"
                    }`}
                  >
                    <Icon name="grid_view" size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="Hiển thị dạng dòng"
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === "list"
                        ? "bg-surface-container-lowest text-primary shadow-sm"
                        : "text-tertiary hover:text-on-surface"
                    }`}
                  >
                    <Icon name="view_list" size={20} />
                  </button>
                </div>
              </div>
            </section>

            {/* Main Content Workspace: Asymmetric Filter Sidebar + Recipe Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* ================= LEFT FILTER SIDEBAR ================= */}
              <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md p-space-md md:p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 bg-surface-container-lowest">
                  <div className="flex items-center gap-2">
                    <Icon name="filter_list" size={22} className="text-primary" />
                    <span className="font-title-md text-title-md text-on-surface font-bold">Lọc công thức</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="font-label-mono-sm text-label-mono-sm text-tertiary hover:text-primary transition-colors cursor-pointer"
                  >
                    Mặc định
                  </button>
                </div>

                {/* Filter Accordion 1: Danh mục món ăn */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex items-center justify-between text-on-surface font-title-md text-title-md cursor-pointer select-none">
                    <span className="font-semibold text-body-md text-body-md">Danh mục món ăn</span>
                    <Icon name="expand_less" size={20} className="text-tertiary" />
                  </div>
                  <div className="flex flex-col gap-2 pl-1 font-body-sm text-body-sm">
                    {[
                      { key: "kho-rim", label: "Món kho & rim" },
                      { key: "canh-sup", label: "Món canh & súp" },
                      { key: "xao", label: "Món xào & cuốn" },
                      { key: "nuong", label: "Món nướng" },
                      { key: "bun-pho", label: "Món nước & bún phở" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                        <span className="flex items-center gap-2.5 text-on-surface-variant group-hover:text-on-surface transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedCategory === item.key}
                            onChange={() => setSelectedCategory(selectedCategory === item.key ? "" : item.key)}
                            className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                          />
                          <span>{item.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-surface-container-high my-1" />

                {/* Filter Accordion 2: Vùng miền ẩm thực */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-on-surface cursor-pointer select-none">
                    <span className="font-semibold text-body-md text-body-md">Vùng miền ẩm thực</span>
                    <Icon name="expand_less" size={20} className="text-tertiary" />
                  </div>
                  <div className="flex flex-col gap-2 pl-1 font-body-sm text-body-sm">
                    {[
                      { key: "Bắc", label: "Bắc bộ" },
                      { key: "Trung", label: "Trung bộ" },
                      { key: "Nam", label: "Nam bộ" },
                      { key: "Miền Tây", label: "Miền Tây sông nước" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                        <span className="flex items-center gap-2.5 text-on-surface-variant group-hover:text-on-surface transition-colors">
                          <input
                            type="radio"
                            name="region-filter"
                            checked={selectedRegion === item.key}
                            onChange={() => setSelectedRegion(selectedRegion === item.key ? "" : item.key)}
                            onClick={() => {
                              if (selectedRegion === item.key) setSelectedRegion("");
                            }}
                            className="w-4 h-4 text-primary focus:ring-0 accent-primary cursor-pointer"
                          />
                          <span>{item.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-surface-container-high my-1" />

                {/* Filter Accordion 3: Thời gian nấu */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-on-surface cursor-pointer select-none">
                    <span className="font-semibold text-body-md text-body-md">Thời gian nấu</span>
                    <Icon name="expand_less" size={20} className="text-tertiary" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-body-sm text-body-sm">
                    {["< 15 phút", "15 - 30 phút", "30 - 60 phút", "> 60 phút"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(selectedTime === t ? "" : t)}
                        className={`px-2.5 py-1.5 rounded-lg text-center transition-colors cursor-pointer ${
                          selectedTime === t
                            ? "bg-primary text-on-primary font-medium shadow-sm"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-surface-container-high my-1" />

                {/* Filter Accordion 4: Độ khó */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-on-surface cursor-pointer select-none">
                    <span className="font-semibold text-body-md text-body-md">Độ khó</span>
                    <Icon name="expand_less" size={20} className="text-tertiary" />
                  </div>
                  <div className="flex flex-col gap-2 pl-1 font-body-sm text-body-sm">
                    {[
                      { key: "Dễ làm", label: "Dễ làm (Người mới)", color: "bg-secondary-fixed text-on-secondary-fixed" },
                      { key: "Trung bình", label: "Trung bình", color: "bg-surface-container-high text-on-surface" },
                      { key: "Cầu kỳ", label: "Cầu kỳ", color: "bg-error-container text-on-error-container" },
                    ].map((diff) => (
                      <label key={diff.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDifficulty.includes(diff.key)}
                          onChange={() => {
                            if (selectedDifficulty.includes(diff.key)) {
                              setSelectedDifficulty(selectedDifficulty.filter((d) => d !== diff.key));
                            } else {
                              setSelectedDifficulty([...selectedDifficulty, diff.key]);
                            }
                          }}
                          className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                        />
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${diff.color}`}>
                          {diff.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-surface-container-high my-1" />

                {/* Filter Accordion 5: Chế độ dinh dưỡng & Ăn kiêng */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-on-surface cursor-pointer select-none">
                    <span className="font-semibold text-body-md text-body-md">Chế độ dinh dưỡng</span>
                    <Icon name="expand_less" size={20} className="text-tertiary" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-body-sm text-body-sm">
                    {["Thuần chay", "Thanh đạm", "Eat Clean", "Giàu Protein", "Ít dầu mỡ"].map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setSelectedDiet(selectedDiet === diet ? "" : diet)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          selectedDiet === diet
                            ? "bg-secondary-fixed text-on-secondary-fixed font-bold shadow-xs"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Actions Stick at Bottom of Sidebar */}
                <div className="pt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => showToast(`Đã lọc ra ${filteredRecipes.length} công thức phù hợp`)}
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Icon name="check" size={18} />
                    <span>Áp dụng ({filteredRecipes.length} kết quả)</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="w-full py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-body-sm text-body-sm font-medium transition-all cursor-pointer"
                  >
                    Đặt lại tất cả bộ lọc
                  </button>
                </div>
              </aside>

              {/* ================= RECIPE CARD GRID ================= */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-lg">
                {displayedRecipes.length === 0 ? (
                  <div className="w-full py-16 px-4 rounded-3xl bg-surface-container-lowest flex flex-col items-center justify-center text-center gap-3 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
                      <Icon name="soup_kitchen" size={32} />
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      Không tìm thấy công thức phù hợp
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                      Thử tìm kiếm với từ khóa khác (ví dụ: &ldquo;bò&rdquo;, &ldquo;cá lóc&rdquo;, &ldquo;canh&rdquo;) hoặc xóa bớt các bộ lọc đang chọn.
                    </p>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md"
                        : "flex flex-col gap-space-md"
                    }
                  >
                    {displayedRecipes.map((recipe) => {
                      const favorited = isFavorited(recipe.id);
                      return (
                        <article
                          key={recipe.id}
                          className={`group flex ${
                            viewMode === "list" ? "flex-col sm:flex-row" : "flex-col"
                          } bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
                        >
                          <div className={`p-space-sm pb-0 sm:pb-space-sm relative ${viewMode === "list" ? "sm:w-64 shrink-0" : ""}`}>
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
                              <Image
                                src={recipe.image}
                                alt={recipe.imageAlt || recipe.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Favorite Heart Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleFavorite(recipe)}
                                aria-label="Lưu vào danh sách yêu thích"
                                className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer ${
                                  favorited ? "text-primary" : "text-outline hover:text-primary"
                                }`}
                              >
                                <Icon name="favorite" filled={favorited} size={20} />
                              </button>

                              {/* Time badge */}
                              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-inverse-surface/80 backdrop-blur-sm text-inverse-on-surface font-label-mono-sm text-label-mono-sm">
                                <Icon name="timer" size={14} className="text-secondary-fixed" />
                                <span>{recipe.totalTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm font-semibold ${
                                    recipe.difficultyBadgeColor === "error"
                                      ? "bg-error-container text-on-error-container"
                                      : recipe.difficultyBadgeColor === "secondary"
                                      ? "bg-secondary-fixed text-on-secondary-fixed"
                                      : "bg-surface-container-high text-on-surface"
                                  }`}
                                >
                                  {recipe.difficulty}
                                </span>
                                <div className="flex items-center gap-1 text-primary">
                                  <Icon name="star" filled size={16} />
                                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                                    {recipe.rating}
                                  </span>
                                  <span className="font-body-sm text-body-sm text-outline">
                                    ({recipe.reviewsCount})
                                  </span>
                                </div>
                              </div>

                              <Link
                                href={`/recipes/${recipe.id}`}
                                className="font-title-md text-title-md text-on-surface hover:text-primary transition-colors font-bold line-clamp-2"
                              >
                                {recipe.title}
                              </Link>
                              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                {recipe.description}
                              </p>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container-high/60">
                              <div className="flex items-center gap-1.5">
                                <Icon name="soup_kitchen" size={16} className="text-tertiary" />
                                <span className="truncate max-w-[120px]">{recipe.author.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-outline font-label-mono-sm text-label-mono-sm">
                                <Icon name="group" size={15} />
                                <span>{recipe.servings} phần</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                {/* Smart Pantry Inline Inset Banner */}
                <div className="w-full p-space-md sm:p-space-lg rounded-2xl bg-gradient-to-r from-surface-container to-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-sm">
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-sm">
                      <Icon name="shelves" size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        Tìm kiếm với những gì có sẵn trong tủ lạnh?
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Nhập 3 loại rau củ hoặc thịt bất kỳ, RecipeHub sẽ gợi ý thực đơn bữa tối ngay lập tức mà không cần đi siêu thị.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/ingredient-search"
                    className="shrink-0 px-space-lg py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant font-body-md text-body-md font-semibold transition-all shadow-sm"
                  >
                    Thử tính năng ngay
                  </Link>
                </div>

                {/* Modern Pagination Strip */}
                {filteredRecipes.length > visibleCount && (
                  <div className="w-full pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
                    <span className="font-body-sm text-body-sm text-on-surface-variant order-2 sm:order-1">
                      Hiển thị <strong className="font-semibold text-on-surface">1 - {Math.min(visibleCount, filteredRecipes.length)}</strong> trong tổng số{" "}
                      <strong className="font-semibold text-on-surface">{filteredRecipes.length}</strong> công thức
                    </span>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      className="px-6 py-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-md text-body-md font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Xem thêm {Math.min(9, filteredRecipes.length - visibleCount)} công thức khác</span>
                      <Icon name="expand_more" size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function RecipesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RecipesPageRoute />
    </React.Suspense>
  );
}

function RecipesPageRoute() {
  const searchParams = useSearchParams();
  return <RecipesPageInner key={searchParams.toString()} />;
}