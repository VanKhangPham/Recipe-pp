"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Profile Form States
  const [fullName, setFullName] = React.useState("Nguyễn Thu Hà");
  const [displayName, setDisplayName] = React.useState("Bếp Mẹ Ba");
  const [username, setUsername] = React.useState("bepmeba");
  const [region, setRegion] = React.useState("Bến Tre & TP. Hồ Chí Minh");
  const [bio, setBio] = React.useState(
    "Người gìn giữ hương vị cơm nhà Nam Bộ & món kho truyền thống. Nấu ăn bằng tình yêu thương và sự tỉ mỉ cho mỗi bữa cơm quây quần."
  );
  const [youtube, setYoutube] = React.useState("Bếp Mẹ Ba Cooking");
  const [tiktok, setTiktok] = React.useState("@bepmeba");

  // Portion State
  const [portion, setPortion] = React.useState(4);

  // Allergens
  const [allergens, setAllergens] = React.useState([
    "Dị ứng hải sản có vỏ (Tôm, Cua, Sò)",
    "Không ăn được quá cay (Ớt chỉ thiên)",
    "Không dùng bột ngọt / mì chính",
    "Không sữa bò (Lactose)",
  ]);
  const [newAllergen, setNewAllergen] = React.useState("");

  // Regional Taste
  const [regionalTaste, setRegionalTaste] = React.useState("south");

  // Notifications
  const [notifications, setNotifications] = React.useState({
    dinnerReminder: true,
    communityInteraction: true,
    recipeModeration: true,
    weeklyNewsletter: false,
  });

  // 2FA
  const [twoFactor, setTwoFactor] = React.useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const removeAllergen = (index: number) => {
    setAllergens((prev) => prev.filter((_, i) => i !== index));
    triggerToast("Đã xóa chất loại trừ!");
  };

  const addAllergen = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newAllergen.trim()) {
      e.preventDefault();
      setAllergens((prev) => [...prev, newAllergen.trim()]);
      setNewAllergen("");
      triggerToast("Đã thêm thành phần loại trừ!");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Đã lưu thay đổi thông tin cá nhân thành công!");
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Sub-header Breadcrumb & Canvas Header */}
          <section className="w-full px-margin-mobile lg:px-margin pt-space-lg pb-space-md">
            <div className="flex flex-col gap-space-xs max-w-7xl mx-auto">
              {/* Breadcrumb */}
              <nav
                aria-label="Đường dẫn điều hướng"
                className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-outline"
              >
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <Icon name="home" className="text-[15px]" />
                  <span>Trang chủ</span>
                </Link>
                <span className="text-surface-variant font-normal">/</span>
                <Link className="hover:text-primary transition-colors" href="/profile">
                  Tài khoản của tôi
                </Link>
                <span className="text-surface-variant font-normal">/</span>
                <span className="text-on-surface font-medium">Cài đặt tài khoản</span>
              </nav>

              {/* Header Banner Strip */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pt-space-xs">
                <div className="space-y-1">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Cài đặt tài khoản
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                    Quản lý thông tin định danh, tùy chỉnh khẩu vị gia đình, thiết lập bảo mật và tùy chọn nhận thông báo nấu nướng.
                  </p>
                </div>
                <div className="flex items-center gap-space-xs self-start md:self-center px-3.5 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container shadow-sm">
                  <Icon name="verified_user" className="text-[18px] text-secondary" />
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold tracking-tight">
                    Tài khoản chính chủ: Bếp Mẹ Ba • Đã xác thực email
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Two-Column Master-Detail Layout */}
          <section className="w-full px-margin-mobile lg:px-margin pb-space-xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Sidebar (Tabs & Sync Status) */}
              <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md sticky top-24">
                <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] p-space-sm flex flex-col gap-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-body-sm text-body-sm font-medium cursor-pointer ${
                      activeTab === "profile"
                        ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(163,57,0,0.22)]"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon name="person" className="text-[20px]" />
                      <span>Thông tin cá nhân</span>
                    </div>
                    <Icon name="chevron_right" className="text-[18px]" />
                  </button>

                  <a
                    href="#preferences-section"
                    onClick={() => setActiveTab("preferences")}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-body-sm text-body-sm group ${
                      activeTab === "preferences"
                        ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(163,57,0,0.22)]"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon name="restaurant_menu" className="text-[20px] group-hover:text-primary transition-colors" />
                      <span>Sở thích &amp; Dị ứng</span>
                    </div>
                    <Icon name="chevron_right" className="text-[18px] text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <a
                    href="#security-section"
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-body-sm text-body-sm group ${
                      activeTab === "security"
                        ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(163,57,0,0.22)]"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon name="shield" className="text-[20px] group-hover:text-primary transition-colors" />
                      <span>Bảo mật &amp; Đăng nhập</span>
                    </div>
                    <Icon name="chevron_right" className="text-[18px] text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <a
                    href="#notification-section"
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-body-sm text-body-sm group ${
                      activeTab === "notifications"
                        ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(163,57,0,0.22)]"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon name="notifications" className="text-[20px] group-hover:text-primary transition-colors" />
                      <span>Thông báo &amp; Lời nhắc</span>
                    </div>
                    <Icon name="chevron_right" className="text-[18px] text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <a
                    href="#display-section"
                    onClick={() => setActiveTab("display")}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-body-sm text-body-sm group ${
                      activeTab === "display"
                        ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(163,57,0,0.22)]"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon name="palette" className="text-[20px] group-hover:text-primary transition-colors" />
                      <span>Giao diện &amp; Ngôn ngữ</span>
                    </div>
                    <Icon name="chevron_right" className="text-[18px] text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <div className="h-px bg-surface-variant/50 my-1" />

                  <a
                    href="#danger-section"
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-error hover:bg-error-container/30 transition-all font-body-sm text-body-sm group"
                  >
                    <div className="flex items-center gap-space-sm">
                      <Icon name="warning" className="text-[20px]" />
                      <span>Vùng nguy hiểm</span>
                    </div>
                    <Icon name="arrow_forward" className="text-[18px] text-error opacity-60" />
                  </a>
                </div>

                {/* Cloud Sync Card */}
                <div className="bg-surface-container-low rounded-2xl p-space-md shadow-sm space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary">
                      <Icon name="cloud_done" className="text-[20px]" />
                      <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase tracking-wider">
                        Đám mây bếp
                      </span>
                    </div>
                    <span className="font-label-mono-sm text-[11px] text-outline">Vừa xong</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Đã đồng bộ 42 món yêu thích, 1 kế hoạch thực đơn tuần lên máy chủ RecipeHub.
                  </p>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-4/5" />
                  </div>
                  <div className="flex justify-between items-center text-outline font-label-mono-sm text-[11px] pt-1">
                    <span>Dung lượng lưu trữ</span>
                    <span>2.4 MB / 100 MB</span>
                  </div>
                </div>

                {/* Quick Chef Profile Preview */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_12px_32px_-8px_rgba(28,25,23,0.04)] flex items-center gap-space-sm">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container flex-shrink-0 shadow-sm">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuByT1U_W7rncMGowEOX5BrYAq8xMKpLDIeKEywJ5IR7ffEHafWK4yg9NW0vICIIUiW-qXr_XNX_5X7Qk85djQIr42EI9lQOe_FsyF5GtEHj9mKjKuB3K2c8w1cp5BUVL3C-rZNS3YUwv5BLqxp9lfdU2QL3ye6FkMHQku-x9mGj-xbKqIYvrePyLws5WMd95ebsTGo8oWbN4LMRDtUqvfOHZoXjzg8Xb-7fZVIqB-av"
                      alt="Bếp Mẹ Ba"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-title-md text-on-surface font-semibold truncate leading-tight">
                      Bếp Mẹ Ba
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">
                      recipehub.vn/@bepmeba
                    </span>
                    <span className="font-label-mono-sm text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Đang hoạt động công khai
                    </span>
                  </div>
                </div>
              </aside>

              {/* Right Main Content Panel */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-lg">
                {/* ================= SECTION 1: Profile Information ================= */}
                <section
                  className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] p-space-md lg:p-space-lg flex flex-col gap-space-md"
                  id="profile-section"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-variant/40">
                    <div>
                      <h2 className="font-title-md text-title-md text-on-surface font-bold">
                        Thông tin cá nhân &amp; Gian bếp
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Tùy biến nhận diện gian bếp của bạn để kết nối cùng hàng triệu đầu bếp gia đình trên cả nước.
                      </p>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-outline">Bước 1/5</span>
                  </div>

                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-md p-space-md bg-surface-container-low rounded-2xl">
                    <div className="relative group">
                      <div className="w-[88px] h-[88px] rounded-full overflow-hidden bg-surface shadow-md relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcaqhg2jBX0hbYVeDSlgsW5Rs3wxOitFY79Ub1sJOcdJnz4EjVrsLmE5OgbBNG7B2VjSfxzyl_MNpIrcHNlSbo8dV__bBrEnNCgi4Qhfi1alzbEMpRGjjM5XLqi9uNYMlru8uh3AJ8t-v6PFECyEXzojnAnSqQgfpTRxccDD2TX-yvUOBlhlpqKaCrxeKB9yBy1Lu9AAo-zI3-sGvclgOC3buw3aUKuy_yixhWyLD-"
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={() => triggerToast("Tải ảnh đại diện mới...")}
                        aria-label="Thay đổi avatar"
                        className="absolute inset-0 rounded-full bg-on-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-on-primary cursor-pointer"
                      >
                        <Icon name="photo_camera" className="text-[24px]" />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <button
                          onClick={() => triggerToast("Tải ảnh mới...")}
                          className="px-space-md py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                          type="button"
                        >
                          Tải ảnh mới
                        </button>
                        <button
                          onClick={() => triggerToast("Đã đặt lại ảnh mặc định!")}
                          className="px-space-md py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-all shadow-sm cursor-pointer"
                          type="button"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                      <p className="font-label-mono-sm text-label-mono-sm text-outline">
                        Hỗ trợ định dạng JPG, WebP, PNG. Kích thước tối đa 5MB. Khuyên dùng ảnh vuông tối thiểu 400x400px.
                      </p>
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">Họ và tên thật</label>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      <span className="font-label-mono-sm text-[11px] text-outline">
                        Chỉ dùng cho mục đích xác thực và liên lạc hành chính.
                      </span>
                    </div>

                    {/* Display Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Biệt danh / Tên hiển thị gian bếp
                      </label>
                      <input
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                      <span className="font-label-mono-sm text-[11px] text-primary">
                        Tên này sẽ xuất hiện trên tất cả các công thức &amp; bài chia sẻ của bạn.
                      </span>
                    </div>

                    {/* Username */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Tên người dùng (Username)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 font-label-mono-sm text-label-mono-sm text-outline select-none">
                          recipehub.vn/@
                        </span>
                        <input
                          className="w-full pl-36 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-label-mono-sm text-label-mono-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-outline">
                        Đường dẫn định danh độc bản đến trang cá nhân của bạn.
                      </span>
                    </div>

                    {/* Email Address with Status Badge */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface">Địa chỉ Email</label>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-mono-sm text-[11px] font-semibold flex items-center gap-1">
                          <Icon name="check_circle" className="text-[13px]" /> Đã xác thực
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed shadow-sm select-none"
                          readOnly
                          type="email"
                          value="thuha.bepmeba@gmail.com"
                        />
                        <button
                          onClick={() => triggerToast("Yêu cầu đổi email đã gửi...")}
                          className="px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          Thay đổi
                        </button>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Số điện thoại bảo mật
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm cursor-not-allowed shadow-sm select-none"
                          readOnly
                          type="text"
                          value="0908 ••• 421"
                        />
                        <button
                          onClick={() => triggerToast("Đã gửi mã OTP đến số điện thoại!")}
                          className="px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          Cập nhật OTP
                        </button>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-secondary">
                        Đã liên kết nhận mã khôi phục khi quên mật khẩu.
                      </span>
                    </div>

                    {/* Region dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Khu vực / Tỉnh thành cư trú
                      </label>
                      <div className="relative">
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="w-full appearance-none px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all cursor-pointer"
                        >
                          <option>Bến Tre &amp; TP. Hồ Chí Minh</option>
                          <option>Hà Nội &amp; Vùng Đồng Bằng Bắc Bộ</option>
                          <option>Đà Nẵng, Huế &amp; Miền Trung</option>
                          <option>Cần Thơ &amp; Miền Tây Sông Nước</option>
                          <option>Tây Nguyên Đại Ngàn</option>
                          <option>Kiều bào nước ngoài</option>
                        </select>
                        <Icon
                          name="expand_more"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline"
                        />
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-outline">
                        Hỗ trợ gợi ý chợ phiên địa phương và loại rau củ theo mùa.
                      </span>
                    </div>

                    {/* Bio Description (Full width) */}
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Giới thiệu bản thân &amp; Triết lý nấu nướng (Bio)
                        </label>
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">
                          {bio.length} / 300 ký tự
                        </span>
                      </div>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all leading-relaxed resize-none"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    {/* Social Media Links */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Kênh ẩm thực Youtube
                      </label>
                      <div className="relative flex items-center">
                        <Icon name="play_circle" className="absolute left-3.5 text-error text-[20px]" />
                        <input
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                          type="text"
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Trang TikTok nấu ăn
                      </label>
                      <div className="relative flex items-center">
                        <Icon name="music_note" className="absolute left-3.5 text-on-surface text-[20px]" />
                        <input
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                          type="text"
                          value={tiktok}
                          onChange={(e) => setTiktok(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-variant/40 mt-space-xs">
                      <button
                        onClick={() => triggerToast("Đã hủy các thay đổi chưa lưu!")}
                        className="px-space-lg py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-body-sm text-body-sm font-medium transition-all shadow-sm cursor-pointer"
                        type="button"
                      >
                        Hủy thay đổi
                      </button>
                      <button
                        className="px-space-xl py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold transition-all shadow-[0_8px_20px_-4px_rgba(163,57,0,0.32)] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                        type="submit"
                      >
                        <Icon name="save" className="text-[18px]" />
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </section>

                {/* ================= SECTION 2: Food Preferences & Allergens ================= */}
                <section
                  className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] p-space-md lg:p-space-lg flex flex-col gap-space-md"
                  id="preferences-section"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-variant/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name="restaurant" className="text-primary text-[24px]" />
                        <h2 className="font-title-md text-title-md text-on-surface font-bold">
                          Sở thích ăn uống &amp; Quản lý dị ứng thực phẩm
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Trái tim của RecipeHub: Tự động lọc thực đơn và cảnh báo thành phần không phù hợp trong từng công thức.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-mono-sm text-[11px] font-semibold">
                      Tự động cá nhân hóa
                    </span>
                  </div>

                  {/* 1. Preferred Diet Checkboxes */}
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Chế độ ăn ưu tiên của gia đình
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-xs pt-1">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer shadow-sm">
                        <div className="w-5 h-5 rounded-md bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0">
                          <Icon name="check" className="text-[16px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-medium text-on-surface">
                            Mâm cơm truyền thống
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-outline">Canh, kho, xào, rau</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer shadow-sm">
                        <div className="w-5 h-5 rounded-md bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0">
                          <Icon name="check" className="text-[16px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-medium text-on-surface">
                            Eat Clean &amp; Ít mỡ
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-outline">Giảm ngọt, hấp luộc</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer shadow-sm border border-surface-variant/40">
                        <div className="w-5 h-5 rounded-md bg-surface-container flex items-center justify-center text-transparent flex-shrink-0">
                          <Icon name="check" className="text-[16px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-medium text-on-surface-variant">
                            Chay thanh tịnh
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-outline">Rau củ, đậu hũ nấm</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer shadow-sm border border-surface-variant/40">
                        <div className="w-5 h-5 rounded-md bg-surface-container flex items-center justify-center text-transparent flex-shrink-0">
                          <Icon name="check" className="text-[16px]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-body-sm text-body-sm font-medium text-on-surface-variant">
                            Cơm hộp tốc hành
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-outline">Chế biến dưới 20p</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 2. Allergens & Exclusion Ingredients Tags */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Dị ứng &amp; Thành phần cần loại trừ
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-error">
                        Hệ thống sẽ gắn cờ cảnh báo đỏ nếu công thức chứa:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-surface-container-low rounded-xl">
                      {allergens.map((alg, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error-container text-on-error-container font-body-sm text-body-sm font-medium shadow-sm"
                        >
                          <Icon name="flip_camera_ios" className="text-[16px]" />
                          {alg}
                          <button
                            onClick={() => removeAllergen(index)}
                            aria-label={`Xóa nhãn ${alg}`}
                            className="hover:text-error transition-colors flex items-center cursor-pointer ml-1"
                            type="button"
                          >
                            <Icon name="close" className="text-[16px]" />
                          </button>
                        </span>
                      ))}

                      {/* Add New Ingredient Pill Input */}
                      <div className="relative flex items-center">
                        <input
                          value={newAllergen}
                          onChange={(e) => setNewAllergen(e.target.value)}
                          onKeyDown={addAllergen}
                          className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                          placeholder="+ Thêm chất loại trừ (Enter)..."
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Family Portion Counter & Regional Taste */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
                    {/* Portion Counter */}
                    <div className="flex flex-col gap-2 p-space-md bg-surface-container-low rounded-xl">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Khẩu phần chuẩn gia đình
                      </span>
                      <p className="font-label-mono-sm text-label-mono-sm text-outline">
                        Tự động nhân tỷ lệ nguyên liệu khi xem bất kỳ công thức nào.
                      </p>
                      <div className="flex items-center justify-between gap-space-sm pt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                            <Icon name="group" className="text-[20px]" />
                          </div>
                          <div>
                            <div className="font-body-sm text-body-sm font-bold text-on-surface">
                              {portion} Người lớn • 1 Trẻ nhỏ
                            </div>
                            <div className="font-label-mono-sm text-[11px] text-secondary">
                              Quy chuẩn tương đương ~ {portion + 0.5} suất ăn
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container-lowest rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => setPortion((p) => Math.max(1, p - 1))}
                            aria-label="Giảm khẩu phần"
                            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                            type="button"
                          >
                            <Icon name="remove" className="text-[18px]" />
                          </button>
                          <span className="font-label-mono-lg text-label-mono-lg font-bold text-primary px-2">
                            {portion}+1
                          </span>
                          <button
                            onClick={() => setPortion((p) => p + 1)}
                            aria-label="Tăng khẩu phần"
                            className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                            type="button"
                          >
                            <Icon name="add" className="text-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Regional Taste Preference */}
                    <div className="flex flex-col gap-2 p-space-md bg-surface-container-low rounded-xl">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Khẩu vị nêm nếm vùng miền
                      </span>
                      <p className="font-label-mono-sm text-label-mono-sm text-outline">
                        Điều chỉnh tỷ lệ gia vị đường, mắm, tiêu trong các công thức chung.
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {[
                          { key: "north", title: "Bắc Bộ", sub: "Thanh đạm, vừa vị" },
                          { key: "central", title: "Trung Bộ", sub: "Đậm cay, nồng nàn" },
                          { key: "south", title: "Nam Bộ", sub: "Đậm đà, canh ngọt" },
                        ].map((t) => (
                          <button
                            key={t.key}
                            onClick={() => setRegionalTaste(t.key)}
                            className={`flex flex-col items-center justify-center text-center p-2 rounded-xl transition-all shadow-sm cursor-pointer ${
                              regionalTaste === t.key
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant"
                            }`}
                            type="button"
                          >
                            <span className="font-body-sm text-body-sm font-bold">{t.title}</span>
                            <span
                              className={`font-label-mono-sm text-[10px] ${
                                regionalTaste === t.key ? "text-on-primary/80" : "text-outline"
                              }`}
                            >
                              {t.sub}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ================= SECTION 3: Security & Auth ================= */}
                <section
                  className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] p-space-md lg:p-space-lg flex flex-col gap-space-md"
                  id="security-section"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-variant/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name="verified" className="text-secondary text-[24px]" />
                        <h2 className="font-title-md text-title-md text-on-surface font-bold">
                          Bảo mật &amp; Đăng nhập
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Bảo vệ bộ sưu tập công thức gia truyền và dữ liệu cá nhân của gia đình bạn.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-mono-sm text-[11px] font-semibold">
                      Độ an toàn: Cao
                    </span>
                  </div>

                  {/* Password Update Form */}
                  <div className="p-space-md bg-surface-container-low rounded-2xl flex flex-col gap-space-sm">
                    <h3 className="font-body-sm text-body-sm font-bold text-on-surface">Đổi mật khẩu truy cập</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-mono-sm text-label-mono-sm text-outline">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                          placeholder="••••••••••••"
                          type="password"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-mono-sm text-label-mono-sm text-outline">Mật khẩu mới</label>
                        <input
                          className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                          type="password"
                          defaultValue="HuongViQueNha@2024!"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-mono-sm text-label-mono-sm text-outline">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                          type="password"
                          defaultValue="HuongViQueNha@2024!"
                        />
                      </div>
                    </div>

                    {/* Password Strength Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">Độ mạnh mật khẩu:</span>
                        <div className="flex items-center gap-1">
                          <span className="w-8 h-2 rounded-full bg-secondary" />
                          <span className="w-8 h-2 rounded-full bg-secondary" />
                          <span className="w-8 h-2 rounded-full bg-secondary" />
                          <span className="w-8 h-2 rounded-full bg-secondary" />
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                          Rất mạnh (Khuyên dùng)
                        </span>
                      </div>
                      <button
                        onClick={() => triggerToast("Đã cập nhật mật khẩu mới thành công!")}
                        className="px-space-md py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold transition-all shadow-sm cursor-pointer"
                        type="button"
                      >
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  {/* 2FA Authenticator Switch */}
                  <div className="p-space-md bg-surface-container-low rounded-2xl flex items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container/50 text-on-secondary-container flex items-center justify-center flex-shrink-0">
                        <Icon name="phonelink_lock" className="text-[24px]" />
                      </div>
                      <div>
                        <h4 className="font-body-sm text-body-sm font-bold text-on-surface">
                          Xác thực 2 bước (2FA)
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Bảo vệ tài khoản qua ứng dụng Google Authenticator hoặc Apple Keychain khi đăng nhập từ thiết bị lạ.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold hidden sm:inline">
                        {twoFactor ? "Đang bật" : "Đã tắt"}
                      </span>
                      <button
                        onClick={() => {
                          setTwoFactor(!twoFactor);
                          triggerToast(!twoFactor ? "Đã bật xác thực 2FA!" : "Đã tắt xác thực 2FA!");
                        }}
                        aria-label="Tắt hoặc bật xác thực 2 bước"
                        className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shadow-inner cursor-pointer ${
                          twoFactor ? "bg-secondary justify-end" : "bg-surface-container-highest justify-start"
                        }`}
                        type="button"
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md block" />
                      </button>
                    </div>
                  </div>

                  {/* Active Devices List */}
                  <div className="flex flex-col gap-space-xs pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Thiết bị đăng nhập gần đây
                      </span>
                      <button
                        onClick={() => triggerToast("Đã đăng xuất khỏi tất cả các thiết bị khác!")}
                        className="font-label-mono-sm text-label-mono-sm text-error hover:underline flex items-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <Icon name="logout" className="text-[15px]" />
                        Đăng xuất tất cả thiết bị khác
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-1">
                      {/* Device 1: Current */}
                      <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <Icon name="laptop_mac" className="text-outline text-[24px]" />
                          <div>
                            <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                              Chrome trên MacOS
                            </div>
                            <div className="font-label-mono-sm text-[11px] text-outline">
                              TP. Hồ Chí Minh • IP: 14.161.42.***
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-mono-sm text-[10px] font-bold">
                          Đang hoạt động
                        </span>
                      </div>
                      {/* Device 2: Mobile */}
                      <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <Icon name="smartphone" className="text-outline text-[24px]" />
                          <div>
                            <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                              Safari trên iPhone 14 Pro Max
                            </div>
                            <div className="font-label-mono-sm text-[11px] text-outline">Bến Tre • 2 giờ trước</div>
                          </div>
                        </div>
                        <button
                          onClick={() => triggerToast("Đã đăng xuất thiết bị iPhone!")}
                          aria-label="Đăng xuất khỏi thiết bị iPhone"
                          className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                          type="button"
                        >
                          <Icon name="logout" className="text-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ================= SECTION 4: Notifications & Reminders ================= */}
                <section
                  className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] p-space-md lg:p-space-lg flex flex-col gap-space-md"
                  id="notification-section"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-variant/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name="notifications_active" className="text-primary text-[24px]" />
                        <h2 className="font-title-md text-title-md text-on-surface font-bold">
                          Thông báo &amp; Lời nhắc nấu nướng
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Kiểm soát cách RecipeHub gửi lời nhắc chuẩn bị bữa cơm và thông tin tương tác.
                      </p>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-outline">
                      {Object.values(notifications).filter(Boolean).length}/4 kích hoạt
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-surface-variant/30">
                    {/* Toggle Item 1 */}
                    <div className="flex items-center justify-between py-3.5 gap-space-md">
                      <div className="space-y-0.5">
                        <div className="font-body-sm text-body-sm font-bold text-on-surface">
                          Nhắc chuẩn bị bữa tối ấm cúng
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          Tự động gợi ý kiểm tra nguyên liệu và sơ chế lúc 16:30 hàng ngày theo kế hoạch tuần.
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({ ...prev, dinnerReminder: !prev.dinnerReminder }))
                        }
                        className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shadow-inner flex-shrink-0 cursor-pointer ${
                          notifications.dinnerReminder ? "bg-secondary justify-end" : "bg-surface-container-highest justify-start"
                        }`}
                        type="button"
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md block" />
                      </button>
                    </div>

                    {/* Toggle Item 2 */}
                    <div className="flex items-center justify-between py-3.5 gap-space-md">
                      <div className="space-y-0.5">
                        <div className="font-body-sm text-body-sm font-bold text-on-surface">
                          Tương tác nấu thử từ cộng đồng
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          Nhận thông báo khi có thành viên lưu, bình luận hoặc khoe ảnh thành quả mâm cơm theo công thức của bạn.
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({ ...prev, communityInteraction: !prev.communityInteraction }))
                        }
                        className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shadow-inner flex-shrink-0 cursor-pointer ${
                          notifications.communityInteraction ? "bg-secondary justify-end" : "bg-surface-container-highest justify-start"
                        }`}
                        type="button"
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md block" />
                      </button>
                    </div>

                    {/* Toggle Item 3 */}
                    <div className="flex items-center justify-between py-3.5 gap-space-md">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-body-sm text-body-sm font-bold text-on-surface">
                            Kiểm duyệt &amp; Đóng góp công thức
                          </span>
                          <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-[10px] font-bold">
                            Quan trọng
                          </span>
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          Cập nhật trạng thái phê duyệt từ Ban Cố Vấn Ẩm Thực RecipeHub (Đã duyệt, Cần chỉnh sửa bước nấu).
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({ ...prev, recipeModeration: !prev.recipeModeration }))
                        }
                        className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shadow-inner flex-shrink-0 cursor-pointer ${
                          notifications.recipeModeration ? "bg-secondary justify-end" : "bg-surface-container-highest justify-start"
                        }`}
                        type="button"
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md block" />
                      </button>
                    </div>

                    {/* Toggle Item 4 */}
                    <div className="flex items-center justify-between py-3.5 gap-space-md">
                      <div className="space-y-0.5">
                        <div className="font-body-sm text-body-sm font-bold text-on-surface">
                          Bản tin mâm cơm cuối tuần qua Email
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          Gửi tổng hợp món ngon theo mùa và xu hướng thực đơn cuối tuần vào mỗi sáng Thứ Bảy.
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({ ...prev, weeklyNewsletter: !prev.weeklyNewsletter }))
                        }
                        className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shadow-inner flex-shrink-0 cursor-pointer ${
                          notifications.weeklyNewsletter ? "bg-secondary justify-end" : "bg-surface-container-highest justify-start"
                        }`}
                        type="button"
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-md block" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* ================= SECTION 5: Danger Zone ================= */}
                <section
                  className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] p-space-md lg:p-space-lg flex flex-col gap-space-md"
                  id="danger-section"
                >
                  <div className="flex items-center justify-between pb-space-xs border-b border-error-container/60">
                    <div>
                      <div className="flex items-center gap-2 text-error">
                        <Icon name="warning" className="text-[24px]" />
                        <h2 className="font-title-md text-title-md font-bold">Vùng nguy hiểm (Danger Zone)</h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Các thao tác ảnh hưởng sâu sắc đến quyền riêng tư hoặc hủy bỏ hoàn toàn tài khoản bếp.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[11px] font-bold">
                      Cần cẩn trọng
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-md">
                    {/* Option 1: Temporary Deactivation */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                      <div className="space-y-1">
                        <div className="font-body-sm text-body-sm font-bold text-on-surface">
                          Tạm khóa tài khoản gian bếp
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                          Tạm thời ẩn toàn bộ 28 công thức đã chia sẻ và hồ sơ công khai của bạn khỏi cộng đồng. Bạn có thể kích hoạt lại bất kỳ lúc nào bằng cách đăng nhập lại.
                        </p>
                      </div>
                      <button
                        onClick={() => triggerToast("Đã tạm khóa tài khoản. Bạn có thể đăng nhập lại bất cứ lúc nào.")}
                        className="px-space-md py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium transition-all shadow-sm whitespace-nowrap cursor-pointer"
                        type="button"
                      >
                        Tạm khóa tài khoản
                      </button>
                    </div>

                    {/* Option 2: Permanent Deletion */}
                    <div className="p-space-md rounded-xl bg-error-container/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                      <div className="space-y-1">
                        <div className="font-body-sm text-body-sm font-bold text-error">Xóa vĩnh viễn tài khoản</div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl leading-relaxed">
                          Hành động này sẽ xóa toàn bộ 28 công thức đã đăng, 42 món yêu thích và dữ liệu lịch nấu gia đình. Hành động này không thể hoàn tác sau 30 ngày bảo lưu.
                        </p>
                      </div>
                      <button
                        onClick={() => triggerToast("Yêu cầu xóa tài khoản đã được tiếp nhận.")}
                        className="px-space-md py-2.5 rounded-xl bg-error hover:bg-on-error-container text-on-error font-body-sm text-body-sm font-semibold transition-all shadow-[0_4px_12px_rgba(186,26,26,0.2)] whitespace-nowrap cursor-pointer"
                        type="button"
                      >
                        Yêu cầu xóa tài khoản
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

          {/* TOAST THÔNG BÁO */}
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
  );
}
