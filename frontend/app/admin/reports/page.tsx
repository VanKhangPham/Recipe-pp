"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface ReportItem {
  id: string;
  reportCode: string;
  user: {
    handle: string;
    initials: string;
    avatarBg: string;
    avatarColor: string;
    badgeText: string;
    isUrgent?: boolean;
    isBot?: boolean;
    isPartner?: boolean;
    isVerified?: boolean;
    roleColor?: string;
  };
  contextType: string;
  content: React.ReactNode;
  recipeTitle: string;
  recipeCode: string;
  timeAgo: string;
  reason: string;
  reasonBadgeClass: string;
  sourceText: string;
  sourceIcon: string;
  riskScore: number;
  riskLevel: string;
  riskBadgeClass: string;
  isResolved?: boolean;
}

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = React.useState<"reports" | "all" | "ratings" | "removed" | "history">("reports");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [reasonFilter, setReasonFilter] = React.useState("Tất cả vi phạm");
  const [sourceFilter, setSourceFilter] = React.useState("Tất cả nguồn");
  const [severityFilter, setSeverityFilter] = React.useState("Tất cả");

  const [selectedIds, setSelectedIds] = React.useState<string[]>(["rep-1", "rep-2"]);
  const [activeReportId, setActiveReportId] = React.useState<string>("rep-1");
  const [penaltyType, setPenaltyType] = React.useState<string>("ban_7_days");
  const [adminNote, setAdminNote] = React.useState<string>(
    "Phát hiện spam số điện thoại hàng loạt trên 3 công thức món canh khác nhau."
  );
  const [showToast, setShowToast] = React.useState<string | null>(null);

  const reportsList: ReportItem[] = [
    {
      id: "rep-1",
      reportCode: "REP-2024-0318",
      user: {
        handle: "@thuhaxinh",
        initials: "TH",
        avatarBg: "bg-error-container",
        avatarColor: "text-on-error-container",
        badgeText: "Thành viên mới (12 ngày)",
        isUrgent: true,
      },
      contextType: "Bình luận công thức",
      content: (
        <>
          <span className="bg-error-container/60 text-on-error-container px-1 py-0.5 rounded font-medium">
            Bán thuốc giảm cân đông y gia truyền
          </span>{" "}
          cam kết giảm 5kg sau 1 tuần{" "}
          <span className="bg-error-container text-on-error-container px-1 py-0.5 rounded font-mono font-medium">
            zalo 0987xxx
          </span>
          ...
        </>
      ),
      recipeTitle: "Canh chua cá lóc chuẩn vị miền Tây",
      recipeCode: "#REC-0028",
      timeAgo: "2 phút trước",
      reason: "Spam / Bán hàng",
      reasonBadgeClass: "bg-error-container text-on-error-container",
      sourceText: "Cộng đồng (4 lượt)",
      sourceIcon: "group",
      riskScore: 98,
      riskLevel: "Nguy cơ cao",
      riskBadgeClass: "text-error bg-error-container",
    },
    {
      id: "rep-2",
      reportCode: "REP-2024-0317",
      user: {
        handle: "@bot_deal_anngon",
        initials: "BT",
        avatarBg: "bg-surface-container",
        avatarColor: "text-on-surface-variant",
        badgeText: "Nghi vấn Bot tự động",
        isBot: true,
      },
      contextType: "Bình luận công thức",
      content: (
        <>
          Nhận quà miễn phí tải app ngay tại{" "}
          <span className="bg-error-container text-on-error-container px-1 py-0.5 rounded font-mono font-medium underline">
            bit.ly/nhan-qua-an-tet
          </span>
          ...
        </>
      ),
      recipeTitle: "Thịt ba chỉ nướng than hoa",
      recipeCode: "#REC-0145",
      timeAgo: "15 phút trước",
      reason: "Lừa đảo / Phishing",
      reasonBadgeClass: "bg-error text-on-error",
      sourceText: "AI Sentinel (99%)",
      sourceIcon: "smart_toy",
      riskScore: 94,
      riskLevel: "Độc hại cao",
      riskBadgeClass: "text-error bg-error-container",
    },
    {
      id: "rep-3",
      reportCode: "REP-2024-0316",
      user: {
        handle: "@hung_nguyen88",
        initials: "HN",
        avatarBg: "bg-surface-container-high",
        avatarColor: "text-on-surface",
        badgeText: "Thành viên 2 năm",
      },
      contextType: "Đánh giá 1 sao",
      content: (
        <>
          Món này nấu dở tệ, xúc phạm ẩm thực Huế,{" "}
          <span className="bg-error-container/60 text-on-error-container px-1 py-0.5 rounded font-medium">
            tác giả ngu ngốc đừng bao giờ nấu ăn nữa
          </span>
          ...
        </>
      ),
      recipeTitle: "Bún bò Huế truyền thống",
      recipeCode: "#REC-0089",
      timeAgo: "45 phút trước",
      reason: "Công kích cá nhân",
      reasonBadgeClass: "bg-error-container text-on-error-container",
      sourceText: "Tác giả: Bếp Mẹ Ba",
      sourceIcon: "person_alert",
      riskScore: 75,
      riskLevel: "Mức vừa",
      riskBadgeClass: "text-on-surface-variant bg-surface-container-high",
    },
    {
      id: "rep-4",
      reportCode: "REP-2024-0315",
      user: {
        handle: "@lan_chef",
        initials: "LC",
        avatarBg: "bg-secondary-fixed",
        avatarColor: "text-on-secondary-fixed",
        badgeText: "Đầu bếp chứng nhận",
        isVerified: true,
      },
      contextType: "Bình luận góp ý",
      content: "Công thức thiếu muối, cho thêm chút tiêu sẽ ngon và thơm hơn nhiều ạ.",
      recipeTitle: "Bò né sốt tiêu đen",
      recipeCode: "#REC-0012",
      timeAgo: "2 giờ trước",
      reason: "Báo cáo nhầm lẫn",
      reasonBadgeClass: "bg-surface-container text-on-surface-variant",
      sourceText: "Đã bỏ qua (Hợp lệ)",
      sourceIcon: "check",
      riskScore: 12,
      riskLevel: "An toàn",
      riskBadgeClass: "text-secondary bg-secondary-fixed",
      isResolved: true,
    },
    {
      id: "rep-5",
      reportCode: "REP-2024-0314",
      user: {
        handle: "@chef_minhkhoi",
        initials: "MK",
        avatarBg: "bg-primary-fixed",
        avatarColor: "text-on-primary-fixed",
        badgeText: "Thành viên đối tác",
        isPartner: true,
      },
      contextType: "Khiếu nại bản quyền",
      content: "Hình ảnh này ăn cắp từ blog cá nhân của tôi mà không trích nguồn! Yêu cầu gỡ bỏ hình ảnh công thức.",
      recipeTitle: "Chè hạt sen long nhãn Huế",
      recipeCode: "#REC-0310",
      timeAgo: "3 giờ trước",
      reason: "Bản quyền hình ảnh",
      reasonBadgeClass: "bg-surface-container text-on-surface-variant",
      sourceText: "Chính chủ gửi link gốc",
      sourceIcon: "verified",
      riskScore: 60,
      riskLevel: "Xác minh ảnh",
      riskBadgeClass: "text-on-surface-variant bg-surface-container-high",
    },
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(reportsList.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApplyPenalty = () => {
    setShowToast("Đã thi hành quyết định xử phạt thành công và gửi thông báo.");
    setTimeout(() => setShowToast(null), 4000);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
            <Icon name="check" size={18} />
          </div>
          <span className="font-body-sm text-body-sm font-medium">{showToast}</span>
          <button
            onClick={() => setShowToast(null)}
            className="p-1 text-inverse-on-surface/60 hover:text-inverse-on-surface rounded-lg"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {/* Top Navigation & Header Bar */}
      <div className="px-space-lg py-space-md flex flex-col gap-space-sm bg-surface">
        {/* Breadcrumb */}
        <div className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-on-surface-variant">
          <Link href="/admin" className="hover:text-primary transition-colors">Hệ thống quản trị</Link>
          <span>/</span>
          <span>Tương tác cộng đồng</span>
          <span>/</span>
          <span className="text-on-surface font-semibold">Bình luận &amp; Báo cáo vi phạm</span>
        </div>

        {/* Title & Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Hàng chờ Xử lý Vi phạm &amp; Kiểm duyệt Bình luận
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Giám sát phản hồi, rà soát báo cáo vi phạm tiêu chuẩn cộng đồng từ người dùng và hệ thống AI phát hiện tự động. Cam kết xử lý trong 24h.
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              className="flex items-center gap-2 px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-title-md text-body-sm shadow-sm transition-all active:scale-[0.98]"
              type="button"
            >
              <Icon name="download" size={18} />
              <span>Xuất nhật ký vi phạm (CSV)</span>
            </button>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-title-md text-body-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <Icon name="rule" size={18} />
              <span>Cấu hình từ khóa cấm</span>
            </Link>
            <button
              onClick={() => {
                setShowToast("Đã đánh dấu đã đọc tất cả báo cáo chờ xử lý.");
                setTimeout(() => setShowToast(null), 3000);
              }}
              className="flex items-center gap-2 px-space-md py-2 rounded-xl bg-primary text-on-primary font-title-md text-body-sm shadow-sm hover:bg-primary-container transition-all active:scale-[0.98]"
              type="button"
            >
              <Icon name="done_all" size={18} />
              <span>Đánh dấu đã đọc tất cả</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="px-space-lg pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* KPI Card 1: Urgent */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-error/5 rounded-full pointer-events-none" />
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Chờ xử lý khẩn cấp
                </span>
                <span className="font-headline-md text-headline-md text-error font-bold mt-1">3 báo cáo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
                <Icon name="warning" size={24} />
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant">2 người dùng, 1 AI gắn cờ</span>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-mono-sm text-label-mono-sm font-semibold">
                ~18 phút
              </span>
            </div>
          </div>

          {/* KPI Card 2: Today comments */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Bình luận &amp; Đánh giá hôm nay
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1">1.840</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <Icon name="chat" size={24} />
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-secondary font-medium flex items-center gap-1">
                <Icon name="trending_up" size={16} /> +15.2% hôm qua
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium">
                Tích cực: 96.8%
              </span>
            </div>
          </div>

          {/* KPI Card 3: Penalties */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Đã xử phạt tuần này
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1">42 vụ việc</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center">
                <Icon name="gavel" size={24} />
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center gap-2 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span className="px-1.5 py-0.5 rounded bg-surface-container">28 cảnh cáo</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container">11 xóa bỏ</span>
              <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container">3 khóa tài khoản</span>
            </div>
          </div>

          {/* KPI Card 4: AI Auto Shield */}
          <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Chặn tự động bằng AI
                </span>
                <span className="font-headline-md text-headline-md text-secondary font-bold mt-1">88.5%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <Icon name="verified_user" size={24} />
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Turnstile &amp; NLP Tiếng Việt</span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" title="Đang chạy bảo vệ chủ động" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Status Tabs & Filter Toolbar */}
      <div className="px-space-lg flex flex-col gap-space-md">
        {/* Tabs Header */}
        <div className="flex items-center justify-between overflow-x-auto pb-1 bg-surface-container-low p-1.5 rounded-2xl">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-md text-body-sm transition-all ${
                activeTab === "reports"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
              type="button"
            >
              <Icon name="inbox" size={18} />
              <span>Hàng chờ báo cáo</span>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-mono-sm text-label-mono-sm font-bold">
                3 khẩn cấp
              </span>
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-md text-body-sm transition-all ${
                activeTab === "all"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
              type="button"
            >
              <span>Tất cả bình luận</span>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">12.450</span>
            </button>
            <button
              onClick={() => setActiveTab("ratings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-md text-body-sm transition-all ${
                activeTab === "ratings"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
              type="button"
            >
              <span>Đánh giá &amp; Chấm sao</span>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">4.120</span>
            </button>
            <button
              onClick={() => setActiveTab("removed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-md text-body-sm transition-all ${
                activeTab === "removed"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
              type="button"
            >
              <span>Nội dung đã gỡ bỏ</span>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">156</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-title-md text-body-sm transition-all ${
                activeTab === "history"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
              type="button"
            >
              <span>Lịch sử xử phạt</span>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">98</span>
            </button>
          </div>
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            <button className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface shadow-xs" title="Chế độ xem bảng chi tiết" type="button">
              <Icon name="table_rows" size={18} />
            </button>
            <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface" title="Chế độ tách khung kiểm tra (Split View)" type="button">
              <Icon name="vertical_split" size={18} />
            </button>
          </div>
        </div>

        {/* Filter Control Bar */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Icon name="search" size={20} />
            </span>
            <input
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all"
              placeholder="Tìm theo nội dung, tài khoản vi phạm, người báo cáo, ID công thức... (Ctrl + K)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Selectors */}
          <div className="flex items-center gap-space-sm flex-wrap">
            {/* Reason Filter */}
            <div className="relative">
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-3 pr-8 py-2 rounded-xl focus:outline-none cursor-pointer"
              >
                <option>Lý do: Tất cả vi phạm</option>
                <option>Spam liên kết / Bán hàng</option>
                <option>Ngôn từ xúc phạm / Đả kích</option>
                <option>Sai lệch an toàn thực phẩm</option>
                <option>Quảng cáo cờ bạc / Lừa đảo</option>
                <option>Bản quyền hình ảnh</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <Icon name="expand_more" size={16} />
              </span>
            </div>

            {/* Detection Source */}
            <div className="relative">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-3 pr-8 py-2 rounded-xl focus:outline-none cursor-pointer"
              >
                <option>Nguồn: Tất cả nguồn</option>
                <option>Cộng đồng tố cáo</option>
                <option>AI tự động gắn cờ (NLP)</option>
                <option>Báo cáo bởi Tác giả công thức</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <Icon name="expand_more" size={16} />
              </span>
            </div>

            {/* Severity */}
            <div className="relative">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-3 pr-8 py-2 rounded-xl focus:outline-none cursor-pointer"
              >
                <option>Mức độ: Tất cả</option>
                <option>Khẩn cấp / Nguy hiểm</option>
                <option>Trung bình</option>
                <option>Nhẹ</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                <Icon name="expand_more" size={16} />
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchQuery("");
                setReasonFilter("Lý do: Tất cả vi phạm");
                setSourceFilter("Nguồn: Tất cả nguồn");
                setSeverityFilter("Mức độ: Tất cả");
              }}
              className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              title="Đặt lại bộ lọc"
              type="button"
            >
              <Icon name="restart_alt" size={18} />
            </button>
          </div>
        </div>

        {/* Floating Bulk Actions Banner (Active when rows selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between px-space-md py-2.5 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-xl transition-all">
            <div className="flex items-center gap-space-md">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-bold">
                {selectedIds.length}
              </span>
              <span className="font-title-md text-body-md text-inverse-on-surface font-medium">
                Đã chọn {selectedIds.length} báo cáo vi phạm cần xử lý tập thể
              </span>
            </div>
            <div className="flex items-center gap-space-sm flex-wrap">
              <button
                onClick={() => {
                  setShowToast(`Đã xóa nội dung và cảnh cáo ${selectedIds.length} người dùng.`);
                  setSelectedIds([]);
                }}
                className="px-space-md py-1.5 rounded-xl bg-error text-on-error font-title-md text-body-sm hover:opacity-95 transition-all"
                type="button"
              >
                Xóa nội dung &amp; Cảnh cáo người dùng
              </button>
              <button
                onClick={() => {
                  setShowToast(`Đã bỏ qua ${selectedIds.length} báo cáo hợp lệ.`);
                  setSelectedIds([]);
                }}
                className="px-space-md py-1.5 rounded-xl bg-surface-container-highest/20 text-inverse-on-surface hover:bg-surface-container-highest/30 font-title-md text-body-sm transition-all"
                type="button"
              >
                Bỏ qua &amp; Đánh dấu hợp lệ
              </button>
              <button
                onClick={() => {
                  setShowToast(`Đã chuyển ${selectedIds.length} báo cáo cho kiểm duyệt viên cấp cao.`);
                  setSelectedIds([]);
                }}
                className="px-space-md py-1.5 rounded-xl bg-surface-container-highest/20 text-inverse-on-surface hover:bg-surface-container-highest/30 font-title-md text-body-sm transition-all"
                type="button"
              >
                Chuyển kiểm duyệt viên cấp cao
              </button>
              <button
                className="p-1 rounded-lg text-inverse-on-surface/60 hover:text-inverse-on-surface"
                onClick={() => setSelectedIds([])}
                title="Đóng thanh chọn"
                type="button"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Split Layout: Reports Queue Table + Live Inspection Panel */}
      <div className="px-space-lg py-space-md grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Data Table (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          <div className="rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden">
            {/* Table Header Info Strip */}
            <div className="px-space-md py-3 bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-title-md text-body-md font-semibold text-on-surface">
                  Danh sách báo cáo chờ thẩm định
                </span>
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                  {reportsList.length} bản ghi
                </span>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">Tự động làm mới sau 45s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
                    <th className="py-3 px-space-md w-10">
                      <input
                        checked={selectedIds.length === reportsList.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                        type="checkbox"
                      />
                    </th>
                    <th className="py-3 px-space-md">Đối tượng vi phạm</th>
                    <th className="py-3 px-space-md">Nội dung &amp; Vị trí</th>
                    <th className="py-3 px-space-md">Lý do &amp; Nguồn</th>
                    <th className="py-3 px-space-md text-center">Rủi ro AI</th>
                    <th className="py-3 px-space-md text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {reportsList.map((row) => {
                    const isSelected = selectedIds.includes(row.id);
                    const isActive = activeReportId === row.id;

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setActiveReportId(row.id)}
                        className={`transition-colors cursor-pointer group ${
                          isActive
                            ? "bg-surface-container-low/70"
                            : isSelected
                            ? "bg-surface-container-low/40 hover:bg-surface-container-low"
                            : row.isResolved
                            ? "hover:bg-surface-container-low/60 opacity-75"
                            : "hover:bg-surface-container-low/60"
                        }`}
                      >
                        <td
                          className="py-space-md px-space-md align-top"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            checked={isSelected}
                            onChange={() => handleToggleRow(row.id)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer mt-1"
                            type="checkbox"
                          />
                        </td>
                        <td className="py-space-md px-space-md align-top">
                          <div className="flex items-start gap-space-sm">
                            <div
                              className={`w-9 h-9 rounded-full ${row.user.avatarBg} ${row.user.avatarColor} flex items-center justify-center font-bold font-headline-sm text-[14px] flex-shrink-0`}
                            >
                              {row.user.initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-title-md text-body-sm font-bold text-on-surface">
                                  {row.user.handle}
                                </span>
                                {row.user.isUrgent && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-error" title="Cần xử lý ngay" />
                                )}
                              </div>
                              <span
                                className={`font-label-mono-sm text-label-mono-sm ${
                                  row.user.isBot
                                    ? "text-error font-medium"
                                    : row.user.isVerified
                                    ? "text-secondary font-medium"
                                    : "text-on-surface-variant"
                                }`}
                              >
                                {row.user.badgeText}
                              </span>
                              <span
                                className={`mt-1 inline-flex items-center gap-1 font-body-sm text-[12px] ${
                                  row.contextType.includes("1 sao")
                                    ? "text-error font-medium"
                                    : row.isResolved
                                    ? "text-on-surface-variant"
                                    : "text-primary"
                                }`}
                              >
                                <Icon
                                  name={
                                    row.contextType.includes("Đánh giá")
                                      ? "star"
                                      : row.contextType.includes("Khiếu nại")
                                      ? "flag"
                                      : "chat_bubble"
                                  }
                                  size={14}
                                />
                                {row.contextType}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md align-top max-w-[280px]">
                          <div className="flex flex-col gap-1">
                            <p className="font-body-sm text-body-sm text-on-surface leading-snug">
                              {row.content}
                            </p>
                            <div className="flex items-center gap-1 text-on-surface-variant font-label-mono-sm text-[11px] truncate">
                              <Icon name="menu_book" size={13} />
                              <span className="hover:underline text-primary truncate cursor-pointer">
                                {row.recipeTitle} {row.recipeCode}
                              </span>
                            </div>
                            <span className="font-label-mono-sm text-label-mono-sm text-outline mt-0.5">
                              {row.timeAgo}
                            </span>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md align-top">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm font-semibold w-max ${row.reasonBadgeClass}`}
                            >
                              {row.reason}
                            </span>
                            <span
                              className={`font-body-sm text-[12px] flex items-center gap-1 ${
                                row.isResolved ? "text-secondary" : "text-on-surface-variant"
                              }`}
                            >
                              <Icon name={row.sourceIcon} size={14} />
                              {row.sourceText}
                            </span>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md align-top text-center">
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`font-label-mono-sm text-label-mono-sm font-bold px-2 py-0.5 rounded-md ${row.riskBadgeClass}`}
                            >
                              {row.riskScore}/100
                            </span>
                            <span
                              className={`font-body-sm text-[11px] font-medium mt-0.5 ${
                                row.riskScore >= 90
                                  ? "text-error"
                                  : row.riskScore <= 30
                                  ? "text-secondary"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {row.riskLevel}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-space-md px-space-md align-top text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setActiveReportId(row.id)}
                              className={`p-1.5 rounded-lg shadow-xs transition-colors ${
                                isActive
                                  ? "bg-primary text-on-primary"
                                  : "text-on-surface-variant hover:bg-surface-container"
                              }`}
                              title="Kiểm tra chi tiết"
                              type="button"
                            >
                              <Icon name="visibility" size={16} />
                            </button>
                            {!row.isResolved ? (
                              <>
                                <button
                                  onClick={() => {
                                    setShowToast(`Đã xóa nội dung vi phạm của ${row.user.handle}.`);
                                  }}
                                  className="p-1.5 rounded-lg text-error hover:bg-error-container transition-colors"
                                  title="Xóa tức thì"
                                  type="button"
                                >
                                  <Icon name="delete" size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setShowToast(`Đã bỏ qua báo cáo #${row.reportCode}.`);
                                  }}
                                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                                  title="Bỏ qua"
                                  type="button"
                                >
                                  <Icon name="check_circle" size={16} />
                                </button>
                              </>
                            ) : (
                              <span className="font-label-mono-sm text-[11px] text-secondary font-medium px-2 py-1 rounded bg-secondary-fixed/50">
                                Đã xong
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="px-space-md py-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Hiển thị <span className="font-semibold text-on-surface">1-5</span> trên tổng số{" "}
                <span className="font-semibold text-on-surface">38</span> báo cáo tuần
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg bg-surface-container-lowest text-outline opacity-50 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  <Icon name="chevron_left" size={16} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-bold" type="button">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-mono-sm text-label-mono-sm" type="button">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-mono-sm text-label-mono-sm" type="button">
                  3
                </button>
                <button className="p-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container" type="button">
                  <Icon name="chevron_right" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Inspection & Decision Panel (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md sticky top-20">
          {/* Dossier Card */}
          <div className="rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden flex flex-col">
            {/* Inspection Header */}
            <div className="px-space-md py-space-sm bg-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="policy" size={20} className="text-primary" />
                <span className="font-title-md text-title-md font-bold text-on-surface">
                  Hồ sơ vi phạm #REP-2024-0318
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error font-label-mono-sm text-label-mono-sm font-bold">
                Chờ xử lý (Khẩn cấp)
              </span>
            </div>

            <div className="p-space-md flex flex-col gap-space-md">
              {/* Box 1: Offender Details & Target Context */}
              <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold">
                      TH
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-title-md text-body-md font-bold text-on-surface">@thuhaxinh</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-[10px]">
                          ID: 88419
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Tạo 12 ngày trước | Đã xác thực Email
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-mono-sm text-[11px] text-on-surface-variant">Điểm uy tín</span>
                    <span className="font-label-mono-lg text-label-mono-sm font-bold text-error">38/100 (Rủi ro)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-body-sm">
                  <div className="flex flex-col">
                    <span className="font-label-mono-sm text-[11px] text-on-surface-variant">Lịch sử vi phạm:</span>
                    <span className="text-error font-medium">1 lần cảnh cáo (10 ngày trước)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-mono-sm text-[11px] text-on-surface-variant">Vị trí bài viết:</span>
                    <span className="text-on-surface truncate">Canh chua cá lóc chuẩn vị miền Tây</span>
                  </div>
                </div>

                {/* Original Comment Preview with Visual Callout */}
                <div className="mt-1 p-space-sm rounded-lg bg-surface-container-lowest">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-mono-sm text-[11px] text-outline font-semibold uppercase">
                      Nội dung nguyên văn
                    </span>
                    <span className="font-label-mono-sm text-[10px] text-outline">Gửi lúc 14:22:08 (2 phút trước)</span>
                  </div>
                  <p className="font-body-md text-body-sm text-on-surface italic">
                    “<span className="bg-error-container text-on-error-container px-1 rounded not-italic font-medium">Bán thuốc giảm cân đông y gia truyền</span> cam kết giảm 5kg sau 1 tuần liên hệ zalo <span className="bg-error text-on-error px-1 rounded not-italic font-mono font-medium">0987xxx654</span> cam đoan khỏi mọi mỡ thừa cam kết hoàn tiền 100%”
                  </p>
                </div>
              </div>

              {/* Box 2: Automated RecipeHub AI Evaluation */}
              <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon name="neurology" size={18} className="text-secondary" />
                    <span className="font-title-md text-body-sm font-bold text-on-surface">
                      Phân tích từ RecipeHub AI Sentinel
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[11px] font-bold">
                    98% Xác thực vi phạm
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5 text-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 text-error">
                      <Icon name="cancel" size={16} />
                    </span>
                    <span>Phát hiện số điện thoại Zalo và từ khóa mua bán thuốc chưa cấp phép.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 text-error">
                      <Icon name="cancel" size={16} />
                    </span>
                    <span>Mẫu câu trùng khớp 89% với 2 spam comment bị xóa sáng nay trên công thức món canh.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 text-secondary">
                      <Icon name="check_circle" size={16} />
                    </span>
                    <span>
                      Đề xuất hệ thống: <strong className="text-on-surface">Xóa bình luận lập tức + Cấm bình luận trong 7 ngày</strong>.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Box 3: Decision & Action Form */}
              <form className="flex flex-col gap-space-sm" onSubmit={(e) => { e.preventDefault(); handleApplyPenalty(); }}>
                <span className="font-title-md text-body-sm font-bold text-on-surface">
                  Quyết định xử phạt của Quản trị viên
                </span>

                {/* Radio Options */}
                <div className="flex flex-col gap-2">
                  <label
                    onClick={() => setPenaltyType("warn_1")}
                    className={`flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer transition-colors ${
                      penaltyType === "warn_1"
                        ? "bg-surface-container ring-2 ring-primary/20"
                        : "bg-surface-container-low hover:bg-surface-container"
                    }`}
                  >
                    <input
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                      name="penalty_type"
                      type="radio"
                      checked={penaltyType === "warn_1"}
                      onChange={() => setPenaltyType("warn_1")}
                    />
                    <div className="flex flex-col">
                      <span className="font-title-md text-body-sm font-semibold text-on-surface">
                        Xóa bình luận &amp; Cảnh cáo lần 1
                      </span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        Gửi thư cảnh báo hệ thống vào hòm thư cá nhân của thành viên.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPenaltyType("ban_7_days")}
                    className={`flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer transition-colors ${
                      penaltyType === "ban_7_days"
                        ? "bg-surface-container ring-2 ring-primary/20"
                        : "bg-surface-container-low hover:bg-surface-container"
                    }`}
                  >
                    <input
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                      name="penalty_type"
                      type="radio"
                      checked={penaltyType === "ban_7_days"}
                      onChange={() => setPenaltyType("ban_7_days")}
                    />
                    <div className="flex flex-col">
                      <span className="font-title-md text-body-sm font-semibold text-error">
                        Xóa bình luận &amp; Khóa quyền bình luận 7 ngày (Khuyến nghị)
                      </span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        Chặn toàn bộ tương tác thảo luận, tạo công thức và đánh giá trong 168 giờ.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPenaltyType("ban_forever")}
                    className={`flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer transition-colors ${
                      penaltyType === "ban_forever"
                        ? "bg-surface-container ring-2 ring-primary/20"
                        : "bg-surface-container-low hover:bg-surface-container"
                    }`}
                  >
                    <input
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                      name="penalty_type"
                      type="radio"
                      checked={penaltyType === "ban_forever"}
                      onChange={() => setPenaltyType("ban_forever")}
                    />
                    <div className="flex flex-col">
                      <span className="font-title-md text-body-sm font-semibold text-on-surface">
                        Cấm tài khoản vĩnh viễn (Khóa toàn bộ)
                      </span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        Khóa email, chặn IP đăng ký và ẩn toàn bộ nội dung từng đăng tải.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPenaltyType("dismiss")}
                    className={`flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer transition-colors ${
                      penaltyType === "dismiss"
                        ? "bg-surface-container ring-2 ring-primary/20"
                        : "bg-surface-container-low hover:bg-surface-container"
                    }`}
                  >
                    <input
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary accent-primary"
                      name="penalty_type"
                      type="radio"
                      checked={penaltyType === "dismiss"}
                      onChange={() => setPenaltyType("dismiss")}
                    />
                    <div className="flex flex-col">
                      <span className="font-title-md text-body-sm font-semibold text-on-surface">
                        Bỏ qua báo cáo (Nội dung hợp lệ)
                      </span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        Xác nhận báo cáo vô căn cứ, khôi phục hiển thị bình thường.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Internal Staff Note */}
                <div className="flex flex-col gap-1 mt-1">
                  <label className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium" htmlFor="admin-note">
                    Ghi chú nội bộ của kiểm duyệt viên (Tối đa 200 ký tự):
                  </label>
                  <textarea
                    className="w-full p-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all"
                    id="admin-note"
                    placeholder="Ví dụ: Phát hiện spam số điện thoại hàng loạt trên 3 công thức món canh khác nhau..."
                    rows={2}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>

                {/* Submit Action Group */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    className="w-full py-2.5 rounded-xl bg-error text-on-error font-title-md text-body-md font-semibold hover:opacity-95 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <Icon name="shield" size={18} />
                    <span>Thi hành quyết định xử phạt</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowToast("Đã bỏ qua báo cáo này.");
                      }}
                      className="py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-title-md text-body-sm transition-all"
                      type="button"
                    >
                      Bỏ qua báo cáo này
                    </button>
                    <button
                      onClick={() => {
                        setShowToast("Đang mở hộp thoại gửi email tới @thuhaxinh...");
                      }}
                      className="py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-title-md text-body-sm transition-all flex items-center justify-center gap-1"
                      type="button"
                    >
                      <Icon name="mail" size={16} />
                      <span>Liên hệ người dùng</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Visual Card: Community Moderation Metrics & Compliance Statement */}
      <div className="px-space-lg py-space-xl">
        <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
              <Icon name="verified" size={28} />
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md font-bold text-on-surface">
                Tiêu chuẩn Cộng đồng RecipeHub &amp; Tuân thủ Pháp luật
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 max-w-2xl">
                Tất cả hoạt động rà soát nội dung tuân thủ Nghị định an toàn thông tin mạng, quy chuẩn văn hóa ẩm thực và Bộ quy tắc ứng xử RecipeHub. Mọi hành vi vi phạm nghiêm trọng sẽ được lưu vết ID và chuyển cơ quan thẩm quyền khi cần thiết.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm flex-shrink-0">
            <button
              className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-title-md text-body-sm shadow-sm transition-all"
              type="button"
            >
              Xem sổ tay quy chế
            </button>
            <button
              className="px-space-md py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-title-md text-body-sm shadow-sm transition-all"
              type="button"
            >
              Báo cáo thống kê tháng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
