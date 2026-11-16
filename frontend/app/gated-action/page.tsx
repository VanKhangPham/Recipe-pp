"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

interface VariantConfig {
  badge: string;
  title: string;
  desc: string;
  icon: string;
  btnText: string;
  returnUrl: string;
  toastText: string;
  props: {
    icon: string;
    color: string;
    title: string;
    desc: string;
  }[];
}

const VARIANTS: Record<string, VariantConfig> = {
  publish: {
    badge: "Hành động yêu cầu tài khoản",
    title: "Đăng nhập để chia sẻ công thức của bạn",
    desc: "Để duy trì chất lượng các món ăn mộc mạc và ngăn chặn bot tự động, RecipeHub chỉ yêu cầu đăng nhập khi bạn bắt đầu đăng tải công thức đầu tiên lên cộng đồng.",
    icon: "stylus_note",
    btnText: "Đăng nhập & Tiếp tục đăng bài",
    returnUrl: "/recipes/new?action=publish&step=1",
    toastText: "Đang khôi phục trình soạn thảo và xuất bản bài...",
    props: [
      {
        icon: "verified_user",
        color: "text-primary",
        title: "Bản quyền & Công nhận",
        desc: "Tên gian bếp gia đình được khắc ghi trang trọng trên từng công thức lưu truyền.",
      },
      {
        icon: "cloud_sync",
        color: "text-secondary",
        title: "Tự động sao lưu & Đồng bộ",
        desc: "Bảo toàn bài nháp dở dang, đồng bộ mượt mà giữa điện thoại và máy tính bàn bếp.",
      },
      {
        icon: "award_star",
        color: "text-primary-container",
        title: "Huy hiệu Tác giả Mới",
        desc: "Được đội ngũ ẩm thực thẩm định và giới thiệu đến 50.000+ người yêu nấu ăn.",
      },
    ],
  },
  comment: {
    badge: "Chống spam & Bình luận văn minh",
    title: "Đăng nhập để gửi nhận xét & kinh nghiệm nấu",
    desc: "Mẹo nhỏ hoặc câu hỏi của bạn sẽ giúp tác giả hoàn thiện công thức hơn. RecipeHub cần định danh để giữ gìn không gian ẩm thực chân thành, không quảng cáo.",
    icon: "chat_bubble",
    btnText: "Đăng nhập & Gửi đánh giá ngay",
    returnUrl: "/recipes/bun-cha-ha-noi#gui-binh-luan",
    toastText: "Đang tự động gửi bình luận bạn vừa soạn thảo...",
    props: [
      {
        icon: "rate_review",
        color: "text-primary",
        title: "Đính kèm ảnh thành phẩm",
        desc: "Tải lên bức ảnh mâm cơm thực tế bạn vừa hoàn thành từ căn bếp nhà mình.",
      },
      {
        icon: "notifications_active",
        color: "text-secondary",
        title: "Nhận hồi đáp từ Tác giả",
        desc: "Nhận thông báo ngay khi nghệ nhân hoặc đầu bếp trả lời thắc mắc của bạn.",
      },
      {
        icon: "thumb_up",
        color: "text-primary-container",
        title: "Tích lũy điểm Uy tín bếp",
        desc: "Được cộng đồng ghi nhận với các mẹo thay thế gia vị hữu ích.",
      },
    ],
  },
  follow: {
    badge: "Cập nhật công thức mới",
    title: "Đăng nhập để theo dõi Nghệ nhân Ánh Tuyết",
    desc: "Lưu lại tác giả yêu thích vào tủ sách bếp riêng của bạn để không bỏ lỡ những mâm cơm chuẩn phong vị gia truyền mỗi dịp cuối tuần.",
    icon: "person_add",
    btnText: "Đăng nhập & Theo dõi tác giả",
    returnUrl: "/authors/anh-tuyet?action=follow",
    toastText: "Đã thêm Nghệ nhân Ánh Tuyết vào danh sách theo dõi!",
    props: [
      {
        icon: "notifications",
        color: "text-primary",
        title: "Bản tin thực đơn tuần mới",
        desc: "Nhận thông báo mâm cơm theo mùa ngay khi nghệ nhân ra mắt bài viết.",
      },
      {
        icon: "auto_stories",
        color: "text-secondary",
        title: "Kho gia truyền độc quyền",
        desc: "Xem các mẹo nêm nếm đặc biệt chỉ dành cho người theo dõi thân thiết.",
      },
      {
        icon: "loyalty",
        color: "text-primary-container",
        title: "Hỏi đáp ẩm thực 1:1",
        desc: "Tham gia các buổi trò chuyện ẩm thực trực tiếp cùng tác giả mỗi tháng.",
      },
    ],
  },
};

