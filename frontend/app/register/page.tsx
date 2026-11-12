"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { safeStorage } from "@/lib/services/storage";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [subscribeWeekly, setSubscribeWeekly] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Password rules validation
  const hasLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpec = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let score = 0;
  if (hasLen) score++;
  if (hasUpper) score++;
  if (hasNum) score++;
  if (hasSpec) score++;

  let strengthLabel = "Chưa nhập";
  let strengthColor = "text-on-surface-variant";
  if (password.length > 0) {
    if (score <= 1) {
      strengthLabel = "Độ mạnh: Rất yếu";
      strengthColor = "text-error";
    } else if (score === 2) {
      strengthLabel = "Độ mạnh: Trung bình";
      strengthColor = "text-amber-600";
    } else if (score === 3) {
      strengthLabel = "Độ mạnh: Khá an toàn";
      strengthColor = "text-primary";
    } else {
      strengthLabel = "Độ mạnh: Rất mạnh";
      strengthColor = "text-secondary";
    }
  }

  const isMatch = confirmPassword.length > 0 && confirmPassword === password;
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const validate = (): boolean => {
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage("Vui lòng nhập họ và tên (tối thiểu 2 ký tự).");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage("Vui lòng nhập định dạng email hợp lệ (ví dụ: bannoitro@recipehub.vn).");
      return false;
    }

    if (!hasLen) {
      setErrorMessage("Mật khẩu phải có độ dài tối thiểu 8 ký tự.");
      return false;
    }

    if (!hasNum) {
      setErrorMessage("Mật khẩu phải chứa ít nhất 1 chữ số (0-9).");
      return false;
    }

    if (!hasUpper && !hasSpec) {
      setErrorMessage("Mật khẩu cần thêm ít nhất 1 chữ hoa hoặc 1 ký tự đặc biệt (!@#$%).");
      return false;
    }

    if (score < 3) {
      setErrorMessage("Mật khẩu chưa đủ an toàn theo quy chuẩn (yêu cầu đạt mức Khá hoặc Rất mạnh).");
      return false;
    }

    if (!confirmPassword) {
      setErrorMessage("Vui lòng nhập lại mật khẩu để xác nhận.");
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.");
      return false;
    }

    if (!agreeTerms) {
      setErrorMessage("Vui lòng tích chọn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của RecipeHub.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      safeStorage.setItem("recipehub_pending_verify_email", email.trim());
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full px-gutter py-space-lg lg:py-space-xl">
        <div className="max-w-7xl mx-auto">
          {/* Split-screen Architectural Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-start">
            {/* Left Editorial Storytelling Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg relative">
              {/* Subtle Decorative Culinary Glow */}
              <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none -z-10" />

              {/* Community Motivation Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 relative overflow-hidden">
                <div className="flex items-center gap-space-xs text-secondary font-label-mono-sm text-label-mono-sm uppercase tracking-wider mb-space-sm">
                  <Icon name="verified" size={16} />
                  <span>Cộng Đồng Ẩm Thực Văn Minh</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight mb-space-sm">
                  Gìn giữ hương vị bếp nhà cùng <span className="text-primary font-bold">45.000+</span> đầu bếp gia đình.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-lg">
                  Tham gia RecipeHub để đồng bộ kế hoạch dinh dưỡng đa thiết bị, lưu giữ công thức gia truyền và đóng góp vào kho tàng mỹ vị Việt hoàn toàn phi thương mại, không quảng cáo rác.
                </p>

                {/* Community Pillars Mosaic */}
                <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                    <Icon name="cloud_sync" size={24} className="text-primary" />
                    <span className="font-title-md text-title-md text-on-surface mt-1">Đồng Bộ Thực Đơn</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Lưu kế hoạch tự động từ điện thoại sang máy tính bảng.</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                    <Icon name="format_image_left" size={24} className="text-secondary" />
                    <span className="font-title-md text-title-md text-on-surface mt-1">Chống Spam Tuyệt Đối</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Quy trình kiểm duyệt công thức 2 lớp chất lượng cao.</span>
                  </div>
                </div>

                {/* Authentic Culinary Visual Placement */}
                <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBzSuLG0RRlhFpv6go_EtdMdFg-ozVYWFhTa00bZ3cyOLadwU8tzYBS8JSSHZiQvaAglcOQVqtXW4B2LcTohYM02ePZsWfIk5AdUf4Y4EqDpV6RsYoFalZEvGhMY1OJYQ-OOjC7CztZysILLQWJfkstfytSmVHxM18wY0cg4IIH6Jp52_6NQ4YCmeDwQV2kRa--_lyCoFRn6ledEFfi-a820al5ReZgmtU2fDkC7O3"
                    alt="Warm sunlight streaming onto a clean wooden kitchen counter with fresh cilantro, star anise and steaming Pho broth"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent flex flex-col justify-end p-space-md">
                    <span className="font-label-mono-sm text-label-mono-sm text-surface uppercase tracking-wider">
                      Bếp Nhà • Bản Sắc Vùng Miền
                    </span>
                    <span className="font-title-md text-title-md text-surface font-medium">
                      Bữa cơm ngon khởi nguồn từ sự chu đáo và yêu thương.
                    </span>
                  </div>
                </div>

                {/* Member Testimonial Snippet */}
                <div className="mt-space-md bg-surface-container-low p-space-md rounded-xl flex items-center gap-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-sm shrink-0">
                    LN
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-body-sm text-body-sm text-on-surface italic truncate">
                      &ldquo;Tôi đã số hóa hơn 60 công thức của bà ngoại mà không sợ thất lạc.&rdquo;
                    </p>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Lê Ngọc Mai — Thành viên từ 2023
                    </span>
                  </div>
                </div>
              </div>

              {/* Strict Anti-Spam Commitment Notice */}
              <div className="bg-surface-container-high/60 rounded-xl p-space-md flex gap-space-sm items-start border border-outline-variant/30">
                <Icon name="policy" size={20} className="text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-title-md text-title-md text-on-surface text-sm">
                    Cam kết cộng đồng minh bạch
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                    RecipeHub kiên quyết loại trừ các tài khoản tạo tự động, bài đăng quảng cáo thực phẩm chức năng hoặc nội dung sao chép không ghi nguồn.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Registration Form Column (7 cols) */}
            <div className="lg:col-span-7">
              {/* Demo Mode Notice */}
              <div className="mb-space-md p-space-md rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-space-sm">
                  <Icon name="info" size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm">
                    <span className="font-semibold block mb-0.5">
                      Luồng đăng ký thử nghiệm (Demo Registration)
                    </span>
                    <p className="opacity-90 leading-relaxed">
                      Form kiểm tra chặt chẽ quy tắc mật khẩu và định dạng dữ liệu. Khi gửi thành công, bạn sẽ được chuyển sang giao diện mô phỏng xác thực email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-sm border border-outline-variant/30">
                {/* Form Header */}
                <div className="flex flex-col mb-space-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-wider font-semibold">
                      Tạo Tài Khoản Mới
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Bước 1 / 2
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-1">
                    Gia nhập gian bếp thông minh
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Điền thông tin bên dưới để bắt đầu chia sẻ công thức và lưu trữ bộ sưu tập ẩm thực của riêng bạn.
                  </p>
                </div>

                {/* Inline Error Notice */}
                {errorMessage && (
                  <div className="mb-space-md p-space-md rounded-xl bg-error/10 border border-error/20 flex items-start gap-space-sm text-error">
                    <Icon name="error" size={18} className="shrink-0 mt-0.5" />
                    <span className="font-body-sm text-body-sm leading-snug">{errorMessage}</span>
                  </div>
                )}

                {/* Main Register Form */}
                <form className="flex flex-col gap-space-md" onSubmit={handleSubmit} noValidate>
                  {/* Full Name Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-title-md text-title-md text-on-surface text-sm flex items-center justify-between" htmlFor="fullName">
                      <span>Họ và tên</span>
                      <span className="font-label-mono-sm text-label-mono-sm text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
                        <Icon name="badge" size={20} />
                      </span>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Ví dụ: Nguyễn Thị Mai"
                        required
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 shadow-inner border border-outline-variant/40 outline-none focus:bg-surface-container-low focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-title-md text-title-md text-on-surface text-sm flex items-center justify-between" htmlFor="email">
                      <span>Địa chỉ Email</span>
                      <span className="font-label-mono-sm text-label-mono-sm text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
                        <Icon name="mail" size={20} />
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="mai.nguyen@email.com"
                        required
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 shadow-inner border border-outline-variant/40 outline-none focus:bg-surface-container-low focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field + Strength Meter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-title-md text-title-md text-on-surface text-sm flex items-center justify-between" htmlFor="password">
                      <span>Mật khẩu bảo mật</span>
                      <span className={`font-label-mono-sm text-label-mono-sm font-medium ${strengthColor}`}>
                        {strengthLabel}
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
                        <Icon name="lock" size={20} />
                      </span>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Tối thiểu 8 ký tự, có số và ký tự đặc biệt..."
                        required
                        className="w-full pl-11 pr-11 py-2.5 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 shadow-inner border border-outline-variant/40 outline-none focus:bg-surface-container-low focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title="Ẩn/Hiện mật khẩu"
                        className="absolute right-3.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                      >
                        <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
                      </button>
                    </div>

                    {/* Password Strength Meter Visuals */}
                    <div className="flex flex-col gap-2 mt-1 p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/20">
                      <div className="grid grid-cols-4 gap-1.5 w-full h-1.5">
                        <div
                          className={`h-full rounded-full transition-colors duration-300 ${
                            score >= 1
                              ? score === 1
                                ? "bg-error"
                                : score === 2
                                ? "bg-amber-600"
                                : score === 3
                                ? "bg-primary"
                                : "bg-secondary"
                              : "bg-surface-container-high"
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-colors duration-300 ${
                            score >= 2
                              ? score === 2
                                ? "bg-amber-600"
                                : score === 3
                                ? "bg-primary"
                                : "bg-secondary"
                              : "bg-surface-container-high"
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-colors duration-300 ${
                            score >= 3
                              ? score === 3
                                ? "bg-primary"
                                : "bg-secondary"
                              : "bg-surface-container-high"
                          }`}
                        />
                        <div
                          className={`h-full rounded-full transition-colors duration-300 ${
                            score >= 4 ? "bg-secondary" : "bg-surface-container-high"
                          }`}
                        />
                      </div>

                      {/* Checklist Grid */}
                      <div className="grid grid-cols-2 gap-x-space-sm gap-y-1 mt-1">
                        <div className={`flex items-center gap-1.5 transition-colors ${hasLen ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                          <Icon name={hasLen ? "check_circle" : "radio_button_unchecked"} size={15} />
                          <span className="font-body-sm text-body-sm">Ít nhất 8 ký tự</span>
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors ${hasUpper ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                          <Icon name={hasUpper ? "check_circle" : "radio_button_unchecked"} size={15} />
                          <span className="font-body-sm text-body-sm">Có chữ hoa</span>
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors ${hasNum ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                          <Icon name={hasNum ? "check_circle" : "radio_button_unchecked"} size={15} />
                          <span className="font-body-sm text-body-sm">Có chữ số</span>
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors ${hasSpec ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                          <Icon name={hasSpec ? "check_circle" : "radio_button_unchecked"} size={15} />
                          <span className="font-body-sm text-body-sm">Ký tự đặc biệt (!@#$)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-title-md text-title-md text-on-surface text-sm flex items-center justify-between" htmlFor="confirmPassword">
                      <span>Xác nhận mật khẩu</span>
                      <span className={`font-label-mono-sm text-label-mono-sm ${isMatch ? "text-secondary font-medium" : isMismatch ? "text-error font-medium" : "text-on-surface-variant"}`}>
                        {isMatch ? "Mật khẩu trùng khớp" : isMismatch ? "Mật khẩu không khớp" : ""}
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
                        <Icon name="lock_reset" size={20} />
                      </span>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Nhập lại mật khẩu..."
                        required
                        className="w-full pl-11 pr-11 py-2.5 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 shadow-inner border border-outline-variant/40 outline-none focus:bg-surface-container-low focus:border-primary transition-all"
                      />
                      <span className="absolute right-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
                        {isMatch ? (
                          <Icon name="check_circle" size={20} className="text-secondary" />
                        ) : isMismatch ? (
                          <Icon name="cancel" size={20} className="text-error" />
                        ) : (
                          <Icon name="horizontal_rule" size={20} />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Agreement Checkboxes */}
                  <div className="flex flex-col gap-space-sm pt-space-xs">
                    <label className="flex items-start gap-space-sm cursor-pointer group">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        required
                        className="mt-1 w-4 h-4 rounded text-secondary focus:ring-0 focus:outline-none accent-secondary cursor-pointer"
                      />
                      <span className="font-body-md text-body-md text-on-surface leading-snug">
                        Tôi đồng ý với{" "}
                        <span className="text-primary font-semibold">
                          Điều khoản sử dụng
                        </span>{" "}
                        và{" "}
                        <span className="text-primary font-semibold">
                          Chính sách bảo mật
                        </span>{" "}
                        của RecipeHub.
                      </span>
                    </label>

                    <label className="flex items-start gap-space-sm cursor-pointer group">
                      <input
                        id="subscribeWeekly"
                        name="subscribeWeekly"
                        type="checkbox"
                        checked={subscribeWeekly}
                        onChange={(e) => setSubscribeWeekly(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-secondary focus:ring-0 focus:outline-none accent-secondary cursor-pointer"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                        Nhận thực đơn gợi ý tuần và bí quyết nấu ăn chọn lọc (tối đa 1 email/tuần).
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-space-sm">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 px-space-lg rounded-xl font-body-lg text-body-lg font-medium flex items-center justify-center gap-space-sm shadow-sm transition-all cursor-pointer ${
                        isSubmitting
                          ? "bg-primary/70 text-on-primary cursor-wait"
                          : "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon name="sync" size={20} className="animate-spin" />
                          <span>Đang khởi tạo tài khoản thử nghiệm...</span>
                        </>
                      ) : (
                        <>
                          <span>Đăng ký &amp; Tiếp tục xác thực</span>
                          <Icon name="arrow_forward" size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Switch to Login */}
                <div className="pt-space-md text-center border-t border-outline-variant/20 mt-space-md">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Đã có tài khoản bếp?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary-container font-semibold ml-1 inline-flex items-center gap-1 group"
                    >
                      <span>Đăng nhập ngay</span>
                      <Icon name="east" size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
