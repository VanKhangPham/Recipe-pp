"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // State: "step-1" | "step-2"
  const [activeStep, setActiveStep] = React.useState<"step-1" | "step-2">("step-1");

  // Step 1 states
  const [recoveryEmail, setRecoveryEmail] = React.useState("hoangnam.chef@gmail.com");
  const [emailSent, setEmailSent] = React.useState(true);
  const [step1Error, setStep1Error] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState(45);
  const [canResend, setCanResend] = React.useState(false);

  // Step 2 states
  const [newPassword, setNewPassword] = React.useState("BepViet#2025");
  const [confirmPassword, setConfirmPassword] = React.useState("BepViet#2025");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [step2Error, setStep2Error] = React.useState<string | null>(null);
  const [step2Success, setStep2Success] = React.useState(false);

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
    setCountdown(45);
    setCanResend(false);
  };

  // Password criteria
  const hasLength = newPassword.length >= 8;
  const hasCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  let strengthScore = 0;
  if (hasLength) strengthScore++;
  if (hasCase) strengthScore++;
  if (hasNumber) strengthScore++;
  if (hasSpecial) strengthScore++;

  const strengthLabels = ["Rất yếu (0%)", "Yếu (25%)", "Trung bình (50%)", "Khá (75%)", "Rất mạnh (100%)"];

  const isPasswordMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error(null);

    if (strengthScore < 3) {
      setStep2Error("Mật khẩu chưa đủ độ an toàn (cần đạt mức Khá hoặc Rất mạnh).");
      return;
    }
    if (!isPasswordMatch) {
      setStep2Error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setStep2Success(true);
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Top Progress & Ambient Flow Ribbon */}
      <section className="w-full bg-surface-container-low px-gutter py-space-sm shadow-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex items-center gap-space-xs">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Icon name="home" size={16} />
              Trang chủ
            </Link>
            <span className="text-tertiary-fixed-dim">/</span>
            <Link href="/login" className="hover:text-primary transition-colors">
              Tài khoản
            </Link>
            <span className="text-tertiary-fixed-dim">/</span>
            <span className="text-on-surface font-medium">Bảo mật &amp; Khôi phục quyền truy cập</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
              <Icon name="encrypted" size={15} className="text-secondary" />
              Mã hóa chuẩn SSL 256-bit
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
              <Icon name="verified_user" size={15} className="text-primary" />
              Hệ thống bảo vệ công thức gia đình
            </span>
          </div>
        </div>
      </section>

      {/* Main Recovery Stage */}
      <section className="w-full px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          {/* Section Intro Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-sm">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm mb-3">
                <Icon name="lock_reset" size={16} className="text-primary" />
                Quy trình bảo mật 2 bước
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Khôi phục mật khẩu &amp; Bảo vệ gian bếp số
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                Lấy lại quyền truy cập an toàn để tiếp tục hành trình lưu giữ sổ tay công thức, kế hoạch đi chợ và nhật ký dinh dưỡng gia đình bạn.
              </p>
            </div>

            {/* Workflow Tab Toggles */}
            <div className="flex items-center p-1.5 bg-surface-container rounded-2xl shadow-inner shrink-0" role="tablist">
              <button
                type="button"
                onClick={() => setActiveStep("step-1")}
                className={`flex items-center gap-2 px-space-md py-2.5 rounded-xl font-body-md text-body-md font-medium transition-all cursor-pointer ${
                  activeStep === "step-1"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-label-mono-sm text-label-mono-sm flex items-center justify-center font-semibold ${
                    activeStep === "step-1" ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  1
                </span>
                <span>Bước 1: Gửi liên kết</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep("step-2")}
                className={`flex items-center gap-2 px-space-md py-2.5 rounded-xl font-body-md text-body-md font-medium transition-all cursor-pointer ${
                  activeStep === "step-2"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-label-mono-sm text-label-mono-sm flex items-center justify-center font-semibold ${
                    activeStep === "step-2" ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  2
                </span>
                <span>Bước 2: Đặt mật khẩu mới</span>
              </button>
            </div>
          </div>

          {/* Core Workspace Grid: 7:5 Editorial Asymmetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left Column: Dynamic State Display (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              {/* STEP 1: YÊU CẦU KHÔI PHỤC MẬT KHẨU */}
              {activeStep === "step-1" && (
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] flex flex-col gap-space-lg border border-outline-variant/30">
                  <div className="flex items-start justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold uppercase tracking-wider">
                        Bước 1 / 2
                      </span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                        Quên mật khẩu?
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mt-1">
                        Nhập địa chỉ email đã đăng ký tài khoản RecipeHub để nhận liên kết đặt lại mật khẩu an toàn và hướng dẫn bảo mật.
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Icon name="mark_email_unread" size={28} />
                    </div>
                  </div>

                  {/* Email Request Form */}
                  {step1Error && (
                    <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-error text-sm">
                      <Icon name="error" size={18} className="shrink-0" />
                      <span>{step1Error}</span>
                    </div>
                  )}

                  <form
                    className="flex flex-col gap-space-md mt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep1Error(null);
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!recoveryEmail.trim() || !emailRegex.test(recoveryEmail.trim())) {
                        setStep1Error("Vui lòng nhập định dạng email hợp lệ.");
                        return;
                      }
                      setEmailSent(true);
                      setCountdown(45);
                      setCanResend(false);
                    }}
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-md text-body-md font-semibold text-on-surface flex items-center justify-between" htmlFor="recovery-email">
                        <span>Địa chỉ email tài khoản</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Đã liên kết sổ tay</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-on-surface-variant pointer-events-none">
                          <Icon name="mail" size={20} />
                        </span>
                        <input
                          id="recovery-email"
                          name="email"
                          type="email"
                          value={recoveryEmail}
                          onChange={(e) => {
                            setRecoveryEmail(e.target.value);
                            if (step1Error) setStep1Error(null);
                          }}
                          placeholder="vidu@gmail.com"
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline-variant border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                        />
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                        <Icon name="info" size={16} className="text-secondary" />
                        [Mô phỏng - Chưa kết nối SMTP/API gửi email thật]. Thao tác sẽ hiển thị thông báo mô phỏng gửi thư.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="submit"
                      className="w-full mt-2 py-4 px-space-lg rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(163,57,0,0.35)] cursor-pointer"
                    >
                      <span>Gửi hướng dẫn khôi phục (Mô phỏng)</span>
                      <Icon name="arrow_forward" size={20} />
                    </button>
                  </form>

                  {/* Success Notification Preview Card */}
                  {emailSent && (
                    <div className="rounded-2xl bg-secondary-fixed/40 p-5 flex flex-col gap-space-sm shadow-sm border border-secondary/20">
                      <div className="flex items-start gap-space-sm">
                        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Icon name="check" size={18} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <h3 className="font-body-md text-body-md font-semibold text-on-secondary-fixed">
                            Email hướng dẫn đã được gửi thành công!
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant leading-relaxed">
                            Hệ thống đã gửi liên kết bảo mật tới hộp thư <span className="font-semibold text-on-surface">{recoveryEmail}</span>. Vui lòng kiểm tra hòm thư chính và thư mục thư rác (Spam) trong vòng 15 phút.
                          </p>
                        </div>
                      </div>

                      {/* Resend Timer Actions */}
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest/70 rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                          <Icon name="schedule" size={18} className="text-primary" />
                          <span>Chưa nhận được mã?</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {!canResend ? (
                            <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface font-semibold">
                              Gửi lại sau <span className="text-primary font-bold">{countdown}</span>s
                            </span>
                          ) : null}
                          <button
                            type="button"
                            disabled={!canResend}
                            onClick={handleResend}
                            className={`font-body-sm text-body-sm font-medium flex items-center gap-1 transition-colors ${
                              canResend
                                ? "text-primary hover:underline cursor-pointer"
                                : "text-on-surface-variant cursor-not-allowed opacity-50"
                            }`}
                          >
                            <Icon name="refresh" size={16} />
                            Gửi lại email
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Return Links */}
                  <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
                    >
                      <Icon name="arrow_back" size={18} />
                      <span>Quay lại trang Đăng nhập</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveStep("step-2")}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-body-md text-body-md font-semibold transition-colors cursor-pointer"
                    >
                      <span>Xem giao diện Bước 2 (Mô phỏng token)</span>
                      <Icon name="open_in_new" size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: THIẾT LẬP MẬT KHẨU MỚI */}
              {activeStep === "step-2" && (
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] flex flex-col gap-space-lg border border-outline-variant/30">
                  <div className="flex items-start justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold uppercase tracking-wider">
                        Bước 2 / 2
                      </span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                        Thiết lập mật khẩu mới
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mt-1">
                        Tạo mật khẩu mạnh với độ bảo mật cao nhằm đảm bảo sổ tay công thức và bộ sưu tập ẩm thực của bạn luôn an toàn.
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 shadow-sm">
                      <Icon name="key" size={28} />
                    </div>
                  </div>

                  {/* Contextual Security Alert Badge */}
                  <div className="p-4 rounded-2xl bg-surface-container flex items-center gap-space-sm shadow-sm border border-outline-variant/20">
                    <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <Icon name="account_circle" size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
                        Xác thực mã thông báo hợp lệ
                      </span>
                      <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                        Đặt lại mật khẩu cho tài khoản: <span className="font-bold text-primary">{recoveryEmail}</span>
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 ml-auto px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                      <Icon name="lock" size={14} />
                      Token an toàn
                    </span>
                  </div>

                  {/* Feedback Banners */}
                  {step2Error && (
                    <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-error text-sm">
                      <Icon name="error" size={18} className="shrink-0" />
                      <span>{step2Error}</span>
                    </div>
                  )}

                  {step2Success && (
                    <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-2 text-secondary text-sm">
                      <Icon name="check_circle" size={18} className="shrink-0" />
                      <span>Mô phỏng: Cập nhật mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...</span>
                    </div>
                  )}

                  {/* Reset Password Input Form */}
                  <form className="flex flex-col gap-space-md" onSubmit={handlePasswordUpdate}>
                    {/* Input: Mật khẩu mới */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-md text-body-md font-semibold text-on-surface" htmlFor="new-pass">
                        Mật khẩu mới
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-on-surface-variant pointer-events-none">
                          <Icon name="lock" size={20} />
                        </span>
                        <input
                          id="new-pass"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới an toàn"
                          required
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline-variant border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          title="Hiện/Ẩn mật khẩu"
                          className="absolute right-3.5 p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg cursor-pointer"
                        >
                          <Icon name={showNewPassword ? "visibility_off" : "visibility"} size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Meter */}
                    <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Độ mạnh mật khẩu
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                          {strengthLabels[strengthScore]}
                        </span>
                      </div>

                      {/* 4-bar indicator */}
                      <div className="grid grid-cols-4 gap-2 w-full">
                        <div className={`h-2 rounded-full transition-all ${strengthScore >= 1 ? "bg-secondary" : "bg-surface-container-high"}`} />
                        <div className={`h-2 rounded-full transition-all ${strengthScore >= 2 ? "bg-secondary" : "bg-surface-container-high"}`} />
                        <div className={`h-2 rounded-full transition-all ${strengthScore >= 3 ? "bg-secondary" : "bg-surface-container-high"}`} />
                        <div className={`h-2 rounded-full transition-all ${strengthScore >= 4 ? "bg-secondary" : "bg-surface-container-high"}`} />
                      </div>

                      {/* Criteria Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <div className={`flex items-center gap-2 font-body-sm text-body-sm font-medium ${hasLength ? "text-secondary" : "text-on-surface-variant"}`}>
                          <Icon name={hasLength ? "check_circle" : "radio_button_unchecked"} size={16} />
                          <span>Tối thiểu 8 ký tự</span>
                        </div>
                        <div className={`flex items-center gap-2 font-body-sm text-body-sm font-medium ${hasCase ? "text-secondary" : "text-on-surface-variant"}`}>
                          <Icon name={hasCase ? "check_circle" : "radio_button_unchecked"} size={16} />
                          <span>Chứa chữ hoa &amp; chữ thường</span>
                        </div>
                        <div className={`flex items-center gap-2 font-body-sm text-body-sm font-medium ${hasNumber ? "text-secondary" : "text-on-surface-variant"}`}>
                          <Icon name={hasNumber ? "check_circle" : "radio_button_unchecked"} size={16} />
                          <span>Có ít nhất 1 chữ số (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-2 font-body-sm text-body-sm font-medium ${hasSpecial ? "text-secondary" : "text-on-surface-variant"}`}>
                          <Icon name={hasSpecial ? "check_circle" : "radio_button_unchecked"} size={16} />
                          <span>Ký tự đặc biệt (@, #, $, ...)</span>
                        </div>
                      </div>
                    </div>

                    {/* Input: Xác nhận mật khẩu mới */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-md text-body-md font-semibold text-on-surface" htmlFor="confirm-pass">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-on-surface-variant pointer-events-none">
                          <Icon name="lock_clock" size={20} />
                        </span>
                        <input
                          id="confirm-pass"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới vừa đặt"
                          required
                          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline-variant border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          title="Hiện/Ẩn mật khẩu"
                          className="absolute right-3.5 p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg cursor-pointer"
                        >
                          <Icon name={showConfirmPassword ? "visibility_off" : "visibility"} size={20} />
                        </button>
                      </div>
                      {isPasswordMatch && (
                        <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-0.5">
                          <Icon name="task_alt" size={16} />
                          Mật khẩu trùng khớp hoàn toàn.
                        </p>
                      )}
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className="w-full mt-2 py-4 px-space-lg rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(163,57,0,0.35)] cursor-pointer"
                    >
                      <Icon name="save" size={20} />
                      <span>Cập nhật mật khẩu mới &amp; Đăng nhập</span>
                    </button>
                  </form>

                  {/* Back to step 1 link */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep("step-1")}
                      className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer"
                    >
                      <Icon name="arrow_back" size={18} />
                      <span>Quay lại yêu cầu gửi email khác</span>
                    </button>
                    <Link
                      href="/contact"
                      className="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm underline"
                    >
                      Cần hỗ trợ từ ban quản trị?
                    </Link>
                  </div>
                </div>
              )}

              {/* Important Security & Verification Guidelines (Mandatory Box) */}
              <div className="rounded-3xl bg-surface-container p-6 sm:p-7 flex flex-col gap-space-sm shadow-sm border border-outline-variant/30">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <Icon name="gshield" size={22} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                      Lưu ý an toàn tài khoản từ RecipeHub
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      RecipeHub không bao giờ yêu cầu bạn cung cấp mật khẩu qua điện thoại hoặc tin nhắn mạng xã hội. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email hoặc liên hệ ngay ban quản trị tại{" "}
                      <a className="text-primary font-semibold hover:underline" href="mailto:hotro@recipehub.vn">
                        hotro@recipehub.vn
                      </a>{" "}
                      để khóa tạm thời gian bếp của bạn.
                    </p>
                  </div>
                </div>

                {/* Mini Trust Elements Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-sm mt-space-xs border-t border-outline-variant/20">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="verified" size={18} className="text-secondary" />
                    <span>Không lưu mật khẩu thô</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="timer_off" size={18} className="text-primary" />
                    <span>Hết hạn tự động sau 15p</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <Icon name="devices" size={18} className="text-secondary" />
                    <span>Đăng xuất phiên cũ tự động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Warm Culinary Accent & Protection Narrative (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg">
              {/* Culinary Showcase Card */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] flex flex-col gap-space-md border border-outline-variant/30">
                {/* Food Photography */}
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner group">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzHx8DJNgoCwTY7kV5AbTRpjciUgoZ-n4vdEBJj5i5ZWXCoWKbk8wo25LTCsFq478YzpGsLAiqAiTEmd-qOPu_5Jh8l7YGjJWTpilfUs_Os5aXYbsDXX1BkEtsqJG-SPlgbSRoGfZ8TEWdLgRJP1GAdK3neBHKCexOc16rpo2Tj3QdJq5EsLEYajAq4__yPN0eksH5tr7ivhV3rwid5ONYrSEAtOyzq19CimNPEffk"
                    alt="A warm sunlit Vietnamese modern kitchen counter with terracotta bowls filled with fragrant phở herbs"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent" />
                  {/* Floating Culinary Quote Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-start gap-3 border border-outline-variant/20">
                    <Icon name="menu_book" size={24} className="text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">
                        Bảo vệ gian bếp cá nhân
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Lưu giữ trọn vẹn gia tài công thức gia truyền và công sức tích lũy thực đơn của gia đình bạn.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bento Stats Card */}
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
                      Công thức bảo mật
                    </span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">148,000+</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Được mã hóa &amp; bảo lưu</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary-fixed/30 flex flex-col gap-1 border border-secondary/20">
                    <span className="font-label-mono-sm text-label-mono-sm text-on-secondary-fixed uppercase">
                      Đầu bếp tin dùng
                    </span>
                    <span className="font-headline-md text-headline-md text-secondary font-bold">99.8%</span>
                    <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant">Đánh giá an tâm tuyệt đối</span>
                  </div>
                </div>

                {/* RecipeHub Culinary Security Highlights */}
                <div className="p-5 rounded-2xl bg-surface-container flex flex-col gap-space-sm border border-outline-variant/20">
                  <span className="font-body-md text-body-md font-semibold text-on-surface flex items-center gap-2">
                    <Icon name="cookie" size={20} className="text-primary" />
                    Dữ liệu được lưu trữ nguyên vẹn:
                  </span>
                  <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <Icon name="check_circle" size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span>
                        <strong>Thực đơn tuần &amp; lịch ăn uống:</strong> Tiếp tục đồng bộ ngay sau khi đăng nhập mật khẩu mới.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="check_circle" size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span>
                        <strong>Danh sách đi chợ thông minh:</strong> Các nguyên liệu và mục đánh dấu không bị mất mát.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="check_circle" size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span>
                        <strong>Sổ ghi chú định lượng bí truyền:</strong> Mọi gia vị điều chỉnh theo khẩu vị riêng được an toàn.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Emergency Direct Support Card */}
                <div className="p-4 rounded-2xl bg-surface-container-high/60 flex items-center justify-between gap-space-sm border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                      <Icon name="headset_mic" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Cần trợ giúp khẩn cấp?</span>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Hỗ trợ trực tuyến 24/7</span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface text-on-surface font-body-sm text-body-sm font-medium transition-colors shadow-sm"
                  >
                    Chat hỗ trợ
                  </Link>
                </div>
              </div>

              {/* Secondary Visual Card: Kitchen Note Tips */}
              <div className="p-6 rounded-3xl bg-primary-fixed/30 flex flex-col gap-space-sm shadow-sm border border-primary/20">
                <div className="flex items-center gap-2 text-on-primary-fixed font-semibold font-title-md text-title-md">
                  <Icon name="lightbulb" size={22} className="text-primary" />
                  Mẹo đặt mật khẩu dễ nhớ nhưng khó đoán
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-fixed-variant leading-relaxed">
                  Bạn có thể sử dụng câu thần chú kết hợp món ăn yêu thích và một năm đáng nhớ. Ví dụ:{" "}
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold bg-surface-container-lowest px-2 py-0.5 rounded text-primary">
                    PhoBoNong#2024
                  </span>{" "}
                  hoặc{" "}
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold bg-surface-container-lowest px-2 py-0.5 rounded text-primary">
                    BanhMiGion@88
                  </span>
                  . Vừa chuẩn phong cách đầu bếp, vừa bất khả xâm phạm!
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pt-space-lg flex flex-col gap-space-md border-t border-outline-variant/20">
            <div className="flex flex-col gap-1 max-w-xl">
              <span className="font-label-mono-sm text-label-mono-sm text-primary font-semibold uppercase">
                Giải đáp thắc mắc
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Câu hỏi thường gặp khi khôi phục tài khoản
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-body-md text-body-md font-semibold text-on-surface flex items-center gap-2">
                  <Icon name="help" size={18} className="text-primary" />
                  Tại sao tôi không nhận được email?
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Hãy kiểm tra kỹ thư mục Thư rác (Spam) hoặc Quảng cáo (Promotions). Nếu sau 2 phút vẫn chưa thấy, hãy bấm nút &ldquo;Gửi lại email&rdquo; hoặc kiểm tra xem bạn có gõ nhầm đuôi hòm thư hay không.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-body-md text-body-md font-semibold text-on-surface flex items-center gap-2">
                  <Icon name="history_toggle_off" size={18} className="text-secondary" />
                  Liên kết hết hạn thì làm thế nào?
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Vì lý do bảo mật dữ liệu ẩm thực cá nhân, mỗi liên kết chỉ tồn tại 15 phút. Bạn chỉ cần nhập lại địa chỉ email tại Bước 1 để hệ thống phát hành một mã bảo mật mới ngay tức thì.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-body-md text-body-md font-semibold text-on-surface flex items-center gap-2">
                  <Icon name="phonelink_lock" size={18} className="text-primary" />
                  Có cần xác thực thiết bị mới không?
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Sau khi cập nhật mật khẩu mới thành công, toàn bộ các phiên đăng nhập lạ trên các trình duyệt khác sẽ được tự động ngắt kết nối để đảm bảo chỉ có bạn đang nắm giữ quyền làm chủ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
