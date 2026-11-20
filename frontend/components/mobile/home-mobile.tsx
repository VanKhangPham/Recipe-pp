"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Icon } from "@/components/ui/icon";
import { useRecipes, RecipeDataStatus } from "@/lib/context/recipes-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { useAuth } from "@/lib/context/auth-context";

const QUICK_SEARCH_CHIPS = [
  "Thịt kho trứng",
  "Canh chua",
  "Sườn xào chua ngọt",
  "Bún thịt xào",
  "Nấm kho tiêu",
];

const CATEGORY_META: Record<string, { icon: string; accent: string }> = {
  "kho-rim": { icon: "skillet", accent: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  "canh-sup": { icon: "soup_kitchen", accent: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  xao: { icon: "eco", accent: "bg-lime-500/15 text-lime-700 dark:text-lime-300" },
  "bun-pho": { icon: "ramen_dining", accent: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  nuong: { icon: "local_fire_department", accent: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  "trang-mieng": { icon: "cake", accent: "bg-pink-500/15 text-pink-700 dark:text-pink-300" },
};

export function HomeMobile() {
  const router = useRouter();
  const { recipes, isLoading, error } = useRecipes();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { user, isRestoringSession } = useAuth();
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "fast" | "easy">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = useMemo(() => {
    const groups = new Map<string, { name: string; count: number }>();
    for (const recipe of recipes) {
      const group = groups.get(recipe.category);
      groups.set(recipe.category, {
        name: recipe.categoryName,
        count: (group?.count ?? 0) + 1,
      });
    }
    return [...groups.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (selectedCategory !== "all" && recipe.category !== selectedCategory) return false;
      if (quickFilter === "fast" && recipe.prepTimeMinutes + recipe.cookTimeMinutes > 30) return false;
      if (quickFilter === "easy" && recipe.difficulty !== "Dễ làm") return false;
      return true;
    });
  }, [recipes, selectedCategory, quickFilter]);

  const featured = filteredRecipes.slice(0, visibleCount);
  const spotlightRecipe = recipes[0] ?? null;

  const handleSearch = (searchValue: string) => {
    const trimmed = searchValue.trim();
    if (!trimmed) {
      router.push("/recipes");
      return;
    }
    router.push("/recipes?q=" + encodeURIComponent(trimmed));
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Navbar />
      <RecipeDataStatus />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-gradient-to-br from-primary-fixed/45 via-surface-container-lowest to-secondary-fixed/25 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-5 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/90 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs border border-primary/15">
                <Icon name="auto_awesome" size={16} />
                <span>
                  {recipes.length > 0
                    ? `${recipes.length.toLocaleString("vi-VN")} công thức chuẩn vị · Đầy đủ ảnh thật`
                    : "Kho công thức ẩm thực Việt Nam & Quốc tế"}
                </span>
              </div>

              <div className="space-y-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl lg:text-5xl leading-tight">
                  Hôm nay nhà mình <span className="text-primary">nấu món gì ngon?</span>
                </h1>
                <p className="max-w-xl text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Khám phá hàng trăm món ăn Việt Nam quen thuộc cùng ẩm thực thế giới được Việt hóa chi tiết — kèm định lượng nguyên liệu, thời gian nấu và thực đơn tuần thông minh.
                </p>
              </div>

              {/* Hero Search Form */}
              <form
                className="flex flex-col sm:flex-row gap-2.5 pt-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearch(query);
                }}
              >
                <label className="relative flex-1">
                  <span className="sr-only">Tìm món ăn hoặc nguyên liệu</span>
                  <Icon
                    name="search"
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm món ăn (VD: thịt kho trứng, canh chua, bún bò...)"
                    className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest py-3.5 pl-11 pr-4 text-sm sm:text-base text-on-surface shadow-xs placeholder:text-on-surface-variant/75 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm sm:text-base font-semibold text-on-primary shadow-sm hover:opacity-95 transition-opacity cursor-pointer shrink-0"
                >
                  <Icon name="search" size={18} />
                  <span>Tìm kiếm</span>
                </button>
              </form>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-on-surface-variant mr-1">Gợi ý nhanh:</span>
                {QUICK_SEARCH_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSearch(chip)}
                    className="rounded-full bg-surface-container-lowest/85 hover:bg-primary-fixed hover:text-primary px-3 py-1 text-xs font-medium text-on-surface-variant border border-outline-variant/35 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Spotlight Dish */}
            <div className="lg:col-span-5">
              {spotlightRecipe ? (
                <Link
                  href={`/recipes/${spotlightRecipe.id}`}
                  className="group relative block overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={spotlightRecipe.image}
                      alt={spotlightRecipe.title}
                      fill
                      priority
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary shadow-sm">
                      <Icon name="star" filled size={14} />
                      <span>Món nổi bật hôm nay</span>
                    </span>
                    <div className="absolute inset-x-4 bottom-4 space-y-1.5 text-white">
                      <h2 className="text-xl font-bold leading-snug line-clamp-1 group-hover:text-primary-fixed transition-colors">
                        {spotlightRecipe.title}
                      </h2>
                      <p className="text-xs text-white/85 line-clamp-2">{spotlightRecipe.description}</p>
                      <div className="flex items-center justify-between pt-2 text-xs font-medium text-white/90">
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Icon name="schedule" size={15} />
                            {spotlightRecipe.totalTime}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="group" size={15} />
                            {spotlightRecipe.servings} người
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 font-semibold">
                          Xem cách nấu <Icon name="arrow_forward" size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-surface-container-high" />
              )}
            </div>
          </div>
        </section>

        {/* Quick Tools Strip */}
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/ingredient-search"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                <Icon name="kitchen" size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  Tìm món theo nguyên liệu có sẵn
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Nhập nguyên liệu trong tủ lạnh, RecipeHub gợi ý ngay món nấu phù hợp nhất.
                </p>
              </div>
            </div>
            <Icon name="arrow_forward" size={20} className="text-on-surface-variant group-hover:translate-x-1 group-hover:text-primary transition-all shrink-0" />
          </Link>

          <Link
            href="/meal-planner"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs hover:border-secondary/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-fixed text-secondary">
                <Icon name="calendar_month" size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                  Lập thực đơn tuần &amp; Danh sách đi chợ
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Tự động tổng hợp nguyên liệu và định lượng cho cả tuần chỉ với 1 cú bấm.
                </p>
              </div>
            </div>
            <Icon name="arrow_forward" size={20} className="text-on-surface-variant group-hover:translate-x-1 group-hover:text-secondary transition-all shrink-0" />
          </Link>
        </section>

        {/* Main Recipe Discovery Section */}
        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Khám phá món ngon</h2>
              <p className="text-sm text-on-surface-variant">
                Hiển thị {featured.length} / {filteredRecipes.length.toLocaleString("vi-VN")} công thức phù hợp
              </p>
            </div>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
            >
              <span>Xem toàn bộ kho món</span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Interactive Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "all", label: "Tất cả", icon: "restaurant" },
                { id: "fast", label: "Nấu nhanh ≤ 30 phút", icon: "bolt" },
                { id: "easy", label: "Dễ làm", icon: "auto_awesome" },
              ] as const
            ).map((tab) => {
              const active = quickFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setQuickFilter(tab.id);
                    setVisibleCount(12);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30"
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <span className="mx-1 hidden sm:inline-block h-5 w-px bg-outline-variant/40" />

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setVisibleCount(12);
              }}
              className={`rounded-full px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-secondary-fixed text-on-secondary-fixed font-semibold"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30"
              }`}
            >
              Mọi danh mục
            </button>
            {categories.map(([code, cat]) => {
              const active = selectedCategory === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(code);
                    setVisibleCount(12);
                  }}
                  className={`rounded-full px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-secondary-fixed text-on-secondary-fixed font-semibold"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Loading Skeletons */}
          {isLoading && recipes.length === 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container-lowest"
                >
                  <div className="aspect-[16/10] animate-pulse bg-surface-container-high" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-surface-container-high" />
                    <div className="h-4 w-full animate-pulse rounded bg-surface-container" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-surface-container" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && featured.length === 0 && (
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-10 text-center space-y-3">
              <Icon name="search_off" size={36} className="text-on-surface-variant mx-auto" />
              <p className="text-base font-semibold text-on-surface">Chưa có công thức phù hợp bộ lọc này.</p>
              <button
                type="button"
                onClick={() => {
                  setQuickFilter("all");
                  setSelectedCategory("all");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Recipe Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((recipe) => {
              const fav = isFavorited(recipe.id);
              const diffStyle =
                recipe.difficulty === "Dễ làm"
                  ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                  : recipe.difficulty === "Trung bình"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-300";

              return (
                <article
                  key={recipe.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container-lowest shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
                    <Link href={`/recipes/${recipe.id}`} className="block h-full w-full">
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

                    {/* Category Badge */}
                    <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                      {recipe.categoryName}
                    </span>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      disabled={isRestoringSession}
                      aria-pressed={fav}
                      aria-label={
                        !user
                          ? `Đăng nhập để lưu ${recipe.title}`
                          : fav
                          ? `Bỏ yêu thích ${recipe.title}`
                          : `Yêu thích ${recipe.title}`
                      }
                      title={!user ? "Đăng nhập để lưu món" : fav ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                      onClick={() => toggleFavorite(recipe.id, recipe)}
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer disabled:opacity-50 ${
                        fav
                          ? "bg-rose-500 text-white shadow-sm scale-105"
                          : "bg-black/45 text-white hover:bg-black/65"
                      }`}
                    >
                      <Icon name="favorite" filled={fav} size={18} />
                    </button>

                    {/* Time Pill */}
                    <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white">
                      <Icon name="schedule" size={14} />
                      <span>{recipe.totalTime}</span>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${diffStyle}`}>
                          {recipe.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-on-surface-variant">
                          <Icon name="restaurant" size={14} className="text-primary" />
                          {recipe.ingredients.length > 0 ? `${recipe.ingredients.length} nguyên liệu` : `${recipe.servings} khẩu phần`}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold leading-snug text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant/25 pt-3 text-xs text-on-surface-variant">
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="group" size={15} />
                          {recipe.servings} phần
                        </span>
                        {recipe.reviewsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                            <Icon name="star" filled size={14} />
                            {recipe.rating} ({recipe.reviewsCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Icon name="restaurant" size={14} />
                            {recipe.ingredients.length > 0 ? `${recipe.ingredients.length} nguyên liệu` : "Chuẩn vị"}
                          </span>
                        )}
                      </span>

                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Chi tiết
                        <Icon name="arrow_forward" size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More */}
          {visibleCount < filteredRecipes.length && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-3 text-sm font-semibold text-on-surface shadow-xs hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span>Xem thêm 12 món ngon</span>
                <Icon name="expand_more" size={18} />
              </button>
            </div>
          )}
        </section>

        {/* Category Showcase Grid */}
        {categories.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">Danh mục ẩm thực</h2>
              <Link href="/recipes" className="text-sm font-semibold text-primary hover:underline">
                Khám phá tất cả
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map(([code, category]) => {
                const meta = CATEGORY_META[code] ?? {
                  icon: "restaurant",
                  accent: "bg-primary-fixed text-primary",
                };
                return (
                  <Link
                    key={code}
                    href={`/recipes?category=${encodeURIComponent(code)}`}
                    className="group flex flex-col items-start justify-between gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-4 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.accent}`}>
                      <Icon name={meta.icon} size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {category.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">{category.count} công thức</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
