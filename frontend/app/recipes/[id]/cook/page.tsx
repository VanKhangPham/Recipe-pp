"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import type { Recipe } from "@/lib/types";
import { planningRequest, isCloudRecipe } from "@/lib/services/planning-api";
import { mapBackendToRecipe, recipeService, type BackendRecipeDetail } from "@/lib/services/recipe-service";
import { useAuth } from "@/lib/context/auth-context";


function CookingModeContent({ recipe }: { recipe: Recipe }) {

  const recipeId = recipe.id;

  // Map recipe.steps to the shape expected by the UI
  const steps = recipe.steps.map((step) => ({
    stepNumber: step.number,
    title: step.title,
    duration: step.durationMinutes >= 60
      ? `${Math.floor(step.durationMinutes / 60)} giờ ${step.durationMinutes % 60} phút`
      : `${step.durationMinutes} phút`,
    defaultSeconds: step.durationMinutes * 60,
    description: step.description,
    chefTip: step.chefTip || "",
    ingredients: step.ingredients || [],
    image: step.image || recipe.image,
    visualStatus: "",
    visualNote: "",
  }));

  // Build the full ingredients list from recipe.ingredients
  const allIngredientsFullList = recipe.ingredients.map((ing) => ({
    name: ing.name,
    note: ing.note || "",
    qty: `${ing.amount} ${ing.unit}`,
  }));

  // Current Step Index (0-based)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const currentStep = steps[currentStepIndex];

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Sound active state
  const [isSoundActive, setIsSoundActive] = React.useState(true);

  // Timer state for current step
  const [secondsLeft, setSecondsLeft] = React.useState(steps[0]?.defaultSeconds ?? 0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(true);

  // Checked ingredients for the step
  const [checkedIngredients, setCheckedIngredients] = React.useState<{ [key: string]: boolean }>({});

  // Toast
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Timer countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      const timer = window.setTimeout(() => {
        setIsTimerRunning(false);
        showToast("Chuông báo: Hết giờ bước nấu!");
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsLeft]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const navStep = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < steps.length) {
      setCurrentStepIndex(newIndex);
      setSecondsLeft(steps[newIndex].defaultSeconds);
      setIsTimerRunning(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-surface text-on-surface font-body-md text-body-md select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Icon name="notifications" size={18} className="text-secondary-fixed" />
          <span className="font-body-sm text-body-sm">{toastMsg}</span>
        </div>
      )}

      {/* Top Control Bar (Sticky & Distraction-Free) */}
      <header className="sticky top-0 z-30 w-full bg-surface-container-lowest/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Exit Cooking Mode */}
          <Link
            href={`/recipes/${recipeId}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
          >
            <Icon name="arrow_back" size={20} className="text-primary" />
            <span className="font-body-md text-body-sm font-medium hidden sm:inline">Thoát chế độ nấu</span>
          </Link>

          {/* Center: Recipe Title & Current Step Breadcrumb */}
          <div className="flex flex-col items-center text-center min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary">
                Đang nấu rảnh tay
              </span>
            </div>
            <h1 className="font-headline-sm text-body-md sm:text-headline-sm font-semibold text-on-surface truncate max-w-md">
              {recipe.title}
            </h1>
          </div>

          {/* Right: Functional Kitchen Indicators & Quick Triggers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Always-On Screen Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-secondary text-body-sm">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface">Màn hình luôn sáng</span>
            </div>

            {/* Voice Control Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-body-sm">
              <Icon name="mic" size={18} className="text-primary" />
              <span className="font-label-mono-sm text-label-mono-sm font-medium">Giọng nói: Sẵn sàng</span>
            </div>

            {/* Audio Alarm Toggle */}
            <button
              type="button"
              id="btnSoundToggle"
              aria-label="Bật/Tắt chuông báo"
              onClick={() => {
                const next = !isSoundActive;
                setIsSoundActive(next);
                showToast(next ? "Đã bật chuông báo hẹn giờ" : "Đã tắt chuông báo");
              }}
              className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
            >
              <Icon name={isSoundActive ? "notifications_active" : "notifications_off"} size={20} />
            </button>

            {/* Quick Ingredient Peek Trigger */}
            <button
              type="button"
              id="btnDrawerOpen"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-outline-variant/30 text-on-surface transition-colors cursor-pointer"
            >
              <Icon name="kitchen" size={20} className="text-primary" />
              <span className="font-body-md text-body-sm font-medium hidden sm:inline">Nguyên liệu</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm">
                {allIngredientsFullList.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Stand-at-Stove Cooking Canvas */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-36 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Instruction & Stove Distance Ergonomics (Col 7) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            {/* Step Title Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-mono-sm text-label-mono-sm font-semibold tracking-wide">
                  BƯỚC {currentStep.stepNumber} / {steps.length}
                </span>
                <div className="flex items-center gap-1 text-tertiary">
                  <Icon name="timer" size={18} />
                  <span className="font-label-mono-sm text-label-mono-sm">Thời lượng: {currentStep.duration}</span>
                </div>
              </div>

              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">{currentStep.title}</h2>

              {/* Large High-Legibility Instruction Text */}
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
                {currentStep.description}
              </p>

              {/* Critical Chef Safety / Technique Alert Box */}
              {currentStep.chefTip && (
                <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="lightbulb" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-title-md text-body-md font-semibold text-primary mb-1">Mẹo đầu bếp đứng bếp</p>
                    <p className="font-body-md text-body-sm text-on-surface-variant leading-relaxed">
                      {currentStep.chefTip}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step Required Ingredients Checklist */}
            {currentStep.ingredients.length > 0 && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-title-md text-title-md font-semibold text-on-surface flex items-center gap-2">
                    <Icon name="fact_check" size={20} className="text-primary" />
                    <span>Nguyên liệu cho bước này</span>
                  </h3>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                    {currentStep.ingredients.length} mục cần dùng
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="stepIngredientsList">
                  {currentStep.ingredients.map((item) => {
                    const isChecked = Boolean(checkedIngredients[item.name]);
                    return (
                      <label
                        key={item.name}
                        className="group flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setCheckedIngredients((prev) => ({
                              ...prev,
                              [item.name]: !prev[item.name],
                            }))
                          }
                          className="w-5 h-5 rounded accent-secondary cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md font-medium text-on-surface">{item.name}</span>
                          {item.note && (
                            <span className="font-body-sm text-body-sm text-tertiary">{item.note}</span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: Interactive High-Contrast Kitchen Timer & Media (Col 5) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            {/* Giant Interactive Timer Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col items-center text-center">
              <div className="w-full flex items-center justify-between mb-3">
                <span className="font-title-md text-title-md font-semibold text-on-surface flex items-center gap-2">
                  <Icon name="hourglass_top" size={20} className="text-primary" />
                  <span>Bộ hẹn giờ kho cá</span>
                </span>
                {/* Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-mono-sm text-label-mono-sm font-semibold">
                  <span className={`w-2 h-2 rounded-full bg-secondary ${isTimerRunning ? "animate-ping" : ""}`} />
                  <span>{isTimerRunning ? "Đang đếm ngược" : "Đã tạm dừng"}</span>
                </span>
              </div>

              {/* Context Subtitle */}
              <p className="font-body-sm text-body-sm text-tertiary mb-4">
                Kho liu riu lửa nhỏ • Âm báo vang to khi hết giờ
              </p>

              {/* Digital Clock Display */}
              <div className="w-full bg-surface-container-low py-6 rounded-2xl flex flex-col items-center justify-center my-2 shadow-inner">
                <div
                  className="font-label-mono-lg text-[64px] sm:text-[76px] tracking-tight font-bold text-on-surface leading-none select-none"
                  id="timerDisplay"
                >
                  {formatTimer(secondsLeft)}
                </div>
                <div className="flex items-center gap-2 mt-3 text-secondary">
                  <Icon name="volume_up" size={16} />
                  <span className="font-label-mono-sm text-label-mono-sm">Âm lượng chuông: 100%</span>
                </div>
              </div>

              {/* Quick Timer Action Controls */}
              <div className="grid grid-cols-4 gap-2 w-full mt-4">
                <button
                  type="button"
                  id="btnToggleTimer"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="col-span-2 py-3 px-4 rounded-xl bg-primary text-on-primary font-body-md font-semibold hover:bg-primary-container active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Icon name={isTimerRunning ? "pause" : "play_arrow"} size={20} id="timerIcon" />
                  <span id="timerActionText">{isTimerRunning ? "Tạm dừng" : "Tiếp tục"}</span>
                </button>
                <button
                  type="button"
                  id="btnAdd1m"
                  onClick={() => setSecondsLeft((prev) => prev + 60)}
                  className="py-3 px-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm font-semibold transition-colors cursor-pointer"
                >
                  +1 phút
                </button>
                <button
                  type="button"
                  id="btnAdd5m"
                  onClick={() => setSecondsLeft((prev) => prev + 300)}
                  className="py-3 px-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm font-semibold transition-colors cursor-pointer"
                >
                  +5 phút
                </button>
              </div>

              <div className="w-full flex justify-end mt-3">
                <button
                  type="button"
                  id="btnResetTimer"
                  onClick={() => {
                    setSecondsLeft(currentStep.defaultSeconds);
                    setIsTimerRunning(true);
                  }}
                  className="inline-flex items-center gap-1 font-body-sm text-body-sm text-tertiary hover:text-on-surface transition-colors py-1 px-2 cursor-pointer"
                >
                  <Icon name="replay" size={16} />
                  <span>Đặt lại {formatTimer(currentStep.defaultSeconds)}</span>
                </button>
              </div>
            </div>

            {/* Step Real-time Visual Demonstration Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col">
              <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-surface-container">
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                {currentStep.visualStatus && (
                  <div className="absolute bottom-3 left-3 bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface px-3 py-1.5 rounded-lg flex items-center gap-2 font-label-mono-sm text-label-mono-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span>{currentStep.visualStatus}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => showToast(currentStep.visualNote || currentStep.title)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-surface-container-lowest/85 backdrop-blur-sm flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors shadow-sm cursor-pointer"
                >
                  <Icon name="zoom_in" size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="font-body-sm text-body-sm text-on-surface-variant">{currentStep.visualNote || currentStep.title}</span>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Hình ảnh thực tế</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Persistent Full-Width Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* Top Section of Footer: 5-Step Segmented Progress Bar */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurr = idx === currentStepIndex;
              return (
                <div
                  key={st.stepNumber}
                  onClick={() => navStep(idx)}
                  className="flex-1 flex flex-col gap-1 cursor-pointer"
                >
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPast
                        ? "bg-secondary"
                        : isCurr
                        ? "bg-primary relative overflow-hidden"
                        : "bg-surface-container-high"
                    }`}
                  >
                    {isCurr && <div className="absolute inset-0 bg-primary-fixed/40 animate-pulse" />}
                  </div>
                  <span
                    className={`font-label-mono-sm text-[11px] font-medium hidden sm:inline truncate ${
                      isPast
                        ? "text-secondary"
                        : isCurr
                        ? "text-primary font-bold"
                        : "text-tertiary"
                    }`}
                  >
                    {st.stepNumber}. {st.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Previous Step */}
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => navStep(currentStepIndex - 1)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-body-md text-body-sm font-medium transition-colors shrink-0 ${
                currentStepIndex === 0
                  ? "bg-surface-container/50 text-tertiary cursor-not-allowed opacity-50"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
              }`}
            >
              <Icon name="arrow_back_ios" size={16} />
              <span className="hidden md:inline">
                {currentStepIndex > 0 ? `Bước ${currentStepIndex}: ${steps[currentStepIndex - 1].title}` : "Bắt đầu"}
              </span>
              <span className="md:hidden">Bước trước</span>
            </button>

            {/* Voice Prompt Assistant Pill (Middle) */}
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-tertiary text-body-sm">
              <Icon name="mic" size={18} className="text-primary" />
              <span>
                Nói <strong className="text-on-surface">&ldquo;Tiếp tục&rdquo;</strong> hoặc{" "}
                <strong className="text-on-surface">&ldquo;Hẹn giờ&rdquo;</strong> để điều khiển rảnh tay
              </span>
            </div>

            {/* Center Mobile Complete Button / Next Action */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  showToast(`Đã đánh dấu hoàn thành bước ${currentStep.stepNumber}!`);
                  if (currentStepIndex < steps.length - 1) {
                    navStep(currentStepIndex + 1);
                  }
                }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-outline-variant/30 text-on-surface font-body-md text-body-sm font-medium transition-colors cursor-pointer"
              >
                <Icon name="check_circle" size={18} className="text-secondary" />
                <span>Đã hoàn thành bước</span>
              </button>

              {/* Next Step */}
              {currentStepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => navStep(currentStepIndex + 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-sm font-semibold active:scale-98 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <span className="hidden md:inline">
                    Bước {currentStepIndex + 2}: {steps[currentStepIndex + 1].title}
                  </span>
                  <span className="md:hidden">Bước tiếp theo</span>
                  <Icon name="arrow_forward_ios" size={16} />
                </button>
              ) : (
                <Link
                  href={`/recipes/${recipeId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-body-md text-body-sm font-semibold active:scale-98 transition-all shadow-sm shrink-0"
                >
                  <span>Hoàn thành món ăn</span>
                  <Icon name="check" size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-Over Quick Peek Drawer: Full Recipe Ingredients List */}
      <aside
        id="ingredientsDrawer"
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface-container-lowest shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon name="format_list_bulleted" size={22} className="text-primary" />
            <h3 className="font-headline-sm text-title-md font-semibold text-on-surface">Tất cả nguyên liệu</h3>
          </div>
          <button
            type="button"
            id="btnDrawerClose"
            aria-label="Đóng ngăn kéo"
            onClick={() => setIsDrawerOpen(false)}
            className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Drawer Content Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-surface-container text-body-sm text-on-surface-variant flex items-center gap-2.5">
            <Icon name="soup_kitchen" size={18} className="text-primary" />
            <span>Định lượng chuẩn cho khẩu phần {recipe.servings} người ăn gia đình</span>
          </div>

          <div className="space-y-2.5">
            {allIngredientsFullList.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                <div className="flex flex-col">
                  <span className="font-body-md font-medium text-on-surface">{item.name}</span>
                  <span className="font-body-sm text-body-sm text-tertiary">{item.note}</span>
                </div>
                <span className="font-label-mono-sm font-semibold text-primary">{item.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer Close CTA */}
        <div className="p-4 bg-surface-container-low">
          <button
            type="button"
            id="btnDrawerCloseBottom"
            onClick={() => setIsDrawerOpen(false)}
            className="w-full py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md font-medium transition-colors cursor-pointer"
          >
            Đóng ngăn kéo nguyên liệu
          </button>
        </div>
      </aside>

      {/* Overlay Backdrop for Drawer */}
      {isDrawerOpen && (
        <div
          id="drawerBackdrop"
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-xs transition-opacity"
        />
      )}
    </div>
  );
}

export default function CookingModePage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[100dvh] bg-inverse-surface flex items-center justify-center">
        <div className="text-inverse-on-surface font-headline-sm text-headline-sm animate-pulse">Đang tải chế độ nấu...</div>
      </div>
    }>
      <CookingModeLoader />
    </React.Suspense>
  );
}

