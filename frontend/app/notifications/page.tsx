"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

interface NotificationItemData {
  id: string;
  category: "meal" | "community" | "review" | "system";
  isRead: boolean;
  dateGroup: "today" | "yesterday" | "older";
  timeLabel: string;
  title: string;
  content: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  accentBarColor?: string;
  metrics?: string[];
  dishPreview?: {
    title: string;
    sub: string;
    image: string;
  };
  reviewQuote?: {
    text: string;
    image: string;
    author: string;
    rating: number;
    sub: string;
  };
  actions: {
    label: string;
    href?: string;
    primary?: boolean;
    onClickType?: "cook" | "view" | "reply" | "share";
  }[];
}

const INITIAL_NOTIFICATIONS: NotificationItemData[] = [
  {
    id: "notif-1",
    category: "meal",
    isRead: false,
    dateGroup: "today",
    timeLabel: "16:30 hôm nay (Cách đây 15 phút)",
    title: "Nhắc lịch nấu cơm tối",
    content:
      "Đã đến giờ sơ chế cho bữa tối theo Kế hoạch tuần! Hôm nay thực đơn gồm: Cá lóc kho tộ và Canh chua cá lóc (khẩu phần 4 người). Nguyên liệu đã sẵn sàng trong tủ lạnh.",
    icon: "schedule",
    iconColor: "text-primary",
    iconBg: "bg-primary-fixed",
    accentBarColor: "bg-primary",
    metrics: ["Nguyên liệu: 7/7 món đã mua", "Dự kiến hoàn thành: 17:45"],
    actions: [
      { label: "Bật Chế độ nấu rảnh tay", href: "/recipes/ca-loc-kho-to/cook", primary: true },
      { label: "Xem danh sách nguyên liệu", href: "/shopping-list" },
    ],
  },
  {
    id: "notif-2",
    category: "review",
    isRead: false,
    dateGroup: "today",
    timeLabel: "14:10 hôm nay",
    title: "Ban cố vấn ẩm thực RecipeHub",
    content:
      'Công thức "Canh cua đồng mồng tơi mướp hương" của bạn đã được kiểm duyệt xuất bản chính thức và vinh dự đạt chứng chỉ Công thức chuẩn định lượng gia đình. Chúc mừng Bếp Mẹ Ba!',
    icon: "verified",
    iconColor: "text-secondary",
    iconBg: "bg-secondary-fixed",
    accentBarColor: "bg-secondary",
    dishPreview: {
      title: "Canh cua đồng mồng tơi mướp hương",
      sub: "Đã công khai trên kho lưu trữ ẩm thực Bắc Bộ",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAW5PTutgQq5rgsfiRcgnxZhIVAkYgDFefhySumk7jjY-BWTmS_2LrdIfISIR9M9H1CFzHivyi-Dd2qeNN1rccTPkT88aY4V1ACntIXU6R00dse2ggihUFw48_-YSAr2_olAABARn6HfxDfs-Tda0ZddO7mFCyDCg_CqTqx8dzPL04_vCjPPLavLhAzmlRZJFzi2F1UHfhF0CL20D0f5V6-TwecEbEY67pqHpVg03rH",
    },
    actions: [
      { label: "Xem bài viết công khai", href: "/recipes/canh-cua-dong" },
      { label: "Chia sẻ lên trang cá nhân", onClickType: "share" },
    ],
  },
  {
    id: "notif-3",
    category: "community",
    isRead: false,
    dateGroup: "today",
    timeLabel: "10:25 hôm nay",
    title: "Bình luận & Báo cáo nấu thử",
    content:
      'Thành viên Lê Hoàng Yến vừa đánh giá 5 sao và đăng ảnh thành phẩm trên công thức "Thịt kho hột vịt nước dừa xiêm":',
    icon: "favorite",
    iconColor: "text-primary",
    iconBg: "bg-primary-fixed",
    accentBarColor: "bg-primary",
    reviewQuote: {
      author: "Lê Hoàng Yến",
      rating: 5,
      text: "“Nấu theo đúng tỷ lệ nước dừa của Mẹ Ba thịt mềm rục tan trong miệng, màu cánh gián tự nhiên đẹp mê ly cả nhà ai cũng khen!”",
      sub: "Đính kèm 1 ảnh thành phẩm thực tế",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDPRyJpoAETSxOpE00fgpE_5vvRLMK0YWu4YEXCFKBR3TYyl6rVgIA_npMqRNbAhrsAvWWZsEF6LZsBpJZlld-fb65_xbtffyrHA9UB9autPHJWYrpU9G3762Iyam_7sZTl4ocZo94USDCl380-uRNgKn8eToTr-o--v_57Uq55CJdLvQ_GdvUdXUOmEvnPQZmlEofbmC7yEQvW1Yfwj2Nm-st3mkIt5SyU1SDbjlR4",
    },
    actions: [
      { label: "Trả lời bình luận", primary: true, onClickType: "reply" },
      { label: "Xem ảnh chụp thành phẩm", onClickType: "view" },
    ],
  },
  {
    id: "notif-4",
    category: "meal",
    isRead: true,
    dateGroup: "yesterday",
    timeLabel: "Hôm qua, 08:30",
    title: "Danh sách mua sắm",
    content:
      "Bạn còn 4 nguyên liệu chưa tick chọn cho bữa ăn tối: Bạc hà (dọc mùng), Ngò gai, Ớt sừng, Giá đỗ. Đừng quên ghé sạp rau tươi trước khi về nhà nhé!",
    icon: "shopping_bag",
    iconColor: "text-outline",
    iconBg: "bg-surface-container",
    actions: [{ label: "Mở Danh sách mua sắm", href: "/shopping-list" }],
  },
  {
    id: "notif-5",
    category: "community",
    isRead: true,
    dateGroup: "yesterday",
    timeLabel: "Hôm qua, 15:45",
    title: "Người theo dõi mới",
    content:
      "Đầu bếp gia đình Nguyễn Mai Phương và 12 người khác đã bắt đầu theo dõi gian bếp Bếp Mẹ Ba. Các công thức cơm nhà của bạn đang truyền cảm hứng cho nhiều gia đình!",
    icon: "person_add",
    iconColor: "text-outline",
    iconBg: "bg-surface-container",
    actions: [{ label: "Xem hồ sơ người theo dõi", href: "/profile" }],
  },
  {
    id: "notif-6",
    category: "system",
    isRead: true,
    dateGroup: "older",
    timeLabel: "18/05/2024, 09:12",
    title: "Bảo mật tài khoản",
    content:
      "Tài khoản của bạn đã được kích hoạt thành công Xác thực 2 bước (2FA) trên trình duyệt Chrome macOS tại Hà Nội. Gian bếp công thức của bạn giờ đây đã được bảo vệ tối đa.",
    icon: "lock",
    iconColor: "text-outline",
    iconBg: "bg-surface-container",
    actions: [{ label: "Kiểm tra nhật ký bảo mật", href: "/settings" }],
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItemData[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [unreadOnly, setUnreadOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    triggerToast("Đã đánh dấu tất cả thông báo là đã đọc!");
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    triggerToast("Đã đánh dấu đã đọc.");
  };

  // Filter items
  const filteredNotifications = notifications.filter((item) => {
    // Unread toggle
    if (unreadOnly && item.isRead) return false;

    // Category
    if (activeCategory === "unread") {
      if (item.isRead) return false;
    } else if (activeCategory !== "all") {
      if (item.category !== activeCategory) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const unreadCount = notifications.filter((i) => !i.isRead).length;

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1240px] mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
            {/* Breadcrumb & Page Header */}
            <section className="space-y-space-xs">
              <nav aria-label="Điều hướng phân cấp" className="flex items-center gap-2 font-body-sm text-body-sm text-outline">
                <Link className="hover:text-primary transition-colors" href="/">
                  Trang chủ
                </Link>
                <span className="text-[12px] opacity-60">/</span>
                <Link className="hover:text-primary transition-colors" href="/profile">
                  Tài khoản của tôi
                </Link>
                <span className="text-[12px] opacity-60">/</span>
                <span className="text-on-surface font-medium">Thông báo</span>
              </nav>

              <div className="pt-space-xs flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                      Trung tâm thông báo
                    </h1>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {unreadCount} thông báo mới chưa đọc
                      </span>
                    )}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Theo dõi lời nhắc chuẩn bị bữa cơm gia đình, tương tác thảo luận từ cộng đồng yêu bếp và cập nhật phê duyệt công thức của bạn.
                  </p>
                </div>

                {/* Quick Header Utilities */}
                <div className="flex flex-wrap items-center gap-space-sm">
                  <button
                    onClick={markAllRead}
                    className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    type="button"
                  >
                    <Icon name="done_all" className="text-secondary text-[18px]" />
                    <span>Đánh dấu tất cả đã đọc</span>
                  </button>
                  <Link
                    className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium shadow-sm transition-all"
                    href="/settings"
                  >
                    <Icon name="settings" className="text-outline text-[18px]" />
                    <span>Cài đặt thông báo</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Filter Tabs & Fast Search Toolbar */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm space-y-space-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm">
                {/* Smart Categorical Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                  {[
                    { key: "all", label: "Tất cả", count: notifications.length },
                    { key: "unread", label: "Chưa đọc", count: unreadCount, isBadge: true },
                    {
                      key: "meal",
                      label: "Lời nhắc lịch nấu & Kế hoạch tuần",
                      icon: "schedule",
                      count: notifications.filter((i) => i.category === "meal").length,
                    },
                    {
                      key: "community",
                      label: "Cộng đồng & Tương tác",
                      icon: "chat",
                      count: notifications.filter((i) => i.category === "community").length,
                    },
                    {
                      key: "review",
                      label: "Kiểm duyệt",
                      icon: "verified",
                      count: notifications.filter((i) => i.category === "review").length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveCategory(tab.key)}
                      className={`filter-tab px-3.5 py-2 rounded-xl font-body-sm text-body-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeCategory === tab.key
                          ? "bg-primary text-on-primary shadow-sm"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      }`}
                      type="button"
                    >
                      {tab.icon && (
                        <Icon
                          name={tab.icon}
                          className={`text-[16px] ${
                            activeCategory === tab.key ? "text-on-primary" : "text-primary"
                          }`}
                        />
                      )}
                      <span>{tab.label}</span>
                      <span
                        className={`font-label-mono-sm text-[11px] ml-1 px-1.5 py-0.5 rounded-full ${
                          tab.isBadge && activeCategory !== tab.key
                            ? "bg-primary-fixed text-on-primary-fixed font-bold"
                            : activeCategory === tab.key
                            ? "bg-white/20 text-on-primary"
                            : "opacity-80"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right Quick Controls: Toggle & Search */}
                <div className="flex items-center gap-space-sm shrink-0 border-t lg:border-t-0 pt-2 lg:pt-0">
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      checked={unreadOnly}
                      onChange={(e) => setUnreadOnly(e.target.checked)}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-10 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner" />
                    <span className="ml-2.5 font-body-sm text-body-sm text-on-surface font-medium whitespace-nowrap">
                      Chỉ hiện chưa đọc
                    </span>
                  </label>
                  <div className="relative w-44 md:w-56">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-body-sm font-body-sm bg-surface rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                      placeholder="Tìm thông báo..."
                      type="text"
                    />
                    <Icon
                      name="search"
                      className="text-outline text-[16px] absolute left-2.5 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Main 2-Column Content Layout (8:4 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Primary Notifications Stream (Col 8) */}
              <div className="lg:col-span-8 space-y-space-lg">
                {/* Check groups: today, yesterday, older */}
                {(["today", "yesterday", "older"] as const).map((groupKey) => {
                  const groupItems = filteredNotifications.filter((i) => i.dateGroup === groupKey);
                  if (groupItems.length === 0) return null;

                  const groupTitle =
                    groupKey === "today"
                      ? "Hôm nay"
                      : groupKey === "yesterday"
                      ? "Hôm qua"
                      : "Tuần này & Cũ hơn";
                  const groupDateLabel =
                    groupKey === "today"
                      ? "Thứ Năm, 23/05/2024"
                      : groupKey === "yesterday"
                      ? "Thứ Tư, 22/05/2024"
                      : "18/05/2024";

                  const groupUnread = groupItems.filter((i) => !i.isRead).length;

                  return (
                    <section key={groupKey} className="space-y-space-sm">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <h2 className="font-title-md text-title-md text-on-surface font-bold tracking-tight">
                            {groupTitle}
                          </h2>
                          {groupUnread > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-[11px] font-semibold">
                              {groupUnread} chưa đọc
                            </span>
                          )}
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">
                          {groupDateLabel}
                        </span>
                      </div>

                      <div className="space-y-space-sm">
                        {groupItems.map((item) => (
                          <article
                            key={item.id}
                            className={`notification-item p-space-md rounded-2xl transition-all shadow-sm hover:shadow-md relative overflow-hidden ${
                              item.isRead
                                ? "bg-surface-container-lowest hover:bg-surface-container-low"
                                : "bg-surface-container-low hover:bg-surface-container"
                            }`}
                          >
                            {!item.isRead && item.accentBarColor && (
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.accentBarColor}`} />
                            )}
                            <div className="flex items-start gap-space-md">
                              {/* Icon Container */}
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${item.iconBg} ${item.iconColor}`}
                              >
                                <Icon name={item.icon} className="text-[24px]" />
                              </div>

                              {/* Main Content Body */}
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span
                                      className={`font-body-sm text-body-sm font-semibold ${
                                        item.isRead ? "text-on-surface" : "text-primary"
                                      }`}
                                    >
                                      {item.title}
                                    </span>
                                    <span className="text-outline text-[12px]">•</span>
                                    <span className="font-label-mono-sm text-[12px] text-outline">
                                      {item.timeLabel}
                                    </span>
                                  </div>
                                  {!item.isRead ? (
                                    <span
                                      className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 ring-4 ring-primary-fixed"
                                      title="Chưa đọc"
                                    />
                                  ) : (
                                    <span className="font-label-mono-sm text-[11px] text-secondary flex items-center gap-1">
                                      <Icon name="done_all" className="text-[14px]" /> Đã đọc
                                    </span>
                                  )}
                                </div>

                                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                                  {item.content}
                                </p>

                                {/* Metric strip */}
                                {item.metrics && (
                                  <div className="flex flex-wrap items-center gap-2 py-1">
                                    {item.metrics.map((m, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container font-label-mono-sm text-[11px] text-on-surface-variant"
                                      >
                                        <Icon name="check_circle" className="text-secondary text-[14px]" />
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Dish preview */}
                                {item.dishPreview && (
                                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-lowest max-w-md shadow-sm">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                                      <Image
                                        src={item.dishPreview.image}
                                        alt={item.dishPreview.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                                        {item.dishPreview.title}
                                      </p>
                                      <p className="font-label-mono-sm text-[11px] text-secondary">
                                        {item.dishPreview.sub}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Review quote */}
                                {item.reviewQuote && (
                                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                                      <Image
                                        src={item.reviewQuote.image}
                                        alt={item.reviewQuote.author}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                      <p className="font-body-sm text-body-sm italic text-on-surface-variant line-clamp-2">
                                        {item.reviewQuote.text}
                                      </p>
                                      <span className="font-label-mono-sm text-[11px] text-secondary font-medium">
                                        {item.reviewQuote.sub}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Action buttons */}
                                <div className="pt-1 flex flex-wrap items-center gap-space-sm">
                                  {item.actions.map((act, aIdx) => {
                                    if (act.href) {
                                      return (
                                        <Link
                                          key={aIdx}
                                          href={act.href}
                                          className={`inline-flex items-center gap-2 px-space-md py-2 rounded-xl font-body-sm text-body-sm font-medium shadow-sm transition-all ${
                                            act.primary
                                              ? "bg-primary hover:bg-primary-container text-on-primary active:scale-[0.98]"
                                              : "bg-surface-container-lowest hover:bg-surface-container text-on-surface"
                                          }`}
                                        >
                                          <span>{act.label}</span>
                                        </Link>
                                      );
                                    }
                                    return (
                                      <button
                                        key={aIdx}
                                        onClick={() => triggerToast(`Thao tác: ${act.label}`)}
                                        className={`inline-flex items-center gap-1.5 px-space-md py-2 rounded-xl font-body-sm text-body-sm font-medium shadow-sm transition-colors cursor-pointer ${
                                          act.primary
                                            ? "bg-primary hover:bg-primary-container text-on-primary active:scale-[0.98]"
                                            : "bg-surface-container-lowest hover:bg-surface-container text-on-surface"
                                        }`}
                                        type="button"
                                      >
                                        <span>{act.label}</span>
                                      </button>
                                    );
                                  })}

                                  {!item.isRead && (
                                    <button
                                      onClick={() => markSingleRead(item.id)}
                                      className="mark-single-read text-outline hover:text-on-surface font-body-sm text-[13px] px-2 py-1 transition-colors cursor-pointer"
                                      type="button"
                                    >
                                      Đánh dấu đã đọc
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  );
                })}

                {filteredNotifications.length === 0 && (
                  <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant font-body-md shadow-sm">
                    Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại.
                  </div>
                )}

                {/* Pagination & Load More Section */}
                <div className="pt-space-md flex flex-col items-center justify-center gap-space-xs text-center">
                  <p className="font-label-mono-sm text-label-mono-sm text-outline">
                    Đang hiển thị {filteredNotifications.length} / {notifications.length} thông báo
                  </p>
                  <button
                    onClick={() => triggerToast("Đã tải hết thông báo 30 ngày qua!")}
                    className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    type="button"
                  >
                    <span>Tải thêm thông báo cũ hơn</span>
                    <Icon name="expand_more" className="text-outline text-[18px]" />
                  </button>
                </div>
              </div>

              {/* Right Companion Sidebar (Col 4) */}
              <aside className="lg:col-span-4 space-y-space-md">
                {/* Widget 1: Quick Notification Settings */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                      Cài đặt nhận thông báo nhanh
                    </h3>
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline">
                      <Icon name="notifications" className="text-[18px]" />
                    </span>
                  </div>

                  <div className="space-y-space-sm divide-y divide-surface-container/60">
                    <div className="flex items-center justify-between pt-space-xs">
                      <div className="pr-2">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">
                          Nhắc giờ nấu cơm tối
                        </p>
                        <p className="font-label-mono-sm text-[11px] text-outline">Mặc định 16:30 mỗi chiều</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox" />
                        <div className="w-9 h-5 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-space-sm">
                      <div className="pr-2">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">
                          Tương tác bình luận &amp; thích
                        </p>
                        <p className="font-label-mono-sm text-[11px] text-outline">Thông báo đẩy ngay khi có</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox" />
                        <div className="w-9 h-5 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-space-sm">
                      <div className="pr-2">
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">
                          Bản tin mâm cơm tuần qua email
                        </p>
                        <p className="font-label-mono-sm text-[11px] text-outline">Gửi sáng Chủ Nhật hàng tuần</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input className="sr-only peer" type="checkbox" />
                        <div className="w-9 h-5 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner" />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-primary hover:text-primary-container font-semibold transition-colors"
                      href="/settings"
                    >
                      <span>Tùy chỉnh chi tiết trong Cài đặt</span>
                      <Icon name="arrow_forward" className="text-[16px]" />
                    </Link>
                  </div>
                </div>

                {/* Widget 2: Upcoming Meal Prep Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                        Kế hoạch nấu tiếp theo
                      </h3>
                    </div>
                    <span className="font-label-mono-sm text-[11px] text-secondary font-semibold px-2 py-0.5 rounded-md bg-secondary-fixed">
                      Trưa mai
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden shadow-sm h-36">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4gfmkxQrd2ZPctb4I9SxpxbIY3xBd7V-NU517elJWopdB9YcKktCRk9bS_7tCVqhAwFDJYyHNx18iXAAE1q0n3mfYw0RdQ6OIs8FeS8edyktdY13Lz43n7e9PWFdRAt7OLlEBkJRQ1_b6WhFCAxoYK1AWehTHq6zc8QBZM0dKd4LHmiIbzEeXzyBlognuYcXnU2REadKDhP3f3LvxgoStO6yWvlNheXacpqd3UND4"
                      alt="Bún chả nướng than hoa Hà Nội"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <span className="font-label-mono-sm text-[11px] text-white/90">
                        Bữa trưa • 11:30 ngày 24/05
                      </span>
                      <h4 className="font-title-md text-title-md font-bold text-white leading-snug">
                        Bún chả nướng than hoa Hà Nội
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-body-sm text-body-sm">
                      <span className="text-on-surface-variant">Khẩu phần gia đình:</span>
                      <span className="font-medium text-on-surface">4 người lớn</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm text-body-sm">
                      <span className="text-on-surface-variant">Thời gian chuẩn bị:</span>
                      <span className="font-label-mono-sm text-primary font-medium">45 phút</span>
                    </div>
                  </div>

                  <Link
                    className="w-full inline-flex items-center justify-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors"
                    href="/meal-planner"
                  >
                    <span>Xem toàn bộ kế hoạch tuần</span>
                    <Icon name="arrow_forward" className="text-[16px]" />
                  </Link>
                </div>

                {/* Widget 3: Notification Health & Maintenance Box */}
                <div className="bg-surface-container-low rounded-2xl p-space-md space-y-space-sm shadow-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="delete_sweep" className="text-outline text-[20px]" />
                    <h4 className="font-body-md text-body-md text-on-surface font-semibold">
                      Dọn dẹp hộp thư
                    </h4>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Tự động giải phóng những thông báo nhắc lịch và cập nhật cũ đã hoàn thành nhằm giữ không gian làm việc gọn gàng.
                  </p>
                  <button
                    onClick={() => triggerToast("Đã dọn dẹp các thông báo cũ hơn 30 ngày!")}
                    className="w-full inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-outline hover:text-error font-body-sm text-body-sm font-medium transition-colors shadow-sm cursor-pointer"
                    type="button"
                  >
                    <span>Xóa thông báo cũ hơn 30 ngày</span>
                  </button>
                </div>
              </aside>
            </div>
          </div>

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
