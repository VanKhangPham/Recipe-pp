"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

export default function DataMergeDialogPage() {
  const [checkRecipes, setCheckRecipes] = React.useState(true);
  const [checkMealPlan, setCheckMealPlan] = React.useState(true);
  const [checkShoppingList, setCheckShoppingList] = React.useState(true);
  const [mergeStrategy, setMergeStrategy] = React.useState<"merge" | "overwrite">("merge");

  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  const selectedCount = [checkRecipes, checkMealPlan, checkShoppingList].filter(Boolean).length;

  const getCtaLabel = () => {
    const parts: string[] = [];
    if (checkRecipes) parts.push("5 món");
    if (checkMealPlan) parts.push("1 kế hoạch");
    if (checkShoppingList) parts.push("1 giỏ chợ");

    if (parts.length === 0) {
      return "Vui lòng chọn ít nhất 1 mục để gộp";
    }
    return `Đồng ý Gộp vào tài khoản (${parts.join(", ")})`;
  };

  const handleConfirmMerge = () => {
    if (selectedCount === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsModalOpen(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 8000);
    }, 650);
  };

  const handleUndo = () => {
    setShowToast(false);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-background flex-1 flex flex-col relative">
        <div className="flex flex-col w-full relative">
          {/* Backdrop Simulated Ambient Workspace (RecipeHub Kitchen Dashboard) */}
          <div className="w-full px-gutter py-space-xl grid grid-cols-12 gap-gutter opacity-35 select-none pointer-events-none filter blur-[2px]">
            {/* Hero / Stats Bar */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-space-md">
              <div className="bg-surface-container p-space-lg rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-wider">
                    Không gian bếp cá nhân
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Xin chào, Bếp Mẹ Ba</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Hôm nay bạn muốn chuẩn bị bữa trưa canh ngọt thịt mềm cho gia đình?
                  </p>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary">
                  <Icon name="soup_kitchen" size={44} />
                </div>
              </div>
              {/* Meal Schedule Grid Demo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Bữa trưa hôm nay</span>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm">
                      3 Món nấu
                    </span>
                  </div>
                  <div className="h-28 rounded-xl bg-surface-container-high" />
                </div>
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Kho đồ khô &amp; Rau củ</span>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm">
                      18 Đơn vị
                    </span>
                  </div>
                  <div className="h-28 rounded-xl bg-surface-container-high" />
                </div>
              </div>
            </div>
            {/* Aside Quick Cook Widget */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-space-md">
              <div className="bg-surface-container p-space-lg rounded-2xl flex flex-col gap-space-sm">
                <div className="flex items-center gap-2 text-primary">
                  <Icon name="menu_book" size={20} />
                  <span className="font-title-md text-title-md font-semibold text-on-surface">Công thức vừa lưu</span>
                </div>
                <div className="h-14 rounded-xl bg-surface-container-high" />
                <div className="h-14 rounded-xl bg-surface-container-high" />
                <div className="h-14 rounded-xl bg-surface-container-high" />
              </div>
            </div>
          </div>

          {/* Re-open trigger when dismissed */}
          {!isModalOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-body-md text-body-md font-semibold shadow-2xl hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icon name="sync_saved_locally" size={20} />
                <span>Mở lại Hộp thoại Gộp dữ liệu (Data Merge Dialog)</span>
              </button>
            </div>
          )}

          {/* Modal Backdrop with Rich Blur Overlay */}
          {isModalOpen && (
            <div
              className="fixed inset-0 z-40 bg-on-background/60 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsModalOpen(false)}
            />
          )}

          {/* Centered Modal Layer */}
          {isModalOpen && (
            <div
              aria-labelledby="dialogTitle"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              role="dialog"
            >
              <div
                className="relative w-full max-w-4xl my-auto bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95"
              >
                {/* Header Section */}
                <div className="px-6 sm:px-8 pt-7 pb-6 bg-surface-container-low flex flex-col gap-3 relative">
                  <div className="flex items-center justify-between gap-4">
                    {/* Top Tag Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold tracking-wide uppercase">
                      <Icon name="sync_saved_locally" size={16} />
                      <span>Phát hiện dữ liệu tồn tại trên trình duyệt</span>
                    </div>
                    {/* Close / Dismiss Action */}
                    <button
                      aria-label="Đóng hộp thoại"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none cursor-pointer"
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                    >
                      <Icon name="close" size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5 pr-8">
                    <h1 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight" id="dialogTitle">
                      Gộp dữ liệu nấu nướng vào tài khoản của bạn?
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
                      Chào mừng <span className="font-semibold text-on-surface">Bếp Mẹ Ba</span>! Trước khi đăng nhập, bạn đã lưu một số món ăn, thực đơn và nguyên liệu đi chợ trên thiết bị này (
                      <span className="font-mono text-label-mono-sm bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface font-medium">
                        LocalStorage
                      </span>
                      ). Bạn có muốn đồng bộ toàn bộ dữ liệu này vào tài khoản đám mây để sử dụng trên điện thoại và máy tính khác không?
                    </p>
                  </div>
                </div>

                {/* Main Body Container */}
                <div className="p-6 sm:p-8 flex flex-col gap-6 max-h-[calc(88vh-260px)] overflow-y-auto">
                  {/* Section: Discovered Data Summary (3 Dynamic Cards) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-title-md text-title-md font-semibold text-on-surface flex items-center gap-2">
                        <Icon name="inventory_2" size={20} className="text-primary" />
                        Chi tiết dữ liệu máy khách sẵn sàng gộp
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Chọn các mục bạn muốn chuyển sang đám mây
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Card 1: Favorite Recipes */}
                      <div className="p-4 rounded-2xl bg-surface-container-low transition-all duration-200 hover:bg-surface-container flex flex-col justify-between gap-3 relative group">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                              <Icon name="favorite" size={20} />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
                              5 món ăn
                            </span>
                          </div>
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface font-semibold">Món yêu thích &amp; Sổ tay</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Lưu trữ từ các buổi nấu gần nhất</p>
                          </div>
                          {/* Recipe Peek Preview */}
                          <div className="p-2.5 rounded-xl bg-surface-container-lowest flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-on-surface">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="font-body-sm text-body-sm truncate font-medium">Canh chua cá lóc miền Tây</span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="font-body-sm text-body-sm truncate">Bún chả nướng than hoa</span>
                            </div>
                            <div className="flex items-center gap-2 text-on-surface">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="font-body-sm text-body-sm truncate">Thịt kho hột vịt nước dừa</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-on-surface-variant pt-1 font-label-mono-sm text-label-mono-sm">
                              <Icon name="add" size={15} className="text-tertiary" />
                              <span>2 món khác (Bánh xèo, Bắp cải cuộn)</span>
                            </div>
                          </div>
                        </div>
                        {/* Selection Toggle */}
                        <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                          <input
                            checked={checkRecipes}
                            onChange={(e) => setCheckRecipes(e.target.checked)}
                            className="peer sr-only"
                            type="checkbox"
                          />
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-on-secondary transition-colors ${
                              checkRecipes ? "bg-secondary" : "bg-surface-container-highest"
                            }`}
                          >
                            {checkRecipes && <Icon name="check" size={16} />}
                          </div>
                          <span className={`font-body-md text-body-md font-medium ${checkRecipes ? "text-secondary" : "text-on-surface"}`}>
                            Gộp 5 món ăn này
                          </span>
                        </label>
                      </div>

                      {/* Card 2: Meal Plan */}
                      <div className="p-4 rounded-2xl bg-surface-container-low transition-all duration-200 hover:bg-surface-container flex flex-col justify-between gap-3 relative group">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                              <Icon name="calendar_month" size={20} />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                              14 bữa ăn
                            </span>
                          </div>
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface font-semibold">Kế hoạch bữa ăn tuần</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Kế hoạch Tuần 12 (Thứ 2 - Chủ Nhật)</p>
                          </div>
                          {/* Plan Peek Preview */}
                          <div className="p-2.5 rounded-xl bg-surface-container-lowest flex flex-col gap-2">
                            <div className="flex items-center justify-between text-on-surface">
                              <span className="font-body-sm text-body-sm font-semibold text-primary">Thứ Hai - Thứ Tư</span>
                              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">6 bữa chính</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded font-body-sm text-body-sm text-xs">
                                Sáng: Phở bò tái
                              </span>
                              <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded font-body-sm text-body-sm text-xs">
                                Trưa: Cá bống kho tiêu
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-on-surface pt-1">
                              <span className="font-body-sm text-body-sm font-semibold text-primary">Thứ Năm - Chủ Nhật</span>
                              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">8 bữa + tráng miệng</span>
                            </div>
                          </div>
                        </div>
                        {/* Selection Toggle */}
                        <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                          <input
                            checked={checkMealPlan}
                            onChange={(e) => setCheckMealPlan(e.target.checked)}
                            className="peer sr-only"
                            type="checkbox"
                          />
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-on-secondary transition-colors ${
                              checkMealPlan ? "bg-secondary" : "bg-surface-container-highest"
                            }`}
                          >
                            {checkMealPlan && <Icon name="check" size={16} />}
                          </div>
                          <span className={`font-body-md text-body-md font-medium ${checkMealPlan ? "text-secondary" : "text-on-surface"}`}>
                            Gộp kế hoạch tuần
                          </span>
                        </label>
                      </div>

                      {/* Card 3: Shopping List */}
                      <div className="p-4 rounded-2xl bg-surface-container-low transition-all duration-200 hover:bg-surface-container flex flex-col justify-between gap-3 relative group">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                              <Icon name="shopping_basket" size={20} />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                              18 nguyên liệu
                            </span>
                          </div>
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface font-semibold">Giỏ đi chợ đang dùng</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Tiến độ mua sắm tại chợ gia đình</p>
                          </div>
                          {/* Shopping Progress Mini Visual */}
                          <div className="p-2.5 rounded-xl bg-surface-container-lowest flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="font-body-sm text-body-sm text-on-surface font-medium">8 đã mua</span>
                              <span className="font-body-sm text-body-sm text-primary font-semibold">10 món cần gom</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                              <div className="bg-secondary h-full rounded-full" style={{ width: "44.4%" }} />
                            </div>
                            <div className="flex flex-col gap-1 text-on-surface-variant pt-0.5">
                              <span className="font-body-sm text-body-sm text-xs truncate">
                                Cần mua: Nước mắm 40° đạm, Hành tím Lý Sơn, Rau quế...
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Selection Toggle */}
                        <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                          <input
                            checked={checkShoppingList}
                            onChange={(e) => setCheckShoppingList(e.target.checked)}
                            className="peer sr-only"
                            type="checkbox"
                          />
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-on-secondary transition-colors ${
                              checkShoppingList ? "bg-secondary" : "bg-surface-container-highest"
                            }`}
                          >
                            {checkShoppingList && <Icon name="check" size={16} />}
                          </div>
                          <span className={`font-body-md text-body-md font-medium ${checkShoppingList ? "text-secondary" : "text-on-surface"}`}>
                            Gộp danh sách đi chợ
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section: Strategy Conflict Resolution */}
                  <div className="p-5 rounded-2xl bg-surface-container flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-title-md text-title-md font-semibold text-on-surface flex items-center gap-2">
                        <Icon name="tune" size={20} className="text-primary" />
                        Phương án giải quyết khi trùng lặp công thức
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                        Khuyến nghị tự động
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Strategy 1: Smart Merge (Recommended) */}
                      <label
                        onClick={() => setMergeStrategy("merge")}
                        className={`flex items-start gap-3.5 p-4 rounded-xl cursor-pointer transition-all shadow-sm group ${
                          mergeStrategy === "merge" ? "bg-surface-container-lowest ring-2 ring-primary/20" : "bg-surface-container-lowest hover:bg-surface-bright"
                        }`}
                      >
                        <input
                          checked={mergeStrategy === "merge"}
                          onChange={() => setMergeStrategy("merge")}
                          className="mt-1 accent-primary h-4 w-4"
                          name="mergeStrategy"
                          type="radio"
                          value="merge"
                        />
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                              Gộp bổ sung (Merge &amp; Keep Both)
                            </span>
                            <Icon name="verified" size={18} className="text-secondary" />
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            Giữ nguyên công thức và danh mục đã có sẵn trên tài khoản đám mây, đồng thời bổ sung toàn bộ ghi chú và món mới từ thiết bị này mà không bị mất dữ liệu.
                          </p>
                        </div>
                      </label>
                      {/* Strategy 2: Overwrite */}
                      <label
                        onClick={() => setMergeStrategy("overwrite")}
                        className={`flex items-start gap-3.5 p-4 rounded-xl cursor-pointer transition-all shadow-sm group ${
                          mergeStrategy === "overwrite" ? "bg-surface-container-lowest ring-2 ring-primary/20" : "bg-surface-container-lowest hover:bg-surface-bright"
                        }`}
                      >
                        <input
                          checked={mergeStrategy === "overwrite"}
                          onChange={() => setMergeStrategy("overwrite")}
                          className="mt-1 accent-primary h-4 w-4"
                          name="mergeStrategy"
                          type="radio"
                          value="overwrite"
                        />
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                            Ghi đè (Overwrite)
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            Thay thế trực tiếp thực đơn và giỏ chợ trên tài khoản bằng phiên bản cục bộ đang mở trên trình duyệt này. Thích hợp khi bạn vừa hoàn thành chỉnh sửa ngoại tuyến.
                          </p>
                        </div>
                      </label>
                    </div>
                    {/* Privacy & LocalStorage Hygiene Notice */}
                    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-high/60 text-on-surface-variant">
                      <Icon name="security" size={18} className="text-secondary shrink-0 mt-0.5" />
                      <p className="font-body-sm text-body-sm leading-normal">
                        <span className="font-semibold text-on-surface">Bảo vệ quyền riêng tư:</span> Bộ nhớ cục bộ trên máy này sẽ được dọn sạch an toàn sau khi đồng bộ thành công, bảo đảm an toàn dữ liệu nếu bạn đang sử dụng máy tính nơi công cộng hoặc dùng chung.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 sm:px-8 py-5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Secondary / Auxiliary Options */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-medium cursor-pointer"
                      type="button"
                    >
                      Bỏ qua &amp; Không gộp
                    </button>
                    <button
                      onClick={() => {
                        alert("RecipeHub: Đang chuẩn bị bảng đối chiếu chi tiết 5 món ăn và 18 nguyên liệu trước khi gộp.");
                      }}
                      className="px-4 py-2.5 rounded-xl font-body-md text-body-md text-primary hover:bg-primary-fixed/40 transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
                      type="button"
                    >
                      <Icon name="checklist" size={18} />
                      <span>Xem chi tiết từng món</span>
                    </button>
                  </div>
                  {/* Primary Call to Action */}
                  <button
                    disabled={selectedCount === 0 || isSyncing}
                    onClick={handleConfirmMerge}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold transition-all duration-150 shadow-md flex items-center justify-center gap-2 group cursor-pointer ${
                      selectedCount === 0 || isSyncing
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-primary-container active:scale-[0.98]"
                    }`}
                    type="button"
                  >
                    {isSyncing ? (
                      <>
                        <span className="animate-spin">
                          <Icon name="refresh" size={20} />
                        </span>
                        <span>Đang lưu trữ dữ liệu...</span>
                      </>
                    ) : (
                      <>
                        <span className="transition-transform group-hover:rotate-180 duration-500">
                          <Icon name="cloud_sync" size={20} />
                        </span>
                        <span>{getCtaLabel()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Toast Notification Component */}
          {showToast && (
            <div className="fixed bottom-6 right-6 z-50 max-w-md w-full transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 rounded-2xl bg-surface-container-highest shadow-2xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                  <Icon name="check_circle" size={22} />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-title-md text-title-md font-semibold text-on-surface">Đồng bộ hoàn tất!</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Vừa xong</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Đã gộp thành công 5 món ăn và kế hoạch tuần vào tài khoản{" "}
                    <span className="font-semibold text-on-surface">@bepmeba</span>. Sẵn sàng nấu nướng trên mọi thiết bị!
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleUndo}
                      className="font-label-mono-sm text-label-mono-sm text-primary font-semibold hover:underline cursor-pointer"
                      type="button"
                    >
                      Hoàn tác trong 10s
                    </button>
                    <span className="text-outline-variant">•</span>
                    <button
                      onClick={() => setShowToast(false)}
                      className="font-label-mono-sm text-label-mono-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
                      type="button"
                    >
                      Đóng thông báo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
