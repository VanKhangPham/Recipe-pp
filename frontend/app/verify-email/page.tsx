"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [currentEmail, setCurrentEmail] = React.useState(emailParam || "nguyenhoangnam.bep@gmail.com");
  const [activeState, setActiveState] = React.useState<"pending" | "success" | "expired">("pending");
  const [countdown, setCountdown] = React.useState(52);
  const [canResend, setCanResend] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newEmailInput, setNewEmailInput] = React.useState(currentEmail);

  // Timer countdown
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
  };

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmailInput.trim()) {
      setCurrentEmail(newEmailInput.trim());
      setIsModalOpen(false);
      setCountdown(60);
      setCanResend(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Interactive State Controller & Breadcrumb Sub-bar */}
      <section className="w-full bg-surface-container-low px-gutter py-space-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="home" size={16} />
              Trang chủ
            </Link>
            <Icon name="chevron_right" size={14} className="text-tertiary" />
            <Link href="/login" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Tài khoản
            </Link>
            <Icon name="chevron_right" size={14} className="text-tertiary" />
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              Kích hoạt quyền sáng tạo
            </span>
          </div>

          {/* State Switching Bar (Demonstrates all 3 critical flows seamlessly) */}
          <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-full self-start md:self-auto shadow-inner">
            <span className="font-label-mono-sm text-label-mono-sm px-2 text-on-surface-variant font-medium">
              Mô phỏng trạng thái:
            </span>
            <button
              type="button"
              onClick={() => setActiveState("pending")}
              className={`px-3 py-1 rounded-full font-body-sm text-body-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeState === "pending"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              Đang chờ xác thực
            </button>
            <button
              type="button"
              onClick={() => setActiveState("success")}
              className={`px-3 py-1 rounded-full font-body-sm text-body-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeState === "success"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Thành công
            </button>
            <button
              type="button"
              onClick={() => setActiveState("expired")}
              className={`px-3 py-1 rounded-full font-body-sm text-body-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeState === "expired"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-error" />
              Hết hạn / Lỗi
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout Area */}
      <div className="w-full px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto">
          {/* Top Context Banner */}
          <div className="w-full bg-surface-container rounded-2xl p-space-md mb-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md shadow-sm border border-outline-variant/30">
            <div className="flex items-start sm:items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <Icon name="shield_person" size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Tiến trình kích hoạt quyền Bếp Trưởng Gia Đình
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                    Cấp độ 1: Bước chuẩn bị
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Xác thực hòm thư để bảo vệ bản quyền công thức và ngăn chặn nội dung quảng cáo rác trong mạng lưới RecipeHub.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
              <div className="text-right">
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary block">
                  Trạng thái bếp cá nhân
                </span>
                <span className="font-body-md text-body-md text-primary font-semibold">
                  Chờ xác minh 1 bước
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <Icon name="lock_clock" size={20} />
              </div>
            </div>
          </div>

          {/* Main Asymmetric Grid (7:5 Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Primary Interaction Column (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              {/* STATE 1: PENDING VERIFICATION */}
              {activeState === "pending" && (
                <div className="w-full bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 transition-all">
                  {/* Warm Culinary Graphic & Badge */}
                  <div className="flex items-start justify-between gap-space-md mb-space-md">
                    <div className="relative">
                      {/* Decorative Warm Glow */}
                      <div className="absolute -inset-2 bg-primary-fixed/40 rounded-3xl blur-lg" />
                      {/* Culinary Letter Stamp Graphic */}
                      <div className="relative w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center shadow-sm">
                        <Icon name="mail_lock" size={42} className="text-primary" />
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm">
                          <Icon name="verified" size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm font-medium">
                      <Icon name="sync" size={16} className="text-primary animate-spin" />
                      Đang chờ kích hoạt
                    </div>
                  </div>

                  {/* Header & Context */}
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
                    Chỉ còn một bước để mở khóa quyền đăng công thức!
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                    Chúng tôi đã gửi một bức thư chứa liên kết xác thực an toàn tới hòm thư của bạn. Vui lòng bấm vào liên kết trong thư để kích hoạt hồ sơ, tạo trang cá nhân và bắt đầu truyền cảm hứng nấu nướng tới hàng nghìn thành viên khác.
                  </p>

                  {/* User Email Chip Container */}
                  <div className="w-full bg-surface-container-low rounded-2xl p-space-md mb-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-inner border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                        <Icon name="alternate_email" size={20} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary block">
                          Địa chỉ nhận thư kích hoạt
                        </span>
                        <p className="font-label-mono-lg text-label-mono-lg text-on-surface font-semibold truncate">
                          {currentEmail}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewEmailInput(currentEmail);
                        setIsModalOpen(true);
                      }}
                      className="px-space-md py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Icon name="edit" size={16} />
                      <span>Thay đổi địa chỉ email</span>
                    </button>
                  </div>

                  {/* Email Quick Access Buttons */}
                  <div className="mb-space-lg">
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase tracking-wider block mb-space-sm">
                      Mở nhanh ứng dụng hòm thư
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      <a
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all group shadow-sm border border-outline-variant/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-xs">
                            <Icon name="mark_email_unread" size={22} className="text-[#EA4335]" />
                          </div>
                          <div>
                            <span className="font-title-md text-title-md text-on-surface block text-[16px] leading-5 font-semibold">
                              Mở Google Gmail
                            </span>
                            <span className="font-body-sm text-body-sm text-tertiary">Chuyển hướng trực tiếp</span>
                          </div>
                        </div>
                        <Icon name="arrow_forward" size={20} className="text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </a>

                      <a
                        href="https://outlook.live.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all group shadow-sm border border-outline-variant/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-xs">
                            <Icon name="mail" size={22} className="text-[#0078D4]" />
                          </div>
                          <div>
                            <span className="font-title-md text-title-md text-on-surface block text-[16px] leading-5 font-semibold">
                              Mở Hộp thư Outlook
                            </span>
                            <span className="font-body-sm text-body-sm text-tertiary">Chuyển hướng trực tiếp</span>
                          </div>
                        </div>
                        <Icon name="arrow_forward" size={20} className="text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </a>
                    </div>
                  </div>

                  {/* Resend Mechanism & Interactive Countdown */}
                  <div className="pt-space-md bg-surface-container-low rounded-2xl p-space-md border border-outline-variant/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                      <div className="flex items-start gap-2.5">
                        <Icon name="help" size={22} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <h2 className="font-title-md text-title-md text-on-surface text-[16px] font-semibold">
                            Vẫn chưa nhận được thư kích hoạt?
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Vui lòng kiểm tra kỹ mục Thư rác (Spam) hoặc tab Quảng cáo (Promotions).
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={!canResend}
                        onClick={handleResend}
                        className={`px-space-md py-2.5 rounded-xl font-body-sm text-body-sm font-medium transition-all shrink-0 flex items-center justify-center gap-2 ${
                          canResend
                            ? "bg-primary text-on-primary hover:bg-primary-container cursor-pointer shadow-sm"
                            : "bg-surface-container text-tertiary cursor-not-allowed"
                        }`}
                      >
                        <Icon name="send" size={18} />
                        <span>
                          {canResend ? "Gửi lại thư xác thực ngay" : `Gửi lại thư xác thực (${countdown}s)`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Direct Simulator Button */}
                  <div className="mt-space-md pt-space-md flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/20">
                    <span className="flex items-center gap-1.5">
                      <Icon name="info" size={16} className="text-secondary" />
                      Thao tác kiểm thử đường dẫn từ hộp thư:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveState("success")}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Giả lập nhấp vào liên kết xác thực email
                      <Icon name="arrow_right_alt" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 2: SUCCESS STATE CARD */}
              {activeState === "success" && (
                <div className="w-full bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-space-md shadow-sm">
                    <Icon name="verified" size={36} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold mb-space-sm">
                    <Icon name="check_circle" size={14} />
                    Hoàn tất định danh tác giả
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
                    Xác thực email thành công!
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                    Tài khoản bếp của bạn đã được kích hoạt đầy đủ mọi tính năng. Giờ đây bạn có thể chia sẻ công thức độc quyền, tham gia xếp hạng bảng vàng cộng đồng và xuất bản nguyên liệu cho bạn bè nấu thử.
                  </p>

                  {/* Recipe Publishing Unlock Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-xl">
                    <div className="p-space-md bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <Icon name="skillet" size={24} className="text-primary mb-1" />
                      <span className="font-title-md text-title-md text-on-surface block text-[15px] font-semibold">
                        Đăng món không giới hạn
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Được hiển thị ngay trên bảng tin khám phá.
                      </p>
                    </div>
                    <div className="p-space-md bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <Icon name="mark_chat_read" size={24} className="text-secondary mb-1" />
                      <span className="font-title-md text-title-md text-on-surface block text-[15px] font-semibold">
                        Tương tác hai chiều
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Giải đáp thắc mắc người xem khi họ làm theo.
                      </p>
                    </div>
                    <div className="p-space-md bg-surface-container-low rounded-2xl border border-outline-variant/20">
                      <Icon name="cloud_sync" size={24} className="text-primary-container mb-1" />
                      <span className="font-title-md text-title-md text-on-surface block text-[15px] font-semibold">
                        Sao lưu đa thiết bị
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Đồng bộ tự động thực đơn và giỏ chợ tuần.
                      </p>
                    </div>
                  </div>

                  {/* Primary CTAs for Success */}
                  <div className="flex flex-col sm:flex-row items-center gap-space-sm">
                    <Link
                      href="/recipes/new"
                      className="w-full sm:w-auto px-space-xl py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-body-md text-body-md font-semibold text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Icon name="add_circle" size={20} />
                      <span>Bắt đầu tạo công thức ngay</span>
                    </Link>
                    <Link
                      href="/"
                      className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-body-md text-body-md font-medium text-center flex items-center justify-center gap-2"
                    >
                      <span>Về trang chủ khám phá</span>
                      <Icon name="arrow_forward" size={18} />
                    </Link>
                  </div>
                </div>
              )}

              {/* STATE 3: EXPIRED / FAILED STATE CARD */}
              {activeState === "expired" && (
                <div className="w-full bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center text-on-error-container mb-space-md shadow-sm">
                    <Icon name="hourglass_disabled" size={36} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold mb-space-sm">
                    <Icon name="warning" size={14} />
                    Liên kết đã hết hiệu lực
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-xs">
                    Liên kết xác thực đã hết hạn!
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
                    Vì lý do an toàn bảo mật tài khoản cá nhân, mã xác nhận kích hoạt chỉ có giá trị trong vòng 24 giờ kể từ thời điểm gửi. Đừng lo lắng, nguyên liệu và bản thảo món ăn của bạn vẫn an toàn trên thiết bị này.
                  </p>
                  <div className="bg-surface-container-low rounded-2xl p-space-md mb-space-lg flex items-center gap-3 border border-outline-variant/20">
                    <Icon name="timer_off" size={24} className="text-error shrink-0" />
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Yêu cầu gửi lại thư sẽ hủy toàn bộ các liên kết cũ và gửi trực tiếp mã mới vào hòm thư <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">{currentEmail}</span>.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-space-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveState("pending");
                        setCountdown(60);
                        setCanResend(false);
                      }}
                      className="w-full sm:w-auto px-space-xl py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-body-md text-body-md font-semibold text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Icon name="refresh" size={20} />
                      <span>Yêu cầu gửi liên kết mới ngay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveState("pending")}
                      className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-body-md text-body-md font-medium text-center cursor-pointer"
                    >
                      Quay lại kiểm tra hòm thư
                    </button>
                  </div>
                </div>
              )}

              {/* Guest Non-blocking Passage Bar */}
              <div className="w-full bg-surface-container rounded-2xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-xs border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-xs">
                    <Icon name="restaurant" size={22} />
                  </div>
                  <div>
                    <span className="font-title-md text-title-md text-on-surface block text-[15px] font-semibold">
                      Bạn chưa muốn đăng bài ngay hôm nay?
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Vẫn có thể khám phá hàng ngàn công thức chuẩn vị và lên thực đơn tuần với tư cách Khách.
                    </p>
                  </div>
                </div>
                <Link
                  href="/recipes"
                  className="px-space-md py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-medium transition-all shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <span>Tiếp tục xem công thức</span>
                  <Icon name="arrow_forward" size={16} className="text-primary" />
                </Link>
              </div>
            </div>

            {/* Secondary Information & Community Trust Column (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* Anti-Spam & Community Quality Explanation Card */}
              <div className="w-full bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-sm mb-space-md">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <Icon name="workspace_premium" size={22} />
                  </div>
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                      Vì sao RecipeHub cần xác thực email?
                    </h2>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                      Tiêu chuẩn chất lượng cộng đồng
                    </span>
                  </div>
                </div>

                {/* 3 Bullet Points with Clear Clean Icons */}
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Icon name="verified_user" size={18} />
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface text-[15px] font-semibold">
                        Chống nội dung rác &amp; bài đăng sao chép
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Đảm bảo các gia vị, liều lượng và kỹ thuật làm bếp được đăng tải bởi những đầu bếp gia đình chân chính, không bị tràn ngập bởi tài khoản tự động (bot).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary shrink-0 mt-0.5">
                      <Icon name="notifications_active" size={18} />
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface text-[15px] font-semibold">
                        Nhận thông báo khi món được nấu thử
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Nhận thông tin ngay khi công thức của bạn được duyệt lên chuyên mục món ngon nổi bật trong tuần hoặc có thành viên chụp ảnh mâm cơm trả bài.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container shrink-0 mt-0.5">
                      <Icon name="cloud_sync" size={18} />
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface text-[15px] font-semibold">
                        Khôi phục dữ liệu gian bếp an toàn
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Dễ dàng lấy lại toàn bộ thực đơn 7 ngày, danh mục nguyên liệu đi chợ đã lưu và danh sách yêu thích khi bạn đổi điện thoại hoặc dọn dẹp trình duyệt.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anti-Spam Trust Notice */}
                <div className="mt-space-lg pt-space-md bg-surface-container-low/70 rounded-2xl p-space-md flex items-center gap-3 border border-outline-variant/20">
                  <Icon name="lock" size={22} className="text-secondary shrink-0" />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    RecipeHub tôn trọng quyền riêng tư. Chúng tôi tuyệt đối không bao giờ gửi email spam hoặc chia sẻ thông tin hòm thư cho bên thứ ba.
                  </p>
                </div>
              </div>

              {/* Recipe Author Guidelines & First Recipe Preview */}
              <div className="w-full bg-surface-container rounded-3xl p-space-lg shadow-sm border border-outline-variant/30">
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase tracking-wider block mb-space-xs">
                  Chuẩn bị sau xác thực
                </span>
                <h3 className="font-title-md text-title-md text-on-surface mb-space-sm font-semibold">
                  Công thức đầu tiên của bạn sẽ trông như thế nào?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Hệ thống soạn thảo công thức thông minh của chúng tôi tự động tính toán calo và quy đổi khối lượng đi chợ theo số người ăn.
                </p>

                {/* Visual Preview Card Snippet */}
                <div className="w-full bg-surface-container-lowest rounded-2xl p-space-sm flex gap-3 shadow-xs border border-outline-variant/20">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK298MII3r5k2YT0oOFUH9CeIcm006RytsrkW0mL66p6gtoJidZ1I_p7onx_1H_kosxXN-09Qa8NtC-dQRpWPNOuJtrXJeYZ7eX0oOMWB_2R2OSjloQ16TD1uKfdFNYXWlSfVSRzz6QayyspHRs96tm392MtCSMCohPNQZRmGdOAcXhnLWQeNZwbIcmT20eCGRs0Efjr3vCiwiKT2new4HXiEwByANVMdWDLopmVVV"
                      alt="Vietnamese Pho bo"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px] font-semibold">
                        Dễ làm
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-tertiary">35 phút</span>
                    </div>
                    <h4 className="font-title-md text-title-md text-on-surface text-[15px] font-semibold truncate">
                      Phở Bò Tái Lăn Hà Nội Chuẩn Vị
                    </h4>
                    <p className="font-body-sm text-body-sm text-tertiary truncate">Bởi Bếp Trưởng Nguyễn Nam</p>
                  </div>
                </div>
                <div className="mt-space-md flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <Icon name="auto_awesome" size={16} className="text-primary" />
                    Hỗ trợ đếm giờ rảnh tay
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                    Sẵn sàng xuất bản
                  </span>
                </div>
              </div>

              {/* Community Support Contact */}
              <div className="px-space-md py-space-sm flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>Cần trợ giúp kỹ thuật xác thực?</span>
                <Link href="/contact" className="text-primary hover:underline font-semibold flex items-center gap-1">
                  Liên hệ ban quản trị
                  <Icon name="support_agent" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Change Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-gutter">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-space-lg shadow-xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <Icon name="edit" size={20} />
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                  Thay đổi địa chỉ email
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Nhập địa chỉ email mới chính xác để chúng tôi gửi lại mã kích hoạt tài khoản bếp của bạn.
            </p>
            <form className="flex flex-col gap-space-md" onSubmit={handleEmailUpdate}>
              <div>
                <label className="font-label-mono-sm text-label-mono-sm text-on-surface block mb-1.5 font-medium" htmlFor="new-email-input">
                  Địa chỉ email mới
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[20px] text-tertiary pointer-events-none">
                    <Icon name="mail" size={20} />
                  </span>
                  <input
                    id="new-email-input"
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="tenban@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md outline-none border border-outline-variant/40 focus:bg-surface-container focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Icon name="check" size={18} />
                  Cập nhật &amp; Gửi lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </React.Suspense>
  );
}
