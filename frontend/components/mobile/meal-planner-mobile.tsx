"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useMealPlanner } from "@/lib/context/meal-planner-context";

export function MealPlannerMobile() {
  const router = useRouter();
  const {
    weekPlans,
    selectedDayId,
    setSelectedDayId,
    activeDayPlan,
    removeMealFromPlan,
    generateShoppingList,
  } = useMealPlanner();

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleGenerateShopping = () => {
    const count = generateShoppingList();
    showToast(`Đã tạo danh sách mua sắm với ${count} nguyên liệu!`);
    setTimeout(() => {
      router.push("/shopping-list");
    }, 800);
  };

  // Group meals of active day by type
  const breakfastMeals = activeDayPlan.meals.filter((m) => m.mealType === "breakfast");
  const lunchMeals = activeDayPlan.meals.filter((m) => m.mealType === "lunch");
  const dinnerMeals = activeDayPlan.meals.filter((m) => m.mealType === "dinner");
  const snackMeals = activeDayPlan.meals.filter((m) => m.mealType === "snack");

  const totalCalories = activeDayPlan.meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex flex-col min-h-screen pb-24">
      {/* ── Mobile Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(40,25,18,0.04)] pt-safe">
        <div className="h-16 px-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <Icon name="skillet" size={20} />
            </div>
            <span className="font-headline-sm text-headline-sm tracking-tight text-primary font-bold">
              RecipeHub
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateShopping}
              className="px-3 py-1.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Icon name="shopping_cart" size={16} />
              <span>Đi chợ</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* Top Title & Quick Actions */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
                Kế Hoạch Bữa Ăn
              </h1>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Tuần này • {activeDayPlan.dayName} ({activeDayPlan.dateStr})
              </span>
            </div>
            <button
              className="h-10 px-3 rounded-xl bg-surface-container flex items-center gap-1.5 text-on-surface font-body-sm text-body-sm font-medium active:scale-95 transition-transform"
              type="button"
              onClick={() => showToast("Đã tối ưu thực đơn")}
            >
              <Icon name="auto_awesome" size={18} className="text-secondary" />
              <span>Gợi ý AI</span>
            </button>
          </div>

          {/* ── Horizontal 7-Day Strip ── */}
          <div className="w-full overflow-x-auto py-2 px-5 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {weekPlans.map((day) => {
                const isSelected = selectedDayId === day.dayId;
                const mealCount = day.meals.length;
                return (
                  <button
                    key={day.dayId}
                    aria-label={`Chọn ${day.dayName}`}
                    className={`flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-on-primary shadow-md scale-105"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                    }`}
                    onClick={() => setSelectedDayId(day.dayId)}
                    type="button"
                  >
                    <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider font-semibold">
                      {day.dayShort}
                    </span>
                    <span className="font-title-md text-title-md font-bold mt-0.5">
                      {day.dateStr.split("/")[0]}
                    </span>
                    <div className="flex gap-0.5 mt-1">
                      {mealCount > 0 ? (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-on-primary" : "bg-secondary"
                          }`}
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-dim opacity-40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Daily Calorie Tracker Strip ── */}
          <div className="px-5 mt-3">
            <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Icon name="local_fire_department" size={18} />
                  </div>
                  <div>
                    <span className="font-title-md text-title-md font-semibold text-on-surface">
                      Tổng năng lượng
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant block">
                      Mục tiêu: {activeDayPlan.targetCalories || 2000} kcal
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-label-mono-lg text-label-mono-lg font-bold text-primary">
                    {totalCalories}
                  </span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant block">
                    {Math.round((totalCalories / (activeDayPlan.targetCalories || 2000)) * 100)}% kế hoạch
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((totalCalories / (activeDayPlan.targetCalories || 2000)) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── 4 Meal Slots of the Selected Day ── */}
          <div className="px-5 mt-4 flex flex-col gap-4">
            {/* 1. Bữa Sáng */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary">
                    <Icon name="sunny" size={17} />
                  </div>
                  <span className="font-title-md text-title-md font-bold text-on-surface">Bữa Sáng</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                  {breakfastMeals.length} món
                </span>
              </div>

              {breakfastMeals.length > 0 ? (
                breakfastMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {meal.image && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <Image src={meal.image} alt={meal.recipeTitle} fill sizes="56px" className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <Link href={`/recipes/${meal.recipeId}`}>
                          <span className="font-body-md text-body-md font-semibold text-on-surface truncate hover:text-primary">
                            {meal.recipeTitle}
                          </span>
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                          <span className="text-primary font-medium">{meal.calories} kcal</span>
                          <span>•</span>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      aria-label="Xóa món"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error active:scale-95 transition-all cursor-pointer shrink-0"
                      type="button"
                      onClick={() => {
                        removeMealFromPlan(selectedDayId, meal.id);
                        showToast(`Đã xóa món ${meal.recipeTitle}`);
                      }}
                    >
                      <Icon name="close" size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <Link
                  href="/recipes"
                  className="w-full py-4 rounded-xl border border-dashed border-outline-variant hover:border-primary flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                >
                  <Icon name="add" size={18} />
                  <span>Chọn món cho bữa sáng</span>
                </Link>
              )}
            </div>

            {/* 2. Bữa Trưa */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                    <Icon name="wb_sunny" size={17} />
                  </div>
                  <span className="font-title-md text-title-md font-bold text-on-surface">Bữa Trưa</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                  {lunchMeals.length} món
                </span>
              </div>

              {lunchMeals.length > 0 ? (
                lunchMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {meal.image && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <Image src={meal.image} alt={meal.recipeTitle} fill sizes="56px" className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <Link href={`/recipes/${meal.recipeId}`}>
                          <span className="font-body-md text-body-md font-semibold text-on-surface truncate hover:text-primary">
                            {meal.recipeTitle}
                          </span>
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                          <span className="text-primary font-medium">{meal.calories} kcal</span>
                          <span>•</span>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      aria-label="Xóa món"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error active:scale-95 transition-all cursor-pointer shrink-0"
                      type="button"
                      onClick={() => {
                        removeMealFromPlan(selectedDayId, meal.id);
                        showToast(`Đã xóa món ${meal.recipeTitle}`);
                      }}
                    >
                      <Icon name="close" size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <Link
                  href="/recipes"
                  className="w-full py-4 rounded-xl border border-dashed border-outline-variant hover:border-primary flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                >
                  <Icon name="add" size={18} />
                  <span>Chọn món cho bữa trưa</span>
                </Link>
              )}
            </div>

            {/* 3. Bữa Tối */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-tertiary-fixed/50 flex items-center justify-center text-tertiary">
                    <Icon name="bedtime" size={17} />
                  </div>
                  <span className="font-title-md text-title-md font-bold text-on-surface">Bữa Tối</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                  {dinnerMeals.length} món
                </span>
              </div>

              {dinnerMeals.length > 0 ? (
                dinnerMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {meal.image && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <Image src={meal.image} alt={meal.recipeTitle} fill sizes="56px" className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <Link href={`/recipes/${meal.recipeId}`}>
                          <span className="font-body-md text-body-md font-semibold text-on-surface truncate hover:text-primary">
                            {meal.recipeTitle}
                          </span>
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                          <span className="text-primary font-medium">{meal.calories} kcal</span>
                          <span>•</span>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      aria-label="Xóa món"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error active:scale-95 transition-all cursor-pointer shrink-0"
                      type="button"
                      onClick={() => {
                        removeMealFromPlan(selectedDayId, meal.id);
                        showToast(`Đã xóa món ${meal.recipeTitle}`);
                      }}
                    >
                      <Icon name="close" size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <Link
                  href="/recipes"
                  className="w-full py-4 rounded-xl border border-dashed border-outline-variant hover:border-primary flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                >
                  <Icon name="add" size={18} />
                  <span>Chọn món cho bữa tối</span>
                </Link>
              )}
            </div>

            {/* 4. Bữa Phụ */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="bakery_dining" size={17} />
                  </div>
                  <span className="font-title-md text-title-md font-bold text-on-surface">Bữa Phụ</span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                  {snackMeals.length} món
                </span>
              </div>

              {snackMeals.length > 0 ? (
                snackMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {meal.image && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <Image src={meal.image} alt={meal.recipeTitle} fill sizes="56px" className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <Link href={`/recipes/${meal.recipeId}`}>
                          <span className="font-body-md text-body-md font-semibold text-on-surface truncate hover:text-primary">
                            {meal.recipeTitle}
                          </span>
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                          <span className="text-primary font-medium">{meal.calories} kcal</span>
                          <span>•</span>
                          <span>{meal.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      aria-label="Xóa món"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error active:scale-95 transition-all cursor-pointer shrink-0"
                      type="button"
                      onClick={() => {
                        removeMealFromPlan(selectedDayId, meal.id);
                        showToast(`Đã xóa món ${meal.recipeTitle}`);
                      }}
                    >
                      <Icon name="close" size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <Link
                  href="/recipes?category=trang-mieng"
                  className="w-full py-4 rounded-xl border border-dashed border-outline-variant hover:border-primary flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
                >
                  <Icon name="add" size={18} />
                  <span>Chọn món tráng miệng hoặc trà chiều</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky Mobile Bottom Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 px-5 py-3 flex items-center gap-3">
        <button
          onClick={handleGenerateShopping}
          className="flex-1 py-3 rounded-xl bg-secondary text-on-secondary font-body-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          <Icon name="shopping_cart_checkout" size={20} />
          <span>Tạo danh sách đi chợ tuần</span>
        </button>
      </div>

      {/* Dynamic Toast */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-5 z-50 transition-all duration-300">
          <div className="p-3.5 rounded-xl bg-on-surface text-surface shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Icon name="check_circle" size={22} className="text-secondary-fixed" />
            <span className="font-body-sm text-body-sm text-surface font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
