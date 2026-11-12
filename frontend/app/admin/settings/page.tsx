"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<
    "anti-spam" | "general" | "emails" | "seo" | "features" | "audit"
  >("anti-spam");

  // Switches
  const [emailVerification, setEmailVerification] = React.useState(true);
  const [firstTimeAuthorReview, setFirstTimeAuthorReview] = React.useState(true);
  const [turnstileProtection, setTurnstileProtection] = React.useState(true);
  const [guestLocalStorage, setGuestLocalStorage] = React.useState(true);
  const [guestSyncBanner, setGuestSyncBanner] = React.useState(true);
  const [cookingModeOpen, setCookingModeOpen] = React.useState(true);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  // Rate Limits
  const [recipeLimit, setRecipeLimit] = React.useState(5);
  const [commentLimit, setCommentLimit] = React.useState(20);

  // AI Similarity Slider
  const [similarityThreshold, setSimilarityThreshold] = React.useState(85);

  // Blacklist tags
  const [tags, setTags] = React.useState<string[]>([
    "thuốc giảm cân gia truyền",
    "zalo 09",
    "link bio",
    "tuyển dụng ctv",
    "lừa đảo",
    "chữa dứt điểm",
    "nhà cái",
    "telegram group",
  ]);
  const [newTagInput, setNewTagInput] = React.useState("");

  // Checkboxes
  const [maskForbiddenWords, setMaskForbiddenWords] = React.useState(true);
  const [warnAuthorOnSensitiveWords, setWarnAuthorOnSensitiveWords] = React.useState(true);

  // Toast
  const [showSaveToast, setShowSaveToast] = React.useState(false);

  const handleSave = () => {
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 4500);
  };

  const handleAddTag = () => {
    const val = newTagInput.trim().toLowerCase();
    if (!val) return;
    if (!tags.includes(val)) {
      setTags([...tags, val]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Keyboard shortcut Ctrl+S
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Command & Settings Header */}
      <section className="px-space-lg pt-space-md pb-space-lg flex flex-col gap-space-md">
        {/* Breadcrumb & Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors cursor-pointer">
              Hệ thống quản trị
            </Link>
            <span className="text-outline">/</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Cấu hình nền tảng</span>
            <span className="text-outline">/</span>
            <span className="font-semibold text-on-surface">Cài đặt hệ thống</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-mono-sm text-label-mono-sm font-medium text-on-surface">
              Môi trường: Production (v2.4.8-vn)
            </span>
          </div>
        </div>

        {/* Main Title & Operational Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest text-primary font-bold">
                Quản trị &amp; An ninh trung tâm
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-[11px] font-semibold">
                Tier-1 Admin
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
              Cài đặt Hệ thống &amp; Chính sách An ninh
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Thiết lập cấu hình vận hành tổng thể, cơ chế phòng chống bot spam Turnstile &amp; AI Sentinel, chính sách phê duyệt tác giả mới, quyền truy cập mở (Guest Mode) và nhật ký thông báo tự động.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={() => {
                setEmailVerification(true);
                setFirstTimeAuthorReview(true);
                setTurnstileProtection(true);
                setGuestLocalStorage(true);
                setGuestSyncBanner(true);
                setCookingModeOpen(true);
                setMaintenanceMode(false);
                setRecipeLimit(5);
                setCommentLimit(20);
                setSimilarityThreshold(85);
                handleSave();
              }}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center gap-1.5 font-body-sm text-body-sm font-medium"
              type="button"
            >
              <Icon name="history" size={18} />
              <span>Khôi phục mặc định</span>
            </button>
            <button
              onClick={() => {
                const configData = {
                  emailVerification,
                  firstTimeAuthorReview,
                  turnstileProtection,
                  guestLocalStorage,
                  guestSyncBanner,
                  cookingModeOpen,
                  maintenanceMode,
                  recipeLimit,
                  commentLimit,
                  similarityThreshold,
                  tags,
                };
                const blob = new Blob([JSON.stringify(configData, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `recipehub-system-config-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
              className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container transition-all flex items-center gap-1.5 font-body-sm text-body-sm font-medium"
              type="button"
            >
              <Icon name="code" size={18} />
              <span>Sao lưu cấu hình (JSON)</span>
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center gap-2 font-body-md text-body-md font-semibold cursor-pointer"
              type="button"
            >
              <Icon name="save" size={20} />
              <span>Lưu thay đổi</span>
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-black/20 text-on-primary font-label-mono-sm text-[10px] uppercase tracking-wider">
                Ctrl + S
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive System Notice Pill (Saved Alert state) */}
      {showSaveToast && (
        <div className="px-space-lg mb-space-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary-container text-on-secondary-container shadow-sm">
            <div className="flex items-center gap-2.5">
              <Icon name="check_circle" size={20} />
              <span className="font-body-sm text-body-sm font-semibold">
                Cấu hình hệ thống đã được đồng bộ hóa tức thời trên toàn cụm máy chủ CDN RecipeHub.
              </span>
            </div>
            <button
              className="text-on-secondary-container hover:opacity-75 cursor-pointer"
              onClick={() => setShowSaveToast(false)}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Shadcn Style Horizontal Nav Tabs */}
      <div className="px-space-lg mb-space-lg">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab("anti-spam")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm text-body-sm whitespace-nowrap transition-all ${
              activeTab === "anti-spam"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
            }`}
            type="button"
          >
            <Icon name="shield" size={18} />
            <span>Chống spam &amp; An toàn nội dung</span>
            <span className="w-2 h-2 rounded-full bg-secondary" />
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm text-body-sm whitespace-nowrap transition-all ${
              activeTab === "general"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
            }`}
            type="button"
          >
            <Icon name="tune" size={18} />
            <span>Cài đặt chung &amp; Vận hành</span>
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm text-body-sm whitespace-nowrap transition-all ${
              activeTab === "emails"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
            }`}
            type="button"
          >
            <Icon name="mail" size={18} />
            <span>Mẫu Email &amp; Webhooks</span>
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm text-body-sm whitespace-nowrap transition-all ${
              activeTab === "seo"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
            }`}
            type="button"
          >
            <Icon name="share" size={18} />
            <span>Cấu hình SEO &amp; Schema</span>
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm text-body-sm whitespace-nowrap transition-all ${
              activeTab === "features"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
            }`}
            type="button"
          >
            <Icon name="toggle_on" size={18} />
            <span>Công tắc tính năng</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm text-body-sm whitespace-nowrap transition-all ${
              activeTab === "audit"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
            }`}
            type="button"
          >
            <Icon name="assignment" size={18} />
            <span>Nhật ký kiểm toán (Audit Logs)</span>
          </button>
        </div>
      </div>

      {/* Primary Content Surface: Anti-Spam & Content Moderation Deep Dive */}
      <div className="px-space-lg pb-space-xl flex flex-col gap-space-lg">
        {/* Hero Security Sentinel Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container-lowest to-surface-container-low p-space-lg shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-md max-w-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-md">
                <Icon name="security" size={28} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    RecipeHub AI Sentinel &amp; Turnstile Shield
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-bold uppercase">
                    Bảo vệ nghiêm ngặt
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Hệ thống phòng vệ 2 lớp đang kích hoạt. Tự động rà quét ngôn từ phản cảm, mã độc quảng cáo, chống bot spam tự động nộp công thức giả lập và giữ vững trải nghiệm ẩm thực thuần khiết.
                </p>
                <div className="flex flex-wrap items-center gap-space-md mt-3 font-label-mono-sm text-label-mono-sm">
                  <span className="flex items-center gap-1.5 text-on-surface font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> Chặn 428 bot requests (24h)
                  </span>
                  <span className="text-outline">•</span>
                  <span className="text-on-surface-variant">
                    Thời gian trễ trung bình: <strong className="text-on-surface font-semibold">18ms</strong>
                  </span>
                  <span className="text-outline">•</span>
                  <span className="text-on-surface-variant">
                    Tỷ lệ gắn cờ chính xác: <strong className="text-secondary font-semibold">99.82%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Sparkline Visual Mini Box */}
            <div className="flex items-center gap-space-md bg-surface-container-lowest/80 backdrop-blur-sm p-4 rounded-xl shadow-sm self-start lg:self-center">
              <div className="flex flex-col">
                <span className="font-label-mono-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Tần suất tấn công bot
                </span>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  428 <span className="font-body-sm text-body-sm text-secondary font-normal">(-14% so với hôm qua)</span>
                </span>
                <span className="font-label-mono-sm text-[11px] text-outline">Đỉnh điểm: 14:20 (Cloudflare SG-1)</span>
              </div>
              {/* Compact Inline Sparkline Chart */}
              <svg className="w-28 h-12 text-primary" fill="none" viewBox="0 0 100 40">
                <path
                  d="M0 32 Q 15 28, 25 35 T 50 18 T 75 8 T 100 24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M0 32 Q 15 28, 25 35 T 50 18 T 75 8 T 100 24 L 100 40 L 0 40 Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bento Grid Settings Arrangement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Column Left: Group 1 & Group 3 (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Nhóm 1: Cơ chế phòng vệ Anti-Spam & Xác thực tài khoản */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <Icon name="verified_user" size={20} />
                  </span>
                  <div className="flex flex-col">
                    <h2 className="font-title-md text-title-md font-bold text-on-surface">
                      Phòng vệ Spam &amp; Phê duyệt tác giả
                    </h2>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Thiết lập rào chắn và ngưỡng tự động duyệt
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
                  Tự động hoá: Bật
                </span>
              </div>

              {/* Switch Rows */}
              <div className="flex flex-col gap-3">
                {/* Row 1: Email Verification Switch */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex flex-col pr-space-md">
                    <label
                      onClick={() => setEmailVerification(!emailVerification)}
                      className="font-body-md text-body-md font-semibold text-on-surface cursor-pointer"
                    >
                      Bắt buộc xác thực email trước khi đăng công thức
                    </label>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Người dùng mới tạo tài khoản cần nhấp liên kết kích hoạt gửi qua hộp thư điện tử mới có quyền nộp bài phê duyệt hoặc công khai công thức nấu ăn.
                    </p>
                  </div>
                  <button
                    aria-checked={emailVerification}
                    onClick={() => setEmailVerification(!emailVerification)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailVerification ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        emailVerification ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Row 2: First-time Author Moderation Switch */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex flex-col pr-space-md">
                    <div className="flex items-center gap-2">
                      <label
                        onClick={() => setFirstTimeAuthorReview(!firstTimeAuthorReview)}
                        className="font-body-md text-body-md font-semibold text-on-surface cursor-pointer"
                      >
                        Kiểm duyệt bắt buộc đối với tác giả mới (First-time Author Review)
                      </label>
                      <span className="px-2 py-0.2 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-[11px] font-semibold">
                        Khuyến nghị
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Tất cả công thức từ tác giả đã đăng dưới <strong className="text-on-surface font-semibold">03 bài viết</strong> sẽ tự động chuyển vào Hàng chờ Duyệt (Màn hình 23 &amp; 24) thay vì đăng tải ngay lập tức.
                    </p>
                  </div>
                  <button
                    aria-checked={firstTimeAuthorReview}
                    onClick={() => setFirstTimeAuthorReview(!firstTimeAuthorReview)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      firstTimeAuthorReview ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        firstTimeAuthorReview ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Row 3: Cloudflare Turnstile */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex flex-col pr-space-md">
                    <label
                      onClick={() => setTurnstileProtection(!turnstileProtection)}
                      className="font-body-md text-body-md font-semibold text-on-surface cursor-pointer"
                    >
                      Bật bảo vệ vô hình Cloudflare Turnstile cho biểu mẫu công khai
                    </label>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Ngăn chặn bot farm tự động gửi biểu mẫu Đăng ký, Đăng nhập, Viết đánh giá món ăn và Góp ý bổ sung nguyên liệu. Không gây khó chịu với captcha giải đố hình ảnh.
                    </p>
                  </div>
                  <button
                    aria-checked={turnstileProtection}
                    onClick={() => setTurnstileProtection(!turnstileProtection)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      turnstileProtection ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        turnstileProtection ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Rate Limiting Inputs & AI Text Similarity Threshold */}
              <div className="p-space-md rounded-xl bg-surface-container-high/60 flex flex-col gap-space-md mt-1">
                <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface uppercase tracking-wider">
                  Cấu hình Ngưỡng Giới hạn Tần suất (Rate Limiting)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Limit 1 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Giới hạn công thức / 24 giờ
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        max="50"
                        min="1"
                        type="number"
                        value={recipeLimit}
                        onChange={(e) => setRecipeLimit(parseInt(e.target.value) || 1)}
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
                        bài / tác giả
                      </span>
                    </div>
                    <span className="font-label-mono-sm text-[11px] text-outline">Ngăn chặn spam nộp hàng loạt</span>
                  </div>

                  {/* Limit 2 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Giới hạn bình luận / 1 giờ
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        max="100"
                        min="5"
                        type="number"
                        value={commentLimit}
                        onChange={(e) => setCommentLimit(parseInt(e.target.value) || 5)}
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
                        lượt / IP
                      </span>
                    </div>
                    <span className="font-label-mono-sm text-[11px] text-outline">Tránh spam seeding đánh giá</span>
                  </div>
                </div>

                {/* AI Similarity Threshold Slider */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5">
                      <span>Ngưỡng phát hiện trùng lặp AI Sentinel (Plagiarism &amp; AI Copy)</span>
                      <Icon name="info" size={16} className="text-outline cursor-pointer" />
                    </label>
                    <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary px-2 py-0.5 rounded bg-primary-fixed">
                      {similarityThreshold}%
                    </span>
                  </div>
                  <input
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                    max={98}
                    min={50}
                    type="range"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between font-label-mono-sm text-[11px] text-outline">
                    <span>50% (Rất khắt khe)</span>
                    <span>85% (Chuẩn khuyến nghị)</span>
                    <span>98% (Chỉ trùng chính xác)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Nếu văn bản nguyên liệu và bước thực hiện có độ tương đồng vượt quá{" "}
                    <strong className="text-on-surface font-semibold">{similarityThreshold}%</strong> so với công thức đã có, hệ thống sẽ tự động chuyển cảnh báo bản quyền tới Điều hành viên.
                  </p>
                </div>
              </div>
            </div>

            {/* Nhóm 3: Công tắc tính năng & Kiểm soát truy cập mở (Open Access / Guest Mode) */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <Icon name="lock_open" size={20} />
                  </span>
                  <div className="flex flex-col">
                    <h2 className="font-title-md text-title-md font-bold text-on-surface">
                      Truy cập mở &amp; Trải nghiệm Khách (Open Access)
                    </h2>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Tuân thủ triết lý ẩm thực không rào cản tài khoản
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
                  Triết lý RecipeHub
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Row Guest Storage */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex flex-col pr-space-md">
                    <label
                      onClick={() => setGuestLocalStorage(!guestLocalStorage)}
                      className="font-body-md text-body-md font-semibold text-on-surface cursor-pointer"
                    >
                      Cho phép Khách (Guest) lưu trữ Kế hoạch bữa ăn &amp; Giỏ mua sắm trên LocalStorage
                    </label>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Người dùng vãng lai có thể lên thực đơn tuần và tích chọn nguyên liệu cần mua trực tiếp mà không bị chặn bắt buộc đăng nhập (Cook First, Sign Up Later).
                    </p>
                  </div>
                  <button
                    aria-checked={guestLocalStorage}
                    onClick={() => setGuestLocalStorage(!guestLocalStorage)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      guestLocalStorage ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        guestLocalStorage ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Row Sync Banner */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex flex-col pr-space-md">
                    <label
                      onClick={() => setGuestSyncBanner(!guestSyncBanner)}
                      className="font-body-md text-body-md font-semibold text-on-surface cursor-pointer"
                    >
                      Hiển thị Banner đồng bộ dữ liệu thông minh khi khách sử dụng
                    </label>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Xuất hiện thanh nhắc nhở tinh tế mời đăng nhập lưu trữ đám mây khi giỏ nguyên liệu hoặc kế hoạch bữa ăn có trên 5 món ăn đã lưu.
                    </p>
                  </div>
                  <button
                    aria-checked={guestSyncBanner}
                    onClick={() => setGuestSyncBanner(!guestSyncBanner)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      guestSyncBanner ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        guestSyncBanner ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Row Cooking Mode Hands-free */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
                  <div className="flex flex-col pr-space-md">
                    <label
                      onClick={() => setCookingModeOpen(!cookingModeOpen)}
                      className="font-body-md text-body-md font-semibold text-on-surface cursor-pointer"
                    >
                      Chế độ nấu ăn rảnh tay (Cooking Mode) mở tự do không yêu cầu tài khoản
                    </label>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Mọi người nấu ăn đều được tận hưởng bộ bấm giờ thông minh, hướng dẫn từng bước toàn màn hình mà không gặp trở ngại đăng ký.
                    </p>
                  </div>
                  <button
                    aria-checked={cookingModeOpen}
                    onClick={() => setCookingModeOpen(!cookingModeOpen)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      cookingModeOpen ? "bg-secondary" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        cookingModeOpen ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Maintenance Mode Danger Switch */}
                <div className="flex items-start justify-between p-4 rounded-xl bg-error-container/40 hover:bg-error-container/60 transition-all">
                  <div className="flex flex-col pr-space-md">
                    <div className="flex items-center gap-2">
                      <Icon name="warning" size={20} className="text-error" />
                      <label
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className="font-body-md text-body-md font-bold text-on-error-container cursor-pointer"
                      >
                        Chế độ bảo trì hệ thống (Maintenance Mode)
                      </label>
                      <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-mono-sm text-[11px] font-semibold">
                        Tác vụ khẩn cấp
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-error-container mt-1">
                      Khi bật, toàn bộ người dùng và khách sẽ nhìn thấy màn hình "Đang bảo dưỡng lò bếp". Chỉ tài khoản Admin cấp cao có IP trong danh sách trắng mới có quyền truy cập.
                    </p>
                  </div>
                  <button
                    aria-checked={maintenanceMode}
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      maintenanceMode ? "bg-error" : "bg-surface-container-highest"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: Group 2 (Từ khóa cấm) & Group 4 (Mẫu Email) (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Nhóm 2: Từ điển từ khóa cấm & Danh sách đen (Forbidden Keywords Engine) */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <Icon name="block" size={20} />
                  </span>
                  <div className="flex flex-col">
                    <h2 className="font-title-md text-title-md font-bold text-on-surface">
                      Từ điển từ khóa cấm &amp; Blacklist
                    </h2>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Lọc lừa đảo, số điện thoại, spam thương mại
                    </span>
                  </div>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-semibold">
                  1,248 từ
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Hệ thống tự động phát hiện và chặn xuất bản nếu công thức hoặc bình luận chứa cụm từ bị gắn cờ độc hại hoặc quảng cáo thuốc không rõ nguồn gốc.
              </p>

              {/* Input to add new forbidden word */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-on-surface-variant">
                    <Icon name="add_circle" size={18} />
                  </span>
                  <input
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm"
                    placeholder="Thêm từ hoặc cụm từ cấm mới..."
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-all cursor-pointer"
                  type="button"
                >
                  Thêm
                </button>
              </div>

              {/* Active Filter Chips / Tags Container */}
              <div className="flex flex-col gap-2">
                <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                  Các từ khóa đang áp dụng ({tags.length})
                </span>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm"
                    >
                      <span>{tag}</span>
                      <button
                        className="hover:text-error cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                        type="button"
                        aria-label={`Xóa từ khóa ${tag}`}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Options for Keyword Engine */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    checked={maskForbiddenWords}
                    onChange={(e) => setMaskForbiddenWords(e.target.checked)}
                    className="rounded text-secondary focus:ring-secondary w-4 h-4 accent-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Tự động thay thế từ cấm trong bình luận bằng dấu sao (***)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    checked={warnAuthorOnSensitiveWords}
                    onChange={(e) => setWarnAuthorOnSensitiveWords(e.target.checked)}
                    className="rounded text-secondary focus:ring-secondary w-4 h-4 accent-secondary"
                    type="checkbox"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Gắn cờ cảnh báo tác giả khi tiêu đề công thức chứa từ khóa nhạy cảm
                  </span>
                </label>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowSaveToast(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium flex items-center justify-center gap-1.5 transition-all"
                  type="button"
                >
                  <Icon name="upload_file" size={18} />
                  <span>Tải từ điển Bộ TT&amp;TT (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + tags.join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "blacklist-recipehub.csv");
                    document.body.appendChild(link);
                    link.click();
                  }}
                  className="py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-body-sm text-body-sm font-medium transition-all"
                  title="Xuất danh sách"
                  type="button"
                >
                  <Icon name="download" size={18} />
                </button>
              </div>
            </div>

            {/* Nhóm 4: Cấu hình Mẫu Email giao dịch (Transactional Email Settings) */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <Icon name="mark_email_read" size={20} />
                  </span>
                  <div className="flex flex-col">
                    <h2 className="font-title-md text-title-md font-bold text-on-surface">
                      Mẫu Email giao dịch
                    </h2>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Cổng SMTP SES &amp; Tỷ lệ gửi thành công 99.4%
                    </span>
                  </div>
                </div>
                <button className="font-body-sm text-body-sm font-semibold text-primary hover:underline cursor-pointer" type="button">
                  Quản lý tất cả
                </button>
              </div>

              {/* Transactional Template List */}
              <div className="flex flex-col gap-2.5">
                {/* Item 1: Verification */}
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                      <Icon name="mark_email_unread" size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                        Xác thực tài khoản (Verification)
                      </span>
                      <div className="flex items-center gap-2 font-label-mono-sm text-[11px] text-on-surface-variant">
                        <span className="text-secondary font-semibold">Gửi: 99.4%</span>
                        <span>•</span>
                        <span>Mở: 78.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest" title="Xem trước giao diện" type="button">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest" title="Chỉnh sửa mẫu HTML" type="button">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </div>

                {/* Item 2: Recipe Approved */}
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="check_circle" size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                        Công thức đã được phê duyệt
                      </span>
                      <div className="flex items-center gap-2 font-label-mono-sm text-[11px] text-on-surface-variant">
                        <span className="text-secondary font-semibold">Tự động gửi</span>
                        <span>•</span>
                        <span>Mở: 92.1%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest" title="Xem trước giao diện" type="button">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest" title="Chỉnh sửa mẫu HTML" type="button">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </div>

                {/* Item 3: Recipe Modification Required */}
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center flex-shrink-0">
                      <Icon name="rate_review" size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                        Yêu cầu bổ sung &amp; sửa công thức
                      </span>
                      <div className="flex items-center gap-2 font-label-mono-sm text-[11px] text-on-surface-variant">
                        <span className="text-primary font-semibold">Kèm phản hồi Mod</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest" title="Xem trước giao diện" type="button">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest" title="Chỉnh sửa mẫu HTML" type="button">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </div>

                {/* Item 4: Security Violation Alert */}
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between hover:bg-surface-container transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                      <Icon name="gpp_maybe" size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                        Cảnh báo đăng nhập lạ / Khóa tài khoản
                      </span>
                      <div className="flex items-center gap-2 font-label-mono-sm text-[11px] text-on-surface-variant">
                        <span className="text-error font-semibold">Ưu tiên cao</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest" title="Xem trước giao diện" type="button">
                      <Icon name="visibility" size={18} />
                    </button>
                    <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest" title="Chỉnh sửa mẫu HTML" type="button">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mail Gateway Quick Status */}
              <div className="p-3 rounded-xl bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">
                    Amazon SES Production Gateway
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowSaveToast(true);
                  }}
                  className="font-label-mono-sm text-label-mono-sm text-primary font-semibold hover:underline cursor-pointer"
                  type="button"
                >
                  Gửi email thử nghiệm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Compliance & Audit Footer */}
        <footer className="mt-space-lg p-space-md rounded-2xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-sm text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <Icon name="verified" size={20} className="text-secondary" />
            <span className="font-body-sm text-body-sm">
              Cơ chế chính sách an ninh tuân thủ tiêu chuẩn an toàn dữ liệu số quốc gia. Nhật ký ghi nhận bởi{" "}
              <strong className="text-on-surface font-semibold">Admin Lê Hoàng Phúc</strong> lúc 10:45 AM hôm nay.
            </span>
          </div>
          <div className="flex items-center gap-space-md font-label-mono-sm text-label-mono-sm">
            <span>
              Uptime: <strong className="text-secondary font-semibold">99.98%</strong>
            </span>
            <span>
              Múi giờ: <strong className="text-on-surface">Asia/Ho_Chi_Minh (UTC+7)</strong>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
