"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = React.useState<"categories" | "ingredients" | "tags" | "units">("ingredients");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMergeTarget, setSelectedMergeTarget] = React.useState<"A" | "B">("A");
  const [selectedIngredientIds, setSelectedIngredientIds] = React.useState<string[]>(["ing-1"]);

  const toggleSelectIngredient = (id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col w-full gap-y-space-lg">
      {/* 1. Page Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span>Hệ thống quản trị</span>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span>Phân loại &amp; Dữ liệu</span>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span className="text-primary font-semibold">Danh mục &amp; Nguyên liệu</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mt-1">
            Quản lý Danh mục, Thẻ &amp; Từ điển nguyên liệu
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Chuẩn hóa danh mục món ăn, quản trị từ điển nguyên liệu với định mức dinh dưỡng, phát hiện gộp trùng lặp từ ngữ địa phương và gắn nhãn dị ứng ẩm thực.
          </p>
        </div>

        {/* Right utility controls */}
        <div className="flex flex-wrap items-center gap-space-xs shrink-0">
          <button
            type="button"
            onClick={() => alert("Đang xuất dữ liệu danh mục & nguyên liệu ra Excel...")}
            className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-outline-variant/30"
          >
            <Icon name="table_chart" size={18} className="text-tertiary" />
            <span>Xuất Excel</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Kích hoạt trợ lý AI Sentinel rà soát phương ngữ 3 miền...")}
            className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-all relative group cursor-pointer border border-outline-variant/30"
          >
            <Icon name="auto_fix_high" size={18} className="text-primary" />
            <span>Rà soát AI</span>
            <span className="w-2 h-2 rounded-full bg-primary-container absolute -top-0.5 -right-0.5 ring-2 ring-surface" />
          </button>
          <button
            type="button"
            onClick={() => alert("Mở modal thêm mới thực phẩm / danh mục...")}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
          >
            <Icon name="add_circle" size={18} />
            <span>Thêm mục mới</span>
          </button>
        </div>
      </div>

      {/* 2. STAT METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant font-medium tracking-wider">
              Danh mục món
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <Icon name="restaurant" size={20} />
            </div>
          </div>
          <div className="mt-space-md space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">28</span>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">+3 tuần này</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              4.520 công thức được phân bổ vào các nhóm ẩm thực
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm border-t border-surface-container">
            <span>Tỷ lệ phân nhóm</span>
            <span className="text-on-surface font-semibold">99.4%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant font-medium tracking-wider">
              Thẻ &amp; Chủ đề
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <Icon name="tag" size={20} />
            </div>
          </div>
          <div className="mt-space-md space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">185</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                Trending
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Top thẻ: #AnComNha, #EatClean, #ChayThanhDam, #MonTet
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm border-t border-surface-container">
            <span>Lượt gán thẻ mới/ngày</span>
            <span className="text-on-surface font-semibold">+412 lần</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant font-medium tracking-wider">
              Từ điển nguyên liệu
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <Icon name="eco" size={20} />
            </div>
          </div>
          <div className="mt-space-md space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">1.420</span>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">98.2% Chuẩn</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nguyên liệu tiêu chuẩn có định mức calo &amp; quy chuẩn dị ứng
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm border-t border-surface-container">
            <span>Ghi nhận dị danh vùng miền</span>
            <span className="text-on-surface font-semibold">680 biến thể</span>
          </div>
        </div>

        {/* Card 4 (Alert State) */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-error/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-error font-medium tracking-wider">
              Cần chuẩn hóa / Gộp trùng
            </span>
            <div className="w-8 h-8 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
              <Icon name="call_merge" size={20} />
            </div>
          </div>
          <div className="mt-space-md space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-bold text-error">8 cặp</span>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">
                Ưu tiên cao
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Phát hiện trùng lặp từ ngữ: &ldquo;Hành tím Lý Sơn&rdquo;, &ldquo;Ba chỉ / Ba rọi&rdquo;
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between font-label-mono-sm text-label-mono-sm border-t border-surface-container">
            <span className="text-on-surface-variant">Tác động công thức</span>
            <span className="text-error font-semibold">189 bài viết</span>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2">
        <div className="inline-flex p-1.5 rounded-2xl bg-surface-container">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="folder_special" size={18} />
            <span>Danh mục món ăn</span>
            <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-on-surface-variant">
              28
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ingredients")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
              activeTab === "ingredients"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="local_dining" size={18} />
            <span>Từ điển nguyên liệu</span>
            <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-primary-fixed text-on-primary-fixed font-bold">
              1.420
            </span>
            <span className="px-1.5 py-0.2 rounded-full font-label-mono-sm text-[10px] bg-error-container text-on-error-container uppercase tracking-wide">
              8 cần gộp
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tags")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
              activeTab === "tags"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="tag" size={18} />
            <span>Thẻ &amp; Chủ đề xu hướng</span>
            <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-on-surface-variant">
              185
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("units")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
              activeTab === "units"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="straighten" size={18} />
            <span>Đơn vị đo lường</span>
            <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-on-surface-variant">
              32
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Chế độ hiển thị:</span>
          <div className="flex items-center bg-surface-container p-1 rounded-xl">
            <button className="p-1.5 rounded-lg bg-surface-container-lowest text-primary shadow-sm cursor-pointer" title="Danh sách chi tiết" type="button">
              <Icon name="format_list_bulleted" size={18} />
            </button>
            <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer" title="Lưới thẻ" type="button">
              <Icon name="grid_view" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN INGREDIENTS TABLE & CONTROLS */}
      <div className="flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* Filter bar */}
        <div className="p-space-md space-y-space-md bg-surface-container-lowest">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            {/* Search bar */}
            <div className="relative flex-1 max-w-2xl">
              <Icon name="search" size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 rounded-xl bg-surface text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                placeholder="Tìm theo tên nguyên liệu, mã code (#ING-XXXX), dị danh địa phương..."
                type="text"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-label-mono-sm text-[11px] text-tertiary bg-surface-container-high px-2 py-0.5 rounded">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <select className="px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-outline-variant/30">
                <option value="all">Nhóm: Tất cả nguyên liệu</option>
                <option value="meat">Thịt &amp; Gia cầm (312)</option>
                <option value="seafood">Thủy hải sản (198)</option>
                <option value="veggie">Rau củ &amp; Nấm (420)</option>
                <option value="spice">Gia vị &amp; Thảo mộc (265)</option>
                <option value="dry">Đồ khô &amp; Hạt dinh dưỡng (140)</option>
                <option value="dairy">Sữa, Trứng &amp; Chế phẩm (85)</option>
              </select>

              <select className="px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-outline-variant/30">
                <option value="all">Trạng thái: Tất cả</option>
                <option value="standard">Đã chuẩn hóa (1.398)</option>
                <option value="review">Chờ duyệt từ công thức mới (14)</option>
                <option defaultValue="duplicate">Cảnh báo trùng lặp (8)</option>
              </select>

              <select className="px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-outline-variant/30">
                <option value="all">Dị ứng: Tất cả</option>
                <option value="has_allergy">Có cảnh báo dị ứng</option>
                <option value="no_allergy">An toàn / Không dị ứng</option>
              </select>
            </div>
          </div>

          {/* Action Batch Bar */}
          <div className="flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-surface-container font-body-sm text-body-sm gap-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedIngredientIds.length > 0}
                  onChange={() => {
                    if (selectedIngredientIds.length > 0) setSelectedIngredientIds([]);
                    else setSelectedIngredientIds(["ing-1", "ing-2", "ing-3", "ing-4", "ing-5"]);
                  }}
                  className="w-4 h-4 rounded text-primary accent-primary focus:ring-primary/20 cursor-pointer"
                />
                <span className="font-medium text-on-surface">
                  Đã chọn: <span className="font-label-mono-sm font-bold text-primary">{selectedIngredientIds.length}</span> nguyên liệu
                </span>
              </label>
              <span className="text-tertiary">•</span>
              <span className="text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                Khuyên dùng: Gộp bản ghi để duy trì định mức chuẩn cho hệ thống tìm kiếm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert("Mở modal đổi nhóm thực phẩm...")}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon name="drive_file_move" size={16} className="text-tertiary" />
                <span>Đổi nhóm hàng loạt</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Kích hoạt quy trình gộp 2 mục thành tên chuẩn...")}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Icon name="call_merge" size={16} />
                <span>Gộp 2 mục thành tên chuẩn</span>
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-body-sm text-body-sm border-collapse">
            <thead>
              <tr className="bg-surface-container/60 text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider select-none border-b border-outline-variant/30">
                <th className="py-3 pl-4 pr-2 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredientIds.length === 5}
                    onChange={() => {
                      if (selectedIngredientIds.length === 5) setSelectedIngredientIds([]);
                      else setSelectedIngredientIds(["ing-1", "ing-2", "ing-3", "ing-4", "ing-5"]);
                    }}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 min-w-[260px]">Tên nguyên liệu &amp; Mã</th>
                <th className="py-3 px-3 min-w-[150px]">Nhóm thực phẩm</th>
                <th className="py-3 px-3 min-w-[130px] text-right">Tần suất dùng</th>
                <th className="py-3 px-3 min-w-[130px]">Đơn vị chuẩn</th>
                <th className="py-3 px-3 min-w-[160px]">Cảnh báo dị ứng</th>
                <th className="py-3 px-3 min-w-[200px]">Trạng thái dữ liệu</th>
                <th className="py-3 pr-4 pl-2 text-right min-w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {/* ROW 1: Hanh tim Ly Son (Duplicate Warning) */}
              <tr className={`transition-colors ${selectedIngredientIds.includes("ing-1") ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container/40"}`}>
                <td className="py-3.5 pl-4 pr-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredientIds.includes("ing-1")}
                    onChange={() => toggleSelectIngredient("ing-1")}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Icon name="nutrition" size={22} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-body-md font-semibold text-on-surface">
                          Hành tím Lý Sơn
                        </span>
                        <span className="px-1.5 py-0.5 rounded font-label-mono-sm text-[11px] bg-primary-fixed text-on-primary-fixed">
                          Đặc sản
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-[11px] mt-0.5">
                        <span>#ING-0412</span>
                        <span>•</span>
                        <span className="italic text-tertiary">Đồng nghĩa: Củ hành đỏ, Củ hành củ</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                    Gia vị &amp; Củ quả
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-label-mono-sm text-label-mono-sm">
                  <span className="font-semibold text-on-surface">842</span>{" "}
                  <span className="text-tertiary">món</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface">củ, g, tép</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Không ghi nhận</span>
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-mono-sm text-label-mono-sm bg-error-container text-on-error-container font-medium">
                    <Icon name="warning" size={14} />
                    <span>Trùng với &apos;Hành tím&apos;</span>
                  </span>
                </td>
                <td className="py-3.5 pr-4 pl-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => alert("Kích hoạt gộp mục #ING-0412 vào #ING-0010...")}
                      className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-body-sm text-[12px] font-medium hover:bg-primary-container shadow-sm transition-all cursor-pointer"
                    >
                      Gộp ngay
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Chỉnh sửa siêu dữ liệu Hành tím Lý Sơn")}
                      className="p-1 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* ROW 2: Ca loc dong */}
              <tr className={`transition-colors ${selectedIngredientIds.includes("ing-2") ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container/40"}`}>
                <td className="py-3.5 pl-4 pr-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredientIds.includes("ing-2")}
                    onChange={() => toggleSelectIngredient("ing-2")}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0 shadow-sm">
                      <Icon name="set_meal" size={22} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-body-md font-semibold text-on-surface">
                        Cá lóc đồng (Cá quả, Cá chuối)
                      </span>
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-[11px] mt-0.5">
                        <span>#ING-0105</span>
                        <span>•</span>
                        <span className="italic text-tertiary">Channa striata • 97 kcal/100g</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                    Thủy hải sản
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-label-mono-sm text-label-mono-sm">
                  <span className="font-semibold text-on-surface">324</span>{" "}
                  <span className="text-tertiary">món</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface">con, g, kg</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-mono-sm text-[11px] bg-tertiary-fixed text-on-tertiary-fixed font-medium">
                    <Icon name="info" size={13} className="text-primary" />
                    <span>Hải sản / Cá nước ngọt</span>
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-medium">
                    <Icon name="check_circle" size={14} />
                    <span>Đã chuẩn hóa</span>
                  </span>
                </td>
                <td className="py-3.5 pr-4 pl-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button type="button" className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* ROW 3: Thit ba chi rut suon */}
              <tr className={`transition-colors ${selectedIngredientIds.includes("ing-3") ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container/40"}`}>
                <td className="py-3.5 pl-4 pr-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredientIds.includes("ing-3")}
                    onChange={() => toggleSelectIngredient("ing-3")}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Icon name="lunch_dining" size={22} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-body-md font-semibold text-on-surface">
                        Thịt ba chỉ rút sườn (Ba rọi)
                      </span>
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-[11px] mt-0.5">
                        <span>#ING-0028</span>
                        <span>•</span>
                        <span className="italic text-tertiary">Pork belly • 260 kcal/100g</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                    Thịt &amp; Gia cầm
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-label-mono-sm text-label-mono-sm">
                  <span className="font-semibold text-on-surface">1.250</span>{" "}
                  <span className="text-tertiary">món</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface">g, kg, lạng</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Không dị ứng phổ thông</span>
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-medium">
                    <Icon name="check_circle" size={14} />
                    <span>Đã chuẩn hóa</span>
                  </span>
                </td>
                <td className="py-3.5 pr-4 pl-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button type="button" className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* ROW 4: Bac ha nau canh chua (Doc mung) */}
              <tr className={`transition-colors ${selectedIngredientIds.includes("ing-4") ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container/40"}`}>
                <td className="py-3.5 pl-4 pr-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredientIds.includes("ing-4")}
                    onChange={() => toggleSelectIngredient("ing-4")}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Icon name="spa" size={22} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-body-md font-semibold text-on-surface">
                          Bạc hà nấu canh chua (Dọc mùng)
                        </span>
                        <span className="px-1.5 py-0.5 rounded font-label-mono-sm text-[11px] bg-surface-container-high text-on-surface-variant">
                          User Tag
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-[11px] mt-0.5">
                        <span>#ING-0899</span>
                        <span>•</span>
                        <span className="italic text-tertiary">Người tạo: chef_minhkhoi (Canh cá dọc mùng)</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                    Rau củ &amp; Nấm
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-label-mono-sm text-label-mono-sm">
                  <span className="font-semibold text-on-surface">98</span>{" "}
                  <span className="text-tertiary">món</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface">nhánh, cây, g</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-mono-sm text-[11px] bg-error-container text-on-error-container font-medium">
                    <Icon name="warning" size={13} />
                    <span>Dễ gây ngứa (Oxalate)</span>
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-mono-sm text-label-mono-sm bg-surface-container text-on-surface font-medium">
                    <Icon name="hourglass_top" size={14} className="text-tertiary" />
                    <span>Bài nộp mới đóng góp</span>
                  </span>
                </td>
                <td className="py-3.5 pr-4 pl-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => alert("Đã phê duyệt tên chuẩn cho #ING-0899.")}
                      className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-body-sm text-[12px] font-medium hover:bg-secondary-container hover:text-on-secondary-container transition-all cursor-pointer"
                    >
                      Duyệt tên
                    </button>
                  </div>
                </td>
              </tr>

              {/* ROW 5: Nuoc mam truyen thong */}
              <tr className={`transition-colors ${selectedIngredientIds.includes("ing-5") ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container/40"}`}>
                <td className="py-3.5 pl-4 pr-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredientIds.includes("ing-5")}
                    onChange={() => toggleSelectIngredient("ing-5")}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Icon name="liquor" size={22} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-body-md font-semibold text-on-surface">
                        Nước mắm truyền thống 35°N - 40°N
                      </span>
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-[11px] mt-0.5">
                        <span>#ING-0004</span>
                        <span>•</span>
                        <span className="italic text-tertiary">Fish Sauce • Độ đạm cao • Phú Quốc / Phan Thiết</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                    Gia vị mắm muối
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-label-mono-sm text-label-mono-sm">
                  <span className="font-semibold text-on-surface">2.180</span>{" "}
                  <span className="text-tertiary">món</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface">muỗng canh, ml</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>An toàn tiêu chuẩn</span>
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container font-medium">
                    <Icon name="check_circle" size={14} />
                    <span>Đã chuẩn hóa</span>
                  </span>
                </td>
                <td className="py-3.5 pr-4 pl-2 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button type="button" className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant border-t border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="bg-surface px-2 py-1 rounded-lg text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none border border-outline-variant/30">
              <option>10</option>
              <option defaultValue="25">25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>trên tổng số <strong className="text-on-surface font-semibold">1.420</strong> nguyên liệu</span>
          </div>
          <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm">
            <button disabled className="w-8 h-8 rounded-lg flex items-center justify-center text-tertiary disabled:opacity-40" type="button">
              <Icon name="chevron_left" size={18} />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary font-bold shadow-sm" type="button">
              1
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface" type="button">
              2
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface" type="button">
              3
            </button>
            <span className="px-1 text-tertiary">...</span>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface" type="button">
              57
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface" type="button">
              <Icon name="chevron_right" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. LOWER WORKSPACE: 2-COLUMN ASYMMETRIC BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT (7 cols): CÔNG CỤ GỘP DỮ LIỆU NLP */}
        <div className="lg:col-span-7 rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
          <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
                <Icon name="psychology" size={20} />
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  Công cụ Rà soát &amp; Gộp trùng lặp (NLP)
                </h3>
                <p className="font-label-mono-sm text-[12px] text-on-surface-variant">
                  Thuật toán phân tích ngữ nghĩa và phương ngữ ẩm thực 3 miền
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
              <Icon name="auto_awesome" size={14} />
              <span>Khớp 96.4%</span>
            </span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container space-y-space-md border border-outline-variant/20">
            <div className="text-on-surface font-body-sm text-body-sm">
              Phát hiện 2 bản ghi có độ tương đồng ngữ cảnh cực cao từ các bài viết do người dùng đăng tải:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Item A */}
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-2 relative border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold">Mục gốc chuẩn A</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm bg-secondary-container text-on-secondary-container font-semibold">
                    Được đề xuất giữ
                  </span>
                </div>
                <div className="font-title-md text-body-md font-bold text-on-surface">Thịt ba chỉ</div>
                <div className="space-y-1 text-on-surface-variant font-label-mono-sm text-[12px]">
                  <div>Mã: <span className="text-on-surface font-mono font-medium">#ING-0028</span></div>
                  <div>Số công thức gắn: <strong className="text-on-surface">1.250 bài viết</strong></div>
                  <div>Quy ước nhóm: Thịt &amp; Gia cầm</div>
                </div>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-body-sm">
                    <input
                      type="radio"
                      name="merge_target"
                      checked={selectedMergeTarget === "A"}
                      onChange={() => setSelectedMergeTarget("A")}
                      className="text-primary accent-primary"
                    />
                    <span className="font-medium text-on-surface">Giữ làm Tên Danh Pháp Chuẩn</span>
                  </label>
                </div>
              </div>

              {/* Item B */}
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-2 relative border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono-sm text-label-mono-sm text-error font-bold">Mục dị biến B</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-label-mono-sm bg-error-container text-on-error-container font-semibold">
                    Phương ngữ Nam
                  </span>
                </div>
                <div className="font-title-md text-body-md font-bold text-on-surface">Thịt ba rọi miền Nam</div>
                <div className="space-y-1 text-on-surface-variant font-label-mono-sm text-[12px]">
                  <div>Mã: <span className="text-on-surface font-mono font-medium">#ING-0914</span></div>
                  <div>Số công thức gắn: <strong className="text-on-surface">145 bài viết</strong></div>
                  <div>Quy ước nhóm: Chưa xác định</div>
                </div>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-body-sm">
                    <input
                      type="radio"
                      name="merge_target"
                      checked={selectedMergeTarget === "B"}
                      onChange={() => setSelectedMergeTarget("B")}
                      className="text-primary accent-primary"
                    />
                    <span className="text-on-surface-variant">Lưu làm tên phương ngữ phụ</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Merge impact preview */}
            <div className="p-space-sm rounded-lg bg-surface-container-lowest text-on-surface-variant font-body-sm text-body-sm space-y-1 border border-outline-variant/20">
              <div className="flex items-center gap-2 font-medium text-on-surface">
                <Icon name="info" size={18} className="text-primary" />
                <span>Hành động tự động khi bấm Xác nhận:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[13px] pl-2 text-on-surface-variant">
                <li>Tự động chuyển <strong>145 công thức</strong> đang dùng tên &ldquo;#ING-0914&rdquo; sang mã chuẩn &ldquo;#ING-0028&rdquo;.</li>
                <li>Thêm từ khóa &ldquo;Ba rọi miền Nam&rdquo; vào mảng <em>aliases (từ khóa đồng nghĩa)</em> của Thịt ba chỉ.</li>
                <li>Lưu trữ #ING-0914 vào kho lưu trữ (soft-delete), giải phóng chỉ mục tìm kiếm và URL SEO.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-end gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={() => alert("Đã bỏ qua gợi ý gộp này.")}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Bỏ qua gợi ý này
            </button>
            <button
              type="button"
              onClick={() => alert("Xác nhận gộp dữ liệu chuẩn #ING-0028 thành công!")}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container shadow-md active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Icon name="merge" size={18} />
              <span>Xác nhận gộp dữ liệu chuẩn</span>
            </button>
          </div>
        </div>

        {/* RIGHT (5 cols): FORM TẠO / SỬA NHANH NGUYÊN LIỆU */}
        <div className="lg:col-span-5 rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
          <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-xs">
                <Icon name="edit_note" size={20} />
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  Chỉnh sửa nhanh thực phẩm
                </h3>
                <p className="font-label-mono-sm text-[12px] text-on-surface-variant">
                  Chỉnh sửa siêu dữ liệu của: #ING-0412
                </p>
              </div>
            </div>
            <span className="font-label-mono-sm text-[12px] text-tertiary">Bản nháp tự lưu</span>
          </div>

          <form className="space-y-3.5" onSubmit={(e) => { e.preventDefault(); alert("Đã lưu thay đổi cho nguyên liệu!"); }}>
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-on-surface mb-1">
                Tên nguyên liệu chính thức <span className="text-error">*</span>
              </label>
              <input
                className="w-full px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30"
                type="text"
                defaultValue="Hành tím Lý Sơn"
              />
            </div>

            <div>
              <label className="block font-body-sm text-body-sm font-medium text-on-surface mb-1">
                Tên đồng nghĩa &amp; Biến thể địa phương (phân cách bằng dấu phẩy)
              </label>
              <input
                className="w-full px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30"
                type="text"
                defaultValue="Hành tỏi khô, Củ hành đỏ, Củ hành ta, Shallot"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body-sm text-body-sm font-medium text-on-surface mb-1">
                  Phân nhóm
                </label>
                <select className="w-full px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30">
                  <option>Gia vị &amp; Củ quả</option>
                  <option>Thịt &amp; Gia cầm</option>
                  <option>Thủy hải sản</option>
                  <option>Rau củ &amp; Nấm</option>
                </select>
              </div>
              <div>
                <label className="block font-body-sm text-body-sm font-medium text-on-surface mb-1">
                  Đơn vị đo chuẩn
                </label>
                <input
                  className="w-full px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30"
                  type="text"
                  defaultValue="củ, g, tép"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body-sm text-body-sm font-medium text-on-surface mb-1">
                  Định mức năng lượng (kcal/100g)
                </label>
                <input
                  className="w-full px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30"
                  type="number"
                  defaultValue={72}
                />
              </div>
              <div>
                <label className="block font-body-sm text-body-sm font-medium text-on-surface mb-1">
                  Cảnh báo dị ứng
                </label>
                <select className="w-full px-3.5 py-2 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30">
                  <option>Không dị ứng phổ thông</option>
                  <option>Hải sản / Cá nước ngọt</option>
                  <option>Dễ gây ngứa (Oxalate)</option>
                  <option>Đậu phộng / Các loại hạt</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Hủy thay đổi
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="save" size={18} />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
