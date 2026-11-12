"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useShoppingList } from "@/lib/context/shopping-list-context";

interface MobileStallConfig {
  id: string;
  category: "rau-cu" | "thit-ca" | "gia-vi" | "khac";
  title: string;
  badge: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const STALL_CONFIGS: MobileStallConfig[] = [
  {
    id: "stall-veg",
    category: "rau-cu",
    title: "Quầy Rau củ & Thảo mộc",
    badge: "Tươi sạch",
    icon: "psychiatry",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-secondary",
  },
  {
    id: "stall-meat",
    category: "thit-ca",
    title: "Quầy Thịt, Cá & Thủy hải sản",
    badge: "Đạm tươi",
    icon: "set_meal",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    id: "stall-spice",
    category: "gia-vi",
    title: "Quầy Gia vị & Đồ khô",
    badge: "Gia vị chuẩn",
    icon: "grain",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-fixed-variant",
  },
  {
    id: "stall-other",
    category: "khac",
    title: "Mục Tự thêm / Khác",
    badge: "Tiện ích",
    icon: "post_add",
    iconBg: "bg-surface-container-highest",
    iconColor: "text-on-surface",
  },
];

export function ShoppingListMobile() {
  const {
    items,
    addItem,
    toggleCheck,
    clearCompleted,
    totalCount,
    checkedCount,
    progressPercent,
    keepScreenOn,
    toggleKeepScreenOn,
  } = useShoppingList();

  const [quickAddVal, setQuickAddVal] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Build stalls from real context items
  const stalls = React.useMemo(() => {
    return STALL_CONFIGS.map((config) => {
      const stallItems = items.filter((item) => item.category === config.category);
      return {
        ...config,
        items: stallItems,
      };
    }).filter((s) => s.items.length > 0);
  }, [items]);

  // Quick Add Item
  const handleQuickAdd = () => {
    if (!quickAddVal.trim()) return;
    addItem({
      name: quickAddVal.trim(),
      amount: "1 phần",
      category: "khac",
    });
    showToast(`Đã thêm "${quickAddVal.trim()}" vào giỏ`);
    setQuickAddVal("");
  };

  // Share via Clipboard
  const handleShare = () => {
    const listText = items
      .filter((i) => !i.checked)
      .map((i) => `• ${i.name} (${i.amount})`)
      .join("\n");
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`Danh sách đi chợ RecipeHub:\n${listText}`);
      showToast("Đã sao chép danh sách để gửi Zalo / Tin nhắn!");
    }
  };

  const handleClearDone = () => {
    clearCompleted();
    showToast("Đã dọn sạch các món đã mua");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* ── Mobile Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(40,25,18,0.04)] pt-safe">
        <div className="h-16 px-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <Icon name="shopping_basket" size={20} />
            </div>
            <span className="font-headline-sm text-headline-sm tracking-tight text-primary font-bold">
              RecipeHub
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Tìm kiếm"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary active:scale-95 transition-transform cursor-pointer"
              type="button"
            >
              <Icon name="search" size={22} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* Top Title & Screen-On Toggle */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
                Đi Chợ Thông Minh
              </h1>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Phân loại theo tuyến quầy hàng tiện lợi
              </span>
            </div>
            {/* Toggle Always-On Display */}
            <button
              aria-label="Bật/Tắt giữ sáng màn hình"
              className={`h-9 px-2.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${
                keepScreenOn
                  ? "bg-secondary-fixed text-on-secondary-fixed"
                  : "bg-surface-container text-on-surface-variant"
              }`}
              type="button"
              onClick={async () => {
                const next = await toggleKeepScreenOn();
                showToast(next ? "Đã bật: Màn hình luôn sáng" : "Đã tắt màn hình luôn sáng");
              }}
            >
              <Icon name="wb_incandescent" size={16} />
              <span className="font-label-mono-sm text-[11px] font-medium">Luôn sáng</span>
            </button>
          </div>

          {/* Progress Banner Bento */}
          <div className="px-5 mt-2">
            <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md font-semibold text-on-surface">
                  Tiến độ thu gom
                </span>
                <span className="font-label-mono-lg text-label-mono-lg font-bold text-secondary">
                  {checkedCount} / {totalCount} món ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick-Add Input & Action Tools */}
          <div className="px-5 mt-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Thêm nhanh: hành lá, ớt hiểm, đường..."
                  type="text"
                  value={quickAddVal}
                  onChange={(e) => setQuickAddVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleQuickAdd();
                    }
                  }}
                />
                <button
                  aria-label="Thêm món"
                  className="absolute right-1.5 top-1.5 w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                  type="button"
                  onClick={handleQuickAdd}
                >
                  <Icon name="add" size={20} />
                </button>
              </div>
              <button
                className="h-11 px-3 bg-surface-container-lowest rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-transform shadow-sm min-w-[44px] cursor-pointer"
                title="Chia sẻ danh sách qua Zalo/Tin nhắn"
                type="button"
                onClick={handleShare}
              >
                <Icon name="share" size={20} />
              </button>
              <button
                className="h-11 px-3 bg-surface-container-lowest rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error active:scale-95 transition-transform shadow-sm min-w-[44px] cursor-pointer"
                title="Xóa các mục đã tích mua"
                type="button"
                onClick={handleClearDone}
              >
                <Icon name="delete_sweep" size={20} />
              </button>
            </div>
          </div>

          {/* Grouped Stalls / Quầy Hàng Section */}
          <div className="px-5 flex flex-col gap-4 py-2 mb-20 mt-2">
            {stalls.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest rounded-2xl flex flex-col items-center gap-2 shadow-sm">
                <Icon name="shopping_cart" size={32} className="text-on-surface-variant" />
                <span className="font-title-md text-on-surface font-semibold">Giỏ đi chợ trống</span>
                <p className="font-body-sm text-on-surface-variant text-center">
                  Nhấn vào công thức hoặc thực đơn tuần để gom nguyên liệu tự động.
                </p>
                <Link
                  href="/recipes"
                  className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm font-semibold"
                >
                  Khám phá công thức
                </Link>
              </div>
            ) : (
              stalls.map((stall) => {
                const stallChecked = stall.items.filter((i) => i.checked).length;
                return (
                  <div
                    key={stall.id}
                    className="stall-card bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${stall.iconBg} flex items-center justify-center ${stall.iconColor}`}
                        >
                          <Icon name={stall.icon} size={19} />
                        </div>
                        <div>
                          <h2 className="font-title-md text-on-surface font-semibold text-[15px] leading-tight">
                            {stall.title}
                          </h2>
                          <span className="stall-badge font-label-mono-sm text-[11px] text-on-surface-variant">
                            Đã mua {stallChecked} / {stall.items.length} món
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full ${stall.iconBg} ${stall.iconColor} font-label-mono-sm text-[10px]`}
                      >
                        {stall.badge}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      {stall.items.map((item) => (
                        <label
                          key={item.id}
                          className="item-row min-h-[44px] py-1.5 flex items-center justify-between gap-3 cursor-pointer select-none group"
                          onClick={() => toggleCheck(item.id)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              checked={item.checked}
                              readOnly
                              className="shopping-item sr-only"
                              type="checkbox"
                            />
                            <div
                              className={`checkbox-visual w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                item.checked
                                  ? "bg-secondary text-on-primary"
                                  : "bg-surface-container-high text-transparent group-active:scale-95"
                              }`}
                            >
                              <Icon name="check" size={16} />
                            </div>
                            <span
                              className={`item-title font-body-md text-[14px] truncate transition-all ${
                                item.checked
                                  ? "text-on-surface-variant line-through opacity-60"
                                  : "text-on-surface font-medium"
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <span
                            className={`item-qty font-label-mono-sm text-[12px] shrink-0 text-right ${
                              item.checked ? "text-on-surface-variant opacity-60" : "text-primary font-medium"
                            }`}
                          >
                            {item.amount}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Sticky Action Button */}
          <div className="fixed bottom-20 left-0 right-0 z-40 px-5 flex justify-center pointer-events-none">
            <button
              className="pointer-events-auto h-12 w-full max-w-sm rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center gap-2 font-body-md font-semibold text-[15px] active:scale-[0.98] transition-transform cursor-pointer"
              type="button"
              onClick={() => showToast("Đã hoàn thành chuyến đi chợ! Tuyệt vời!")}
            >
              <Icon name="task_alt" size={20} />
              <span>Hoàn thành đi chợ</span>
            </button>
          </div>
        </div>
      </main>

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
