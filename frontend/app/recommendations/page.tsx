"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

export default function RecommendationsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);
  const [activeDiet, setActiveDiet] = React.useState("family");
  const [activeTime, setActiveTime] = React.useState("fast");
  const [region, setRegion] = React.useState("south");
  const [familySize, setFamilySize] = React.useState("3-4");
  const [allergies, setAllergies] = React.useState({
    shellfish: true,
    chili: true,
    peanuts: false,
  });

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [likedRecipes, setLikedRecipes] = React.useState<Record<string, boolean>>({});
  const [dismissedCards, setDismissedCards] = React.useState<Record<string, boolean>>({});
  const [trayScheduled, setTrayScheduled] = React.useState(false);
  const [trayGroceriesAdded, setTrayGroceriesAdded] = React.useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      triggerToast("Đã cập nhật thực đơn gợi ý mới nhất!");
    }, 600);
  };

  const toggleLike = (id: string) => {
    setLikedRecipes((prev) => {
      const next = !prev[id];
      if (next) {
        triggerToast("Đã lưu vào danh sách yêu thích!");
      }
      return { ...prev, [id]: next };
    });
  };

  const handleDismiss = (id: string) => {
    setDismissedCards((prev) => ({ ...prev, [id]: true }));
    triggerToast("Đã ẩn món khỏi đề xuất hôm nay.");
  };

  const handleSavePreferences = () => {
    triggerToast("Đang đồng bộ khẩu vị...");
    setTimeout(() => {
      setIsDrawerOpen(false);
      triggerToast("Đã lưu khẩu vị gia đình thành công!");
    }, 400);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Top Background Ambient Glow */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-40 right-10 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-64 -left-20 w-80 h-80 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="w-full px-margin-mobile lg:px-margin pt-space-md pb-space-xl">
              {/* 1. Breadcrumb */}
              <nav aria-label="Đường dẫn trang" className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mb-space-md">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <Icon name="home" className="text-[16px]" />
                  <span>Trang chủ</span>
                </Link>
                <Icon name="chevron_right" className="text-outline opacity-60 text-[14px]" />
                <span className="hover:text-primary transition-colors cursor-pointer">Gợi ý &amp; Đề xuất thực đơn</span>
                <Icon name="chevron_right" className="text-outline opacity-60 text-[14px]" />
                <span className="text-primary font-medium">Gợi ý thông minh cho bạn</span>
              </nav>

              {/* 2. Header & Personalization Preferences Bar */}
              <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-lg">
                <div className="max-w-3xl space-y-space-xs">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-mono-sm text-label-mono-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    Hôm nay ăn gì? • Trợ lý bếp trưởng AI
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                    Gợi ý món ngon cho bạn
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Được cá nhân hóa thông minh dựa trên nguyên liệu sẵn có trong tủ lạnh, lịch sử mâm cơm gia đình và kế hoạch dinh dưỡng tuần này.
                  </p>
                </div>

                {/* Controls: Customization Modal Trigger & Refresh */}
                <div className="flex items-center gap-space-sm flex-wrap">
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-low shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    type="button"
                  >
                    <Icon name="tune" className="text-primary text-[18px]" />
                    <span className="font-body-sm text-body-sm font-medium">Tùy chỉnh khẩu vị &amp; dị ứng</span>
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    type="button"
                  >
                    <Icon
                      name="refresh"
                      className={`text-[18px] transition-transform duration-500 ${isRotating ? "rotate-180" : ""}`}
                    />
                    <span className="font-body-sm text-body-sm font-medium">Làm mới gợi ý</span>
                  </button>
                </div>
              </header>

              {/* Active Profile Indicator Ribbon */}
              <section className="bg-surface-container-low rounded-2xl p-space-md mb-space-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-variant/50">
                  <div className="flex items-center gap-space-xs text-on-surface">
                    <Icon name="favorite" className="text-primary text-[18px] flex-shrink-0" />
                    <span className="font-body-sm text-body-sm font-medium">Khẩu vị đang áp dụng:</span>
                    <span className="font-body-sm text-body-sm font-semibold text-primary">
                      Cơm nhà Nam Bộ &amp; Ít dầu mỡ • 4 người ăn
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                    <Icon name="check" className="text-secondary text-[16px]" />
                    <span>Tự động cân bằng 3 nhóm chất</span>
                  </div>
                </div>

                {/* Filter Pill Chips */}
                <div className="pt-space-sm flex flex-col gap-space-xs">
                  {/* Dietary Style */}
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider min-w-[110px]">
                      Chế độ ăn:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { key: "family", label: "Ăn gia đình truyền thống" },
                        { key: "healthy", label: "Eat Clean / Healthy" },
                        { key: "veg", label: "Món chay thanh tịnh" },
                        { key: "lowcarb", label: "Ít tinh bột (Low-carb)" },
                        { key: "rich", label: "Đậm đà đưa cơm" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setActiveDiet(item.key)}
                          className={`px-3 py-1 rounded-full text-body-sm font-body-sm transition-all cursor-pointer ${
                            activeDiet === item.key
                              ? "bg-primary text-on-primary shadow-sm"
                              : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                          }`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Constraint */}
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider min-w-[110px]">
                      Thời gian nấu:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { key: "all", label: "Mọi thời gian" },
                        { key: "fast", label: "Nhanh dưới 25 phút" },
                        { key: "weekend", label: "Thong thả cuối tuần" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setActiveTime(item.key)}
                          className={`px-3 py-1 rounded-full text-body-sm font-body-sm transition-all cursor-pointer ${
                            activeTime === item.key
                              ? "bg-secondary text-on-secondary shadow-sm"
                              : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                          }`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avoid / Allergies */}
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider min-w-[110px]">
                      Dị ứng / Tránh:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-body-sm bg-surface-container text-on-surface-variant">
                        <Icon name="close" className="text-error text-[14px]" />
                        Không dùng hải sản có vỏ
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-body-sm bg-surface-container text-on-surface-variant">
                        <Icon name="close" className="text-error text-[14px]" />
                        Hạn chế ớt cay
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-body-sm bg-surface-container text-on-surface-variant">
                        <Icon name="close" className="text-error text-[14px]" />
                        Không sữa bò
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. HERO AI RECOMMENDATION: "Mâm cơm đề xuất hôm nay" */}
              <section className="mb-space-xl">
                <div className="bg-surface-container-lowest rounded-3xl p-space-md lg:p-space-lg shadow-md relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Section Label & Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-[11px] tracking-wide uppercase font-semibold">
                          Mâm cơm đề xuất số 1
                        </span>
                        <span className="text-secondary font-label-mono-sm text-label-mono-sm font-medium flex items-center gap-1">
                          <Icon name="payments" className="text-[16px]" />
                          Tối ưu chi phí &amp; dinh dưỡng
                        </span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                        Mâm cơm trọn vị 3 món cho 4 người
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Quy luật ngũ hành ẩm thực: 1 món kho đậm đà, 1 món canh ngọt thanh giải nhiệt, 1 món rau xào giòn thơm xém cạnh.
                      </p>
                    </div>

                    {/* Meal Metrics Summary Pills */}
                    <div className="flex items-center gap-space-sm flex-wrap lg:flex-nowrap">
                      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface">
                        <Icon name="local_fire_department" className="text-primary text-[20px]" />
                        <div className="flex flex-col">
                          <span className="font-label-mono-sm text-[11px] text-outline uppercase">Năng lượng</span>
                          <span className="font-label-mono-lg text-label-mono-lg font-semibold text-on-surface leading-none">
                            ~1.420 kcal
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface">
                        <Icon name="schedule" className="text-secondary text-[20px]" />
                        <div className="flex flex-col">
                          <span className="font-label-mono-sm text-[11px] text-outline uppercase">Nấu song song</span>
                          <span className="font-label-mono-lg text-label-mono-lg font-semibold text-on-surface leading-none">
                            45 phút
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface">
                        <Icon name="kitchen" className="text-primary-container text-[20px]" />
                        <div className="flex flex-col">
                          <span className="font-label-mono-sm text-[11px] text-outline uppercase">Tủ lạnh có sẵn</span>
                          <span className="font-label-mono-lg text-label-mono-lg font-semibold text-secondary leading-none">
                            6 / 9 vị
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Dish Bento Cards Array */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
                    {/* Món 1: Món Mặn Chính */}
                    <article className="group rounded-2xl bg-surface p-space-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfZK-ahVineBzJN4efdekfWKApAbfuD2QKcRCXf1orENpKbvqpJnYUZ3PXTGE3ChxTSCX5EVAvRAtM8tRC36Sb24BFZB8d3yk7WXKjfbtcBexNiem-2vkH0bSQ0XNg7SRW5_P1Xu9hAa5HNg7HS8moWtvRtxB4MiZ3vZlc6joTNrNz8UpjlkzLzNqld5d4aZYdotLUb1BWdvy28fOrni6rUs7YhV8orkHXU-kVZMFj"
                            alt="Cá bống kho tiêu gừng sắn dây"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-[11px] font-semibold">
                            Món mặn chính
                          </span>
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-mono-sm text-[11px]">
                            25 phút
                          </span>
                        </div>
                        <div className="px-space-xs">
                          <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            Cá bống kho tiêu gừng sắn dây
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            Thịt cá săn chắc, nước màu dừa cánh gián óng ả, thoang thoảng gừng già và sắn dây sánh nhẹ đưa cơm.
                          </p>
                        </div>
                      </div>
                      <div className="pt-space-sm px-space-xs flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px]">
                          Có sẵn cá &amp; gừng
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">480 kcal</span>
                      </div>
                    </article>

                    {/* Món 2: Món Canh Giải Nhiệt */}
                    <article className="group rounded-2xl bg-surface p-space-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA94zMiVoVyRPpVyj0wFiEHPaNCyxDd9MgMTuugzDIphpvzUc7tfx59chL2nCQ-kYVUVpmzItn8tnJq_paGt02N_UfrAtvG2fA_ekaY6bygDc9hniGE9REENKloXmvG9I20BiAPikB3y3PvRWnv0_9Kkhuq-falPAHv_ODYjsTjAVp9xrF4R8XeYn83kmcRQO3BB1DZNWfzv5OP-QnggPU9LkE7f-GyLAWrbnz-_K4E"
                            alt="Canh cua đồng mồng tơi mướp hương"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-mono-sm text-[11px] font-semibold">
                            Món canh mát
                          </span>
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-mono-sm text-[11px]">
                            20 phút
                          </span>
                        </div>
                        <div className="px-space-xs">
                          <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            Canh cua đồng mồng tơi mướp hương
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            Gạch cua đóng tảng béo bùi, nước canh ngọt lịm từ mướp vườn và lá mồng tơi tươi non thanh nhiệt.
                          </p>
                        </div>
                      </div>
                      <div className="pt-space-sm px-space-xs flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[11px]">
                          Cần mua: Cua đồng xay
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">320 kcal</span>
                      </div>
                    </article>

                    {/* Món 3: Món Rau Xào Giòn Ngọt */}
                    <article className="group rounded-2xl bg-surface p-space-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBnHmjY3vNF5BgR2fukMSoeCHIkkO-omn18WdrkwWtyD5uwgqbnr_ZTt7iT0JA9aTpYIiiSxvR2qbbnue2mFTOhs5eOANwiVJ0j_cEa3sAC90DU1qd-eD3G9QznJI3R0Yh3lsbpFBa2wa7vk35Z43KYAUlpTW4L9yG3f7tLgBrpD2hpM0OH4yPv8u7xcypQ78hSkRGbT9mindeu7UeO6HZ6bGjsIYQ80fmyfgPtFYV"
                            alt="Bông bí xào tỏi xém cạnh"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-[11px] font-semibold">
                            Món xào giòn
                          </span>
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-mono-sm text-[11px]">
                            10 phút
                          </span>
                        </div>
                        <div className="px-space-xs">
                          <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            Bông bí xào tỏi xém cạnh
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            Bông bí ngắt nhụy sạch sẽ, phi tỏi ta thơm lừng, xào lửa lớn giữ nguyên độ ngọt giòn mọng nước.
                          </p>
                        </div>
                      </div>
                      <div className="pt-space-sm px-space-xs flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px]">
                          Có sẵn tỏi &amp; dầu hào
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">180 kcal</span>
                      </div>
                    </article>
                  </div>

                  {/* Master Action Bar for Whole Tray */}
                  <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <Icon name="description" className="text-primary text-[18px]" />
                      <span>Thực đơn được đồng bộ tự động với định lượng cho 4 khẩu phần.</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleRefresh}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-variant transition-colors font-body-sm text-body-sm font-medium cursor-pointer"
                        type="button"
                      >
                        <Icon name="shuffle" className="text-outline text-[18px]" />
                        Đổi mâm khác
                      </button>
                      <button
                        onClick={() => {
                          setTrayGroceriesAdded(true);
                          triggerToast("Đã thêm 3 món vào Danh sách đi chợ!");
                        }}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-variant transition-colors font-body-sm text-body-sm font-medium cursor-pointer"
                        type="button"
                      >
                        <Icon name="shopping_cart" className="text-secondary text-[18px]" />
                        {trayGroceriesAdded ? "Đã thêm vào Chợ!" : "Thêm vào Đi chợ"}
                      </button>
                      <button
                        onClick={() => {
                          setTrayScheduled(true);
                          triggerToast("Đã lên lịch mâm cơm này vào Kế hoạch tuần!");
                        }}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all font-body-sm text-body-sm font-medium cursor-pointer"
                        type="button"
                      >
                        <Icon name="calendar_today" className="text-[18px]" />
                        {trayScheduled ? "Đã lên lịch tuần!" : "Lên lịch mâm này"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. CONTEXTUAL RECOMMENDATION ROWS */}
              {/* PHÂN MỤC 1: Hợp với kế hoạch tuần này */}
              <section className="mb-space-xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs mb-space-md">
                  <div>
                    <div className="flex items-center gap-2 text-secondary font-label-mono-sm text-label-mono-sm uppercase font-semibold">
                      <Icon name="trending_up" className="text-[18px]" />
                      Cân bằng vị giác &amp; dinh dưỡng
                    </div>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      Hợp với kế hoạch tuần này
                    </h2>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-lg">
                    Tuần này bạn đã lên lịch 2 món thịt bò và 1 món kho mặn, hãy cân bằng lại bằng vị cá đồng tươi mát và vị chua thanh tao.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {[
                    {
                      id: "plan-1",
                      title: "Canh chua cá lóc miền Tây",
                      tag: "Thanh nhiệt",
                      tagBg: "bg-secondary text-on-secondary",
                      timeKcal: "35p • 340 kcal",
                      desc: "Vị chua dịu của me chín quyện cùng bạc hà, giá đỗ, bắp chuối và cá lóc đồng chắc ngọt.",
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDrnJNETSPtMXLG-KX3MJ5wMhBZ3iX6r07kJKLXG-n37V8QGYAw_of2YxQBXW1zf9jly7MdDN2Qr4thKDP_u9pU8tKg-fi9DaSR8F6-PQrG1EHJ8vpu4XzoI2DaRyyol-ep95kQXKDQrxg03YneLoxS8j6SUjCyH5H4dDgGtdfElsofLUfRqtho6IeqtCI7a_gV1RIB4W_QAUACFwmXhuYR3xniMJ4XDIFiRUN5cTsg",
                    },
                    {
                      id: "plan-2",
                      title: "Chả cá thác lác hấp thì là",
                      tag: "Ít dầu mỡ",
                      tagBg: "bg-secondary-fixed text-on-secondary-fixed",
                      timeKcal: "25p • 260 kcal",
                      desc: "Thịt cá quết dẻo dai tự nhiên, dậy mùi thì là thơm nức, chấm muối tiêu chanh chuẩn vị.",
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuA12VoapmLuvfimRqd3xZWSu4v3fYu7eSBigMQdLaNPT5w01TIRtDNf3NPv6UB_ckZMgIJgXnv5WGmtXcL6Wdge_EgN9vrKSt61vKcMWfvX0mZNeXYOFKbhcQ_wGRXhPDJIL0VUT5CSmEfPg8Ebbq8S4md9eZrxxjvKPyqvfz_MX8h--5bEV2ZO-EM2wJ4MECq10IC2lKomSZeXnYXF-VTOn-UOaRi5T_-UQoChGsJP",
                    },
                    {
                      id: "plan-3",
                      title: "Gỏi ngó sen tôm thịt",
                      tag: "Giàu xơ & Giòn",
                      tagBg: "bg-primary-fixed text-on-primary-fixed",
                      timeKcal: "20p • 290 kcal",
                      desc: "Ngó sen trắng muốt giòn sần sật, tôm sông ngọt nước, nước mắm tỏi ớt chua ngọt đánh thức vị giác.",
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDCFJu0v5RtxFUB6JW-19KkiRnEmRJj5xa3DAtF2ukOu_HHDVy10Xi-8yKsFoYxsYNlVwPTh-l5ehzi_YepPZ4WjpqZjUsHWhC-reQ16ypnbxE3F9IErA5Bnz0s8MVelAItxZKyaARFaq-OTRX48H7StFXpvt3iH5g5vdmUjAvxS7mRTldHVStsO_OkEqgy9mj4JZn6B0BMyOHGxfKy7mE3w2bEjL8SGxkYD3hTFAqF",
                    },
                    {
                      id: "plan-4",
                      title: "Đậu phụ non sốt nấm hương",
                      tag: "Món nhẹ bụng",
                      tagBg: "bg-secondary-fixed text-on-secondary-fixed",
                      timeKcal: "15p • 190 kcal",
                      desc: "Từng miếng đậu phụ non mềm tan trong miệng thấm đẫm sốt nấm đông cô ngậy ngọt tự nhiên.",
                      image:
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCvt7YdCEH4bXjhE0r4ZfUXDn6abm-4wbdQ4L0SP6ywJrw2x9DDjlCz1GqWp7XbS1UF101_l406pXJZhuBYY-_XQsoJJu4fMhxyjgc8tVvGL1RZcG_E_dFbJPQCDupyiPUsSkw7sveRHDFNxcwvAoAVdLra4k_S2d6_BukD1D5anttfFEAXmHSVxsm_VwuOkIqEj9VYOSSWQHhnd_gjM1xVokdFZcP0yCMSuJLuKYaw",
                    },
                  ]
                    .filter((item) => !dismissedCards[item.id])
                    .map((item) => (
                      <article
                        key={item.id}
                        className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span
                              className={`absolute top-2 left-2 px-2 py-0.5 rounded-full font-label-mono-sm text-[10px] font-semibold ${item.tagBg}`}
                            >
                              {item.tag}
                            </span>
                            <button
                              onClick={() => toggleLike(item.id)}
                              aria-label="Lưu công thức"
                              className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer ${
                                likedRecipes[item.id] ? "text-primary" : "text-outline hover:text-primary"
                              }`}
                              type="button"
                            >
                              <Icon
                                name="favorite"
                                className={`text-[18px] ${likedRecipes[item.id] ? "fill-current" : ""}`}
                              />
                            </button>
                          </div>
                          <h3 className="font-title-md text-title-md font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            {item.desc}
                          </p>
                        </div>
                        <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                          <span className="font-label-mono-sm text-label-mono-sm text-outline">{item.timeKcal}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDismiss(item.id)}
                              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                              title="Không quan tâm"
                              type="button"
                            >
                              <Icon name="close" className="text-[16px]" />
                            </button>
                            <button
                              onClick={() => triggerToast(`Đã lên lịch món "${item.title}" cho ngày mai!`)}
                              className="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-body-sm text-[12px] font-medium transition-colors cursor-pointer"
                              type="button"
                            >
                              Lên lịch mai
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              </section>

              {/* PHÂN MỤC 2: Tận dụng nguyên liệu sẵn có trong tủ lạnh */}
              <section className="mb-space-xl">
                <div className="p-space-lg rounded-3xl bg-surface-container-low shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-md">
                    <div>
                      <div className="flex items-center gap-2 text-primary font-label-mono-sm text-label-mono-sm uppercase font-semibold">
                        <Icon name="kitchen" className="text-[18px]" />
                        Khớp tủ lạnh thông minh
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                        Tận dụng nguyên liệu sẵn có trong tủ lạnh
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl text-on-surface-variant font-body-sm text-body-sm">
                      <span className="text-secondary font-semibold">5 nguyên liệu vừa kiểm tra:</span>
                      <span className="font-medium text-on-surface">Trứng gà, Cà chua, Hành lá, Đậu hũ, Thịt băm</span>
                    </div>
                  </div>

                  {/* Card List with 100% matched banner */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    {/* Dish 1 */}
                    <article className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm9rXCXFxpGpkUZqVsMSdfoO8njymjLVdbFfQSF9-1q2cbSbpwxgO24dgC_VDIxVtbuWZon2oCFQ4xyM1rtv6i5NFBJgXfPui-k-2EaBwCe9cGMZPDtoGFitwCLT_UW9TBYc7BmQEJEeBqyeTCQtZi4c8WUp6cacZUu2YWi3XR5KsWrib0eXKZ0whkwbnpWsEQhTtD0SjQAA5mfsEqOuokHV7UrnMQW0XtaSl0ECqB"
                            alt="Đậu hũ nhồi thịt sốt cà chua"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-mono-sm text-[11px] font-semibold flex items-center gap-1">
                            <Icon name="check" className="text-[14px]" />
                            Sẵn 100% nguyên liệu
                          </span>
                        </div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                          Đậu hũ nhồi thịt sốt cà chua
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                          Đậu rán vàng rộm nhồi thịt băm mềm ngọt, om sốt cà chua chín mọng sánh quyện cực kỳ đưa cơm.
                        </p>
                      </div>
                      <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                        <span className="text-secondary font-body-sm text-[12px] font-medium">
                          Nấu ngay không cần đi chợ!
                        </span>
                        <Link
                          href="/recipes/dau-hu-nhoi-thit/cook"
                          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-[12px] font-medium transition-colors"
                        >
                          Bắt đầu nấu
                        </Link>
                      </div>
                    </article>

                    {/* Dish 2 */}
                    <article className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL3lwuLJ-TEeElpL4hi2ZjSjDuTpRbzcxm5mmnfqFkkFWIza8B1UsUKoF2n4JP1fjXYGHuvH8qv-G9DsbS7HZP8PyytYWj1PfBvqrIMfKZiX81eCXVc5WxRxVC5XMtGTV5Q-B-4o29bvsjleJaC8KaBs7fC1WTgZCcVxR_ys8kHA5UlRqCuHBGm6mUPqYElMDBq5N0Ylf8WZXqIYG3bqcCsGe9Dw7MxVclgvlYxvtK"
                            alt="Trứng cuộn vân mây ngũ sắc"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-mono-sm text-[11px] font-semibold flex items-center gap-1">
                            <Icon name="check" className="text-[14px]" />
                            Sẵn 100% nguyên liệu
                          </span>
                        </div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                          Trứng cuộn vân mây ngũ sắc
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                          Lớp trứng xốp mịn vàng ươm, quyện hành lá và thịt băm thơm ngậy, đẹp mắt từ người lớn đến trẻ nhỏ.
                        </p>
                      </div>
                      <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                        <span className="text-secondary font-body-sm text-[12px] font-medium">
                          Thời gian chuẩn bị 12 phút
                        </span>
                        <Link
                          href="/recipes/trung-cuon-van-may/cook"
                          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-[12px] font-medium transition-colors"
                        >
                          Bắt đầu nấu
                        </Link>
                      </div>
                    </article>

                    {/* Dish 3 */}
                    <article className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQfRI931i2evsgOatJ9xDyAh9CLI-oxYSaaNNvgKin3hosUR-KepuLTiLFYWbu1Hba2ebNN1FNSGDw0AUa7CUVyPGocT3A4ylvJRIVO189IgqbCjGSC_nAj-N4mm6d6SCmQ1AY9PyT5h4t_qpWaXa8bL2eAeoFldTPZg5L5FDcxrCYJDM2_vGJG95xgGDpzCbgOif9L0mz6oqGvaLeIMEnw8ipbN1LnpQaEPNtu6wy"
                            alt="Canh cà chua nấu trứng hành hoa"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-mono-sm text-[11px] font-semibold flex items-center gap-1">
                            <Icon name="check" className="text-[14px]" />
                            Sẵn 100% nguyên liệu
                          </span>
                        </div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                          Canh cà chua nấu trứng hành hoa
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                          Bát canh quốc dân ấm bụng, vân trứng tơ mềm như mây, vị chua thanh dịu ngọt giải tỏa mệt mỏi tức thì.
                        </p>
                      </div>
                      <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                        <span className="text-secondary font-body-sm text-[12px] font-medium">Nấu siêu tốc 8 phút</span>
                        <Link
                          href="/recipes/canh-ca-chua-trung/cook"
                          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-[12px] font-medium transition-colors"
                        >
                          Bắt đầu nấu
                        </Link>
                      </div>
                    </article>
                  </div>
                </div>
              </section>

              {/* PHÂN MỤC 3: Món mới thịnh hành từ các đầu bếp bạn theo dõi */}
              <section className="mb-space-xl">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-label-mono-sm text-label-mono-sm uppercase font-semibold">
                      <Icon name="group" className="text-[18px]" />
                      Cộng đồng yêu bếp
                    </div>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      Món mới từ các đầu bếp bạn theo dõi
                    </h2>
                  </div>
                  <Link
                    className="text-primary hover:underline font-body-sm text-body-sm font-medium flex items-center gap-1"
                    href="/recipes"
                  >
                    Xem tất cả bài đăng
                    <Icon name="chevron_right" className="text-[16px]" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Chef Card 1: Bếp Mẹ Ba */}
                  <article className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-space-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-title-md">
                            MB
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight">
                              Bếp Mẹ Ba
                            </h4>
                            <span className="font-label-mono-sm text-[11px] text-outline">
                              Đăng 3 giờ trước • Bếp Nam Bộ
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-mono-sm text-[10px] font-semibold">
                          Đang theo dõi
                        </span>
                      </div>
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfAjLWtkJWBqvwMmp9fKe_IJcpCo3rMvKU9GxtKcrP8W5pQK-T4ffwQPyWB1bu2tEt45EEccs2B7bmObB9GHOb0mZAALepGsIQO3zUfTS1aXY_vOnXJHGNP5-yw7Mevjs3dDoOOZCGTjFS322i7tfxZecIfBxyfKhKm-VD5ge5g-nbp8KYxhVUFR6-KyLjGC_aUXIglcDEv68_9rzGkaIgyeO5o-chvE1CddMsdomJ"
                          alt="Tôm rim nước dừa cùi dày"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        Tôm rim nước dừa cùi dày
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        Bí quyết rim tôm đất chắc thịt với nước dừa xiêm ngọt lịm và cùi dừa dẻo bùi, bóng đẹp không cần phẩm màu.
                      </p>
                    </div>
                    <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                      <span className="flex items-center gap-1 text-primary">
                        <Icon name="favorite" className="text-[16px]" />
                        1.420 yêu thích
                      </span>
                      <Link className="text-primary hover:underline font-medium font-body-sm text-body-sm" href="/recipes/tom-rim-nuoc-dua">
                        Xem công thức
                      </Link>
                    </div>
                  </article>

                  {/* Chef Card 2: Bếp Cô Lan */}
                  <article className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-space-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-title-md">
                            CL
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight">
                              Bếp Cô Lan
                            </h4>
                            <span className="font-label-mono-sm text-[11px] text-outline">
                              Đăng 6 giờ trước • Bếp Hà Nội
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-mono-sm text-[10px] font-semibold">
                          Đang theo dõi
                        </span>
                      </div>
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuASiYbwVTNRQQI_8aL5ibtbC9zmPtkVHoolX8yss5-JwArQXC1iMqEK0-ZqbsMSp_VSLfaazAjJYowUY1ur-CNFlzcZJt5k-jYV8ERLbFRy0FDH96eIwC8Vs_43Z1_DC48hpJV7_zxiqwN3DXyPU5RyjODPFXI2ZAT-GCZ8pf4nOrqddFBes4R21Tw8H3H0isKvGljTo9GCigXRaf_b-ufMyckSIdGaoW_TfLgowp-K"
                          alt="Bún chả nướng than hoa"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        Bún chả nướng than hoa
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        Công thức ướp chả miếng ba chỉ và chả băm nướng kẹp tre truyền thống Hà Nội, nước chấm ấm thơm dịu giấm bỗng.
                      </p>
                    </div>
                    <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                      <span className="flex items-center gap-1 text-primary">
                        <Icon name="favorite" className="text-[16px]" />
                        2.890 yêu thích
                      </span>
                      <Link className="text-primary hover:underline font-medium font-body-sm text-body-sm" href="/recipes/bun-cha-nuong">
                        Xem công thức
                      </Link>
                    </div>
                  </article>

                  {/* Chef Card 3: Bếp Bác Sĩ Dinh Dưỡng */}
                  <article className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-space-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-title-md">
                            DD
                          </div>
                          <div>
                            <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight">
                              Bếp Bác Sĩ Dinh Dưỡng
                            </h4>
                            <span className="font-label-mono-sm text-[11px] text-outline">
                              Đăng hôm qua • Chuyên khoa ăn sạch
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-mono-sm text-[10px] font-semibold">
                          Đang theo dõi
                        </span>
                      </div>
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsGQF6SpaELgOvynSemTzNfCepkYUDn9V6wLbNwM6txi7WVSJF5pGfQzJ6pLHtt5K6XSnnoSHJNxizzapdY8JQkpWVrverfFRU3XNSBkD8JTS-wdH-6E2Y1Auoc1uB3Xhid1a2incMNBSmOGAJzUzkVvp2MAC76WRmekHl4FuZrRg55VCxI0mJK6R5E-qZ_185JmNnxEedIkbXjLD1tYi2FZ1pEfzptmwDHSEwhhoQ"
                          alt="Cháo sườn yến mạch hạt sen"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        Cháo sườn yến mạch hạt sen
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        Giải pháp giảm tinh bột nhanh cho người tiểu đường, hạt sen bở tơi giúp an thần ngủ sâu giấc sau ngày dài.
                      </p>
                    </div>
                    <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                      <span className="flex items-center gap-1 text-primary">
                        <Icon name="favorite" className="text-[16px]" />
                        940 yêu thích
                      </span>
                      <Link className="text-primary hover:underline font-medium font-body-sm text-body-sm" href="/recipes/chao-suon-yen-mach">
                        Xem công thức
                      </Link>
                    </div>
                  </article>
                </div>
              </section>

              {/* PHÂN MỤC 4: Món nhanh dưới 20 phút cho ngày bận rộn */}
              <section className="mb-space-xl">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-label-mono-sm text-label-mono-sm uppercase font-semibold">
                      <Icon name="timer" className="text-[18px]" />
                      Giải pháp tối gấp rút
                    </div>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      Món nhanh dưới 20 phút cho ngày bận rộn
                    </h2>
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline hidden sm:inline">
                    Tối giản thời gian sơ chế &amp; dọn rửa
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Item 1 */}
                  <article className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5OlCGhyZmlZ8PUFA3-I6j1543crA0pLLmNTAGQEkFvRvfd_ZNDduKWKGq-Egm4Xi6hXev2WM4mUydLgA-bdxdCXLb83rsM4RwzB7o9NjctRGpSC-dktzli57u0WcY_Drs6x7glhONY-XDlOovAy_7ix-pPuuojXCjNkIqRdk0ewPPbz5XLTtHd-nyC5fw-DDdh1q-jawjaXhQ_ewOR-HgLOJzYgP6y21nn14XWlB4"
                          alt="Thịt ba chỉ rang cháy cạnh nước mắm"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-[11px] font-semibold">
                          15 phút
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        Thịt ba chỉ rang cháy cạnh nước mắm
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        Thịt ba chỉ thái mỏng đảo xém cạnh giòn sần sật, rưới nước mắm ngon và tiêu đập dập thơm lừng cả gian bếp.
                      </p>
                    </div>
                    <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">3 nguyên liệu chính</span>
                      <button
                        onClick={() => triggerToast("Đã thêm món vào bữa tối nay!")}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary font-body-sm text-[12px] font-medium transition-colors cursor-pointer"
                        type="button"
                      >
                        Thêm vào bữa tối
                      </button>
                    </div>
                  </article>

                  {/* Item 2 */}
                  <article className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFkDAcbg3EKh6wgpr0YIf9XsON4j3ErGzC9MFY0e56uSKc8KAEOMjOxbc63SBGWdvbLuvbSoLtuJOdBlxiNC0Zutz8uoM79o-1R3DhRiSXcbF9U04sdKyya-lCQqr0ACgs3sejR17TKxy_KR6-TzYXP3-YkAOSxiqF-vIsoPfB6X4EY56M3J2x7UDC2SuIXFa8AU5Y8SQIfjqPbvJdJrDUDBSmxRFMLFtb9RnOGfq-"
                          alt="Canh tôm nấu bầu non"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-mono-sm text-[11px] font-semibold">
                          12 phút
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        Canh tôm nấu bầu non
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        Bầu non nạo sợi nấu tôm băm giã nhuyễn, nước canh trong veo ngọt lịm tự nhiên không cần hạt nêm.
                      </p>
                    </div>
                    <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">Nấu 1 nồi gọn nhẹ</span>
                      <button
                        onClick={() => triggerToast("Đã thêm món vào bữa tối nay!")}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary font-body-sm text-[12px] font-medium transition-colors cursor-pointer"
                        type="button"
                      >
                        Thêm vào bữa tối
                      </button>
                    </div>
                  </article>

                  {/* Item 3 */}
                  <article className="bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEMYyqQlN1RvBkftIr-rO83Q-nsBUEtzUi91ctd6qsXwz3FQT5MfAqGeIKR7K4meKY7P1QPzsxYBTgPwRZUYXuptwfvPG8ue1a4ocg8tVlIs06bU75skRkRRgSJlBk3yUdQLxYQH2Iw-lQi0--_CXX5mYUuT7LBy_ZfdXJDh0uxBMMMdppWI3yrI54nhIW7DcT6770V6fSIciRQQuKyP-hKSW9B0t927ySvPcTvPUK"
                          alt="Rau muống luộc dầm sấu & nước chấm tỏi ớt"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px] font-semibold">
                          10 phút
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                        Rau muống luộc dầm sấu &amp; nước chấm tỏi ớt
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        Rau xanh mướt giòn ngọt, nước luộc dầm quả sấu tươi chua mát đánh tan cái nóng nực ngày hè.
                      </p>
                    </div>
                    <div className="pt-space-sm mt-space-sm border-t border-surface-variant/40 flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">Thuần túy dân dã</span>
                      <button
                        onClick={() => triggerToast("Đã thêm món vào bữa tối nay!")}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary font-body-sm text-[12px] font-medium transition-colors cursor-pointer"
                        type="button"
                      >
                        Thêm vào bữa tối
                      </button>
                    </div>
                  </article>
                </div>
              </section>

              {/* 5. BANNER CHUYỂN ĐỔI & LỢI ÍCH TÀI KHOẢN (Soft Gating Banner) */}
              <section className="mb-space-lg">
                <div className="rounded-3xl bg-surface-container p-space-lg lg:p-space-xl shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-space-lg">
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="max-w-2xl space-y-space-xs z-10 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                      <Icon name="payments" className="text-primary text-[16px]" />
                      Cá nhân hóa chuyên sâu
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      Bạn muốn gợi ý chính xác hơn theo dị ứng thực phẩm và chỉ số đường huyết của cả nhà?
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Đăng nhập miễn phí để lưu vĩnh viễn hồ sơ dinh dưỡng gia đình, nhận thông báo món ngon đúng khẩu vị mỗi 5 giờ chiều trước giờ tan tầm.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full lg:w-auto z-10">
                    <Link
                      href="/login"
                      className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold text-center shadow-md transition-all active:scale-[0.98]"
                    >
                      Đăng nhập để đồng bộ
                    </Link>
                    <Link
                      href="/about"
                      className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-semibold text-center transition-all"
                    >
                      Tìm hiểu thuật toán ẩm thực
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* ONBOARDING / PREFERENCE WIZARD DRAWER (MODAL OVERLAY) */}
          {isDrawerOpen && (
            <aside
              aria-hidden={!isDrawerOpen}
              className="fixed inset-0 z-50 transition-opacity duration-300 animate-in fade-in"
            >
              {/* Backdrop */}
              <div
                onClick={() => setIsDrawerOpen(false)}
                className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
              />

              {/* Right Drawer Content */}
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-container-lowest shadow-2xl p-space-lg flex flex-col justify-between pointer-events-auto overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="space-y-space-lg">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant/40">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Tùy chỉnh khẩu vị bếp nhà
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Lưu sở thích để gợi ý bữa cơm luôn đúng điệu
                      </p>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      aria-label="Đóng bảng tùy chỉnh"
                      className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      type="button"
                    >
                      <Icon name="close" className="text-[20px]" />
                    </button>
                  </div>

                  {/* Setting 1: Vùng miền & Khẩu vị */}
                  <div className="space-y-space-xs">
                    <label className="font-title-md text-title-md font-semibold text-on-surface">
                      Vùng miền ẩm thực chủ đạo
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "north", label: "Miền Bắc" },
                        { key: "central", label: "Miền Trung" },
                        { key: "south", label: "Miền Nam" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setRegion(item.key)}
                          className={`py-2 px-3 rounded-xl font-body-sm text-center transition-colors cursor-pointer ${
                            region === item.key
                              ? "bg-primary text-on-primary font-medium"
                              : "bg-surface-container-high text-on-surface hover:bg-primary-fixed"
                          }`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Setting 2: Số người ăn */}
                  <div className="space-y-space-xs">
                    <label className="font-title-md text-title-md font-semibold text-on-surface">
                      Quy mô bữa ăn thường nhật
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: "1-2", label: "1-2 người" },
                        { key: "3-4", label: "3-4 người" },
                        { key: "5-6", label: "5-6 người" },
                        { key: ">6", label: "> 6 người" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setFamilySize(item.key)}
                          className={`py-2 rounded-xl font-body-sm text-center transition-colors cursor-pointer ${
                            familySize === item.key
                              ? "bg-primary text-on-primary font-medium"
                              : "bg-surface-container-high text-on-surface hover:bg-primary-fixed"
                          }`}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Setting 3: Hạn chế & Dị ứng */}
                  <div className="space-y-space-xs">
                    <label className="font-title-md text-title-md font-semibold text-on-surface">
                      Nguyên liệu cần loại bỏ (Dị ứng)
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allergies.shellfish}
                          onChange={(e) =>
                            setAllergies((prev) => ({ ...prev, shellfish: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface">
                          Tôm, cua, ốc (Hải sản có vỏ)
                        </span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allergies.chili}
                          onChange={(e) =>
                            setAllergies((prev) => ({ ...prev, chili: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface">Ớt hiểm cay nồng</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allergies.peanuts}
                          onChange={(e) =>
                            setAllergies((prev) => ({ ...prev, peanuts: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface">Đậu phộng / Lạc</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-space-md border-t border-surface-variant/40 space-y-2">
                  <button
                    onClick={handleSavePreferences}
                    className="w-full py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold transition-all cursor-pointer"
                    type="button"
                  >
                    Lưu &amp; Cập nhật gợi ý ngay
                  </button>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer"
                    type="button"
                  >
                    Để sau
                  </button>
                </div>
              </div>
            </aside>
          )}

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
