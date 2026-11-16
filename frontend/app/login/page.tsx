"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/recipes";
  const { login, loginAs } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [roleSelection, setRoleSelection] = React.useState<"user" | "admin">("user");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "simulated">("idle");

  const validateForm = (): boolean => {
    setErrorMessage(null);
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setErrorMessage("Vui lòng nhập địa chỉ email.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage("Định dạng email chưa hợp lệ (Ví dụ: bep.nha@recipehub.vn).");
      return false;
    }
    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu tài khoản.");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Mật khẩu cần tối thiểu 8 ký tự để đảm bảo an toàn.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("simulated");
      login(email, email.split("@")[0], roleSelection);

      setTimeout(() => {
        router.push(returnUrl);
      }, 700);
    }, 600);
  };

  const handleQuickPersona = (persona: "member" | "admin") => {
    setStatus("loading");
    setErrorMessage(null);
    setTimeout(() => {
      setStatus("simulated");
      loginAs(persona);
      setTimeout(() => {
        router.push(persona === "admin" ? "/admin" : returnUrl);
      }, 600);
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full flex items-stretch py-space-md px-gutter lg:px-margin">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left Column: Auth Form Container (7/12 desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center py-space-sm sm:py-space-md">
            {/* Demo Notice Banner */}
            <div className="mb-space-md p-space-md rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
              <div className="flex items-start gap-space-sm">
                <Icon name="info" size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs sm:text-sm">
                  <span className="font-semibold block mb-0.5">
                    Giao diện thử nghiệm (Demo Mode)
                  </span>
                  <p className="opacity-90 leading-relaxed">
                    Hệ thống chưa kết nối cơ sở dữ liệu thật. Mọi trạng thái đăng nhập được lưu tạm trong trình duyệt để kiểm thử trải nghiệm người dùng và phân quyền.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Demo Persona Switcher */}
            <div className="mb-space-lg p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-on-surface-variant font-semibold block mb-2">
                Kiểm thử nhanh vai trò mẫu (1 chạm)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <button
                  type="button"
                  disabled={status !== "idle"}
                  onClick={() => handleQuickPersona("member")}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-left transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-sm shrink-0">
                    HN
                  </div>
                  <div className="min-w-0">
                    <p className="font-title-md text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      Nguyễn Hoàng Nam
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-medium text-secondary">
                      Thành viên (Member)
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={status !== "idle"}
                  onClick={() => handleQuickPersona("admin")}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-left transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    HP
                  </div>
                  <div className="min-w-0">
                    <p className="font-title-md text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      Lê Hoàng Phúc
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-medium text-primary">
                      Quản trị viên (Admin)
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Form Wrapper Card */}
            <div className="bg-surface-container-lowest rounded-[1.75rem] p-space-lg sm:p-space-xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30">
              {/* Header Form */}
              <div className="mb-space-lg">
                <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary font-semibold block mb-1">
                  Đăng nhập mô phỏng
                </span>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2">
                  Khởi đầu bữa cơm gia đình
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Nhập thông tin tùy chọn hoặc dùng nút chọn vai trò phía trên.
                </p>
              </div>

              {/* Inline Error Notification */}
              {errorMessage && (
                <div className="mb-space-md p-space-md rounded-xl bg-error/10 border border-error/20 flex items-start gap-space-sm text-error">
                  <Icon name="error" size={18} className="shrink-0 mt-0.5" />
                  <span className="font-body-sm text-body-sm leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form className="space-y-space-md" onSubmit={handleSubmit} noValidate>
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block font-title-md text-title-md text-[14px] text-on-surface font-medium" htmlFor="auth-email">
                    Địa chỉ Email <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center justify-center text-outline pointer-events-none">
                      <Icon name="mail" size={20} />
                    </div>
                    <input
                      id="auth-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="ban.doc@recipehub.vn"
                      required
                      className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline/70 font-body-md text-body-md pl-11 pr-4 py-3 rounded-xl border border-outline-variant/40 shadow-[0_2px_8px_rgba(28,25,23,0.03)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(204,73,0,0.18)] focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-title-md text-title-md text-[14px] text-on-surface font-medium" htmlFor="auth-password">
                      Mật khẩu tài khoản <span className="text-error">*</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="font-body-sm text-body-sm text-primary hover:text-primary-container transition-colors font-medium"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center justify-center text-outline pointer-events-none">
                      <Icon name="lock" size={20} />
                    </div>
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Tối thiểu 8 ký tự"
                      required
                      className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline/70 font-body-md text-body-md pl-11 pr-11 py-3 rounded-xl border border-outline-variant/40 shadow-[0_2px_8px_rgba(28,25,23,0.03)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(204,73,0,0.18)] focus:border-primary transition-all"
                    />
                    <button
                      id="toggle-password-visibility"
                      type="button"
                      aria-label="Ẩn hoặc hiển thị mật khẩu"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 flex items-center justify-center text-outline hover:text-on-surface transition-colors p-1"
                    >
                      <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
                    </button>
                  </div>
                </div>

                {/* Role Selection for Custom Login */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-title-md text-title-md text-[14px] text-on-surface font-medium">
                    Gán vai trò kiểm thử cho phiên này:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoleSelection("user")}
                      className={`py-2 px-3 rounded-xl border font-body-sm text-body-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        roleSelection === "user"
                          ? "bg-secondary-fixed/30 border-secondary text-secondary font-semibold"
                          : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <Icon name="person" size={16} />
                      Thành viên (User)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleSelection("admin")}
                      className={`py-2 px-3 rounded-xl border font-body-sm text-body-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        roleSelection === "admin"
                          ? "bg-primary-fixed/30 border-primary text-primary font-semibold"
                          : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <Icon name="admin_panel_settings" size={16} />
                      Quản trị viên (Admin)
                    </button>
                  </div>
                </div>

                {/* Remember me & sync hint */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded-md text-secondary accent-[#006d30] focus:ring-0 cursor-pointer shadow-sm"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Ghi nhớ vai trò trên trình duyệt này
                    </span>
                  </label>
                </div>

                {/* CTA Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-space-lg rounded-xl font-body-lg text-body-lg font-medium shadow-[0_12px_24px_-8px_rgba(163,57,0,0.35)] transition-all cursor-pointer ${
                      status === "simulated"
                        ? "bg-secondary text-on-secondary"
                        : status === "loading"
                        ? "bg-primary/70 text-on-primary cursor-wait"
                        : "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99]"
                    }`}
                  >
                    {status === "loading" && (
                      <>
                        <Icon name="sync" size={20} className="animate-spin" />
                        <span>Đang thiết lập phiên mô phỏng...</span>
                      </>
                    )}
                    {status === "simulated" && (
                      <>
                        <Icon name="check_circle" size={20} />
                        <span>Đã kích hoạt phiên thử nghiệm!</span>
                      </>
                    )}
                    {status === "idle" && (
                      <>
                        <span>Đăng nhập mô phỏng</span>
                        <Icon name="arrow_forward" size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-space-lg flex items-center justify-center">
                <div className="w-full h-px bg-surface-container-high" />
                <span className="absolute px-3 bg-surface-container-lowest font-body-sm text-body-sm text-tertiary">
                  Hoặc tiếp tục với
                </span>
              </div>

              {/* Social Login Providers (Demo Only) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-lg">
                <button
                  type="button"
                  onClick={() => handleQuickPersona("member")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer text-xs font-medium"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.665-5.17 3.665-9.14z" fill="#4285F4" />
                    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.44 7.33 24 12 24z" fill="#34A853" />
                    <path d="M5.28 14.28a7.18 7.18 0 0 1 0-4.56V6.59H1.25a11.96 11.96 0 0 0 0 10.82l4.03-3.13z" fill="#FBBC05" />
                    <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.56 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.97 6.72-4.97z" fill="#EA4335" />
                  </svg>
                  <span>Google (Demo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona("member")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer text-xs font-medium"
                >
                  <svg className="w-4 h-4 shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook (Demo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona("member")}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer text-xs font-medium"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.95-1 .04-2.16.66-2.84 1.45-.59.68-1.12 1.77-.98 2.83 1.12.09 2.22-.55 2.86-1.33z" />
                  </svg>
                  <span>Apple (Demo)</span>
                </button>
              </div>

              {/* Footer Switch to Register */}
              <div className="pt-space-sm text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Chưa có tài khoản bếp riêng?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary-container font-semibold ml-1 inline-flex items-center gap-1 group"
                  >
                    <span>Đăng ký thử nghiệm</span>
                    <Icon name="east" size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-space-md px-space-sm flex items-start gap-space-xs text-tertiary">
              <Icon name="security" size={18} className="text-secondary shrink-0 mt-0.5" />
              <p className="font-body-sm text-body-sm leading-relaxed">
                <span className="font-semibold text-on-surface">Lưu ý phân quyền:</span> Đổi vai trò tại frontend nhằm mục đích đánh giá luồng giao diện người dùng. Việc bảo mật tài khoản thực tế sẽ được bảo vệ bởi xác thực JWT/OAuth2 từ Backend.
              </p>
            </div>
          </div>

          {/* Right Column: Culinary Artwork & Inspiration */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg relative mt-space-lg lg:mt-0">
            <div className="relative rounded-[2rem] overflow-hidden bg-surface-container-high shadow-[0_24px_48px_-12px_rgba(28,25,23,0.08)] group">
              <div className="relative w-full h-[460px] overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGcXbbgDGcvVqFJ2sRvMKM4urwJkFR2nDO9NAut2i4KcnabeeTHR9ba30XdgvYnBkOmRbX0tkCUVw9lsU6rPQtrA8tTFN3t1vIEG3GlxGBX2yyWlJSMawWcRJ5ZOxLqM2cQa0rtRRSNsrQsVoMbePscga9TZcDHhkGLnP1Bn64bJcfVqf51zf3rDFck8FE0pTmLLFLZBOlCsU3t0GJN5CrEnbVcime4C_odT0izQnq"
                  alt="Cozy photography of Vietnamese home cooking"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent flex flex-col justify-end p-space-lg sm:p-space-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-primary font-label-mono-sm text-label-mono-sm font-semibold flex items-center gap-1 shadow-sm">
                      <Icon name="local_fire_department" size={14} />
                      Món ngon hôm nay
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-highest/80 backdrop-blur-md text-inverse-on-surface font-label-mono-sm text-label-mono-sm">
                      35 phút • Chuẩn vị Bắc
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-inverse-on-surface font-semibold leading-snug mb-2">
                    &ldquo;Mỗi bữa cơm ngon là sợi dây gắn kết yêu thương.&rdquo;
                  </h2>
                  <p className="font-body-md text-body-md text-inverse-on-surface/80 line-clamp-2">
                    Khám phá kho công thức tinh tuyển từ cộng đồng yêu bếp RecipeHub.
                  </p>
                </div>
              </div>
            </div>

            <div className="-mt-8 sm:-mt-12 ml-4 sm:ml-8 z-10 p-space-md rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(28,25,23,0.1)] border border-outline-variant/30 flex items-center gap-space-md max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Icon name="menu_book" size={24} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Icon key={s} name="star" size={16} className="text-primary" />
                  ))}
                </div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                  Kho 12.800+ công thức tinh hoa
                </p>
                <p className="font-label-mono-sm text-label-mono-sm text-tertiary">
                  Cập nhật mỗi ngày từ cộng đồng
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}