function CookingModeLoader() {
  const { id } = useParams<{ id: string }>();
  const { user, isRestoringSession } = useAuth();
  if (isRestoringSession) return <p role="status" className="p-6">Đang kiểm tra phiên đăng nhập…</p>;
  return <CookingModeRequest key={id + ":" + (user?.id ?? "guest")} id={id} />;
}
function CookingModeRequest({ id }: { id: string }) {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [error, setError] = React.useState("");
  const [revision, setRevision] = React.useState(0);
  React.useEffect(() => {
    const controller = new AbortController();
    async function loadRecipe() {
      if (!isCloudRecipe(id)) return (await recipeService.getRecipeById(id)).data;
      const detail = await planningRequest<BackendRecipeDetail>("recipes/" + encodeURIComponent(id), { signal: controller.signal });
      return mapBackendToRecipe(detail.summary, detail);
    }
    loadRecipe().then((loaded) => {
      if (controller.signal.aborted) return;
      if (!loaded) { setError("Không tìm thấy công thức này."); return; }
      if (!loaded.steps.length) { setError("Công thức chưa có bước nấu."); return; }
      setRecipe(loaded);
    }).catch(() => {
      if (!controller.signal.aborted) setError("Không tải được công thức. Kiểm tra kết nối và quyền xem công thức.");
    });
    return () => controller.abort();
  }, [id, revision]);
  if (recipe) return <CookingModeContent recipe={recipe} />;
  return <main className="space-y-4 p-6">
    <p role={error ? "alert" : "status"}>{error || "Đang tải công thức…"}</p>
    {error && <button className="rounded border p-3" onClick={() => { setError(""); setRevision((value) => value + 1); }}>Thử lại</button>}
    <Link className="ml-4 underline" href={"/recipes/" + id}>Về công thức</Link>
  </main>;
}
