"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { ShoppingListMobile } from "@/components/mobile/shopping-list-mobile";
import { useShoppingList } from "@/lib/context/shopping-list-context";
import { ShoppingItem } from "@/lib/types";

interface CategoryGroupConfig {
  id: string;
  category: ShoppingItem["category"];
  title: string;
  subtitle: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
}

const CATEGORY_GROUP_CONFIGS: CategoryGroupConfig[] = [
  {
    id: "veg",
    category: "rau-cu",
    title: "1. Rau củ, Quả & Nấm tươi",
    subtitle: "Khu vực mát, ưu tiên chọn đầu buổi sáng",
    icon: "nutrition",
    iconBgClass: "bg-secondary-fixed text-on-secondary-fixed",
    iconTextClass: "text-secondary",
  },
  {
    id: "meat",
    category: "thit-ca",
    title: "2. Thịt tươi sống & Thủy hải sản",
    subtitle: "Nên mua trong chuyến giữa tuần để giữ độ ngọt tươi",
    icon: "set_meal",
    iconBgClass: "bg-primary-fixed text-on-primary-fixed",
    iconTextClass: "text-primary",
  },
  {
    id: "seasoning",
    category: "gia-vi",
    title: "3. Gia vị truyền thống, Bún tươi & Đồ khô",
    subtitle: "Bảo quản lâu, có thể gom mua đầu tuần",
    icon: "soup_kitchen",
    iconBgClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    iconTextClass: "text-tertiary",
  },
  {
    id: "other",
    category: "khac",
    title: "4. Mục cá nhân tự thêm vào giỏ",
    subtitle: "Vật dụng bếp, đồ dùng gia đình cần mua kèm",
    icon: "post_add",
    iconBgClass: "bg-surface-container-highest text-on-surface",
    iconTextClass: "text-on-surface",
  },
];

