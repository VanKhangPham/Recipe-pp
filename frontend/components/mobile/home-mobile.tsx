"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export function HomeMobile() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState("quick");
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recipehub_guest_favs") || "[]");
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleFavorite = (id: string, name: string) => {
    let next: string[];
    if (favorites.includes(id)) {
      next = favorites.filter((item) => item !== id);
      showToast(`Đã bỏ lưu "${name}" khỏi bộ nhớ máy.`);
    } else {
      next = [...favorites, id];
      showToast(`Đã lưu "${name}" vào danh sách yêu thích trên máy!`);
    }
    setFavorites(next);
    try {
      localStorage.setItem("recipehub_guest_favs", JSON.stringify(next));
    } catch (e) {
      console.warn("Storage full or blocked", e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredRecipes = [
    {
      id: "pho-bo-tai-lan",
      title: "Phở bò tái lăn Hà Nội",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuArMQFc6eVMMTK1Sk2RKeG78iaIjN_K6sIyArBOszBammxiDLvEnmhb6Ku4thuKvxi4namnJcV8G2cX_Z9aNLDRcDNmNiP86a8ZEJ9etYm2f8MqIjl6rMkby6e5yJxLXVF5ass45Ca-Z6Offwie3XZ9Kcv1b38Yl_gzP1nJcLdjIgq8P3zdBkypfEbMpKFe9sZoI00EFANXjAYzqOnT4TktTaTMo7VnQVg-cMafc20J",
      imageAlt: "Phở bò tái lăn Hà Nội thơm nức mũi trong bát gốm mộc",
      rating: "4.9",
      time: "45 phút",
      saved: "1.2k lưu",
      difficulty: "Dễ",
      difficultyBadge: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: "bun-cha-than-hoa",
      title: "Bún chả nướng than hoa",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSV6zz1Zd_Tf_pOMGOMp701NGW1DU3bO7M_ojGH8gWedAe9wIhhGViZOGuBbja_sA-6jX8aXtYxAfzS-jU45wOf05LsEf9w_zOldM8LFpiRha79RRp-Ibd1rZyT4JlL1zy-EYdsaSGgGKXkGJV4VYqnerc5sYeb1yn9PfqTpIe-3GSFHW1-kxjDK2ejClSCdK6DcDgqoU_nv09qp5gXuqdeuwKDaRmeVYAQyWedwFz",
      imageAlt: "Bún chả nướng than hoa Hà Nội đượm khói thơm",
      rating: "4.8",
      time: "50 phút",
      saved: "980 lưu",
      difficulty: "Vừa",
      difficultyBadge: "bg-primary-fixed text-on-primary-fixed-variant",
    },
    {
      id: "com-tam-suon-nuong",
      title: "Cơm tấm sườn nướng mỡ hành",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDeLQ05NGfGAYlKfgVsbt8KMMukRp4K3NfZ-atiuufFs4bE06ixnujyvu6pRy8z6ExHhoXsldioUJSsznP-ZvbrbZK-DxPm-rlVUWZHBmQabSdsvDAOJbxR2oFJYjFswEYNrsP65PzlO71T_FBI57bKblAY8eIKM_BkgtMAF7DN-UAlVTaeIqYAFbuf-yAiAZIy2WbJq1da8Qf0HNFAbFCQXVx3gdwgGdrZUYV9li6x",
      imageAlt: "Dĩa cơm tấm sườn nướng mật ong vàng óng kiểu Sài Gòn",
      rating: "4.9",
      time: "35 phút",
      saved: "1.5k lưu",
      difficulty: "Dễ",
      difficultyBadge: "bg-secondary-container text-on-secondary-container",
    },
  ];

  const categories = [
    { title: "Món chính", count: "120+ món", icon: "dinner_dining", bg: "bg-primary-fixed/60", color: "text-primary", href: "/recipes?cat=main" },
    { title: "Món canh", count: "65+ món", icon: "soup_kitchen", bg: "bg-secondary-fixed/50", color: "text-secondary", href: "/recipes?cat=soup" },
    { title: "Món xào", count: "80+ món", icon: "skillet", bg: "bg-tertiary-fixed", color: "text-tertiary", href: "/recipes?cat=stir-fry" },
    { title: "Món cuốn", count: "45+ món", icon: "lunch_dining", bg: "bg-primary-fixed/40", color: "text-primary-container", href: "/recipes?cat=rolls" },
    { title: "Ăn vặt", count: "95+ món", icon: "cookie", bg: "bg-surface-container-high", color: "text-on-surface-variant", href: "/recipes?cat=snack" },
    { title: "Đồ uống mát", count: "50+ món", icon: "local_cafe", bg: "bg-secondary-fixed/40", color: "text-secondary", href: "/recipes?cat=drinks" },
  ];

  const trendingRecipes = [
    {
      id: "ca-bong-kho-tieu",
      title: "Cá bống kho tiêu tộ đất",
      author: "Bếp Mẹ Ba",
      time: "40 phút",
      tag: "Bữa cơm chiều",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCfqFfGlKcNLZnTwTaI8UV18L53YNZ11Etf3qGGPhneBnXJMOFMa73FTikEkWcT8fz0h3HqkpWs7bW2iAr6eNOuiZXJE11uLOLB73kJaWhw1XbejezEhluGiw8rnoK31qwGqe-RUCDxHjfOCWqiE-85c0ebShqeqcfDnSvr2Z9K1bDqigcPH65L8tPmT5FJKVBjDbrAo9E_X2VPkN609AolE1maMUKdGGBFl1fD9AUR",
      imageAlt: "Nồi cá bống kho tiêu thơm lừng trong tộ đất miền Tây",
    },
    {
      id: "canh-chua-ca-loc",
      title: "Canh chua cá lóc đồng",
      author: "Bếp Chú Bảy",
      time: "30 phút",
      tag: "Giải nhiệt hè",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBGB4AilFKNatnKX1qB7DVnuMH2wvFyacoO0yoQltCF8cKPUJIZhqKcWcxf-In5eZfxzLfFIJZFM68huHb_bU8TWw9S8pLAtPc31QlcaIW213sXmV_DIBxU4nXbkYhd5ScwetZwTX1NuzI86vpfQeVQh515jqqkalnNf9zqFZ2Im387kDPglt1bt8HITP5DDm54QGeFgm_kbLPGh7HDaTOaUHS4kds7Y0-NnC4-Q76f",
      imageAlt: "Bát canh chua cá lóc đồng Nam Bộ bốc khói nghi ngút",
    },
    {
      id: "muc-nhay-xao-can",
      title: "Mực nhảy xào cần tỏi",
      author: "Nàng Dâu Xứ Quảng",
      time: "20 phút",
      tag: "Nhanh gọn lẹ",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAzooF6Y9nue1J5oqfJ6JZVCikfox6UDzAqj2GgaChpBz4G_JgOoTdfrb-OILx-P8M4-HUxkcOEmJXKgwytsYMlomP-QqJWCQ_-NVCVbRmmnedLtTKKTSEjvTjjojvE7l_NUZa3DPmP9pOB20Jy8Mx1Zz07KMhowXuML0iqorjhYfxN2w9FCRBwRTxBnCyPkKctrr2uWF1y5slrp6O_rbKbUhbmmYmAZbf34bCr3Tt7",
      imageAlt: "Đĩa mực cơm xào dưa leo cà chua cần tây thơm nức",
    },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col max-w-md mx-auto shadow-2xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-4 z-50 p-3 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <Icon name="check_circle" size={18} className="text-secondary" />
          <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(43,30,22,0.04)] pt-safe max-w-md mx-auto">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <Link href="/" className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
              <Icon name="skillet" size={24} />
            </div>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              RecipeHub
            </span>
          </Link>
          <div className="flex items-center gap-space-xs">
            <Link
              href="/recipes"
              aria-label="Tìm kiếm"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <Icon name="search" size={22} />
            </Link>
            <Link
              href="/notifications"
              aria-label="Thông báo"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-primary relative transition-colors"
            >
              <Icon name="notifications" size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary" />
            </Link>
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1"
            >
              <Icon name="person" size={18} className="text-on-primary" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
        <div className="flex flex-col w-full overflow-x-hidden pb-12">
          {/* 1. Guest Mode Pill Banner */}
          <section className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between gap-3 bg-surface-container-high/90 text-on-surface px-3.5 py-2.5 rounded-2xl shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                  <Icon name="cloud_off" size={17} />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Lưu máy này. <span className="font-medium text-on-surface">Đăng nhập</span> để đồng bộ
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 px-3 py-1.5 rounded-full bg-primary text-on-primary font-body-sm text-body-sm font-medium shadow-sm active:scale-95 transition-all"
              >
                Đăng nhập
              </Link>
            </div>
          </section>

          {/* 2. Hero Section Mobile */}
          <section className="px-4 pt-4 pb-2">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 text-primary">
                <Icon name="local_fire_department" size={16} />
                <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider font-semibold">
                  Bếp Lửa Yêu Thương
                </span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-tight">
                Hôm nay nấu gì<br />
                <span className="text-primary">cho ấm gian bếp?</span>
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Hơn 4,200+ công thức dân dã, tinh gọn cho bữa cơm gia đình tròn vị.
              </p>
            </div>

            {/* Quick Pill Search */}
            <form onSubmit={handleSearch} className="mt-4 relative flex items-center">
              <div className="relative w-full flex items-center">
                <span className="absolute left-4 text-on-surface-variant pointer-events-none">
                  <Icon name="search" size={20} />
                </span>
                <input
                  className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline/70 font-body-md text-body-md pl-11 pr-20 py-3 rounded-full shadow-sm outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                  placeholder="Tìm món ăn, nguyên liệu, vị phở..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    aria-label="Tìm bằng giọng nói"
                    onClick={() => showToast("Đang kích hoạt nhận diện giọng nói...")}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    type="button"
                  >
                    <Icon name="mic" size={18} />
                  </button>
                  <Link
                    href="/recipes"
                    aria-label="Bộ lọc nhanh"
                    className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Icon name="tune" size={18} />
                  </Link>
                </div>
              </div>
            </form>
          </section>

          {/* 3. Horizontal Scroll Tags */}
          <section className="pt-3 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 px-4 whitespace-nowrap min-w-max">
              <button
                onClick={() => setActiveTag("quick")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-medium shadow-sm cursor-pointer transition-all ${
                  activeTag === "quick"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                }`}
                type="button"
              >
                <Icon name="bolt" size={16} />
                Bữa cơm 30p
              </button>
              <button
                onClick={() => setActiveTag("vegan")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-medium shadow-sm cursor-pointer transition-all ${
                  activeTag === "vegan"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                }`}
                type="button"
              >
                <Icon name="spa" size={16} />
                Món chay thanh đạm
              </button>
              <button
                onClick={() => setActiveTag("soup")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-medium shadow-sm cursor-pointer transition-all ${
                  activeTag === "soup"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                }`}
                type="button"
              >
                <Icon name="soup_kitchen" size={16} />
                Canh thanh nhiệt
              </button>
              <button
                onClick={() => setActiveTag("healthy")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-medium shadow-sm cursor-pointer transition-all ${
                  activeTag === "healthy"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                }`}
                type="button"
              >
                <Icon name="energy_savings_leaf" size={16} />
                Ăn kiêng Healthy
              </button>
              <button
                onClick={() => setActiveTag("breakfast")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-medium shadow-sm cursor-pointer transition-all ${
                  activeTag === "breakfast"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
                }`}
                type="button"
              >
                <Icon name="bakery_dining" size={16} />
                Món sáng nhanh
              </button>
            </div>
          </section>

          {/* 4. Featured Carousel (4:3 Cards with Guest LocalStorage Save) */}
          <section className="mt-4">
            <div className="px-4 flex items-center justify-between mb-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Mâm cơm gợi ý
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chọn lọc công thức được nấu nhiều nhất
                </p>
              </div>
              <Link className="text-primary font-body-sm text-body-sm font-medium flex items-center gap-0.5" href="/recipes">
                Xem tất cả
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>

            {/* Horizontal scroll cards */}
            <div className="flex gap-4 overflow-x-auto px-4 pb-3 no-scrollbar snap-x snap-mandatory">
              {featuredRecipes.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[280px] bg-surface-container-lowest rounded-3xl p-3 shadow-md flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1 shadow-sm">
                        <span className="text-amber-500">
                          <Icon name="star" size={14} />
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                          {item.rating}
                        </span>
                      </div>
                      <button
                        aria-label={`Lưu công thức ${item.title}`}
                        onClick={() => toggleFavorite(item.id, item.title)}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer ${
                          isFav ? "text-primary" : "text-on-surface-variant hover:text-primary"
                        }`}
                        type="button"
                      >
                        <Icon name="favorite" size={18} />
                      </button>
                      <div className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm font-semibold ${item.difficultyBadge}`}>
                        Độ khó: {item.difficulty}
                      </div>
                    </div>
                    <div className="pt-3 px-1">
                      <Link href={`/recipes/${item.id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-title-md text-title-md font-bold text-on-surface line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t-0 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" size={16} />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="bookmark_border" size={16} />
                          {item.saved}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Category Grid 2x3 Warm & Tactile */}
          <section className="mt-6 px-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Danh mục hương vị
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Phân loại món theo cách nấu chuẩn Việt</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group"
                  href={cat.href}
                >
                  <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon name={cat.icon} size={26} />
                  </div>
                  <span className="mt-2 font-body-sm text-body-sm font-semibold text-on-surface">{cat.title}</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">{cat.count}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 6. Trending Recipes of the Week (List Cards) */}
          <section className="mt-7 px-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5 text-primary">
                  <Icon name="trending_up" size={16} />
                  <span className="font-label-mono-sm text-label-mono-sm uppercase font-semibold">Xu Hướng Nấu Nướng</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Món ngon tuần này
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                Cập nhật hôm nay
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {trendingRecipes.map((trend) => (
                <Link
                  key={trend.id}
                  href={`/recipes/${trend.id}`}
                  className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container relative">
                    <Image
                      src={trend.image}
                      alt={trend.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center gap-1.5 font-label-mono-sm text-label-mono-sm text-outline">
                        <Icon name="account_circle" size={14} />
                        <span className="truncate">{trend.author}</span>
                      </div>
                      <h4 className="font-title-md text-title-md font-bold text-on-surface truncate mt-0.5 group-hover:text-primary transition-colors">
                        {trend.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm pt-1">
                      <span className="flex items-center gap-1">
                        <Icon name="timer" size={15} className="text-primary" />
                        {trend.time}
                      </span>
                      <span className="text-secondary font-medium">{trend.tag}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 7. Section: 3 Bước Nấu Nướng Dễ Dàng (No Account Needed) */}
          <section className="mt-8 px-4">
            <div className="bg-surface-container-low rounded-3xl p-5 shadow-sm">
              <div className="text-center max-w-xs mx-auto mb-5">
                <span className="font-label-mono-sm text-label-mono-sm uppercase text-primary font-semibold tracking-wider">
                  Trải Nghiệm Tự Do
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1">
                  3 Bước Nấu Nướng Dễ Dàng
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Sử dụng ngay lập tức, không bắt buộc tạo tài khoản
                </p>
              </div>
              <div className="flex flex-col gap-3.5">
                {/* Step 1 */}
                <div className="flex items-start gap-3.5 bg-surface-container-lowest p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-label-mono-lg text-label-mono-lg font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-title-md text-[16px] font-bold text-on-surface">
                      Tìm món theo nguyên liệu tủ lạnh
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Gõ những gì còn trong tủ lạnh, RecipeHub sẽ gợi ý thực đơn phù hợp tức thì.
                    </p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex items-start gap-3.5 bg-surface-container-lowest p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-label-mono-lg text-label-mono-lg font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-title-md text-[16px] font-bold text-on-surface">
                      Lên thực đơn tuần nhanh gọn
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Kéo thả các món yêu thích vào lịch nấu ăn 7 ngày, không còn đau đầu nghĩ món.
                    </p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex items-start gap-3.5 bg-surface-container-lowest p-3.5 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-label-mono-lg text-label-mono-lg font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-title-md text-[16px] font-bold text-on-surface">
                      Đi chợ thông minh tự động gom đồ
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Tự cộng dồn định lượng thịt, rau, gia vị để bạn cầm điện thoại lướt chợ gọn gàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Chef Community CTA Banner */}
          <section className="mt-8 px-4">
            <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-on-primary shadow-lg flex flex-col justify-between">
              <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-primary-fixed/20 blur-xl pointer-events-none" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-on-primary/10 blur-lg pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md self-start text-on-primary">
                  <Icon name="outdoor_grill" size={15} />
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold tracking-wide">
                    Cộng Đồng Bếp Nhà
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary mt-1">
                  Chia sẻ công thức của riêng bạn
                </h3>
                <p className="font-body-sm text-body-sm text-on-primary/90 max-w-xs">
                  Lưu giữ những bí kíp nấu ăn gia truyền từ mẹ và nhận huy hiệu Bếp Trưởng Gia Đình.
                </p>
              </div>
              <div className="relative z-10 mt-5 flex items-center gap-2.5">
                <Link
                  href="/recipes/new"
                  className="px-5 py-2.5 rounded-full bg-surface-container-lowest text-primary font-body-sm text-body-sm font-bold shadow-md hover:bg-surface-container transition-all active:scale-95"
                >
                  Bắt đầu chia sẻ
                </Link>
                <Link
                  href="/recipes"
                  className="px-4 py-2.5 rounded-full bg-transparent text-on-primary font-body-sm text-body-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
