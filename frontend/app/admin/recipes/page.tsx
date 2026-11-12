"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export default function AdminRecipesPage() {
  const [activeTab, setActiveTab] = React.useState<string>("pending");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>(["item-1", "item-2", "item-3"]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === 7) {
      setSelectedIds([]);
    } else {
      setSelectedIds(["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]);
    }
  };

  return (
    <div className="flex flex-col w-full gap-y-space-lg">
      {/* 1. Header Trang Quản Lý Công Thức */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm tracking-wide">
            <span>Hệ thống quản trị</span>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span>Quản lý nội dung</span>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span className="text-primary font-semibold">Quản lý công thức</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-1 font-bold">
            Danh sách công thức &amp; Kiểm duyệt nội dung
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Kiểm duyệt công thức từ cộng đồng, quản lý trạng thái xuất bản, kiểm soát chất lượng hình ảnh và thành phần dinh dưỡng chuẩn mâm cơm Việt.
          </p>
        </div>

        {/* Nút hành động nhanh */}
        <div className="flex flex-wrap items-center gap-space-sm shrink-0">
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface text-on-surface font-title-md text-body-sm border border-outline-variant/50 hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
            type="button"
            onClick={() => alert("Đang xuất dữ liệu Excel/CSV công thức...")}
          >
            <Icon name="download" size={16} className="text-tertiary" />
            <span>Xuất dữ liệu Excel/CSV</span>
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-title-md text-body-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            type="button"
            onClick={() => alert("Chạy quy tắc kiểm tra AI Sentinel tự động...")}
          >
            <Icon name="auto_awesome" size={16} className="text-primary" />
            <span>Duyệt nhanh theo quy tắc</span>
          </button>
          <Link
            href="/recipes/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-title-md text-body-sm hover:bg-primary-container transition-all shadow-sm"
          >
            <Icon name="add" size={16} />
            <span>Thêm công thức Ban biên tập</span>
          </Link>
        </div>
      </div>

      {/* 2. Thẻ Tóm Tắt Nhanh Trạng Thái (Quick KPI Status Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* Card 1: Tổng số */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span className="uppercase tracking-wider">Tổng công thức</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <Icon name="menu_book" size={16} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg text-on-surface leading-none font-bold">4.520</div>
          </div>
          <div className="flex items-center gap-1.5 text-secondary font-label-mono-sm text-label-mono-sm">
            <Icon name="arrow_upward" size={14} />
            <span>+86 bài nộp tuần này</span>
          </div>
        </div>

        {/* Card 2: Chờ duyệt (Khẩn cấp) */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border-2 border-primary/40 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between text-primary font-label-mono-sm text-label-mono-sm font-semibold">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Chờ duyệt (Khẩn)
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <Icon name="schedule" size={16} />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary leading-none font-bold">14</span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-normal">bài nộp</span>
          </div>
          <div className="flex flex-col gap-0.5 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span>Chờ TB: <strong className="text-on-surface font-medium">38 phút</strong></span>
            <span className="text-primary font-medium">4 bài từ tác giả mới</span>
          </div>
        </div>

        {/* Card 3: Đã xuất bản */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span className="uppercase tracking-wider">Đã xuất bản</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
              <Icon name="check_circle" size={16} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg text-on-surface leading-none font-bold">4.150</div>
          </div>
          <div className="flex items-center gap-1.5 text-secondary font-label-mono-sm text-label-mono-sm">
            <span>91.8% tỷ lệ đạt chuẩn</span>
          </div>
        </div>

        {/* Card 4: Bị từ chối / Cần sửa */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span className="uppercase tracking-wider">Cần chỉnh sửa</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <Icon name="edit_note" size={18} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg text-on-surface leading-none font-bold">32</div>
          </div>
          <div className="text-outline font-label-mono-sm text-label-mono-sm truncate" title="Chủ yếu thiếu ảnh bước thực hiện hoặc định lượng sai">
            Thiếu ảnh / Sai định lượng
          </div>
        </div>

        {/* Card 5: Đã ẩn / Tạm khóa */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span className="uppercase tracking-wider">Đã ẩn / Tạm khóa</span>
            <div className="w-8 h-8 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
              <Icon name="visibility_off" size={16} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg text-error leading-none font-bold">18</div>
          </div>
          <div className="text-outline font-label-mono-sm text-label-mono-sm truncate" title="Vi phạm bản quyền hoặc bài viết bị báo cáo">
            Báo cáo / Vi phạm nội dung
          </div>
        </div>
      </div>

      {/* 3. Thanh Công Cụ Lọc Đa Chiều & Tìm Kiếm Thông Minh */}
      <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
        {/* Tab trạng thái dạng Segmented Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-outline-variant/20 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-label-mono-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-on-primary font-medium shadow-sm"
                : "text-on-surface hover:bg-surface-container"
            }`}
            type="button"
          >
            Tất cả <span className="ml-1 opacity-75">4.520</span>
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-label-mono-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "pending"
                ? "bg-primary text-on-primary font-medium shadow-sm"
                : "text-on-surface hover:bg-surface-container"
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-surface-bright animate-pulse" />
            <span>Chờ duyệt</span>
            <span className="px-1.5 py-0.2 rounded-full bg-primary-container text-on-primary text-[10px]">14</span>
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-label-mono-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "published"
                ? "bg-primary text-on-primary font-medium shadow-sm"
                : "text-on-surface hover:bg-surface-container"
            }`}
            type="button"
          >
            Đã xuất bản <span className="ml-1 opacity-75">4.150</span>
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-label-mono-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "draft"
                ? "bg-primary text-on-primary font-medium shadow-sm"
                : "text-on-surface hover:bg-surface-container"
            }`}
            type="button"
          >
            Bản nháp tác giả <span className="ml-1 opacity-75">370</span>
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-label-mono-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "rejected"
                ? "bg-primary text-on-primary font-medium shadow-sm"
                : "text-on-surface hover:bg-surface-container"
            }`}
            type="button"
          >
            Bị từ chối / Cần sửa <span className="ml-1 opacity-75">32</span>
          </button>
          <button
            onClick={() => setActiveTab("hidden")}
            className={`px-3.5 py-1.5 rounded-full font-label-mono-sm text-label-mono-sm transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "hidden"
                ? "bg-primary text-on-primary font-medium shadow-sm"
                : "text-on-surface hover:bg-surface-container"
            }`}
            type="button"
          >
            Đã ẩn / Vi phạm <span className="ml-1 text-error">18</span>
          </button>
        </div>

        {/* Hàng lọc chi tiết & Thanh tìm kiếm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-sm pt-1">
          {/* Tìm kiếm */}
          <div className="lg:col-span-4 relative flex items-center">
            <span className="absolute left-3 text-outline pointer-events-none flex items-center">
              <Icon name="search" size={16} />
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-surface font-body-sm text-body-sm text-on-surface placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:border-primary transition-all shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
              placeholder="Tìm theo tên món, nguyên liệu, tác giả, mã..."
              type="text"
            />
            <span className="absolute right-2.5 px-1.5 py-0.5 rounded font-label-mono-sm text-[10px] bg-surface-container text-on-surface-variant border border-outline-variant/40">
              Ctrl+K
            </span>
          </div>

          {/* Dropdown Danh mục */}
          <div className="lg:col-span-2">
            <select className="w-full px-3 py-2 rounded-xl bg-surface font-body-sm text-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary transition-colors">
              <option value="">Tất cả danh mục</option>
              <option value="kho">Món kho Nam Bộ</option>
              <option value="canh">Canh thanh nhiệt</option>
              <option value="bun">Bún - Phở - Mì</option>
              <option value="xao">Món xào dân dã</option>
              <option value="che">Ăn vặt &amp; Chè</option>
              <option value="chay">Chay &amp; Eat Clean</option>
            </select>
          </div>

          {/* Dropdown Phân loại tác giả */}
          <div className="lg:col-span-2">
            <select className="w-full px-3 py-2 rounded-xl bg-surface font-body-sm text-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary transition-colors">
              <option value="">Tất cả tác giả</option>
              <option value="elite">Đầu bếp tinh hoa</option>
              <option value="verified">Thành viên xác thực</option>
              <option value="new">Tài khoản mới</option>
              <option value="editorial">Ban biên tập</option>
            </select>
          </div>

          {/* Dropdown Vùng miền & Chế độ ăn */}
          <div className="lg:col-span-2">
            <select className="w-full px-3 py-2 rounded-xl bg-surface font-body-sm text-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary transition-colors">
              <option value="">Vùng miền &amp; Chế độ</option>
              <option value="bac">Ẩm thực Miền Bắc</option>
              <option value="trung">Ẩm thực Miền Trung</option>
              <option value="nam">Ẩm thực Miền Nam</option>
              <option value="family">Mâm cơm gia đình</option>
              <option value="clean">Eat Clean / Dinh dưỡng</option>
            </select>
          </div>

          {/* Dropdown Sắp xếp & Nút Reset */}
          <div className="lg:col-span-2 flex items-center gap-1.5">
            <select className="w-full px-3 py-2 rounded-xl bg-surface font-body-sm text-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary transition-colors">
              <option value="newest">Mới nộp nhất</option>
              <option value="waiting">Chờ lâu nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="views">Lượt xem nhiều</option>
            </select>
            <button
              className="p-2 rounded-xl bg-surface text-tertiary hover:text-primary hover:bg-surface-container border border-outline-variant/40 transition-colors shrink-0 cursor-pointer"
              title="Đặt lại bộ lọc"
              type="button"
              onClick={() => setSearchQuery("")}
            >
              <Icon name="restart_alt" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Thanh Thao Tác Hàng Loạt (Bulk Actions Bar) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm px-space-md py-3 rounded-2xl bg-surface-container border border-primary/30 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-mono-sm text-label-mono-sm font-semibold">
              {selectedIds.length}
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-body-sm text-on-surface font-semibold leading-tight">
                Đã chọn {selectedIds.length} công thức chờ kiểm duyệt
              </span>
              <span className="font-label-mono-sm text-[11px] text-on-surface-variant">
                Có thể áp dụng kiểm duyệt hoặc trả về hàng loạt
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary font-title-md text-body-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              type="button"
              onClick={() => alert(`Đã phê duyệt hàng loạt ${selectedIds.length} công thức!`)}
            >
              <Icon name="check" size={16} />
              <span>Phê duyệt hàng loạt ({selectedIds.length})</span>
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
              onClick={() => alert("Gửi yêu cầu bổ sung thông tin tới tác giả...")}
            >
              <Icon name="warning" size={16} className="text-primary" />
              <span>Yêu cầu bổ sung</span>
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface text-error font-body-sm text-body-sm hover:bg-error-container/20 border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
              onClick={() => alert("Từ chối các bài nộp đã chọn...")}
            >
              <Icon name="close" size={16} />
              <span>Từ chối</span>
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
              onClick={() => alert("Gắn nhãn Chuẩn Mâm Cơm Việt thành công!")}
            >
              <Icon name="local_offer" size={16} className="text-tertiary" />
              <span>Gắn nhãn chuẩn vị</span>
            </button>
            <button
              className="px-2.5 py-1.5 rounded-xl text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer"
              type="button"
              onClick={() => setSelectedIds([])}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 5. Bảng Dữ Liệu Kiểm Duyệt Chi Tiết (Moderation Data Table) */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-outline-variant/30 font-label-mono-sm text-[12px] text-tertiary uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    checked={selectedIds.length === 7}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th className="py-3.5 px-4 min-w-[280px]">Công thức &amp; Món ăn</th>
                <th className="py-3.5 px-4 min-w-[210px]">Tác giả &amp; Cấp bậc</th>
                <th className="py-3.5 px-4 min-w-[170px]">Thời gian &amp; Trạng thái</th>
                <th className="py-3.5 px-4 min-w-[220px]">Đánh giá chất lượng sơ bộ</th>
                <th className="py-3.5 px-4 min-w-[130px]">Tương tác</th>
                <th className="py-3.5 px-4 min-w-[150px] text-right">Thao tác xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
              {/* ROW 1: Ca bong kho tieu */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors ${selectedIds.includes("item-1") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-1")}
                    onChange={() => toggleSelect("item-1")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu5Pa2rlqJnjUNC93unfxE8gkOsbd9TmazS_356A-WpBw4dhO6PuI6rzt_M8E2FJXBg7JhK_b14I_fKj7ybROReH0pBFVWvCSzz7p3gBXklFoYqdcHVuzPq_6s4tjPfHT-pP47yNaBRpGzzJ5PlurQ5vtdsAJd4seNBPBmNRCNia1tWyIXVzjc3BnZf4XD43QDOm7l5XAb70ph5F0oAXYG5BzjD7HWYKvWe2Jwthk9"
                        alt="Cá bống kho tiêu gừng sắn dây"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href="/admin/recipes/item-1"
                        className="font-title-md text-on-surface font-semibold hover:text-primary transition-colors leading-snug"
                      >
                        Cá bống kho tiêu gừng sắn dây
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size={14} className="text-outline" />
                          45 phút
                        </span>
                        <span>•</span>
                        <span>4 phần ăn</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Món kho Nam Bộ
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-primary/20">
                      MB
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Bếp Mẹ Ba
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@bepmeba</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-mono-sm text-[11px] font-medium flex items-center gap-1">
                          <Icon name="military_tech" size={12} />
                          Đầu bếp tinh hoa
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-tertiary mt-0.5">28 bài đã duyệt</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-mono-sm text-[11px] font-semibold w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Chờ duyệt
                    </span>
                    <span className="font-label-mono-sm text-body-sm font-medium text-primary">14 phút trước</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">10:42 • Hôm nay</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary font-medium flex items-center gap-1">
                        <Icon name="check" size={14} />
                        Đạt chuẩn 100%
                      </span>
                      <span className="text-on-surface font-semibold">Ảnh: 4.9/5</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "100%" }} />
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px] font-label-mono-sm text-on-surface-variant">
                      <span className="px-1.5 py-0.2 bg-surface rounded">Đủ định lượng g/ml</span>
                      <span className="px-1.5 py-0.2 bg-surface rounded">Có thời gian bước</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm text-outline">
                    <span className="text-tertiary">Chưa công khai</span>
                    <span className="text-[11px] text-outline">0 lượt xem</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-2 rounded-xl text-secondary hover:bg-secondary-container/40 transition-colors cursor-pointer"
                      title="Duyệt nhanh và xuất bản"
                      type="button"
                      onClick={() => alert("Đã phê duyệt công thức #01!")}
                    >
                      <Icon name="check" size={16} />
                    </button>
                    <button
                      className="p-2 rounded-xl text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                      title="Từ chối công thức"
                      type="button"
                      onClick={() => alert("Từ chối công thức #01.")}
                    >
                      <Icon name="close" size={16} />
                    </button>
                    <Link
                      href="/admin/recipes/item-1"
                      className="p-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors inline-block"
                      title="Xem chi tiết & Thẩm định"
                    >
                      <Icon name="visibility" size={16} />
                    </Link>
                  </div>
                </td>
              </tr>

              {/* ROW 2: Bun cha nuong than hoa */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors ${selectedIds.includes("item-2") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-2")}
                    onChange={() => toggleSelect("item-2")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj5povBQxmCXpEQHHKOoro7eXz-4dbXVlzGieYBG_hthJpK2rYrAW304jsHcHztI5bO3QKDB3iimtcvtH6sYJUOvEvxn-p0AIktibSru7cNkdleJ2B4fCInEuan7-WOs6grD0hiY9hsXYq2a9VujGi6n6sIDM2XhjgYH-aK1GBXQvwcunenFik23Rfh_y3rjneBy9hqlEkcJkAM8KUDTj4NkNsnXQISoWUx534KusS"
                        alt="Bún chả nướng than hoa Hà Nội"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href="/admin/recipes/item-2"
                        className="font-title-md text-on-surface font-semibold hover:text-primary transition-colors leading-snug"
                      >
                        Bún chả nướng than hoa Hà Nội
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size={14} className="text-outline" />
                          60 phút
                        </span>
                        <span>•</span>
                        <span>5 phần ăn</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Bún - Phở - Mì
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-tertiary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-outline-variant">
                      HH
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Lê Hoàng Hải
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@hoanghai_chef</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-[11px] font-medium">
                          Tài khoản mới
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-secondary flex items-center gap-0.5 mt-0.5">
                        <Icon name="check" size={12} />
                        Đã xác thực email
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-mono-sm text-[11px] font-semibold w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Chờ duyệt
                    </span>
                    <span className="font-label-mono-sm text-body-sm font-medium text-on-surface">35 phút trước</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">10:21 • Hôm nay</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-primary font-medium flex items-center gap-1">
                        Cần thẩm định ảnh
                      </span>
                      <span className="text-on-surface font-semibold">Ảnh: 4.1/5</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "82%" }} />
                    </div>
                    <div className="text-[11px] font-label-mono-sm text-tertiary">
                      Cần kiểm tra kỹ bí quyết ướp mật mía &amp; nước hàng
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm text-outline">
                    <span className="text-tertiary">Bài nộp đầu tay</span>
                    <span className="text-[11px] text-outline">Chờ duyệt lần 1</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-2 rounded-xl text-secondary hover:bg-secondary-container/40 transition-colors cursor-pointer"
                      title="Duyệt nhanh và xuất bản"
                      type="button"
                      onClick={() => alert("Đã phê duyệt công thức #02!")}
                    >
                      <Icon name="check" size={16} />
                    </button>
                    <button
                      className="p-2 rounded-xl text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                      title="Từ chối công thức"
                      type="button"
                      onClick={() => alert("Từ chối công thức #02.")}
                    >
                      <Icon name="close" size={16} />
                    </button>
                    <Link
                      href="/admin/recipes/item-2"
                      className="p-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors inline-block"
                      title="Xem chi tiết & Thẩm định"
                    >
                      <Icon name="visibility" size={16} />
                    </Link>
                  </div>
                </td>
              </tr>

              {/* ROW 3: Che hat sen long nhan */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors ${selectedIds.includes("item-3") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-3")}
                    onChange={() => toggleSelect("item-3")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqczu69SLoUdP3lrLyOYNxwb6qrIHfX5PlEvdEfdet2yiw-Q5cbExI0bhJ4arWk2qM4OnIXf-kPyfDxh8tdj_QgZVmsW_r3geF8GLqTpdAAMeriqbARF2UuZUlMiOWGpc8wKLqZq4zjgkgQq8MwDgv60KNZ4N-OGjnmOev_pWjSkCjKWePNukJOryzfUARyRfx8E4FBh-Xbh6trMDvx-GzUmRWjROCEk3feF4dNakC"
                        alt="Chè hạt sen long nhãn Hưng Yên"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href="/admin/recipes/item-3"
                        className="font-title-md text-on-surface font-semibold hover:text-primary transition-colors leading-snug"
                      >
                        Chè hạt sen long nhãn Hưng Yên
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size={14} className="text-outline" />
                          40 phút
                        </span>
                        <span>•</span>
                        <span>6 bát</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Ăn vặt &amp; Chè
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-tertiary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-outline-variant">
                      MT
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Minh Trang
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@minhtrang_kitchen</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-[11px] font-medium">
                          Tài khoản mới
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-tertiary mt-0.5">2 bài đã đăng</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-mono-sm text-[11px] font-semibold w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Chờ duyệt
                    </span>
                    <span className="font-label-mono-sm text-body-sm font-medium text-on-surface">48 phút trước</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">10:08 • Hôm nay</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-outline font-medium flex items-center gap-1">
                        Cần sửa định lượng
                      </span>
                      <span className="text-on-surface font-semibold">Ảnh: 4.6/5</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5">
                      <div className="bg-outline h-1.5 rounded-full" style={{ width: "70%" }} />
                    </div>
                    <div className="text-[11px] font-label-mono-sm text-error">
                      Thiếu số gam đường phèn ở Bước 2
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm text-outline">
                    <span className="text-tertiary">Chờ phản hồi</span>
                    <span className="text-[11px] text-outline">Tác giả đang online</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-2 rounded-xl text-primary hover:bg-primary-fixed transition-colors cursor-pointer"
                      title="Gửi yêu cầu bổ sung"
                      type="button"
                      onClick={() => alert("Đã gửi yêu cầu bổ sung định lượng.")}
                    >
                      <Icon name="warning" size={16} />
                    </button>
                    <button
                      className="p-2 rounded-xl text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                      title="Từ chối công thức"
                      type="button"
                      onClick={() => alert("Từ chối công thức #03.")}
                    >
                      <Icon name="close" size={16} />
                    </button>
                    <Link
                      href="/admin/recipes/item-3"
                      className="p-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors inline-block"
                      title="Xem chi tiết & Thẩm định"
                    >
                      <Icon name="visibility" size={16} />
                    </Link>
                  </div>
                </td>
              </tr>

              {/* ROW 4: Canh cua dong (Published) */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors ${selectedIds.includes("item-4") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-4")}
                    onChange={() => toggleSelect("item-4")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCusiZRpdkO2HDlQsZ2miob639UN9Cu-EmMszY9V2GwuhQ-KJBjzyMDIHONYJZA3Gc53yROp7oy3Xfl9zWyg4tgrWLBoPdo9f_igC_jIzHS42ncYowf5Z2_vJ2KRLvmOcjoNrhWqKEe7x47120t07Ldc1AmYcO52IwVrXlYoUvFdv4HX5sLfnd52spjX6h8wbtI2s2YNYv4u0uEH63LAsZKpbYddtpzngGQfRvwAAgE"
                        alt="Canh cua đồng mồng tơi mướp hương"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href="/recipes/canh-cua-dong"
                        className="font-title-md text-on-surface font-semibold hover:text-primary transition-colors leading-snug"
                      >
                        Canh cua đồng mồng tơi mướp hương
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size={14} className="text-outline" />
                          30 phút
                        </span>
                        <span>•</span>
                        <span>4 phần ăn</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Canh thanh nhiệt
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-primary/20">
                      MB
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Bếp Mẹ Ba
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@bepmeba</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-mono-sm text-[11px] font-medium">
                          Đầu bếp tinh hoa
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-tertiary mt-0.5">28 bài đã duyệt</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Đã xuất bản
                    </span>
                    <span className="font-label-mono-sm text-body-sm text-on-surface">Hôm qua, 14:10</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">Duyệt bởi Phúc LH</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary font-medium flex items-center gap-1">
                        Chuẩn Mâm Cơm Việt
                      </span>
                      <span className="text-on-surface font-semibold">Ảnh: 5.0/5</span>
                    </div>
                    <div className="text-[11px] font-label-mono-sm text-tertiary">
                      Đã phân tích dị ứng: cua đồng &amp; hải sản nước ngọt
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm">
                    <span className="text-on-surface font-semibold">18.240 xem</span>
                    <span className="text-secondary text-[11px] font-medium flex items-center gap-1">
                      <Icon name="star" size={12} className="text-primary" />
                      4.9 (142 vote)
                    </span>
                    <span className="text-outline text-[11px]">840 lượt lưu</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href="/recipes/canh-cua-dong"
                      className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors inline-block"
                      title="Xem trang người dùng công khai"
                    >
                      <Icon name="open_in_new" size={16} />
                    </Link>
                    <button
                      className="p-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Tạm ẩn bài viết"
                      type="button"
                      onClick={() => alert("Đã tạm ẩn bài viết.")}
                    >
                      <Icon name="visibility_off" size={16} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* ROW 5: Thit kho hot vit (Published) */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors ${selectedIds.includes("item-5") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-5")}
                    onChange={() => toggleSelect("item-5")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKYKy8LONRiiijuq98Ug_N2FUHxmYC8omrt1MUoO9lbYUOMyyh1W0nazKd66SaDHi_kU8pl84B_6x3GAEDETL3SXsOSaGxWsZkipjt9FraQRmR-Hn6SlmYoaLPVAJlP58O6XbeJvh5HSDovHZ9YGyFhI4D98Bcn_DwIRfaes0RAyCPe2LmHcN7L5HsJ50TKqJ-iZjaKwkiuKJyOGjlt_wtXimtbLfgonn3BS0nEtmG"
                        alt="Thịt kho hột vịt nước dừa xiêm"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href="/recipes/thit-kho-tau"
                        className="font-title-md text-on-surface font-semibold hover:text-primary transition-colors leading-snug"
                      >
                        Thịt kho hột vịt nước dừa xiêm
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size={14} className="text-outline" />
                          90 phút
                        </span>
                        <span>•</span>
                        <span>6 phần ăn</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Món kho Nam Bộ
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-outline-variant">
                      CL
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Bếp Cô Lan
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@lan_kitchen</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-mono-sm text-[11px] font-medium">
                          Đầu bếp uy tín
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-tertiary mt-0.5">16 bài đã duyệt</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Đã xuất bản
                    </span>
                    <span className="font-label-mono-sm text-body-sm text-on-surface">2 ngày trước</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">Duyệt tự động</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-secondary font-medium">Đạt chuẩn 98%</span>
                      <span className="text-on-surface font-semibold">Ảnh: 4.8/5</span>
                    </div>
                    <div className="text-[11px] font-label-mono-sm text-tertiary">
                      Thời gian ninh nhỏ lửa chi tiết từng giai đoạn
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm">
                    <span className="text-on-surface font-semibold">15.280 xem</span>
                    <span className="text-secondary text-[11px] font-medium flex items-center gap-1">
                      <Icon name="star" size={12} className="text-primary" />
                      4.8 (98 vote)
                    </span>
                    <span className="text-outline text-[11px]">720 lượt lưu</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href="/recipes/thit-kho-tau"
                      className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors inline-block"
                      title="Xem trang người dùng công khai"
                    >
                      <Icon name="open_in_new" size={16} />
                    </Link>
                    <button
                      className="p-2 rounded-xl text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Tạm ẩn bài viết"
                      type="button"
                      onClick={() => alert("Đã tạm ẩn bài viết.")}
                    >
                      <Icon name="visibility_off" size={16} />
                    </button>
                  </div>
                </td>
              </tr>

              {/* ROW 6: Goi ga mang cut (Needs revision) */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors ${selectedIds.includes("item-6") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-6")}
                    onChange={() => toggleSelect("item-6")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr5HaS0A1YrIdTptVq2zvlFR4suqxGl1RwuorerKw304RxL1hVByJ8cN9bLoF0gwjMcaokqdImSVbmyvDvk56-b7AUe5HbHm07zUTn-xKeTIQXLQO-Q8oBEGtjhMwtXus7M8HI7f1qox5BWT-mKAcdKJEI6SiI8pYYoK0QSeoczMJuR_H_9I122gEBQVmkIIeagfGs0XHlK4U-3q_RkkSyOSz5rcEsVQY9SIBo5WKt"
                        alt="Gỏi gà măng cụt chua ngọt Lái Thiêu"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface font-semibold hover:text-primary transition-colors leading-snug">
                        Gỏi gà măng cụt chua ngọt Lái Thiêu
                      </span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="schedule" size={14} className="text-outline" />
                          50 phút
                        </span>
                        <span>•</span>
                        <span>4 phần ăn</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                          Món xào &amp; Gỏi
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-tertiary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-outline-variant">
                      QB
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Đặng Quốc Bảo
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@quocbao_cook</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-[11px] font-medium">
                          Thành viên mới
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-tertiary mt-0.5">3 bài đã nộp</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-mono-sm text-[11px] font-semibold w-max">
                      Yêu cầu sửa
                    </span>
                    <span className="font-label-mono-sm text-body-sm text-on-surface">Trả về 2 giờ trước</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">Bởi Kiểm duyệt viên 02</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-error-container/30 p-2 rounded-xl border border-error/20">
                    <span className="text-error font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1">
                      <Icon name="warning" size={14} />
                      Thiếu cảnh báo an toàn
                    </span>
                    <div className="text-[11px] font-label-mono-sm text-on-surface-variant">
                      Chưa nêu cách sơ chế khử mủ măng cụt xanh và lưu ý dị ứng mủ quả.
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm text-outline">
                    <span className="text-tertiary">Chưa duyệt lại</span>
                    <span className="text-[11px] text-outline">Đã gửi tin nhắn nhắc</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Xem lịch sử trao đổi"
                      type="button"
                      onClick={() => alert("Lịch sử trao đổi với tác giả: Đã yêu cầu thêm lưu ý dị ứng mủ măng cụt.")}
                    >
                      <Icon name="chat" size={16} />
                    </button>
                    <Link
                      href="/admin/recipes/item-6"
                      className="p-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors inline-block"
                      title="Xem bài viết gốc"
                    >
                      <Icon name="visibility" size={16} />
                    </Link>
                  </div>
                </td>
              </tr>

              {/* ROW 7: Bo ne banh mi (Hidden) */}
              <tr className={`hover:bg-surface-container-low/50 transition-colors bg-error-container/10 ${selectedIds.includes("item-7") ? "bg-surface-container/20" : ""}`}>
                <td className="py-4 px-4 text-center align-top">
                  <input
                    checked={selectedIds.includes("item-7")}
                    onChange={() => toggleSelect("item-7")}
                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0 shadow-sm relative grayscale opacity-75">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmwtkSH1NKNx6ddNT1m7YlTlAfZkVyFU7t9gluVWvENlUvZLNdEDoaN3nrlBncN4DpFmLEBvZWXnLoCHkOxDstoAw4HVBdM7Mk44ObT0eHMX-6uBHwtyXCkI70RAR2fkD7LD1IdrSvrvNso3h3KGh8sBNs7wR64EZi_vLtYbXdmgD1fwFN9cZYHYZKfAKas1weTbruA91YgPPGbl5Jfrrd4U4OPLoWXS0eLE9IhzcQ"
                        alt="Bò né bánh mì sốt tiêu đen"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-outline font-semibold line-through leading-snug">
                        Bò né bánh mì sốt tiêu đen
                      </span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-outline font-label-mono-sm text-label-mono-sm">
                        <span>25 phút</span>
                        <span>•</span>
                        <span>2 phần ăn</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-outline text-[11px]">
                          Bò - Bít tết
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-tertiary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-outline-variant">
                      HD
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-on-surface text-[14px] font-semibold truncate leading-tight">
                        Hoàng Duy
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">@duy_foodie</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[11px] font-medium">
                          Tài khoản bị cảnh cáo
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-error font-label-mono-sm text-[11px] font-semibold w-max">
                      Đã ẩn
                    </span>
                    <span className="font-label-mono-sm text-body-sm text-error">3 ngày trước</span>
                    <span className="font-label-mono-sm text-[11px] text-outline">Bị khóa bởi Admin</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1.5 bg-error-container/40 p-2 rounded-xl border border-error/30">
                    <span className="text-error font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1">
                      Vi phạm bản quyền
                    </span>
                    <div className="text-[11px] font-label-mono-sm text-on-surface-variant">
                      Sao chép 100% hình ảnh và công thức của bên thứ 3 không ghi nguồn.
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="flex flex-col gap-1 font-label-mono-sm text-label-mono-sm text-outline">
                    <span className="text-error">3 lượt báo cáo</span>
                    <span className="text-[11px] text-outline">Đã lưu trữ vi phạm</span>
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="p-2 rounded-xl text-tertiary hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Mở khóa và cho phép sửa"
                      type="button"
                      onClick={() => alert("Đã mở khóa công thức cho tác giả cập nhật.")}
                    >
                      <Icon name="lock_open" size={16} />
                    </button>
                    <button
                      className="p-2 rounded-xl text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                      title="Xóa vĩnh viễn"
                      type="button"
                      onClick={() => alert("Đã xóa vĩnh viễn công thức vi phạm.")}
                    >
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6. Chân Bảng Điều Khiển & Phân Trang (Table Footer & Pagination) */}
        <div className="px-space-md py-4 bg-surface-container-low/50 border-t border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          {/* Số lượng hiển thị */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Hiển thị <strong className="text-on-surface font-semibold">1 - 7</strong> trong tổng số{" "}
              <strong className="text-on-surface font-semibold">4.520</strong> công thức (
              <span className="text-primary font-medium">14 bài chờ duyệt cần xử lý</span>)
            </span>
            <div className="flex items-center gap-1.5 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span>Xem:</span>
              <select className="px-2 py-1 rounded-lg bg-surface text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary">
                <option>10 hàng / trang</option>
                <option>20 hàng / trang</option>
                <option>50 hàng / trang</option>
                <option>100 hàng / trang</option>
              </select>
            </div>
          </div>

          {/* Nút phân trang */}
          <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm">
            <button
              className="px-3 py-1.5 rounded-xl bg-surface text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-outline-variant/40 transition-colors disabled:opacity-50 cursor-pointer"
              disabled
              type="button"
            >
              Trang trước
            </button>
            <button
              className="w-8 h-8 rounded-xl bg-primary text-on-primary font-semibold flex items-center justify-center shadow-sm cursor-pointer"
              type="button"
            >
              1
            </button>
            <button
              className="w-8 h-8 rounded-xl bg-surface text-on-surface hover:bg-surface-container flex items-center justify-center border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
            >
              2
            </button>
            <button
              className="w-8 h-8 rounded-xl bg-surface text-on-surface hover:bg-surface-container flex items-center justify-center border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
            >
              3
            </button>
            <span className="px-1 text-tertiary">...</span>
            <button
              className="w-8 h-8 rounded-xl bg-surface text-on-surface hover:bg-surface-container flex items-center justify-center border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
            >
              452
            </button>
            <button
              className="px-3 py-1.5 rounded-xl bg-surface text-on-surface hover:bg-surface-container hover:text-on-surface border border-outline-variant/40 transition-colors cursor-pointer"
              type="button"
            >
              Trang tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Cam kết & Quy chuẩn kiểm duyệt nội dung */}
      <div className="flex items-center justify-between gap-space-md p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="verified_user" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-title-md text-body-sm text-on-surface font-semibold">
              Quy chuẩn kiểm duyệt RecipeHub
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Cam kết phản hồi và xử lý duyệt bài từ cộng đồng trong vòng <strong>60 phút</strong> từ lúc nộp. Đảm bảo đúng định lượng gam, ml và an toàn vệ sinh thực phẩm.
            </span>
          </div>
        </div>
        <Link
          className="hidden sm:inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-primary hover:underline whitespace-nowrap"
          href="/admin/settings"
        >
          <span>Đọc bộ quy tắc kiểm duyệt</span>
          <Icon name="arrow_forward" size={14} />
        </Link>
      </div>
    </div>
  );
}
