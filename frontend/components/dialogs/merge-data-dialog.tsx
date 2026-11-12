"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export interface MergeDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMerge: () => void;
  onSkip: () => void;
  userName?: string;
  stats?: {
    favoritesCount: number;
    mealPlansCount: number;
    shoppingItemsCount: number;
  };
}

export function MergeDataDialog({
  isOpen,
  onClose,
  onMerge,
  onSkip,
  userName = "Bếp Mẹ Ba",
  stats = {
    favoritesCount: 12,
    mealPlansCount: 1,
    shoppingItemsCount: 18,
  },
}: MergeDataDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal overflow-y-auto bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 transition-opacity">
      <div className="relative w-full max-w-4xl my-auto bg-surface-container-lowest rounded-3xl shadow-modal overflow-hidden flex flex-col transition-all duration-300 border border-outline-variant/40 animate-in fade-in zoom-in-95">
        {/* Header Section */}
        <div className="px-6 sm:px-8 pt-7 pb-6 bg-surface-container-low flex flex-col gap-3 relative border-b border-outline-variant/20">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold tracking-wide uppercase">
              <Icon name="sync_saved_locally" size={16} />
              <span>Phát hiện dữ liệu tồn tại trên trình duyệt</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng hộp thoại"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pr-8">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
              Gộp dữ liệu nấu nướng vào tài khoản của bạn?
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
              Chào mừng <span className="font-semibold text-on-surface">{userName}</span>! Trước khi đăng nhập,
              bạn đã lưu một số món ăn, thực đơn và nguyên liệu đi chợ trên thiết bị này (
              <span className="font-mono text-label-mono-sm bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface font-medium">
                LocalStorage
              </span>
              ). Bạn có muốn đồng bộ toàn bộ dữ liệu này vào tài khoản đám mây để sử dụng trên điện thoại và máy tính khác không?
            </p>
          </div>
        </div>

        {/* Main Content: 3 Dynamic Data Summary Cards */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-title-md text-title-md font-semibold text-on-surface flex items-center gap-2">
              <Icon name="inventory_2" size={20} className="text-primary" />
              Chi tiết dữ liệu máy khách sẵn sàng gộp
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              Gộp an toàn, không trùng lặp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Favorites */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <Icon name="favorite" size={20} />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
                  {stats.favoritesCount} Món
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  Món ăn yêu thích
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Bao gồm Phở bò tái lăn, Bún chả than hoa và các món bạn đã thả tim.
                </p>
              </div>
            </div>

            {/* Card 2: Meal Plan */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <Icon name="calendar_today" size={20} />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                  {stats.mealPlansCount} Thực đơn
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  Kế hoạch bữa ăn
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Lịch trình 7 ngày đang soạn dở cùng phân bổ bữa sáng, trưa và tối.
                </p>
              </div>
            </div>

            {/* Card 3: Shopping List */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <Icon name="shopping_cart" size={20} />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-mono-sm text-label-mono-sm font-semibold">
                  {stats.shoppingItemsCount} Mục
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  Danh sách đi chợ
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Danh sách nguyên liệu đã tổng hợp cùng các mục đã đánh dấu mua xong.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center sm:text-left">
            Sau khi gộp, bạn có thể truy cập dữ liệu trên mọi thiết bị khi đăng nhập.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="flex-1 sm:flex-none justify-center"
            >
              Bỏ qua &amp; Dùng dữ liệu đám mây
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onMerge}
              className="flex-1 sm:flex-none justify-center gap-1.5 shadow-sm"
            >
              <Icon name="merge" size={18} />
              <span>Gộp dữ liệu ngay</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
