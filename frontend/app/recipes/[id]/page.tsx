"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { LoginRequiredDialog } from "@/components/dialogs/login-required-dialog";
import { RecipeDetailMobile } from "@/components/mobile/recipe-detail-mobile";
import { useRecipes } from "@/lib/context/recipes-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { useShoppingList } from "@/lib/context/shopping-list-context";
import { useMealPlanner } from "@/lib/context/meal-planner-context";
import { useAuth } from "@/lib/context/auth-context";
import { addRecipeToCurrentWeek, recipePlannerLink } from "@/lib/services/planning-api";
import { backendFetch } from "@/lib/services/api-client";
import type { Recipe, Review } from "@/lib/types";
import { recipeService, mapBackendToRecipe, type BackendRecipeDetail } from "@/lib/services/recipe-service";
import { planningRequest, PlanningError, isCloudRecipe } from "@/lib/services/planning-api";

function RecipeDetailContent({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  const { addReview, recipes } = useRecipes();
  const { isFavorited: checkFavorited, toggleFavorite: doToggleFavorite } = useFavorites();
  const { addIngredientsFromRecipe } = useShoppingList();
  const { addMealToPlan } = useMealPlanner();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!isCloudRecipe(recipe.id) || recipe.status !== "published") return;
    // Deferring until mount settles avoids recording React's Strict Mode probe.
    const timer = window.setTimeout(() => {
      void backendFetch(`/api/v1/recipes/${recipe.id}/views`, { method: "POST" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [recipe.id, recipe.status]);

  const [savedReviews, setSavedReviews] = React.useState<Review[]>([]);
  const [reviewsError, setReviewsError] = React.useState("");
  const [reviewsLoading, setReviewsLoading] = React.useState(true);
  const [reviewRevision, setReviewRevision] = React.useState(0);
  React.useEffect(() => {
    const controller = new AbortController();
    async function loadReviews() {
      const items: Review[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const result = await backendFetch<{
          items: { id: string; author: { displayName: string }; rating: number; comment: string; createdAt: string }[];
          totalPages: number;
        }>(`/api/v1/recipes/${recipe.id}/reviews?page=${page}&pageSize=100`, {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]),
        });
        if (controller.signal.aborted) return;
        if (!result) { setReviewsError("Không tải được đánh giá. Vui lòng thử tải lại trang."); setReviewsLoading(false); return; }
        items.push(...result.items.map((item) => ({
          id: item.id, userName: item.author.displayName,
          userAvatarText: item.author.displayName.slice(0, 2).toUpperCase(),
          rating: item.rating, content: item.comment, createdAt: item.createdAt,
        })));
        totalPages = result.totalPages;
        page++;
      } while (page <= totalPages);
      if (!controller.signal.aborted) { setSavedReviews(items); setReviewsError(""); setReviewsLoading(false); }
    }
    if (isCloudRecipe(recipe.id)) void loadReviews();
    else Promise.resolve().then(() => { if (!controller.signal.aborted) { setSavedReviews(recipe.reviews); setReviewsLoading(false); } });
    return () => controller.abort();
  }, [recipe.id, recipe.reviews, reviewRevision]);

  // Servings state
  const baseServings = recipe.servings || 4;
  const [servings, setServings] = React.useState(baseServings);



  // Follow author state
  const [isFollowing, setIsFollowing] = React.useState(false);

  // Checkbox state for ingredients
  const [checkedIngredients, setCheckedIngredients] = React.useState<{ [key: string]: boolean }>({});

  // Active step timer state
  const [activeTimerSeconds, setActiveTimerSeconds] = React.useState<number | null>(null);
  const [timerName, setTimerName] = React.useState<string>("");
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  const [savingPlan, setSavingPlan] = React.useState(false);
  const planLock = React.useRef(false);
  // Meal plan modal state
  const [isMealPlanOpen, setIsMealPlanOpen] = React.useState(false);
  const [selectedPlanDay, setSelectedPlanDay] = React.useState<"T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN">("T2");
  const [selectedMealType, setSelectedMealType] = React.useState<"breakfast" | "lunch" | "dinner" | "snack">("dinner");

  // Review form state
  const [newRating, setNewRating] = React.useState(5);
  const [newReviewText, setNewReviewText] = React.useState("");

  // Login required dialog state
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false);
  const [loginAction] = React.useState<"publish" | "comment" | "follow">("comment");

  // Toast state
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Adjust Servings
  const adjustServings = (delta: number) => {
    setServings((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const getScaledAmount = (amountStr: string) => {
    const match = amountStr.match(/^([0-9]+(?:\.[0-9]+)?)/);
    if (!match) return amountStr;
    const num = parseFloat(match[1]);
    const scaled = (num * servings) / baseServings;
    const rounded = Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1);
    return amountStr.replace(match[1], rounded);
  };

  // Toggle Ingredient Check
  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const allIngredients = recipe.ingredients || [];
  const checkedCount = allIngredients.filter((ing) => checkedIngredients[ing.name]).length;

  const toggleAllIngredients = () => {
    const allChecked = checkedCount === allIngredients.length;
    const newState: { [key: string]: boolean } = {};
    allIngredients.forEach((ing) => {
      newState[ing.name] = !allChecked;
    });
    setCheckedIngredients(newState);
    showToast(allChecked ? "Đã bỏ chọn tất cả nguyên liệu" : `Đã đánh dấu có đủ ${allIngredients.length}/${allIngredients.length} nguyên liệu`);
  };

  // Favorite toggle
  const isFavorited = checkFavorited(recipe.id);
  const handleToggleFavorite = () => {
    const next = doToggleFavorite(recipe.id, recipe);
    showToast(next ? `Đã lưu "${recipe.title}" vào danh sách yêu thích!` : `Đã bỏ lưu món ăn`);
  };

  // Add to Shopping List
  const handleAddToShoppingList = () => {
    if (user) { router.push(recipePlannerLink(recipe.id, servings)); return; }
    addIngredientsFromRecipe(
      recipe.title,
      recipe.ingredients.map((ing) => ({
        name: ing.name,
        amount: `${getScaledAmount(ing.amount)} ${ing.unit}`.trim(),
        unit: ing.unit,
      }))
    );
    showToast(`Đã thêm ${recipe.ingredients.length} nguyên liệu vào Danh sách đi chợ!`);
  };

  // Add to Meal Plan
  const handleSaveToMealPlan = async () => {
    if (user) {
      if (planLock.current) return;
      planLock.current = true; setSavingPlan(true);
      try {
        await addRecipeToCurrentWeek(recipe.id, selectedPlanDay, selectedMealType, servings);
        showToast("Đã lưu món vào thực đơn tuần hiện tại.");
        setIsMealPlanOpen(false);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Không thể lưu thực đơn. Vui lòng thử lại.");
      } finally { planLock.current = false; setSavingPlan(false); }
      return;
    }
    addMealToPlan(selectedPlanDay, recipe, selectedMealType);
    const dayNames: Record<string, string> = {
      T2: "Thứ Hai",
      T3: "Thứ Ba",
      T4: "Thứ Tư",
      T5: "Thứ Năm",
      T6: "Thứ Sáu",
      T7: "Thứ Bảy",
      CN: "Chủ Nhật",
    };
    const mealNames: Record<string, string> = {
      breakfast: "Bữa sáng",
      lunch: "Bữa trưa",
      dinner: "Bữa tối",
      snack: "Bữa phụ",
    };
    showToast(`Đã thêm vào ${dayNames[selectedPlanDay]} (${mealNames[selectedMealType]})!`);
    setIsMealPlanOpen(false);
  };

  // Submit Review
  const reviewLock = React.useRef(false);
  const [savingReview, setSavingReview] = React.useState(false);
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá");
      return;
    }
    if (!user) { setIsLoginDialogOpen(true); return; }
    if (reviewLock.current) return;
    reviewLock.current = true; setSavingReview(true);
    try {
    await addReview(recipe.id, {
      userName: user?.name || "Bếp Trưởng Gia Đình",
      userAvatarText: user?.avatarText || "BT",
      rating: newRating,
      content: newReviewText.trim(),
      location: user?.location || "Việt Nam",
    });
    setReviewRevision((value) => value + 1);
    setNewReviewText("");
    showToast("Đã lưu đánh giá của bạn.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Không gửi được đánh giá.");
    } finally { reviewLock.current = false; setSavingReview(false); }
  };

  // Timer logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && activeTimerSeconds !== null && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        setActiveTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (activeTimerSeconds === 0) {
      const timer = window.setTimeout(() => {
        setIsTimerRunning(false);
        showToast(`Hết giờ: ${timerName}!`);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeTimerSeconds, timerName]);

  const startStepTimer = (seconds: number, name: string) => {
    setTimerName(name);
    setActiveTimerSeconds(seconds);
    setIsTimerRunning(true);
    showToast(`Đã bắt đầu hẹn giờ: ${name} (${Math.floor(seconds / 60)} phút)`);
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Similar recipes
  const similarRecipes = React.useMemo(() => {
    return recipes.filter((r) => r.id !== recipe.id).slice(0, 4);
  }, [recipes, recipe.id]);

  return (
    <>
      {/* ═══════ MOBILE LAYOUT ═══════ */}
      <div className="md:hidden">
        <RecipeDetailMobile recipe={{ ...recipe, reviews: savedReviews }} reviewsLoading={reviewsLoading} reviewsError={reviewsError} onReviewSaved={() => setReviewRevision((value) => value + 1)} />
      </div>

      {/* ═══════ DESKTOP LAYOUT ═══════ */}
      <div className="hidden md:flex w-full min-h-[100dvh] flex-col bg-background text-on-surface">
        <Navbar />

        {/* Dynamic Toast */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface px-space-md py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-5">
            <Icon name="check_circle" size={20} className="text-secondary-fixed" />
            <span className="font-body-md text-body-md text-inverse-on-surface">{toastMsg}</span>
          </div>
        )}

        <main className="w-full pt-20 bg-background flex-1">
          <div className="flex flex-col w-full">
            <div className="w-full px-gutter md:px-margin py-space-lg flex flex-col gap-space-xl">
              {/* 1. Breadcrumb */}
              <nav
                aria-label="Đường dẫn điều hướng"
                className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant overflow-x-auto whitespace-nowrap py-1"
              >
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Icon name="home" size={16} />
                  <span>Trang chủ</span>
                </Link>
                <Icon name="chevron_right" size={14} className="text-tertiary/60" />
                <Link href="/recipes" className="hover:text-primary transition-colors">
                  Khám phá
                </Link>
                <Icon name="chevron_right" size={14} className="text-tertiary/60" />
                <Link href={`/recipes?category=${recipe.category}`} className="hover:text-primary transition-colors">
                  {recipe.categoryName}
                </Link>
                <Icon name="chevron_right" size={14} className="text-tertiary/60" />
                <span className="text-on-surface font-semibold truncate max-w-xs md:max-w-md">
                  {recipe.title}
                </span>
              </nav>

              {/* 2. Header & Hero Media Gallery */}
              <header className="flex flex-col gap-space-lg">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                  <div className="flex flex-col gap-space-xs max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-medium">
                        Ẩm thực {recipe.region}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm font-medium">
                        {recipe.categoryName}
                      </span>
                      {recipe.tags && recipe.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                      {recipe.title}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {recipe.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm mt-1">
                      <div className="flex items-center gap-1.5 text-primary">
                        <Icon name="star" filled size={18} />
                        <span className="font-semibold text-on-surface text-body-md font-body-md">{recipe.rating}</span>
                        <span className="text-on-surface-variant">({recipe.reviewsCount} lượt đánh giá)</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-tertiary-fixed-dim" />
                      <div className="flex items-center gap-1">
                        <Icon name="favorite" size={18} className="text-primary" />
                        <span>{recipe.bookmarksCount}</span>
                        <span>lượt lưu</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-tertiary-fixed-dim" />
                      <div className="flex items-center gap-1">
                        <Icon name="schedule" size={18} />
                        <span>{recipe.totalTime}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-tertiary-fixed-dim" />
                      <div className="flex items-center gap-1">
                        <Icon name="local_fire_department" size={18} />
                        <span>{recipe.calories} kcal/phần</span>
                      </div>
                    </div>
                  </div>

                  {/* Author Tag Card */}
                  <div className="flex items-center gap-space-sm p-2.5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 shrink-0 self-start md:self-auto">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-semibold font-headline-sm text-headline-sm overflow-hidden relative">
                      {recipe.author.avatar ? (
                        <Image
                          src={recipe.author.avatar}
                          alt={recipe.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{recipe.author.avatarText}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1">
                        <span className="font-title-md text-title-md text-on-surface truncate">{recipe.author.name}</span>
                        <Icon name="verified" size={16} className="text-secondary" />
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {recipe.author.title || "Tác giả công thức"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFollowing(!isFollowing);
                        showToast(isFollowing ? `Đã hủy theo dõi ${recipe.author.name}` : `Đã theo dõi ${recipe.author.name}!`);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-body-sm text-body-sm font-medium transition-all ml-1 cursor-pointer ${
                        isFollowing
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {isFollowing ? "Đang theo dõi" : "+ Theo dõi"}
                    </button>
                  </div>
                </div>

                {/* Hero Gallery Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm rounded-3xl overflow-hidden bg-surface-container-low p-2">
                  <div className="lg:col-span-8 relative aspect-[16/9] rounded-2xl overflow-hidden group">
                    <Image
                      src={recipe.image}
                      alt={recipe.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-on-primary">
                      <span className="font-body-sm text-body-sm backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Icon name="restaurant" size={16} />
                        <span>Món ngon chuẩn phong vị {recipe.region}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => showToast(`Xem bộ sưu tập ảnh ${recipe.title}`)}
                        className="backdrop-blur-md bg-surface-container-lowest/90 text-on-surface hover:bg-surface-container-lowest px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-semibold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                      >
                        <Icon name="photo_library" size={18} />
                        <span>Xem ảnh</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-space-sm">
                    {similarRecipes.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/recipes/${item.id}`}
                        className="relative aspect-[16/9] lg:aspect-auto lg:h-[132px] rounded-2xl overflow-hidden cursor-pointer group"
                      >
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 33vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <span className="absolute bottom-2 left-2 text-[11px] font-body-sm text-on-primary bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm line-clamp-1">
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </header>

              {/* 3. Action Toolbar */}
              <section className="flex flex-wrap items-center justify-between gap-space-sm p-space-sm bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className={`flex items-center gap-2 px-space-md py-2.5 rounded-xl transition-all active:scale-95 font-body-md text-body-md font-medium cursor-pointer ${
                      isFavorited
                        ? "bg-primary-fixed text-primary"
                        : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <Icon name={isFavorited ? "favorite" : "favorite_border"} filled={isFavorited} size={20} className="text-primary" />
                    <span>{isFavorited ? "Đã lưu yêu thích" : "Lưu yêu thích"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMealPlanOpen(true)}
                    className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all active:scale-95 font-body-md text-body-md font-medium cursor-pointer"
                  >
                    <Icon name="calendar_add_on" size={20} className="text-secondary" />
                    <span>Lên kế hoạch tuần</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToShoppingList}
                    className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all active:scale-95 font-body-md text-body-md font-medium cursor-pointer"
                  >
                    <Icon name="add_shopping_cart" size={20} className="text-tertiary" />
                    <span>{user ? "Lập thực đơn để đi chợ" : "Thêm vào giỏ chợ"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-space-xs sm:gap-space-sm ml-auto">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="In công thức"
                    className="p-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <Icon name="print" size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(window.location.href);
                        showToast("Đã sao chép liên kết công thức!");
                      }
                    }}
                    title="Chia sẻ công thức"
                    className="p-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <Icon name="share" size={20} />
                  </button>

                  <Link
                    href={`/recipes/${recipe.id}/cook`}
                    className="flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-md font-body-md text-body-md font-semibold transition-all active:scale-95"
                  >
                    <Icon name="outdoor_grill" size={22} />
                    <span>Vào Chế độ Nấu (Cooking Mode)</span>
                  </Link>
                </div>
              </section>

              {/* 4. Recipe Meta Cards */}
              <section className="grid grid-cols-2 md:grid-cols-5 gap-space-sm">
                <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="emoji_symbols" size={18} className="text-primary" />
                    <span>Chuẩn bị</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {recipe.prepTimeMinutes}{" "}
                    <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">phút</span>
                  </span>
                </div>

                <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="skillet" size={18} className="text-primary" />
                    <span>Nấu chín</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {recipe.cookTimeMinutes}{" "}
                    <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">phút</span>
                  </span>
                </div>

                <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="schedule" size={18} className="text-primary" />
                    <span>Tổng thời gian</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {recipe.totalTime}
                  </span>
                </div>

                <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="equalizer" size={18} className="text-secondary" />
                    <span>Độ khó</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-mono-sm text-label-mono-sm font-medium">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1 shadow-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="group" size={18} className="text-primary" />
                    <span>Khẩu phần cơ bản</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {servings}{" "}
                    <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">người</span>
                  </span>
                </div>
              </section>

              {/* 5. Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 flex flex-col gap-space-xl">
                  {/* Ingredients Section */}
                  <section className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Danh sách nguyên liệu</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Số lượng nguyên liệu tự động điều chỉnh theo số khẩu phần thực tế
                        </p>
                      </div>

                      {/* Servings Stepper */}
                      <div className="flex items-center gap-3 bg-surface-container-low px-3 py-1.5 rounded-2xl border border-outline-variant/40 shrink-0">
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">Khẩu phần:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Giảm khẩu phần"
                            onClick={() => adjustServings(-1)}
                            className="w-7 h-7 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-lg active:scale-90 transition-transform cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-label-mono-lg text-label-mono-lg font-bold text-primary w-6 text-center">
                            {servings}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">người</span>
                          <button
                            type="button"
                            aria-label="Tăng khẩu phần"
                            onClick={() => adjustServings(1)}
                            className="w-7 h-7 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-lg active:scale-90 transition-transform cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Utility Bar */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={toggleAllIngredients}
                        className="text-secondary font-body-sm text-body-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Icon name="checklist" size={16} />
                        <span>
                          {checkedCount === allIngredients.length ? "Bỏ chọn tất cả" : "Đánh dấu tất cả đã có"}
                        </span>
                      </button>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Đã sẵn sàng{" "}
                        <span className="font-bold text-secondary">{checkedCount}</span>/
                        {allIngredients.length} nguyên liệu
                      </span>
                    </div>

                    {/* Ingredients Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                      {allIngredients.map((item) => (
                        <label
                          key={item.id || item.name}
                          className="ingredient-row flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(checkedIngredients[item.name])}
                            onChange={() => toggleIngredientCheck(item.name)}
                            className="w-5 h-5 rounded-md accent-secondary text-on-secondary cursor-pointer"
                          />
                          <div className="flex items-center justify-between flex-1">
                            <span className="font-body-md text-body-md text-on-surface">{item.name}</span>
                            <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary">
                              {getScaledAmount(item.amount)} {item.unit}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Step-by-Step Instructions */}
                  <section className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Các bước thực hiện chi tiết</h2>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {recipe.steps.length} bước • Có tính năng hẹn giờ bếp
                      </span>
                    </div>

                    <div className="flex flex-col gap-space-lg">
                      {recipe.steps.map((st, idx) => (
                        <div
                          key={st.number || idx}
                          className="p-space-lg rounded-3xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-space-sm shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-space-sm">
                              <span className="w-9 h-9 rounded-2xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center shrink-0">
                                {st.number || idx + 1}
                              </span>
                              <h3 className="font-title-md text-title-md text-on-surface">{st.title}</h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => startStepTimer((st.durationMinutes || 10) * 60, st.title)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-fixed text-on-primary-fixed hover:bg-primary-container hover:text-on-primary transition-colors font-label-mono-sm text-label-mono-sm font-semibold active:scale-95 cursor-pointer"
                            >
                              <Icon name="timer" size={16} />
                              <span>Hẹn giờ {st.durationMinutes}:00</span>
                            </button>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface-variant pl-12 leading-relaxed">
                            {st.description}
                          </p>

                          {st.image && (
                            <div className="pl-12 mt-1">
                              <div className="aspect-[21/9] rounded-2xl overflow-hidden max-w-xl relative">
                                <Image
                                  src={st.image}
                                  alt={st.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 576px"
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}

                          {st.chefTip && (
                            <div className="ml-12 mt-2 p-3 rounded-xl bg-primary-fixed/20 border border-primary-fixed/40 flex items-start gap-2">
                              <Icon name="lightbulb" size={18} className="text-primary shrink-0 mt-0.5" />
                              <span className="font-body-sm text-body-sm text-on-surface">
                                <strong>Mẹo đầu bếp:</strong> {st.chefTip}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Reviews & Community */}
                  <section className="flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Đánh giá từ cộng đồng</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {recipe.reviewsCount} đầu bếp gia đình đã thử nghiệm và để lại nhận xét
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl">
                        <Icon name="star" filled size={20} className="text-primary" />
                        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{recipe.rating}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">/ 5.0</span>
                      </div>
                    </div>

                    {/* Write Review Form */}
                    <form onSubmit={handleSubmitReview} className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">
                          Viết nhận xét của bạn
                        </span>
                        <div className="flex items-center gap-1 text-primary">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                            >
                              <Icon name="star" filled={star <= newRating} size={22} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        maxLength={2000}
                        disabled={savingReview}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Chia sẻ cảm nhận, mẹo nấu hoặc hương vị thành phẩm sau khi nấu món này..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant/70 border border-outline-variant/30 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Đăng bởi: <strong>{user?.name || "Người dùng RecipeHub"}</strong>
                        </span>
                        <button
                          type="submit" disabled={savingReview}
                          className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          Gửi đánh giá
                        </button>
                      </div>
                    </form>

                    {/* Reviews List */}
                    <div className="flex flex-col gap-space-md">
                      {reviewsLoading ? <p role="status">Đang tải đánh giá…</p> : reviewsError ? <p role="alert">{reviewsError}</p> : savedReviews.length > 0 ? (
                        savedReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-space-xs shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-space-xs">
                                <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-sm">
                                  {rev.userAvatarText}
                                </div>
                                <div>
                                  <h5 className="font-body-md text-body-md font-semibold text-on-surface">{rev.userName}</h5>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    {rev.location || "Việt Nam"} • {rev.createdAt}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center text-primary">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Icon key={s} name="star" filled={s <= rev.rating} size={16} />
                                ))}
                              </div>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface leading-relaxed mt-1">
                              {rev.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-on-surface-variant font-body-md">
                          Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá công thức này!
                        </p>
                      )}
                    </div>
                  </section>
                </div>

                {/* RIGHT COLUMN */}
                <aside className="lg:col-span-4 flex flex-col gap-space-xl">
                  {/* Nutrition Facts Panel */}
                  <section className="bg-surface-container-lowest p-space-md rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface">Giá trị dinh dưỡng</h3>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Ước tính trên mỗi khẩu phần ăn</span>
                      </div>
                      <div className="text-right">
                        <span className="font-headline-sm text-headline-sm font-bold text-primary">{recipe.calories}</span>
                        <span className="font-body-sm text-body-sm block text-on-surface-variant -mt-1">kcal / phần</span>
                      </div>
                    </div>

                    {/* Micro Macro Bar */}
                    <div className="flex flex-col gap-1.5">
                      <div className="h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden flex">
                        <div className="bg-primary h-full" style={{ width: "45%" }} title="Chất đạm (45%)" />
                        <div className="bg-secondary h-full" style={{ width: "35%" }} title="Chất béo (35%)" />
                        <div className="bg-outline h-full" style={{ width: "20%" }} title="Tinh bột (20%)" />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Đạm: 35g
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-secondary inline-block" /> Béo: 18g
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-outline inline-block" /> Carbs: 12g
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Hands-free Cooking Mode CTA */}
                  <section
                    className="bg-gradient-to-br from-primary-fixed/40 via-surface-container-lowest to-surface-container-lowest p-space-lg rounded-3xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-sm relative overflow-hidden"
                  >
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                        <Icon name="outdoor_grill" size={22} />
                      </div>
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface font-semibold">Chế độ nấu rảnh tay</h3>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Trợ lý bàn bếp thông minh</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Màn hình chữ lớn chống tắt sáng, tự động đọc to từng bước nấu và kích hoạt bộ đếm thời gian cho bếp máy tính bảng hoặc điện thoại.
                    </p>
                    <ul className="flex flex-col gap-1.5 text-body-sm font-body-sm text-on-surface">
                      <li className="flex items-center gap-2">
                        <Icon name="check_circle" size={16} className="text-secondary" />
                        <span>Chữ to rõ ràng không chạm tay ướt</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="check_circle" size={16} className="text-secondary" />
                        <span>Chuông báo hẹn giờ tự động các bước</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="check_circle" size={16} className="text-secondary" />
                        <span>Không tốn pin, giữ sáng màn hình</span>
                      </li>
                    </ul>
                    <Link
                      href={`/recipes/${recipe.id}/cook`}
                      className="w-full mt-2 py-3 px-space-md rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all text-center"
                    >
                      <Icon name="play_arrow" size={20} />
                      <span>Bắt đầu nấu ngay</span>
                    </Link>
                  </section>

                  {/* Floating Quick Kitchen Timer Helper widget */}
                  {activeTimerSeconds !== null && (
                    <div className="p-space-md rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <Icon name="timer" size={24} className="text-primary-fixed-dim animate-pulse" />
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm text-tertiary-fixed-dim truncate max-w-[130px]">
                            {timerName || "Hẹn giờ bếp"}
                          </span>
                          <span className="font-label-mono-lg text-label-mono-lg font-bold text-inverse-on-surface">
                            {formatTimer(activeTimerSeconds)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className="p-2 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/40 text-inverse-on-surface transition-colors cursor-pointer"
                        >
                          <Icon name={isTimerRunning ? "pause" : "play_arrow"} size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTimerRunning(false);
                            setActiveTimerSeconds(null);
                          }}
                          className="p-2 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/40 text-inverse-on-surface transition-colors cursor-pointer"
                        >
                          <Icon name="stop" size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </aside>
              </div>

              {/* 6. Similar Recipes Section */}
              <section className="flex flex-col gap-space-md pt-space-lg border-t border-surface-container">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Công thức tương tự có thể bạn thích</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Làm phong phú mâm cơm gia đình với những món ăn đậm đà
                    </p>
                  </div>
                  <Link
                    href={`/recipes?category=${recipe.category}`}
                    className="font-body-sm text-body-sm text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Xem thêm</span>
                    <Icon name="arrow_forward" size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {similarRecipes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-surface-container-lowest rounded-3xl p-space-sm border border-outline-variant/30 shadow-sm flex flex-col gap-space-xs group hover:shadow-md transition-all"
                    >
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                        <Image
                          src={dish.image}
                          alt={dish.imageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            doToggleFavorite(dish.id, dish);
                            showToast(`Đã lưu "${dish.title}" vào yêu thích`);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Icon name={checkFavorited(dish.id) ? "favorite" : "favorite_border"} filled={checkFavorited(dish.id)} size={18} />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-on-primary font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-md">
                          {dish.totalTime}
                        </span>
                      </div>

                      <div className="p-1 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                          <span className="text-secondary font-semibold">
                            {dish.difficulty}
                          </span>
                          <span className="flex items-center gap-0.5 text-primary">
                            <Icon name="star" filled size={14} />
                            {dish.rating}
                          </span>
                        </div>
                        <Link href={`/recipes/${dish.id}`}>
                          <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {dish.title}
                          </h3>
                        </Link>
                        <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                          {dish.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Modal: Lên kế hoạch tuần (Meal Plan Modal) */}
            {isMealPlanOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-space-lg shadow-2xl border border-outline-variant/30 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="calendar_month" size={24} className="text-secondary" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Thêm vào Kế hoạch tuần</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMealPlanOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    >
                      <Icon name="close" size={20} />
                    </button>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Chọn ngày và bữa ăn dự định cho món <strong>{recipe.title}</strong>:
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">Chọn ngày:</span>
                    <div className="grid grid-cols-4 gap-2 font-body-sm text-body-sm">
                      {[
                        { label: "Thứ 2", value: "T2" },
                        { label: "Thứ 3", value: "T3" },
                        { label: "Thứ 4", value: "T4" },
                        { label: "Thứ 5", value: "T5" },
                        { label: "Thứ 6", value: "T6" },
                        { label: "Thứ 7", value: "T7" },
                        { label: "Chủ Nhật", value: "CN" },
                      ].map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setSelectedPlanDay(d.value as typeof selectedPlanDay)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedPlanDay === d.value
                              ? "border-primary bg-primary-fixed text-primary font-bold shadow-sm"
                              : "border-surface-container hover:border-outline text-on-surface"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">Chọn bữa ăn:</span>
                    <div className="grid grid-cols-3 gap-2 font-body-sm text-body-sm">
                      {[
                        { label: "Bữa sáng", value: "breakfast" },
                        { label: "Bữa trưa", value: "lunch" },
                        { label: "Bữa tối", value: "dinner" },
                      ].map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setSelectedMealType(m.value as typeof selectedMealType)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedMealType === m.value
                              ? "border-secondary bg-secondary-fixed text-on-secondary-fixed font-bold shadow-sm"
                              : "border-surface-container hover:border-outline text-on-surface"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-space-sm mt-2">
                    <button
                      type="button"
                      onClick={() => setIsMealPlanOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-medium cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToMealPlan}
                      disabled={savingPlan}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-md text-body-md font-semibold cursor-pointer shadow-sm"
                    >
                      {savingPlan ? "Đang lưu…" : "Lưu vào thực đơn tuần này"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gated Action Dialog */}
            <LoginRequiredDialog
              isOpen={isLoginDialogOpen}
              onClose={() => setIsLoginDialogOpen(false)}
              actionType={loginAction}
              returnUrl={`/recipes/${recipe.id}`}
              onSuccess={() => {
                showToast("Đăng nhập thành công!");
                setIsLoginDialogOpen(false);
              }}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function RecipeDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[100dvh] bg-surface flex items-center justify-center">
          <div className="text-on-surface font-headline-sm text-headline-sm animate-pulse">
            Đang tải công thức...
          </div>
        </div>
      }
    >
      <RecipeDetailLoader />
    </React.Suspense>
  );
}

function RecipeDetailLoader() {
  const { id } = useParams<{ id: string }>();
  const { user, isRestoringSession } = useAuth();
  return <RecipeDetailRequest key={id + ":" + (user?.id ?? "guest") + ":" + isRestoringSession} id={id} waiting={isRestoringSession} />;
}

function RecipeDetailRequest({ id, waiting }: { id: string; waiting: boolean }) {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [error, setError] = React.useState("");
  const [revision, setRevision] = React.useState(0);
  React.useEffect(() => {
    if (waiting) return;
    const controller = new AbortController();
    async function load() {
      try {
        let loaded: Recipe | null;
        if (isCloudRecipe(id)) {
          const detail = await planningRequest<BackendRecipeDetail>(`recipes/${id}`, { signal: controller.signal });
          loaded = mapBackendToRecipe(detail.summary, detail);
        } else {
          loaded = (await recipeService.getRecipeById(id)).data;
        }
        if (controller.signal.aborted) return;
        if (loaded) setRecipe(loaded);
        else setError("Không tìm thấy công thức này.");
      } catch (cause) {
        if (controller.signal.aborted) return;
        setError(cause instanceof PlanningError && cause.status === 404
          ? "Không tìm thấy công thức này."
          : "Không tải được công thức. Vui lòng kiểm tra kết nối rồi thử lại.");
      }
    }
    void load();
    return () => controller.abort();
  }, [id, waiting, revision]);
  if (recipe) return <RecipeDetailContent key={recipe.id} recipe={recipe} />;
  return <><Navbar /><main className="mx-auto min-h-[60vh] max-w-4xl space-y-4 p-8">
    {error ? <><p role="alert">{error}</p><button className="rounded-xl border p-3" onClick={() => { setError(""); setRevision((value) => value + 1); }}>Thử lại</button><Link className="ml-4 underline" href="/recipes">Khám phá công thức</Link></> : <p role="status">Đang tải công thức…</p>}
  </main><Footer /></>;
}
