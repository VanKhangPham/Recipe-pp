"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/context/auth-context";

import { safeStorage } from "@/lib/services/storage";
import { useFavorites } from "@/lib/context/favorites-context";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, isRestoringSession, logout } = useAuth();

  const { favorites } = useFavorites();
  const [bannerClosed, setBannerClosed] = React.useState(false);
  const bannerHidden = React.useSyncExternalStore(subscribeToBanner, readBannerHidden, () => false);
  const showBanner = !bannerClosed && !bannerHidden;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [userMenuPath, setUserMenuPath] = React.useState<string | null>(null);
  const [mobileNavPath, setMobileNavPath] = React.useState<string | null>(null);
  const isUserMenuOpen = userMenuPath === pathname;
  const isMobileNavOpen = mobileNavPath === pathname;
  const setIsUserMenuOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof open === "function" ? open(isUserMenuOpen) : open;
    setUserMenuPath(next ? pathname : null);
  };
  const setIsMobileNavOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof open === "function" ? open(isMobileNavOpen) : open;
    setMobileNavPath(next ? pathname : null);
  };
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isUserMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuPath(null);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuPath(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isUserMenuOpen]);

  const dismissBanner = () => {
    setBannerClosed(true);
    safeStorage.setItem("recipehub_guest_banner_dismissed", "true");
    window.dispatchEvent(new Event("recipehub-banner"));
  };

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Khám phá", href: "/recipes" },
    { label: "Kế hoạch bữa ăn", href: "/meal-planner" },
    { label: "Danh sách mua sắm", href: "/shopping-list" },
    { label: "Gợi ý", href: "/recommendations" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById("navbar-search-input");
        if (input) {
          input.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Navbar Row */}
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={isMobileNavOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
            aria-expanded={isMobileNavOpen}
            className="xl:hidden p-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors shrink-0 cursor-pointer"
          >
            <Icon name={isMobileNavOpen ? "close" : "menu"} size={22} />
          </button>

          <Link href="/" className="flex items-center gap-space-sm group shrink-0" data-path="trang-chu">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm shrink-0">
              <Icon name="skillet" size={24} />
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold whitespace-nowrap">
              Recipe<span className="text-primary">Hub</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-space-xs p-1 bg-surface-container-low/60 rounded-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-space-md py-1.5 rounded-full transition-colors font-body-md text-body-md whitespace-nowrap ${
                    isActive
                      ? "bg-surface-container-high text-on-surface font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-space-sm lg:gap-space-md shrink-0">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center gap-space-sm bg-surface-container px-space-md py-2 rounded-xl text-on-surface-variant w-56 xl:w-72 shadow-inner"
          >
            <Icon name="search" size={18} className="text-outline shrink-0" />
            <input
              id="navbar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm món ăn..."
              className="bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/80 flex-1 focus:outline-none min-w-0"
            />
            <kbd className="font-label-mono-sm text-label-mono-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono shrink-0">
              Ctrl+K
            </kbd>
          </form>

          <div className="flex items-center gap-space-xs sm:gap-space-sm shrink-0">
            <Link
              href="/recipes/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high hover:text-on-surface transition-all font-body-sm text-body-sm font-medium whitespace-nowrap shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
            >
              <Icon name="add_circle" size={18} className="text-primary shrink-0" />
              <span>Đăng công thức</span>
            </Link>

            <ThemeToggle />

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all font-body-sm text-body-sm font-medium whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-body-sm text-body-sm font-semibold whitespace-nowrap shadow-sm"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-xs shrink-0 shadow-sm">
                    {user?.avatarText || "TV"}
                  </div>
                  <span className="hidden md:inline font-body-sm text-body-sm font-semibold text-on-surface whitespace-nowrap max-w-[140px] truncate">
                    {user?.name || "Thành viên"}
                  </span>
                  <Icon name="expand_more" size={18} className="text-on-surface-variant shrink-0" />
                </button>

                {isUserMenuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-container-lowest p-2 shadow-2xl border border-outline-variant/40 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                      <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                        {user?.name || "Thành viên"}
                      </p>
                      <p className="font-label-mono-sm text-[11px] text-tertiary truncate">
                        {user?.email || ""}
                      </p>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase">
                        {user?.role === "admin" ? "Quản trị viên" : "Thành viên"}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container font-body-sm text-body-sm transition-colors"
                    >
                      <Icon name="account_circle" size={18} className="text-primary" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link
                      href="/my-recipes"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container font-body-sm text-body-sm transition-colors"
                    >
                      <Icon name="menu_book" size={18} className="text-primary" />
                      <span>Công thức của tôi</span>
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container font-body-sm text-body-sm transition-colors"
                    >
                      <Icon name="bookmark" size={18} className="text-secondary" />
                      <span>Bộ sưu tập ({favorites.length})</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container font-body-sm text-body-sm transition-colors"
                    >
                      <Icon name="settings" size={18} className="text-outline" />
                      <span>Cài đặt tài khoản</span>
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container font-body-sm text-body-sm transition-colors"
                      >
                        <Icon name="space_dashboard" size={18} className="text-primary" />
                        <span>Bảng điều khiển Admin</span>
                      </Link>
                    )}
                    <div className="my-1 border-t border-outline-variant/20" />
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-error hover:bg-error-container/30 font-body-sm text-body-sm transition-colors text-left cursor-pointer"
                    >
                      <Icon name="logout" size={18} />
                      <span>Đăng xuất (về Khách)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Navigation Drawer (< xl) */}
      {isMobileNavOpen && (
        <nav
          aria-label="Điều hướng chính"
          className="xl:hidden border-t border-outline-variant/20 bg-surface px-gutter py-3 space-y-2 shadow-md"
        >
          <form
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setIsMobileNavOpen(false);
            }}
            className="lg:hidden flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl text-on-surface-variant"
          >
            <Icon name="search" size={18} className="text-outline shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm món ăn..."
              className="bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/80 flex-1 focus:outline-none min-w-0"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`px-3.5 py-2 rounded-xl font-body-sm text-body-sm transition-colors ${
                    isActive
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/recipes/new"
              onClick={() => setIsMobileNavOpen(false)}
              className="sm:hidden px-3.5 py-2 rounded-xl bg-primary-fixed text-on-primary-fixed font-body-sm text-body-sm font-semibold"
            >
              + Đăng công thức
            </Link>
          </div>
        </nav>
      )}

      {/* Guest Data Transparency Banner Strip */}
      {!isRestoringSession && !isLoggedIn && !["/login", "/register", "/favorites"].includes(pathname) && showBanner && (
        <div className="w-full bg-surface-container-low py-2.5 px-gutter shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="w-full flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm min-w-0">
              <Icon name="cloud_off" size={20} className="text-secondary shrink-0" />
              <p className="font-body-sm text-body-sm text-on-surface">
                Bạn đang dùng chế độ khách trên trình duyệt này.{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold ml-1">
                  Đăng nhập
                </Link>{" "}
                để dùng dữ liệu của tài khoản. Dữ liệu khách chưa được tự chuyển sang tài khoản.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Đóng thông báo"
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function readBannerHidden() {
  return safeStorage.getItem("recipehub_guest_banner_dismissed") === "true";
}
function subscribeToBanner(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("recipehub-banner", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("recipehub-banner", listener);
  };
}
