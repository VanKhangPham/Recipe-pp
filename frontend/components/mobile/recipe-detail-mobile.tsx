"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useRecipes } from "@/lib/context/recipes-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { useShoppingList } from "@/lib/context/shopping-list-context";
import { useAuth } from "@/lib/context/auth-context";
import { recipePlannerLink } from "@/lib/services/planning-api";
import type { Recipe } from "@/lib/types";

export function RecipeDetailMobile({ recipe, onReviewSaved, reviewsLoading, reviewsError }: { recipe: Recipe; onReviewSaved: () => void; reviewsLoading: boolean; reviewsError: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addReview } = useRecipes();
  const { isFavorited, toggleFavorite: doToggleFavorite } = useFavorites();
  const { addIngredientsFromRecipe } = useShoppingList();

  const [reviewText, setReviewText] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(5);
  const [savingReview, setSavingReview] = React.useState(false);
  const [reviewMessage, setReviewMessage] = React.useState("");
  const reviewLock = React.useRef(false);
  async function submitReview(event: React.FormEvent) {
    event.preventDefault();
    if (!user || reviewLock.current) return;
    reviewLock.current = true;
    setSavingReview(true);
    setReviewMessage("");
    try {
      await addReview(recipe.id, {
        userName: user.name, userAvatarText: user.avatarText ?? "",
        rating: reviewRating, content: reviewText.trim(),
      });
      setReviewText("");
      setReviewMessage("Đã lưu đánh giá của bạn.");
      onReviewSaved();
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : "Không gửi được đánh giá.");
    } finally {
      reviewLock.current = false;
      setSavingReview(false);
    }
  }

  // Servings state
  const baseServings = recipe.servings || 4;
  const [servings, setServings] = React.useState(baseServings);



  // Ingredients checked state
  const [checkedIngredients, setCheckedIngredients] = React.useState<Record<string, boolean>>({});

  // Timer state for first step or active step
  const [timerSeconds, setTimerSeconds] = React.useState(
    (recipe.steps[0]?.durationMinutes || 20) * 60
  );
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  // Toast notification state
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const [toastIcon, setToastIcon] = React.useState<string>("check_circle");

  const showToast = (message: string, icon = "check_circle") => {
    setToastMsg(message);
    setToastIcon(icon);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Timer tick effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            showToast("Hết giờ bước nấu!", "alarm");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSecs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const updateServings = (delta: number) => {
    const next = servings + delta;
    if (next < 1 || next > 20) return;
    setServings(next);
    showToast(`Đã điều chỉnh khẩu phần cho ${next} người`);
  };

  const isFavorite = isFavorited(recipe.id);

  const handleToggleFavorite = () => {
    const next = doToggleFavorite(recipe.id, recipe);
    showToast(next ? "Đã lưu vào bộ sưu tập Yêu thích" : "Đã bỏ lưu công thức");
  };

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const scaleAmount = (amountStr: string) => {
    const match = amountStr.match(/^([0-9]+(?:\.[0-9]+)?)/);
    if (!match) return amountStr;
    const num = parseFloat(match[1]);
    const scaled = (num * servings) / baseServings;
    const rounded = Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1);
    return amountStr.replace(match[1], rounded);
  };

  const addAllToShoppingList = () => {
    if (user) { router.push(recipePlannerLink(recipe.id, servings)); return; }
    addIngredientsFromRecipe(
      recipe.title,
      recipe.ingredients.map((ing) => ({
        name: ing.name,
        amount: `${scaleAmount(ing.amount)} ${ing.unit}`.trim(),
        unit: ing.unit,
      }))
    );
    showToast(`Đã thêm ${recipe.ingredients.length} nguyên liệu vào Giỏ đi chợ!`, "shopping_bag");
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-surface">
      {/* ── Mobile Header ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(43,30,22,0.04)] pt-safe">
        <div className="h-16 px-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              aria-label="Quay lại"
              className="w-11 h-11 min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
              onClick={() => router.back()}
            >
              <Icon name="arrow_back" size={24} />
            </button>
            <h1 className="font-title-md text-title-md text-on-surface truncate max-w-[200px]">
              {recipe.title}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Chia sẻ"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined" && navigator.share) {
                  navigator.share({
                    title: `${recipe.title} - RecipeHub`,
                    url: window.location.href,
                  });
                } else {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  showToast("Đã sao chép liên kết công thức!", "link");
                }
              }}
            >
              <Icon name="share" size={22} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1">
              <span className="text-on-primary font-bold text-xs">{recipe.author.avatarText}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface min-h-screen">
        <div className="flex flex-col w-full pb-32">
          {/* Top Navigation Extension & Action Row */}
          <div className="px-5 pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {recipe.categoryName} • Ẩm thực {recipe.region}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Yêu thích"
                className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer ${
                  isFavorite ? "text-primary" : "text-on-surface-variant"
                }`}
                onClick={handleToggleFavorite}
              >
                <Icon name="favorite" filled={isFavorite} size={22} />
              </button>
            </div>
          </div>

          {/* Hero Visual Framing (16:9) with Soft Overlays */}
          <div className="px-5">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md bg-surface-container">
              <Image
                src={recipe.image}
                alt={recipe.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
              {/* Badges on top of hero image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-mono-sm text-label-mono-sm shadow-sm">
                  {recipe.region}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-mono-sm text-label-mono-sm shadow-sm">
                  {recipe.difficulty}
                </span>
              </div>
              {/* Quick highlight tag on hero bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary text-body-sm font-body-sm">
                <span className="flex items-center gap-1">
                  <Icon name="schedule" size={16} />
                  {recipe.totalTime}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="verified" size={16} />
                  Đã kiểm chứng
                </span>
              </div>
            </div>
          </div>

          {/* Recipe Title & Chef Meta */}
          <div className="px-5 mt-4 flex flex-col gap-1">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              {recipe.title}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {recipe.description}
            </p>

            {/* Author & Social Proof Strip */}
            <div className="mt-2 p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-primary shrink-0">
                  {recipe.author.avatar ? (
                    <Image
                      src={recipe.author.avatar}
                      alt={recipe.author.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <span>{recipe.author.avatarText}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-body-md text-on-surface font-semibold">{recipe.author.name}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{recipe.author.title || "Tác giả công thức"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-1 text-primary">
                  <Icon name="star" filled size={16} />
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">{recipe.rating}</span>
                  <span className="text-body-sm text-on-surface-variant">({recipe.reviewsCount})</span>
                </div>
                <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant">{recipe.bookmarksCount} lượt lưu</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bento (4 Cards) */}
          <div className="px-5 mt-4 grid grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-surface-container text-center flex flex-col items-center justify-center">
              <Icon name="timer" size={20} className="text-primary" />
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Chuẩn bị</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">{recipe.prepTimeMinutes}p</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container text-center flex flex-col items-center justify-center">
              <Icon name="skillet" size={20} className="text-primary" />
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Nấu chín</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">{recipe.cookTimeMinutes}p</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container text-center flex flex-col items-center justify-center">
              <Icon name="signal_cellular_alt" size={20} className="text-secondary" />
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Độ khó</span>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">{recipe.difficulty}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container text-center flex flex-col items-center justify-center">
              <Icon name="local_fire_department" size={20} className="text-primary" />
              <span className="font-body-sm text-[11px] text-on-surface-variant mt-1">Năng lượng</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">{recipe.calories} kcal</span>
            </div>
          </div>

          {/* Interactive Servings Stepper */}
          <div className="px-5 mt-6">
            <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-title-md text-title-md text-on-surface block">Khẩu phần ăn</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Tự động cân đối lượng nguyên liệu</span>
                </div>
                <div className="flex items-center bg-surface-container-highest rounded-full p-1 shadow-inner">
                  <button
                    aria-label="Giảm khẩu phần"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                    onClick={() => updateServings(-1)}
                  >
                    <Icon name="remove" size={18} />
                  </button>
                  <span className="w-10 text-center font-label-mono-lg text-label-mono-lg text-on-surface font-bold">
                    {servings}
                  </span>
                  <button
                    aria-label="Tăng khẩu phần"
                    className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                    onClick={() => updateServings(1)}
                  >
                    <Icon name="add" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Checklist Component */}
          <div className="px-5 mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Nguyên liệu</h2>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  {recipe.ingredients.length} món
                </span>
              </div>
              <button
                className="text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 active:opacity-70 transition-opacity cursor-pointer"
                onClick={addAllToShoppingList}
              >
                <Icon name="playlist_add" size={18} />
                {user ? "Lập thực đơn để đi chợ" : "Thêm vào giỏ"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {recipe.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.name];
                return (
                  <label
                    key={ing.id || ing.name}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-lowest shadow-sm cursor-pointer select-none transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        checked={isChecked}
                        onChange={() => toggleIngredient(ing.name)}
                        className="w-5 h-5 rounded accent-secondary cursor-pointer"
                        type="checkbox"
                      />
                      <span
                        className={`font-body-md text-body-md text-on-surface transition-all ${
                          isChecked ? "line-through opacity-50" : ""
                        }`}
                      >
                        {ing.name}
                      </span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium shrink-0 ml-2">
                      {scaleAmount(ing.amount)} {ing.unit}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Cooking Guide */}
          <div className="px-5 mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Các bước thực hiện</h2>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                {recipe.steps.length} bước chính
              </span>
            </div>

            {recipe.steps.map((st, idx) => (
              <div key={st.number || idx} className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                    Bước {st.number || idx + 1}
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    {st.durationMinutes} phút
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface">{st.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {st.description}
                </p>

                {/* Step Image if available */}
                {st.image && (
                  <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-surface-container mt-1">
                    <Image
                      src={st.image}
                      alt={st.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Step 1 Interactive Timer Widget */}
                {idx === 0 && (
                  <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                        <Icon name="hourglass_top" size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-mono-lg text-label-mono-lg font-bold text-on-surface tracking-wider">
                          {formatTimer(timerSeconds)}
                        </span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Hẹn giờ bước {st.number || 1}</span>
                      </div>
                    </div>
                    <button
                      className={`px-3.5 py-1.5 rounded-lg text-on-primary font-body-sm text-body-sm font-medium shadow-sm active:scale-95 transition-transform flex items-center gap-1 cursor-pointer ${
                        isTimerRunning ? "bg-tertiary" : "bg-primary"
                      }`}
                      onClick={toggleTimer}
                    >
                      <Icon name={isTimerRunning ? "pause" : "play_arrow"} size={18} />
                      <span>{isTimerRunning ? "Tạm dừng" : "Bắt đầu"}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chef Pro Tip Card */}
          {recipe.steps[0]?.chefTip && (
            <div className="px-5 mt-6">
              <div className="p-4 rounded-2xl bg-primary-fixed/40 flex items-start gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 mt-0.5">
                  <Icon name="lightbulb" size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-title-md text-title-md text-on-primary-fixed font-semibold">
                    Bí quyết vàng từ đầu bếp
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {recipe.steps[0].chefTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews & Community Feedback */}
          <div className="px-5 mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Đánh giá thực tế</h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Từ {recipe.reviewsCount} người đã nấu thử</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high">
                <Icon name="star" filled size={18} className="text-primary" />
                <span className="font-label-mono-lg text-label-mono-lg font-bold text-on-surface">{recipe.rating}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">/ 5</span>
              </div>
            </div>

            {user ? (
              <form onSubmit={submitReview} className="space-y-3 rounded-xl border border-outline-variant p-4">
                <label className="block">Điểm đánh giá
                  <select className="ml-3 rounded border p-2" value={reviewRating} disabled={savingReview} onChange={(event) => setReviewRating(Number(event.target.value))}>
                    {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} sao</option>)}
                  </select>
                </label>
                <label className="block">Nhận xét
                  <textarea className="mt-2 w-full rounded border p-3" required maxLength={2000} rows={3} value={reviewText} disabled={savingReview} onChange={(event) => setReviewText(event.target.value)} />
                </label>
                <button className="rounded-xl bg-primary px-4 py-2 text-on-primary disabled:opacity-50" disabled={savingReview || !reviewText.trim()}>{savingReview ? "Đang gửi…" : "Gửi đánh giá"}</button>
                {reviewMessage && <p role="status">{reviewMessage}</p>}
              </form>
            ) : <Link href="/login" className="underline">Đăng nhập để đánh giá</Link>}

            {reviewsLoading ? <p role="status">Đang tải đánh giá…</p> : reviewsError ? <p role="alert">{reviewsError}</p> : recipe.reviews && recipe.reviews.length > 0 ? (
              recipe.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {rev.userAvatarText}
                      </div>
                      <div>
                        <span className="font-title-md text-body-md text-on-surface font-semibold block leading-tight">
                          {rev.userName}
                        </span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant">
                          {rev.location || "Việt Nam"} • {rev.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-primary">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Icon key={i} name="star" filled size={16} />
                      ))}
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {rev.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-4">
                Chưa có đánh giá nào. Hãy là người đầu tiên để lại đánh giá!
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ── Sticky Bottom Kitchen Action Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(43,30,22,0.08)] pb-safe">
        <div className="px-5 py-3 flex items-center gap-3">
          {/* Secondary Action: Add to Shopping List */}
          <button
            aria-label="Thêm nguyên liệu vào giỏ"
            className="h-12 w-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform shrink-0 cursor-pointer"
            onClick={addAllToShoppingList}
          >
            <Icon name="shopping_basket" size={22} />
          </button>
          {/* Primary Action: Cooking Mode Hands-Free */}
          <Link
            href={`/recipes/${recipe.id}/cook`}
            className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
          >
            <Icon name="soup_kitchen" size={20} />
            <span>Bắt đầu nấu ngay</span>
            <span className="px-1.5 py-0.5 rounded-full bg-on-primary/20 text-on-primary text-[10px] font-label-mono-sm">
              Rảnh tay
            </span>
          </Link>
        </div>
      </div>

      {/* Dynamic Toast */}
      {toastMsg && (
        <div className="fixed top-20 inset-x-5 z-50 transition-all duration-300">
          <div className="p-3.5 rounded-xl bg-on-surface text-surface shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Icon name={toastIcon} size={22} className="text-secondary-fixed" />
            <span className="font-body-sm text-body-sm text-surface font-medium">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
