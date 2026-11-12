"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { useRecipes } from "@/lib/context/recipes-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { useShoppingList } from "@/lib/context/shopping-list-context";

export default function IngredientSearchPage() {
  const { recipes } = useRecipes();
  const { isFavorited, toggleFavorite: doToggleFavorite } = useFavorites();
  const { addItem } = useShoppingList();

  const [selectedIngredients, setSelectedIngredients] = React.useState<string[]>([
    "Thịt ba chỉ",
    "Trứng gà",
    "Cà chua",
    "Đậu phụ",
    "Hành lá",
  ]);
  const [customInput, setCustomInput] = React.useState("");
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const [sortOption, setSortOption] = React.useState<"match" | "time" | "favorite">("match");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleFavorite = (recipeId: string, recipeObj: any) => {
    const next = doToggleFavorite(recipeId, recipeObj);
    if (next) {
      showToast(`Đã lưu "${recipeObj.title}" vào mục yêu thích!`);
    } else {
      showToast(`Đã bỏ lưu "${recipeObj.title}"`);
    }
  };

  const addIngredient = (name: string) => {
    if (!name || !name.trim()) return;
    const clean = name.trim();
    if (!selectedIngredients.includes(clean)) {
      setSelectedIngredients((prev) => [...prev, clean]);
      showToast(`Đã thêm "${clean}" vào danh sách nguyên liệu`);
    }
  };

  const removeIngredient = (name: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== name));
    showToast(`Đã xóa "${name}"`);
  };

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      removeIngredient(name);
    } else {
      addIngredient(name);
    }
  };

  const clearAllIngredients = () => {
    setSelectedIngredients([]);
    showToast("Đã xóa tất cả nguyên liệu");
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      addIngredient(customInput.trim());
      setCustomInput("");
    }
  };

  // Dynamic Matched Recipes based on selectedIngredients & recipes library
  const matchedRecipes = React.useMemo(() => {
    const normSelected = selectedIngredients.map((s) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .trim()
    );

    return recipes
      .map((r) => {
        const totalIngs = r.ingredients.length || 1;
        const matchedIngs = r.ingredients.filter((ing) => {
          const normName = ing.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .trim();
          return normSelected.some(
            (sel) => sel.length >= 2 && (normName.includes(sel) || sel.includes(normName))
          );
        });

        const missingIngs = r.ingredients.filter(
          (ing) => !matchedIngs.some((m) => m.name === ing.name)
        );

        const matchPercent = Math.round((matchedIngs.length / totalIngs) * 100);
        const isFull = missingIngs.length === 0 || matchedIngs.length >= totalIngs;

        return {
          id: r.id,
          title: r.title,
          author: r.author.name,
          tagline: r.description,
          time: r.totalTime,
          totalMinutes: r.prepTimeMinutes + r.cookTimeMinutes,
          difficulty: r.difficulty,
          rating: r.rating,
          matchBadge: isFull
            ? `Có sẵn ${matchedIngs.length}/${totalIngs} nguyên liệu (100% đủ đồ)`
            : `Có sẵn ${matchedIngs.length}/${totalIngs} nguyên liệu (Thiếu ${missingIngs.length} món)`,
          isFullMatch: isFull,
          missingItem: missingIngs[0]?.name || "",
          ingredients:
            matchedIngs.length > 0
              ? matchedIngs.map((i) => i.name)
              : r.ingredients.slice(0, 3).map((i) => i.name),
          image: r.image,
          imageAlt: r.imageAlt,
          matchScore: matchedIngs.length,
          matchPercent,
          rawRecipe: r,
        };
      })
      .sort((a, b) => {
        if (sortOption === "match") return b.matchScore - a.matchScore;
        if (sortOption === "time") return a.totalMinutes - b.totalMinutes;
        if (sortOption === "favorite") return b.rating - a.rating;
        return 0;
      });
  }, [recipes, selectedIngredients, sortOption]);

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Navbar />

      {/* Dynamic Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Icon name="check_circle" size={20} className="text-secondary-fixed" />
          <span className="font-body-md text-body-md">{toastMsg}</span>
        </div>
      )}

      <main className="w-full pt-20 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* MAIN SEARCH & SELECTOR REGION */}
          <section className="w-full px-gutter py-space-xl">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              {/* HERO INTRO */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="max-w-3xl flex flex-col gap-space-xs">
                  <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed w-fit">
                    <Icon name="check_circle" size={16} />
                    <span className="font-label-mono-sm text-label-mono-sm font-medium">
                      3.520+ công thức phân tích thời gian thực
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Nấu ngon từ nguyên liệu sẵn có trong gian bếp
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Chọn hoặc nhập các nguyên liệu bạn đang có sẵn trong tủ lạnh (thịt, cá, rau củ, trứng...). RecipeHub
                    sẽ tự động tính toán, phân tích và đề xuất các món ăn phù hợp nhất kèm tỷ lệ nguyên liệu đầy đủ giúp bạn
                    tiết kiệm thời gian đi chợ.
                  </p>
                </div>
                <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center gap-space-md shrink-0 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name="timer" size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider">
                      Tiết kiệm thời gian
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      15 - 35 phút
                    </span>
                  </div>
                </div>
              </div>

              {/* INGREDIENT SELECTOR WORKBENCH (BENTO BOX) */}
              <div className="w-full bg-surface-container-lowest rounded-3xl p-space-md md:p-space-xl shadow-xl flex flex-col gap-space-lg">
                {/* TOP: SEARCH & ACTIVE TAGS */}
                <div className="flex flex-col gap-space-md">
                  <form onSubmit={handleCustomAdd} className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-space-md flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="search" size={20} />
                    </div>
                    <input
                      id="ingredient-input"
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Nhập tên nguyên liệu ví dụ: trứng gà, thịt ba chỉ, cà chua, nấm hương..."
                      className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 font-body-md text-body-md focus:outline-none focus:bg-surface-container transition-all"
                    />
                    <button
                      type="submit"
                      id="add-custom-tag-btn"
                      className="absolute right-2 top-2 bottom-2 px-space-md rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Icon name="add" size={18} />
                      <span>Thêm</span>
                    </button>
                  </form>

                  {/* SELECTED INGREDIENTS CONTAINER */}
                  <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
                    <div className="flex items-center gap-2 flex-wrap" id="selected-tags-wrapper">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mr-1">
                        Đang chọn ({selectedIngredients.length}):
                      </span>
                      {selectedIngredients.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-body-sm text-body-sm font-medium shadow-sm transition-transform hover:scale-105"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(item)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-on-primary-fixed/20 cursor-pointer"
                          >
                            <Icon name="close" size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-space-sm ml-auto">
                      <button
                        type="button"
                        onClick={clearAllIngredients}
                        className="px-space-md py-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm font-medium cursor-pointer"
                      >
                        Xóa tất cả
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Đang tìm kiếm món ngon với ${selectedIngredients.length} nguyên liệu...`)}
                        className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                      >
                        <Icon name="auto_awesome" size={16} />
                        <span>Tìm món nấu ngay</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* QUICK CATEGORY MATRICES */}
                <div className="flex flex-col gap-space-md pt-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      Chọn nhanh theo nhóm thực phẩm thường gặp
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
                      Nhấn để thêm hoặc bớt khỏi tủ lạnh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
                    {/* GROUP 1: THỊT & GIA CẦM */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <Icon name="restaurant" size={16} />
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          Thịt &amp; Gia cầm
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Thịt ba chỉ", "Thịt heo nạc", "Thịt bò", "Thịt gà", "Sườn non"].map((item) => (
                          <label
                            key={item}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer text-body-sm font-body-sm text-on-surface"
                          >
                            <span>{item}</span>
                            <input
                              type="checkbox"
                              checked={selectedIngredients.includes(item)}
                              onChange={() => toggleIngredient(item)}
                              className="w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* GROUP 2: HẢI SẢN */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <Icon name="phishing" size={16} />
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">Hải sản</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Tôm tươi", "Mực ống", "Cá lóc", "Cá hồi phi lê", "Nghêu / Sò"].map((item) => (
                          <label
                            key={item}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer text-body-sm font-body-sm text-on-surface"
                          >
                            <span>{item}</span>
                            <input
                              type="checkbox"
                              checked={selectedIngredients.includes(item)}
                              onChange={() => toggleIngredient(item)}
                              className="w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* GROUP 3: RAU CỦ & NẤM */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                          <Icon name="eco" size={16} />
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">Rau củ &amp; Nấm</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Cà chua", "Bắp cải", "Nấm rơm", "Cà rốt", "Hành tây"].map((item) => (
                          <label
                            key={item}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer text-body-sm font-body-sm text-on-surface"
                          >
                            <span>{item}</span>
                            <input
                              type="checkbox"
                              checked={selectedIngredients.includes(item)}
                              onChange={() => toggleIngredient(item)}
                              className="w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* GROUP 4: ĐẬU & TRỨNG */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <Icon name="egg" size={16} />
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">Đậu &amp; Trứng</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Trứng gà", "Đậu phụ", "Trứng vịt lộn", "Đậu hũ non", "Trứng cút"].map((item) => (
                          <label
                            key={item}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer text-body-sm font-body-sm text-on-surface"
                          >
                            <span>{item}</span>
                            <input
                              type="checkbox"
                              checked={selectedIngredients.includes(item)}
                              onChange={() => toggleIngredient(item)}
                              className="w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* GROUP 5: GIA VỊ & ĐỒ KHÔ */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <Icon name="grain" size={16} />
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          Gia vị &amp; Đồ khô
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {["Hành lá", "Hành tím / Tỏi", "Tiêu đen", "Nấm hương", "Nước mắm nhỉ"].map((item) => (
                          <label
                            key={item}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer text-body-sm font-body-sm text-on-surface"
                          >
                            <span>{item}</span>
                            <input
                              type="checkbox"
                              checked={selectedIngredients.includes(item)}
                              onChange={() => toggleIngredient(item)}
                              className="w-4 h-4 rounded text-secondary accent-secondary cursor-pointer"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADVANCED PREFERENCES STRIP */}
                <div className="flex flex-wrap items-center justify-between gap-space-md p-space-md rounded-2xl bg-surface-container-low">
                  <div className="flex flex-wrap items-center gap-space-md">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input defaultChecked className="w-4 h-4 rounded text-primary accent-primary cursor-pointer" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        Ưu tiên món đủ 100% nguyên liệu
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input defaultChecked className="w-4 h-4 rounded text-primary accent-primary cursor-pointer" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        Bỏ qua các gia vị cơ bản gia đình (muối, mắm, đường, dầu ăn)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input className="w-4 h-4 rounded text-primary accent-primary cursor-pointer" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        Thời gian nấu dưới 30 phút
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                    <Icon name="info" size={16} />
                    <span>Tự động cập nhật tức thì</span>
                  </div>
                </div>
              </div>

              {/* RESULTS HEADER & CONTROLS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="w-3 h-3 rounded-full bg-secondary" />
                  <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                    Tìm thấy {matchedRecipes.length} món ăn phù hợp với {selectedIngredients.length} nguyên liệu đã chọn
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Sắp xếp theo:</span>
                  <div className="inline-flex rounded-xl bg-surface-container p-1 text-on-surface">
                    <button
                      type="button"
                      onClick={() => setSortOption("match")}
                      className={`px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all cursor-pointer ${
                        sortOption === "match"
                          ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                          : "text-on-surface-variant hover:bg-surface-container-high font-medium"
                      }`}
                    >
                      Khớp cao nhất
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortOption("time")}
                      className={`px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all cursor-pointer ${
                        sortOption === "time"
                          ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                          : "text-on-surface-variant hover:bg-surface-container-high font-medium"
                      }`}
                    >
                      Nấu nhanh nhất
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortOption("favorite")}
                      className={`px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all cursor-pointer ${
                        sortOption === "favorite"
                          ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                          : "text-on-surface-variant hover:bg-surface-container-high font-medium"
                      }`}
                    >
                      Yêu thích nhất
                    </button>
                  </div>
                </div>
              </div>

              {/* RECIPE CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {matchedRecipes.map((recipe) => {
                  const isFav = isFavorited(recipe.id);
                  return (
                    <article
                      key={recipe.id}
                      className="bg-surface-container-lowest rounded-3xl p-space-sm shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="flex flex-col">
                        {/* IMAGE WRAPPER */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container">
                          <Image
                            src={recipe.image}
                            alt={recipe.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* FAVORITE HEART */}
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(recipe.id, recipe.rawRecipe)}
                            title="Lưu vào thực đơn yêu thích"
                            className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                              isFav ? "text-primary bg-primary-fixed" : "text-on-surface hover:text-primary"
                            }`}
                          >
                            <Icon name="favorite" filled={isFav} size={20} />
                          </button>

                          {/* BADGE PROGRESS */}
                          <div
                            className={`absolute bottom-3 left-3 px-3 py-1 rounded-full font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1.5 shadow-sm ${
                              recipe.isFullMatch
                                ? "bg-secondary-fixed text-on-secondary-fixed"
                                : "bg-primary-fixed text-on-primary-fixed"
                            }`}
                          >
                            <Icon name={recipe.isFullMatch ? "check" : "error"} size={14} />
                            <span>{recipe.matchBadge}</span>
                          </div>
                        </div>

                        {/* METADATA & TITLE */}
                        <div className="p-space-sm flex flex-col gap-space-xs mt-1">
                          <div className="flex items-center gap-space-sm text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                            <span className="flex items-center gap-1">
                              <Icon name="timer" size={14} />
                              {recipe.time}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant" />
                            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary font-medium">
                              {recipe.difficulty}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant" />
                            <span className="flex items-center gap-1 text-primary font-semibold">
                              <Icon name="star" filled size={14} />
                              {recipe.rating}
                            </span>
                          </div>

                          <Link href={`/recipes/${recipe.id}`}>
                            <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                              {recipe.title}
                            </h3>
                          </Link>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Bởi {recipe.author} • {recipe.tagline}
                          </p>

                          {/* INGREDIENT LIST BREAKDOWN */}
                          <div className="mt-space-xs p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                            {recipe.isFullMatch ? (
                              <>
                                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold flex items-center gap-1">
                                  <Icon name="check" size={14} />
                                  Đủ mọi nguyên liệu chính:
                                </span>
                                <div className="flex flex-wrap gap-1 text-on-surface font-body-sm text-body-sm">
                                  {recipe.ingredients.map((ing) => (
                                    <span key={ing} className="px-2 py-0.5 rounded bg-surface-container text-on-surface">
                                      {ing}
                                    </span>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                                    Tình trạng đồ nấu:
                                  </span>
                                  <span className="font-label-mono-sm text-label-mono-sm text-error font-medium">
                                    Thiếu: {recipe.missingItem}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-1 pt-1">
                                  <div className="flex flex-wrap gap-1 text-on-surface font-body-sm text-body-sm">
                                    {recipe.ingredients.map((ing) => (
                                      <span key={ing} className="px-2 py-0.5 rounded bg-surface-container">
                                        {ing}
                                      </span>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      addItem({
                                        name: recipe.missingItem,
                                        amount: "1 phần",
                                        category: "khac",
                                        subtext: `Cần cho: ${recipe.title}`,
                                      });
                                      showToast(`Đã thêm "${recipe.missingItem}" vào giỏ chợ!`);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-primary font-body-sm text-body-sm font-medium hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <Icon name="add" size={14} />
                                    <span>Thêm {recipe.missingItem?.toLowerCase()} vào giỏ</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="p-space-sm pt-0 flex items-center gap-2 mt-space-sm">
                        <Link
                          href={`/recipes/${recipe.id}`}
                          className="flex-1 py-2 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container-high transition-colors text-center"
                        >
                          Xem công thức
                        </Link>
                        <Link
                          href={`/recipes/${recipe.id}/cook`}
                          className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-colors shadow-sm text-center"
                        >
                          Nấu ngay
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* CONTEXTUAL SHOPPING & MEAL PLANNER BANNER */}
              <aside className="w-full rounded-3xl bg-surface-container-low p-space-md md:p-space-xl flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <Icon name="shopping_cart" size={28} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Thiếu một vài nguyên liệu cho món bạn yêu thích?
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                      Nhấn nút &ldquo;+ Thêm vào giỏ đi chợ&rdquo; trên bất kỳ thẻ món ăn nào để tự động gom vào Danh sách đi
                      chợ thông minh mà không cần ghi chép thủ công.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm shrink-0 w-full sm:w-auto">
                  <Link
                    href="/shopping-list"
                    className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-on-surface text-surface font-body-md text-body-md font-semibold hover:bg-inverse-surface transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Mở danh sách mua sắm</span>
                    <Icon name="arrow_forward" size={16} />
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
