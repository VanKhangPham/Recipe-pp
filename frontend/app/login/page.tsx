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
  const requestedUrl = searchParams.get("returnUrl");
  const returnUrl = requestedUrl?.startsWith("/") && !requestedUrl.startsWith("//") && !requestedUrl.includes(String.fromCharCode(92)) ? requestedUrl : "/recipes";
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");

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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle" || !validateForm()) return;

    setStatus("loading");
    try {
      const account = await login(email, password);
      setStatus("success");
      setTimeout(() => {
        router.push(account.role === "admin" ? "/admin" : returnUrl);
      }, 500);
    } catch (err: unknown) {
      setStatus("idle");
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full flex items-stretch py-space-md px-gutter lg:px-margin">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left Column: Auth Form Container (7/12 desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center py-space-sm sm:py-space-md">
            {/* Form Wrapper Card */}
            <div className="bg-surface-container-lowest rounded-[1.75rem] p-space-lg sm:p-space-xl shadow-[0_20px_40px_-15px_rgba(28,25,23,0.05)] border border-outline-variant/30">
              {/* Header Form */}
              <div className="mb-space-lg">
                <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary font-semibold block mb-1">
                  Xác thực tài khoản
                </span>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2">
                  Khởi đầu bữa cơm gia đình
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Nhập email và mật khẩu để đăng nhập.
                </p>
              </div>

              {/* Inline Error Notification */}
              {searchParams.get("registered") === "1" && <p role="status" className="mb-4 rounded-xl border p-4">Đã tạo tài khoản. Hãy đăng nhập bằng email và mật khẩu vừa đăng ký.</p>}
              {searchParams.get("passwordChanged") === "1" && <p role="status" className="mb-4 rounded-xl border p-4">Đã đổi mật khẩu. Hãy đăng nhập bằng mật khẩu mới.</p>}
              {errorMessage && (
                <div role="alert" className="mb-space-md p-space-md rounded-xl bg-error/10 border border-error/20 flex items-start gap-space-sm text-error">
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

                {/* CTA Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-space-lg rounded-xl font-body-lg text-body-lg font-medium shadow-[0_12px_24px_-8px_rgba(163,57,0,0.35)] transition-all cursor-pointer ${
                      status === "success"
                        ? "bg-secondary text-on-secondary"
                        : status === "loading"
                        ? "bg-primary/70 text-on-primary cursor-wait"
                        : "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99]"
                    }`}
                  >
                    {status === "loading" && (
                      <>
                        <Icon name="sync" size={20} className="animate-spin" />
                        <span>Đang xác thực tài khoản...</span>
                      </>
                    )}
                    {status === "success" && (
                      <>
                        <Icon name="check_circle" size={20} />
                        <span>Đăng nhập thành công!</span>
                      </>
                    )}
                    {status === "idle" && (
                      <>
                        <span>Đăng nhập hệ thống</span>
                        <Icon name="arrow_forward" size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer Switch to Register */}
              <div className="pt-space-sm text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Chưa có tài khoản bếp riêng?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary-container font-semibold ml-1 inline-flex items-center gap-1 group"
                  >
                    <span>Đăng ký thành viên</span>
                    <Icon name="east" size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </p>
              </div>
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
                  Khám phá công thức cho bữa cơm nhà
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