export default function ShoppingListPage() {
  const {
    items,
    addItem,
    toggleCheck,
    removeItem,
    clearCompleted,
    totalCost,
    totalCount,
    checkedCount,
    progressPercent,
  } = useShoppingList();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Form states for quick add
  const [newItemName, setNewItemName] = React.useState("");
  const [newItemAmount, setNewItemAmount] = React.useState("");
  const [newItemCost, setNewItemCost] = React.useState("");
  const [newItemCategory, setNewItemCategory] = React.useState<ShoppingItem["category"]>("khac");
  const [newItemNote, setNewItemNote] = React.useState("");

  // Toast trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Build groups from context items grouped by category
  const groups = React.useMemo(() => {
    return CATEGORY_GROUP_CONFIGS.map((config) => ({
      ...config,
      items: items.filter((item) => item.category === config.category),
    }));
  }, [items]);

  // Budget calculations derived from context
  const paidCost = React.useMemo(
    () => items.filter((i) => i.checked).reduce((acc, curr) => acc + (curr.cost || 0), 0),
    [items]
  );
  const remainingCost = totalCost - paidCost;

  // Toggle checkbox
  const handleToggleItem = (_groupId: string, itemId: string) => {
    toggleCheck(itemId);
  };

  // Add item handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemAmount.trim()) return;

    addItem({
      name: newItemName.trim(),
      amount: newItemAmount.trim(),
      category: newItemCategory,
      cost: Number(newItemCost) || 0,
      subtext: newItemNote.trim() || undefined,
    });

    triggerToast(`Đã thêm "${newItemName}" vào danh sách mua sắm!`);
    setNewItemName("");
    setNewItemAmount("");
    setNewItemCost("");
    setNewItemNote("");
    setNewItemCategory("khac");
    setIsModalOpen(false);
  };

  // Share via Zalo / Clipboard
  const handleShareZalo = () => {
    const itemLines = items
      .filter((i) => !i.checked)
      .map((i) => `- ${i.name}: ${i.amount}`)
      .slice(0, 10);
    const remaining = items.filter((i) => !i.checked).length - itemLines.length;
    const textToCopy =
      `Danh sách đi chợ RecipeHub:\n${itemLines.join("\n")}` +
      (remaining > 0 ? `\n... và ${remaining} mục khác.` : "");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        triggerToast("Đã sao chép danh sách đi chợ! Hãy dán gửi qua Zalo.");
      })
      .catch(() => {
        triggerToast("Đã chuẩn bị nội dung chia sẻ Zalo.");
      });
  };

  // Clear completed
  const handleClearCompleted = () => {
    if (checkedCount > 0) {
      clearCompleted();
      triggerToast(`Đã xoá ${checkedCount} món đã mua để giỏ hàng gọn hơn!`);
    } else {
      triggerToast("Chưa có món nào được đánh dấu đã mua.");
    }
  };

  return (
    <>
    {/* ═══════ MOBILE LAYOUT ═══════ */}
    <div className="md:hidden">
      <ShoppingListMobile />
    </div>

    {/* ═══════ DESKTOP LAYOUT ═══════ */}
    <div className="hidden md:flex bg-background font-body-md text-body-md text-on-surface min-h-screen flex-col antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* BANNER CHẾ ĐỘ KHÁCH (Guest Mode Transparency Banner) */}
          <div className="w-full bg-surface-container-low border-b border-outline-variant/30 py-3 px-margin-mobile md:px-margin">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface">
              <div className="flex items-center gap-2.5">
                <Icon name="cloud_sync" className="text-secondary text-[22px] shrink-0" />
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Dữ liệu danh sách đi chợ đang được lưu trên trình duyệt này. Đăng nhập để đồng bộ sang điện thoại và chia sẻ cùng người thân.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm"
                >
                  <Icon name="sync_alt" className="text-[16px]" />
                  <span>Đăng nhập để đồng bộ</span>
                </Link>
              </div>
            </div>
          </div>

          {/* PHẦN THÂN TRANG DANH SÁCH MUA SẮM */}
          <div className="w-full px-margin-mobile md:px-margin py-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {/* TIÊU ĐỀ, NGUỒN GỐC & TIẾN ĐỘ TỔNG THỂ */}
              <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30 flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm">
                        <Icon name="event_repeat" className="text-[15px]" />
                        Kế hoạch tuần 18/03 - 24/03
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm">
                        <Icon name="groups" className="text-[15px]" />
                        Khẩu phần 4 người
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                        <Icon name="restaurant_menu" className="text-[15px]" />
                        18 món ăn đã lên lịch
                      </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                      Danh sách đi chợ thông minh
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Tự động cộng dồn số lượng nguyên liệu chuẩn xác từ thực đơn gia đình, phân luồng theo từng quầy hàng để bạn tiết kiệm thời gian nhất.
                    </p>
                  </div>

                  {/* Nhóm nút hành động nhanh */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-all shadow-sm active:scale-95 cursor-pointer"
                      type="button"
                    >
                      <Icon name="add_circle" className="text-[18px]" />
                      <span>Thêm món nhanh</span>
                    </button>
                    <button
                      onClick={handleShareZalo}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md border border-outline-variant/40 cursor-pointer"
                      type="button"
                    >
                      <Icon name="share" className="text-[18px] text-primary" />
                      <span>Gửi Zalo / Người thân</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md border border-outline-variant/40 cursor-pointer"
                      type="button"
                    >
                      <Icon name="print" className="text-[18px]" />
                      <span>In danh sách</span>
                    </button>
                    <button
                      onClick={handleClearCompleted}
                      title="Bỏ các món đã mua"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors font-body-md text-body-md border border-outline-variant/40 cursor-pointer"
                      type="button"
                    >
                      <Icon name="delete_sweep" className="text-[18px]" />
                      <span className="hidden sm:inline">Dọn món đã mua</span>
                    </button>
                  </div>
                </div>

                {/* Bảng tiến độ & kinh phí */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 items-center">
                  <div className="md:col-span-8 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="font-body-md text-body-md font-medium flex items-center gap-1.5">
                        <Icon name="checklist" className="text-secondary text-[20px]" />
                        Tiến độ đi chợ:{" "}
                        <span className="text-primary font-semibold font-label-mono-sm">
                          Đã gom {checkedCount} / {totalCount} mục ({progressPercent}%)
                        </span>
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                        {progressPercent}% Hoàn thành
                      </span>
                    </div>
                    {/* Thanh đo trực quan */}
                    <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3 pl-0 md:pl-4 md:border-l md:border-outline-variant/40">
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Tổng chi dự kiến</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold font-label-mono-lg">
                        ~{totalCost.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <Icon name="payments" className="text-tertiary-container text-[32px]" />
                  </div>
                </div>
              </section>

              {/* BỐ CỤC CHÍNH (8:4 chia theo Quầy hàng vs Sidebar) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* CỘT CHÍNH: CÁC QUẦY HÀNG ĐI CHỢ (Lg: Col 8) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {groups.map((group) => {
                    const visibleItems = group.items;
                    const groupCheckedCount = visibleItems.filter((i) => i.checked).length;
                    const groupTotal = visibleItems.length;

                    return (
                      <div
                        key={group.id}
                        className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30 overflow-hidden"
                      >
                        {/* Header quầy hàng */}
                        <div className="p-4 md:p-5 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${group.iconBgClass}`}
                            >
                              <Icon name={group.icon} className="text-[20px]" />
                            </div>
                            <div>
                              <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                                {group.title}
                              </h2>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {group.subtitle}
                              </p>
                            </div>
                          </div>
                          <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface">
                            {groupCheckedCount} / {groupTotal} mục đã mua
                          </span>
                        </div>

                        {/* Danh sách items của quầy */}
                        <div className="divide-y divide-outline-variant/15 p-2 md:p-3 flex flex-col">
                          {visibleItems.length === 0 ? (
                            <div className="p-4 text-center text-on-surface-variant font-body-sm">
                              Tất cả các món ở quầy này đã gom xong!
                            </div>
                          ) : (
                            visibleItems.map((item) => (
                              <div
                                key={item.id}
                                className={`item-row flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low/60 transition-colors ${
                                  item.checked ? "opacity-70" : ""
                                } ${item.mergedTag ? "bg-surface-container-low/20" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  onChange={() => handleToggleItem(group.id, item.id)}
                                  className="mt-1 w-5 h-5 rounded-md accent-secondary border-outline text-on-primary cursor-pointer shrink-0"
                                />
                                <div className="flex-1 flex flex-col gap-1">
                                  <div className="flex items-baseline justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-body-md text-body-md font-medium text-on-surface ${
                                          item.checked ? "line-through opacity-60" : ""
                                        }`}
                                      >
                                        {item.name}
                                      </span>
                                      {item.freshBadge && !item.checked && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[11px]">
                                          {item.freshBadge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-label-mono-sm text-label-mono-sm font-semibold text-on-surface ${
                                          item.checked ? "line-through opacity-60" : ""
                                        }`}
                                      >
                                        {item.amount}
                                      </span>
                                      {(item.cost ?? 0) > 0 && !item.checked && (
                                        <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold">
                                          ~{(item.cost ?? 0).toLocaleString("vi-VN")} đ
                                        </span>
                                      )}
                                      <button
                                        onClick={() => removeItem(item.id)}
                                        title="Xoá món này"
                                        className="ml-1 p-0.5 rounded text-on-surface-variant/50 hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                                        type="button"
                                      >
                                        <Icon name="close" className="text-[16px]" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Merged tag if present */}
                                  {item.mergedTag && (
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-mono-sm text-[11px]">
                                        <Icon name="merge" className="text-[13px]" />
                                        {item.mergedTag}
                                      </span>
                                    </div>
                                  )}

                                  {/* Subtext description */}
                                  {item.subtext && (
                                    <span
                                      className={`font-body-sm text-body-sm text-on-surface-variant ${
                                        item.checked ? "opacity-70" : ""
                                      }`}
                                    >
                                      {item.subtext}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CỘT PHỤ (SIDEBAR PHẢI ~360px - Lg: Col 4) */}
                <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
                  {/* THẺ 1: TỔNG QUAN KINH PHÍ ĐI CHỢ */}
                  <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                        <Icon name="account_balance_wallet" className="text-primary text-[20px]" />
                        Tổng quan ngân sách
                      </h3>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                        VND
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span>Tổng số nguyên liệu:</span>
                        <span className="font-label-mono-sm text-on-surface font-semibold">
                          {totalCount} mục
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-secondary">
                        <span className="flex items-center gap-1">
                          <Icon name="check_circle" className="text-[16px]" />
                          Số tiền đã mua:
                        </span>
                        <span className="font-label-mono-sm font-semibold">
                          {paidCost.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cần chi dự kiến:</span>
                        <span className="font-label-mono-sm text-primary font-semibold">
                          ~{remainingCost.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30 text-on-surface font-title-md text-title-md font-bold">
                        <span>Tổng chi trọn gói:</span>
                        <span className="text-primary font-label-mono-lg">
                          ~{totalCost.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2 border-t border-outline-variant/20 text-body-sm text-body-sm text-on-surface">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          defaultChecked
                          className="w-4 h-4 rounded accent-primary text-on-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span>Làm tròn giá đi chợ theo chục ngàn</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          defaultChecked
                          className="w-4 h-4 rounded accent-primary text-on-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span>Hiện gợi ý vị trí quầy chợ gần bạn</span>
                      </label>
                    </div>
                  </div>

                  {/* THẺ 2: CƠ CHẾ GỘP NGUYÊN LIỆU THÔNG MINH */}
                  <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 text-on-surface">
                      <Icon name="auto_awesome" className="text-secondary text-[22px]" />
                      <h3 className="font-title-md text-title-md font-semibold">Tính năng gộp thông minh</h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Hệ thống tự động rà soát và gộp định lượng các nguyên liệu trùng nhau từ 18 công thức trong tuần. Ví dụ:{" "}
                      <strong className="text-on-surface">Cà chua</strong> được gom thành{" "}
                      <strong className="text-on-surface">1.2kg</strong> để bạn mua một lượt ở quầy sỉ mà không bị mua lẻ nhiều lần gây hao phí.
                    </p>
                  </div>

                  {/* THẺ 3: LỊCH ĐI CHỢ ĐỀ XUẤT 2 CHUYẾN */}
                  <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30 flex flex-col gap-4">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                      <Icon name="calendar_month" className="text-primary text-[20px]" />
                      Lịch đi chợ gợi ý
                    </h3>
                    <div className="flex flex-col gap-3 font-body-sm text-body-sm">
                      {/* Chuyến 1 */}
                      <div className="p-3 rounded-xl bg-surface-container-low/70 flex flex-col gap-1 border border-secondary-fixed">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-on-surface flex items-center gap-1.5">
                            <Icon name="done_all" className="text-secondary text-[16px]" />
                            Chuyến 1: Đầu tuần (Thứ 2)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px]">
                            Đã hoàn tất
                          </span>
                        </div>
                        <p className="text-on-surface-variant">
                          Đã mua các món đồ khô, trứng vỉ, gia vị &amp; thịt bảo quản tủ đông (12 mục).
                        </p>
                      </div>

                      {/* Chuyến 2 */}
                      <div className="p-3 rounded-xl bg-surface-container-low/70 flex flex-col gap-1 border border-primary-fixed">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-on-surface flex items-center gap-1.5">
                            <Icon name="schedule" className="text-primary text-[16px]" />
                            Chuyến 2: Giữa tuần (Thứ 4 &amp; 6)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-[11px]">
                            Cần đi chợ
                          </span>
                        </div>
                        <p className="text-on-surface-variant">
                          Cá lóc sống, rau muống non, nấm rơm và bún tươi lấy trong ngày (12 mục).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* THẺ 4: CÔNG THỨC NGUỒN CỦA TUẦN (Quick Recipes Link) */}
                  <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30 flex flex-col gap-3">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                      <Icon name="menu_book" className="text-tertiary text-[20px]" />
                      Món ngon tuần này
                    </h3>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/recipes/ca-loc-kho-to"
                        className="p-2.5 rounded-xl hover:bg-surface-container-low flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                            <Icon name="dinner_dining" className="text-[18px]" />
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                              Cá lóc kho tộ Bến Tre
                            </h4>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Bữa tối Thứ 4
                            </span>
                          </div>
                        </div>
                        <Icon
                          name="chevron_right"
                          className="text-on-surface-variant group-hover:text-primary text-[18px]"
                        />
                      </Link>

                      <Link
                        href="/recipes/canh-suon-sau"
                        className="p-2.5 rounded-xl hover:bg-surface-container-low flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                            <Icon name="soup_kitchen" className="text-[18px]" />
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                              Canh sườn non nấu sấu
                            </h4>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Bữa trưa Thứ 3
                            </span>
                          </div>
                        </div>
                        <Icon
                          name="chevron_right"
                          className="text-on-surface-variant group-hover:text-primary text-[18px]"
                        />
                      </Link>

                      <Link
                        href="/recipes/bun-moc-suon-chua"
                        className="p-2.5 rounded-xl hover:bg-surface-container-low flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                            <Icon name="ramen_dining" className="text-[18px]" />
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                              Bún mọc nấm sườn chua
                            </h4>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Bữa sáng Thứ 6
                            </span>
                          </div>
                        </div>
                        <Icon
                          name="chevron_right"
                          className="text-on-surface-variant group-hover:text-primary text-[18px]"
                        />
                      </Link>

                      <Link
                        href="/recipes/bo-sot-vang"
                        className="p-2.5 rounded-xl hover:bg-surface-container-low flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                            <Icon name="skillet" className="text-[18px]" />
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                              Bò sốt vang bánh mì
                            </h4>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Bữa tối Chủ Nhật
                            </span>
                          </div>
                        </div>
                        <Icon
                          name="chevron_right"
                          className="text-on-surface-variant group-hover:text-primary text-[18px]"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL / POPUP THÊM NHANH NGUYÊN LIỆU */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-[0_32px_64px_-16px_rgba(28,25,23,0.15)] border border-outline-variant/40 overflow-hidden flex flex-col">
                <div className="p-5 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <Icon name="playlist_add" className="text-primary text-[22px]" />
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      Thêm món vào danh sách đi chợ
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    type="button"
                  >
                    <Icon name="close" className="text-[20px]" />
                  </button>
                </div>

                <form onSubmit={handleAddItem} className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="item-name-input">
                      Tên nguyên liệu hoặc vật phẩm *
                    </label>
                    <input
                      id="item-name-input"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Ví dụ: Nước mắm Phú Quốc, Gừng tươi..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50"
                      type="text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="item-amount-input">
                        Định lượng *
                      </label>
                      <input
                        id="item-amount-input"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(e.target.value)}
                        placeholder="Ví dụ: 500g, 2 chai, 1 bó"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="item-cost-input">
                        Giá ước tính (đ)
                      </label>
                      <input
                        id="item-cost-input"
                        value={newItemCost}
                        onChange={(e) => setNewItemCost(e.target.value)}
                        placeholder="Ví dụ: 35000"
                        step="1000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="item-category-select">
                      Quầy hàng chợ / siêu thị
                    </label>
                    <select
                      id="item-category-select"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as ShoppingItem["category"])}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface"
                    >
                      <option value="rau-cu">1. Rau củ, Quả &amp; Nấm tươi</option>
                      <option value="thit-ca">2. Thịt tươi sống &amp; Thủy hải sản</option>
                      <option value="gia-vi">3. Gia vị truyền thống, Bún tươi &amp; Đồ khô</option>
                      <option value="khac">4. Mục cá nhân tự thêm vào giỏ</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="item-note-input">
                      Ghi chú nguồn món hoặc yêu cầu đi chợ
                    </label>
                    <input
                      id="item-note-input"
                      value={newItemNote}
                      onChange={(e) => setNewItemNote(e.target.value)}
                      placeholder="Ví dụ: Mua loại còn tươi cứng, chọn quả nhỏ..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50"
                      type="text"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-body-md text-body-md cursor-pointer"
                      type="button"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-body-md text-body-md font-medium shadow-sm cursor-pointer"
                    >
                      Thêm vào danh sách
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TOAST THÔNG BÁO TƯƠNG TÁC */}
          <div
            className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${
              toastMessage ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-on-surface text-on-primary shadow-xl">
              <Icon name="check_circle" className="text-secondary-fixed text-[20px]" />
              <span className="font-body-sm text-body-sm">{toastMessage}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