export default function GatedActionDialogPage() {
  const [activeVariant, setActiveVariant] = React.useState<"publish" | "comment" | "follow">("publish");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  const currentVariant = VARIANTS[activeVariant];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage(currentVariant.toastText);
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }, 900);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setToastMessage("Đã đóng hộp thoại. Bạn có thể tiếp tục duyệt công thức tự do.");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Keyboard shortcut Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-background flex-1 flex flex-col relative">
        <div className="flex flex-col w-full relative">
          {/* MÀN HÌNH NỀN THỰC TẾ ĐANG BỊ GATED: "Bún chả nướng than hoa Hà Nội" */}
          <div className="w-full pointer-events-none select-none blur-[6px] opacity-40 px-gutter py-space-xl">
            <div className="max-w-6xl mx-auto flex flex-col gap-space-lg">
              <div className="flex items-center gap-space-sm text-tertiary">
                <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Khám phá</span>
                <span>/</span>
                <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Món Bắc</span>
                <span>/</span>
                <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider text-primary">Món nướng</span>
              </div>
              <div className="grid grid-cols-12 gap-space-lg">
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-space-md">
                  <span className="font-display-hero text-display-hero text-on-surface leading-tight font-bold">
                    Bún chả nướng than hoa Hà Nội truyền thống
                  </span>
                  <div className="flex items-center gap-space-md">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high" />
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Nghệ nhân Ánh Tuyết</span>
                    </div>
                    <span className="text-tertiary">•</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">45 phút chuẩn bị</span>
                    <span className="text-tertiary">•</span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary">680 kcal</span>
                  </div>
                  <div className="w-full h-80 rounded-3xl bg-surface-container overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHjToswiXnNw9meh1JjHofnvIltom7qFnIjxMdadEPyRMefPTymfXkliA1UsPxTkz3B04Fqs84FZO1txAw3Yh7tLUGpaNFkzzFYrUujHIvHI6Xa9pkYZ-V7xd4IHXemGORsOAr423z_qxMaSC9C3rvOiXhgx4VgcBcQ0SHa4wrXw2PWt6V14aFzeKn3YwCuiHbTz6Sl3zaqmse5EAjijxlpwjNX99WeG7Vx5jXfk-W')",
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-space-md bg-surface-container-low p-space-lg rounded-3xl">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Nguyên liệu cần chuẩn bị</span>
                  <div className="flex flex-col gap-3">
                    <div className="h-6 bg-surface-container-high rounded w-3/4" />
                    <div className="h-6 bg-surface-container-high rounded w-5/6" />
                    <div className="h-6 bg-surface-container-high rounded w-2/3" />
                    <div className="h-6 bg-surface-container-high rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Re-open trigger when dismissed */}
          {!isModalOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-body-md text-body-md font-semibold shadow-2xl hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icon name="lock_open" size={20} />
                <span>Mở lại Hộp thoại Đăng nhập hành động (Gated Action Dialog)</span>
              </button>
            </div>
          )}

          {/* LỚP OVERLAY BACKDROP BLUR CAO CẤP & CONTAINER CHÍNH */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 transition-opacity">
              <div className="w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-[0_24px_50px_-12px_rgba(28,25,23,0.22)] overflow-hidden flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
                {/* THANH ĐIỀU HƯỚNG VARIANT (Context Switcher Demo Bar) */}
                <div className="w-full bg-surface-container-low px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon name="tune" size={18} className="text-primary" />
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium uppercase tracking-wider">
                      Ngữ cảnh kích hoạt:
                    </span>
                  </div>
                  <div className="inline-flex p-1 bg-surface-container rounded-full gap-1" id="variant-tabs">
                    <button
                      className={`px-3.5 py-1 rounded-full font-body-sm text-body-sm transition-all cursor-pointer ${
                        activeVariant === "publish"
                          ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setActiveVariant("publish")}
                      type="button"
                    >
                      Đăng công thức
                    </button>
                    <button
                      className={`px-3.5 py-1 rounded-full font-body-sm text-body-sm transition-all cursor-pointer ${
                        activeVariant === "comment"
                          ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setActiveVariant("comment")}
                      type="button"
                    >
                      Bình luận / Đánh giá
                    </button>
                    <button
                      className={`px-3.5 py-1 rounded-full font-body-sm text-body-sm transition-all cursor-pointer ${
                        activeVariant === "follow"
                          ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setActiveVariant("follow")}
                      type="button"
                    >
                      Theo dõi tác giả
                    </button>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-secondary font-label-mono-sm text-label-mono-sm">
                    <Icon name="lock_reset" size={15} />
                    <span>Bảo lưu ngữ cảnh</span>
                  </div>
                </div>

                {/* HEADER MODAL & NÚT ĐÓNG */}
                <div className="px-6 sm:px-10 pt-8 pb-4 relative">
                  <button
                    aria-label="Đóng hộp thoại"
                    onClick={handleClose}
                    className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer group"
                    type="button"
                  >
                    <Icon name="close" size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                    <span className="font-label-mono-sm text-label-mono-sm font-medium pr-1 text-tertiary">Esc</span>
                  </button>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span>{currentVariant.badge}</span>
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary hidden sm:inline-block">
                      Duyệt web tự do • Chỉ định danh khi chia sẻ
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0 shadow-inner">
                      <Icon name={currentVariant.icon} size={28} />
                    </div>
                    <div className="flex flex-col gap-1 pr-12">
                      <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                        {currentVariant.title}
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                        {currentVariant.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* NỘI DUNG 2 CỘT: GIÁ TRỊ THÀNH VIÊN + KHUNG ĐĂNG NHẬP */}
                <div className="px-6 sm:px-10 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* CỘT TRÁI: VALUE PROPOSITION (Lợi ích thiết thực) */}
                  <div className="lg:col-span-5 flex flex-col gap-5 bg-surface-container-low/70 p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Đặc quyền gian bếp</span>
                      <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-medium">
                        Miễn phí 100%
                      </span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {currentVariant.props.map((p, idx) => (
                        <div key={idx} className="flex items-start gap-3.5 animate-in fade-in duration-300">
                          <div
                            className={`w-9 h-9 rounded-xl bg-surface-container-lowest ${p.color} flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            <Icon name={p.icon} size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-body-md text-body-md text-on-surface font-semibold">{p.title}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{p.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* MINI CARD: BẢO LƯU DỮ LIỆU ĐANG THAO TÁC */}
                    <div className="p-3.5 bg-surface-container-lowest rounded-xl flex items-center gap-3 shadow-sm">
                      <Icon name="bookmark_added" size={22} className="text-secondary shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold truncate">
                          Phiên làm việc hiện tại:
                        </span>
                        <span className="font-body-sm text-body-sm text-tertiary truncate">
                          Đã ghi nhớ bước nhập liệu. Không mất nội dung.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI: FORM ĐĂNG NHẬP NHANH (SSO + TÀI KHOẢN) */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* SSO BUTTONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
                        type="button"
                        onClick={() => {
                          setToastMessage("Đang chuyển hướng tới cổng đăng nhập Google...");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                      >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span>Tiếp tục với Google</span>
                      </button>
                      <button
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
                        type="button"
                        onClick={() => {
                          setToastMessage("Đang kết nối Apple ID...");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                      >
                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.44-6.3-9.99-11.22-21.72-14.75-35.19-3.53-13.48-5.3-26.04-5.3-37.69 0-14.44 3.63-26.17 10.89-35.19 7.26-9.02 16.29-13.62 27.1-13.8 5.4 0 11.27 1.48 17.62 4.44 6.35 2.96 10.37 4.5 12.06 4.62 1.48 0 5.65-1.57 12.51-4.7 6.87-3.14 12.78-4.53 17.75-4.18 13.9.7 24.81 5.92 32.73 15.67-12.2 7.42-18.15 17.51-17.84 30.27.32 9.99 4.22 18.3 11.69 24.93 7.47 6.63 16.38 10.45 26.74 11.45-2.22 6.83-4.7 13.1-7.44 18.8zM119.22 33.05c0-7.39 2.65-14.42 7.96-21.1 5.3-6.68 12-10.97 20.08-12.87.21 1.27.32 2.43.32 3.49 0 7.39-2.8 14.54-8.41 21.43-5.61 6.9-12.48 11.05-20.61 12.47-.42-1.16-.64-2.31-.64-3.42z" />
                        </svg>
                        <span>Tiếp tục với Apple</span>
                      </button>
                    </div>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-3 my-1">
                      <div className="h-px bg-surface-container-high flex-1" />
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium">
                        Hoặc với Email cá nhân
                      </span>
                      <div className="h-px bg-surface-container-high flex-1" />
                    </div>

                    {/* INPUT FORM */}
                    <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body-sm text-body-sm text-on-surface font-semibold flex items-center justify-between">
                          <span>Email hoặc Tên tài khoản</span>
                          <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Bắt buộc</span>
                        </label>
                        <div className="relative">
                          <input
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-tertiary shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="vd: bepnha.haiduong@recipehub.vn"
                            required
                            type="text"
                            defaultValue="bepnhameba@recipehub.vn"
                          />
                          <span className="absolute right-3.5 top-2.5 text-tertiary">
                            <Icon name="alternate_email" size={20} />
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-body-sm text-body-sm text-on-surface font-semibold">Mật khẩu</label>
                          <Link href="/forgot-password" className="font-body-sm text-body-sm text-primary hover:underline font-medium">
                            Quên mật khẩu?
                          </Link>
                        </div>
                        <div className="relative">
                          <input
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-tertiary shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Nhập ít nhất 6 ký tự"
                            required
                            type={showPassword ? "text" : "password"}
                            defaultValue="••••••••••"
                          />
                          <button
                            aria-label="Ẩn hiện mật khẩu"
                            className="absolute right-3.5 top-2.5 text-tertiary hover:text-on-surface transition-colors cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            defaultChecked
                            className="w-4 h-4 rounded text-secondary focus:ring-0 focus:ring-offset-0 cursor-pointer accent-secondary"
                            type="checkbox"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Ghi nhớ phiên trên thiết bị này
                          </span>
                        </label>
                        <div className="flex items-center gap-1 text-secondary font-label-mono-sm text-label-mono-sm">
                          <Icon name="security" size={15} />
                          <span>SSL 256-bit</span>
                        </div>
                      </div>

                      {/* PRIMARY ACTION BUTTON */}
                      <button
                        className="w-full mt-2 py-3 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin">
                              <Icon name="progress_activity" size={20} />
                            </span>
                            <span>Đang xác thực...</span>
                          </>
                        ) : (
                          <>
                            <span>{currentVariant.btnText}</span>
                            <span className="group-hover:translate-x-1 transition-transform">
                              <Icon name="arrow_forward" size={20} />
                            </span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* CHUYỂN ĐỔI SANG ĐĂNG KÝ */}
                    <div className="text-center pt-2">
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Chưa có tài khoản RecipeHub?{" "}
                        <Link className="font-semibold text-primary hover:underline ml-1" href="/register">
                          Đăng ký thành viên miễn phí
                        </Link>
                        <span className="text-tertiary ml-1">(Chỉ mất 30 giây)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* FOOTER MODAL & CƠ CHẾ GUEST TRỞ VỀ */}
                <div className="bg-surface-container-low px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name="history_toggle_off" size={18} className="text-tertiary shrink-0" />
                    <p className="font-label-mono-sm text-label-mono-sm text-tertiary truncate">
                      Chuyển tiếp tự động:{" "}
                      <span className="text-on-surface font-semibold">{currentVariant.returnUrl}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                      type="button"
                    >
                      Để sau, tôi muốn tiếp tục xem
                    </button>
                    <div className="hidden sm:block w-px h-4 bg-surface-container-high" />
                    <span className="font-body-sm text-body-sm text-tertiary hidden sm:inline-block">
                      Dữ liệu nháp luôn được bảo vệ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* THÔNG BÁO TOAST MÔ PHỎNG ĐĂNG NHẬP THÀNH CÔNG */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <Icon name="done_all" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-semibold text-inverse-on-surface">
                  Thông báo hệ thống
                </span>
                <span className="font-body-sm text-body-sm text-inverse-on-surface/80">{toastMessage}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
