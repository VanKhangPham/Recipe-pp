"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { LoginRequiredDialog } from "@/components/dialogs/login-required-dialog";
import { MergeDataDialog } from "@/components/dialogs/merge-data-dialog";
import { HomeMobile } from "@/components/mobile/home-mobile";

export default function HomePage() {
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter tabs state
  const [activeCategory, setActiveCategory] = React.useState<"all" | "quick" | "main" | "dessert">("all");

  // Spotlight bookmark state
  const [isSpotlightBookmarked, setIsSpotlightBookmarked] = React.useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Dialogs state
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = React.useState(false);
  const [loginDialogAction, setLoginDialogAction] = React.useState<"publish" | "comment" | "follow">("publish");

  // Quick recipe preview modal state
  const [previewDishName, setPreviewDishName] = React.useState<string | null>(null);

  // Bookmarks state for cards
  const [bookmarkedCards, setBookmarkedCards] = React.useState<{ [key: string]: boolean }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`Đang tìm kiếm món ngon với từ khóa: "${searchQuery.trim()}"`);
      router.push(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      showToast("Vui lòng nhập tên món hoặc nguyên liệu bạn muốn tìm.");
    }
  };

  const handleSelectQuickTag = (tag: string) => {
    setSearchQuery(tag);
    showToast(`Đang tìm kiếm món ngon với từ khóa: "${tag}"`);
    router.push(`/recipes?q=${encodeURIComponent(tag)}`);
  };

  const toggleSpotlightBookmark = () => {
    const nextState = !isSpotlightBookmarked;
    setIsSpotlightBookmarked(nextState);
    if (nextState) {
      showToast('Đã lưu "Phở bò tái lăn Hà Nội" vào danh sách yêu thích trên trình duyệt!');
    } else {
      showToast('Đã bỏ lưu "Phở bò tái lăn Hà Nội" khỏi bộ nhớ máy.');
    }
  };

  const toggleCardBookmark = (cardId: string, dishName: string) => {
    const nextState = !bookmarkedCards[cardId];
    setBookmarkedCards((prev) => ({ ...prev, [cardId]: nextState }));
    if (nextState) {
      showToast(`Đã lưu "${dishName}" vào danh sách yêu thích trên trình duyệt!`);
    } else {
      showToast(`Đã bỏ lưu "${dishName}" khỏi bộ nhớ máy.`);
    }
  };

  // 4 Detailed Recipe Cards dataset from Stitch design
  const recipes = [
    {
      id: "bun-cha",
      title: "Bún chả nướng than hoa",
      fullName: "Bún chả nướng than hoa Hà Nội",
      description: "Chả miếng thơm lừng kết hợp chả viên nướng xém cạnh, ngập trong nước chấm ấm cay nhẹ.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWMnkqc2eRxk-eraF3cSus3GWeKgN1YnUQnB7ATKA5-ltj-9YrUzYpbbRzzRWUJaLFibDIbmi4tNAJnqS3Da4EtGfwn8NuyFQmyIoSL_JTwwXvFNu3AwCBXgcc67lpVMXTLETjL5L5lfmc7Dps_7b5NI6zi0ZCeVgLXRGh1RxJXeAh1lXHNFcvfAToHjKvaaGqeKNuG2pgZ26V57IUKoLi71o1xahjVoyg_QZIqAZ6",
      imageAlt: "Authentic Hanoi Bun Cha grilled over hot coconut charcoal embers with smoky golden meat patties and sliced pork belly. Served alongside a clear dipping sauce bowl with sliced pickled green papaya and carrots, fresh white rice vermicelli bundles, and a generous wooden woven tray heaped with fresh perilla leaves, Vietnamese balm, and crisp lettuce.",
      time: "40 phút",
      rating: "4.8",
      portions: "4 khẩu phần",
      author: "Bếp Hà Thành",
      authorInitial: "H",
      category: "main",
    },
    {
      id: "banh-xeo",
      title: "Bánh xèo tôm nhảy giòn rụm",
      fullName: "Bánh xèo tôm nhảy giòn rụm",
      description: "Vỏ bánh mỏng tang vàng ươm nghệ tây, nhân tôm đất tươi sống ngọt lịm cuộn rau cải cay.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlD3iBw2pBkRK59E5XYlejnQKtV0KluCAyN4RLEji9NJl5SKulUht4j6L7Hgn_X85-gpfJZ6CuuM2Fh70q38Nehoml6vconZWT8YJ78InjZYfdUyJSOHShDCQPVeslgCkaCJ_SKhc9DvwEAgvjsuWzzr27FgtewzCF9buX3kc8kZQ0yd3rgONOPj0NXJqRGf9WeoBo2aPlNz0ylqV6ZkkR5j_bpx4qFBAhgDW2WzPI",
      imageAlt: "Crispy golden Vietnamese Banh Xeo sizzling pancake folded over fresh wild river shrimp, sweet bean sprouts, and pork slices. Served on a dark green banana leaf platter next to a wide basket of fresh mustard greens, aromatic herbs, and sweet garlic-lime fish sauce dip bathed in warm natural afternoon sunlight.",
      time: "30 phút",
      rating: "4.9",
      portions: "3 khẩu phần",
      author: "Má Bảy Quy Nhơn",
      authorInitial: "Q",
      category: "quick",
    },
    {
      id: "canh-chua",
      title: "Canh chua cá lóc miền Tây",
      fullName: "Canh chua cá lóc miền Tây",
      description: "Nước dùng chua thanh vị me chín, ngò om ngò gai dậy hương cùng thớ thịt cá lóc đồng săn chắc.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7KruAMAxaQbttHMnMKdTb3oEfiibubAWbicjn6ogic26xSdnmauexSlsOCP8flOQvDWxCA_0yZ4qhuI5spDsY5DtiYv0UjKVIrXGl4FLAr58i_7bVOYAEugyqjLTB-1zhlgL9TWCnqFg2M-Q6DStQgqbEUtNx6_O-FiU8clcUsLd9We0ayDBctQJx5Mdl1nyaUcTeH6zfetrKxnao7b_gfjdbuT5jb_tmLWvBwF1B",
      imageAlt: "Mekong Delta style Canh Chua Ca Loc sour soup cooked with fresh snakehead fish steaks, ripe pineapples, sour tamarind broth, sponge gourd stems, fresh okra, and bean sprouts. Garnished heavily with freshly chopped sawtooth herb and aromatic rice paddy herb, served in a handmade earthen bowl.",
      time: "25 phút",
      rating: "4.7",
      portions: "4 khẩu phần",
      author: "Út Tươi Bến Tre",
      authorInitial: "T",
      category: "quick",
    },
    {
      id: "suon-ram",
      title: "Sườn non ram mặn ngọt",
      fullName: "Sườn non ram mặn ngọt",
      description: "Màu cánh gián óng ả, nước sốt kẹo lại đậm vị nước mắm truyền thống và tiêu đen cay nồng.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDPXaFadXg2CokBqp96OZQ8fehhqLAmhPVFY1j2bKM41JwTHNKLGx6e1Pw8xNJEFPknAeGD1_-slQYv1qgPvOB2uHI5p0MzX__q4x8FlYvhLLuxiL9bE_36rGH-RocI5VCbslEx--HrpOBobx9IJV0ijoaXJkTJwlendHWkL_bzqckgcLQ5WZK_-bILxScj-rpzDyL0vl9r4MslqI_Y9qYJ3dhIh8X4EnJFH6aCm6L",
      imageAlt: "Vietnamese caramelized pork spare ribs Suon Ram Man Ngot glazed in a rich, glossy amber sauce flavored with shallots, crushed garlic, whole black pepper, and premium fish sauce. Plated in a white ceramic shallow bowl garnished with fresh cilantro sprigs and freshly sliced red chili peppers.",
      time: "20 phút",
      rating: "4.9",
      portions: "4 khẩu phần",
      author: "Bếp Nhà Nam",
      authorInitial: "N",
      category: "main",
    },
  ];

  const filteredRecipes = recipes.filter((r) => {
    if (activeCategory === "all") return true;
    return r.category === activeCategory;
  });

  return (
    <>
    {/* ═══════ MOBILE LAYOUT ═══════ */}
    <div className="md:hidden">
      <HomeMobile />
    </div>

    {/* ═══════ DESKTOP LAYOUT ═══════ */}
    <div className="hidden md:flex w-full min-h-[100dvh] flex-col bg-background text-on-surface">
      {/* App Navbar */}
      <Navbar />

      {/* Dynamic Notification / Status Toast Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm px-space-md py-3 rounded-xl bg-on-background text-surface-container-lowest shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <Icon name="check_circle" size={20} className="text-secondary" />
          <span className="font-body-md text-body-md text-surface-container-lowest font-medium">
            {toastMessage}
          </span>
        </div>
      )}

      <main className="w-full bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* SECTION 1: HERO ASYMMETRIC SECTION (55/45 SPLIT) */}
          <section className="w-full px-gutter py-space-xl lg:py-16">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Column: Typography & Intelligent Search (7 cols / ~58%) */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Live Open Badge */}
                <div className="inline-flex items-center gap-space-xs self-start px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm mb-space-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Nền tảng nấu ăn mở • Không cần tài khoản để bắt đầu</span>
                </div>

                {/* Hero Headline */}
                <h1 className="font-display-hero text-display-hero text-on-background tracking-tight mb-space-md">
                  Khám phá công thức <span className="text-primary">chuẩn vị</span>, lập kế hoạch bữa ăn trong tích tắc.
                </h1>

                {/* Subtitle description */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-xl">
                  Hơn 3.500 công thức gia đình Việt được kiểm chứng. Tự do tìm kiếm nguyên liệu, lên thực đơn tuần và tạo
                  danh sách đi chợ hoàn toàn miễn phí ngay trên trình duyệt của bạn.
                </p>

                {/* Smart Omnisearch Bar */}
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl mb-space-md">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-surface-container-lowest rounded-2xl shadow-md p-1.5 gap-2 transition-all duration-200 focus-within:shadow-xl">
                    <div className="flex items-center flex-1 px-3 min-w-0">
                      <Icon name="search" size={22} className="text-outline shrink-0 mr-1" />
                      <input
                        id="recipe-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm món ăn, nguyên liệu như thịt bò, nấm, sả..."
                        className="w-full bg-transparent px-space-sm py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                      />
                      <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface-variant shrink-0 select-none">
                        <span>Ctrl</span>
                        <span>+</span>
                        <span>K</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm shrink-0 cursor-pointer"
                    >
                      <span>Tìm kiếm</span>
                      <Icon name="arrow_forward" size={18} />
                    </button>
                  </div>
                </form>

                {/* Quick Trending Discovery Chips */}
                <div className="flex flex-wrap items-center gap-2 max-w-2xl">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider py-1">
                    Gợi ý nhanh:
                  </span>
                  {[
                    "Món sáng dưới 20p",
                    "Ăn kiêng Eat Clean",
                    "Món chay thanh đạm",
                    "Món nhậu cuối tuần",
                    "Nồi chiên không dầu",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectQuickTag(tag)}
                      className="px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-body-sm text-body-sm transition-colors shadow-sm cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Featured Spotlight Dish (5 cols / ~42%) */}
              <div className="lg:col-span-5 relative mt-space-lg lg:mt-0">
                {/* Ambient Warm Diffuse Backdrop */}
                <div className="absolute -top-6 -right-6 w-72 h-72 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

                {/* Spotlight Card Container */}
                <div className="relative bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden p-3 transition-transform duration-300 hover:-translate-y-1">
                  {/* Spotlight Dish Image Container */}
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-surface-container">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEDHq3CIW_vduvvUEFX65Btr-67QR5re6cUf9oRr56NZIZbQVHZM8OnCTvWYlgr5nJSI04OR929XIxqIgpfj7E2gzeUqONXlllyEO6Os2brJXuep0nbFog-IAL91GRdoOwDw4aqdJD38bUaA_bdOhU3QzgGjomkl2V5YBh-42qq1ys5iUewfzrItASOoMpSfYQ9xFdt4Z1fOgnG-VoFOi1Ib11q7KtinnRL9ojdDU6"
                      alt="A steaming hot bowl of authentic Hanoi Pho Bo Tai Lan served on a rustic dark wooden tabletop"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      priority
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-label-mono-sm text-label-mono-sm text-primary font-semibold shadow-sm">
                      <Icon name="local_fire_department" size={16} />
                      <span>Tiêu Điểm Tuần</span>
                    </div>

                    {/* Quick Bookmark Action for Guest */}
                    <button
                      type="button"
                      onClick={toggleSpotlightBookmark}
                      title="Lưu vào yêu thích"
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                        isSpotlightBookmarked ? "text-primary" : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      <Icon
                        name={isSpotlightBookmarked ? "bookmark" : "bookmark_border"}
                        filled={isSpotlightBookmarked}
                        size={20}
                      />
                    </button>
                  </div>

                  {/* Spotlight Details */}
                  <div className="p-space-md">
                    <div className="flex items-center justify-between gap-space-sm mb-space-xs">
                      <div className="flex items-center gap-1 text-secondary">
                        <Icon name="star" filled size={18} />
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                          4.9
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">
                          (184 đánh giá)
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                        Độ khó: Trung bình
                      </span>
                    </div>

                    <Link href="/recipes/pho-bo-tai-lan">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold hover:text-primary transition-colors">
                        Phở bò tái lăn Hà Nội
                      </h3>
                    </Link>

                    {/* Cooking Metadata Strip */}
                    <div className="grid grid-cols-3 gap-2 py-space-sm px-space-md rounded-xl bg-surface-container-low mb-space-md">
                      <div className="flex flex-col">
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">Chuẩn bị</span>
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">20 phút</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">Nấu chín</span>
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">35 phút</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-mono-sm text-label-mono-sm text-outline">Khẩu phần</span>
                        <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">4 người</span>
                      </div>
                    </div>

                    {/* Author & Action Row */}
                    <div className="flex items-center justify-between gap-space-sm pt-space-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-semibold text-xs shrink-0">
                          CC
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                            Bếp Cô Cúc
                          </span>
                          <span className="font-label-mono-sm text-label-mono-sm text-outline truncate">
                            Ẩm thực truyền thống
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewDishName("Phở bò tái lăn Hà Nội")}
                        className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md font-semibold shrink-0 shadow-sm cursor-pointer"
                      >
                        <span>Xem công thức</span>
                        <Icon name="menu_book" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: GUEST LOCAL DATA TRANSPARENCY BANNER */}
          <section className="w-full px-gutter pb-space-lg">
            <div className="w-full p-space-md lg:p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                  <Icon name="data_object" size={22} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                      Chế độ trải nghiệm khách an toàn
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-medium">
                      Bộ nhớ máy chủ trống
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Tất cả công thức đã lưu, lịch trình thực đơn 7 ngày và danh sách mua sắm được ghi nhớ tức thời trong bộ
                    nhớ trình duyệt cục bộ (Local Storage). Không thu thập danh tính người dùng.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-space-sm self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMergeDialogOpen(true)}
                  className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                >
                  Tìm hiểu thêm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginDialogAction("publish");
                    setIsLoginDialogOpen(true);
                  }}
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Đăng nhập để đồng bộ
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: ASYMMETRIC CATEGORY BENTO GRID */}
          <section className="w-full px-gutter py-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
              <div>
                <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase font-semibold tracking-wider">
                  Cảm hứng gian bếp
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-background mt-1">
                  Danh mục ẩm thực phổ biến
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Phân loại món ăn theo khẩu vị bản địa và phương thức nấu thực tế, giúp bạn dễ dàng chọn món chỉ trong 30 giây.
              </p>
            </div>

            {/* Asymmetric 6-Card Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
              {/* Bento Item 1: Món nước đậm đà (6 cols) */}
              <Link
                href="/recipes?category=mon-nuoc"
                className="lg:col-span-6 bg-surface-container-lowest rounded-3xl p-space-lg shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
                    <Icon name="soup_kitchen" size={28} />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    840+ công thức
                  </span>
                </div>
                <div className="my-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Món nước đậm đà
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Phở, Bún riêu, Bún bò Huế, Hủ tiếu Nam Vang, Miến gà măng tươi - Nước dùng thanh ngọt hầm kỹ từ xương tự nhiên.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                      Ninh hầm
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface">
                      Gia vị phở
                    </span>
                  </div>
                  <Icon
                    name="arrow_forward"
                    size={20}
                    className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>

              {/* Bento Item 2: Cơm & Món mặn (3 cols) */}
              <Link
                href="/recipes?category=com-mon-man"
                className="lg:col-span-3 bg-surface-container-lowest rounded-3xl p-space-lg shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <Icon name="rice_bowl" size={28} />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    1.250+ món
                  </span>
                </div>
                <div className="my-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Cơm &amp; Món mặn
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Thịt kho tàu dừa xiêm, Cá kho tộ, Sườn xào chua ngọt đưa cơm.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                    Bữa cơm mẹ nấu
                  </span>
                  <Icon
                    name="arrow_forward"
                    size={20}
                    className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>

              {/* Bento Item 3: Món cuốn & Khai vị (3 cols) */}
              <Link
                href="/recipes?category=mon-cuon"
                className="lg:col-span-3 bg-surface-container-lowest rounded-3xl p-space-lg shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container text-on-surface flex items-center justify-center">
                    <Icon name="restaurant_menu" size={28} />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    410+ món
                  </span>
                </div>
                <div className="my-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Món cuốn &amp; Khai vị
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Gỏi cuốn tôm thịt chấm tương nếp, Nem rán giòn tan, Phở cuốn thanh mát.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    Tươi giòn
                  </span>
                  <Icon
                    name="arrow_forward"
                    size={20}
                    className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>

              {/* Bento Item 4: Canh rau & Món chay (4 cols) */}
              <Link
                href="/recipes?category=chay"
                className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-space-lg shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <Icon name="eco" size={28} />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    520+ món
                  </span>
                </div>
                <div className="my-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Canh rau &amp; Món chay
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Canh cua mồng tơi, Canh chua thanh mát, Nấm kho tiêu chay, Đậu phụ sốt cà chua mộc mạc.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                    100% Thực vật tự nhiên
                  </span>
                  <Icon
                    name="arrow_forward"
                    size={20}
                    className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>

              {/* Bento Item 5: Tráng miệng & Chè Việt (4 cols) */}
              <Link
                href="/recipes?category=trang-mieng"
                className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-space-lg shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center">
                    <Icon name="bakery_dining" size={28} />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    290+ món
                  </span>
                </div>
                <div className="my-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Tráng miệng &amp; Chè Việt
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Chè bưởi An Giang giòn sần sật, Chè sương sa hạt lựu, Bánh flan nước cốt dừa béo ngậy.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    Ngọt thanh cốt dừa
                  </span>
                  <Icon
                    name="arrow_forward"
                    size={20}
                    className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>

              {/* Bento Item 6: Lối sống & Eat Clean (4 cols) */}
              <Link
                href="/recipes?category=eat-clean"
                className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-space-lg shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                    <Icon name="vital_signs" size={28} />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    380+ thực đơn
                  </span>
                </div>
                <div className="my-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                    Lối sống &amp; Eat Clean
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Cân bằng Macro, Giảm tinh bột tinh chế, Giữ nguyên dinh dưỡng với kỹ thuật hấp và áp chảo.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
                    Tính Calo chính xác
                  </span>
                  <Icon
                    name="arrow_forward"
                    size={20}
                    className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            </div>
          </section>

          {/* SECTION 4: TRENDING RECIPES (MÓN NGON NỔI BẬT HÔM NAY) */}
          <section className="w-full px-gutter py-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div>
                <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase font-semibold tracking-wider">
                  Xu hướng cộng đồng
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-background mt-1">
                  Món ngon nổi bật hôm nay
                </h2>
              </div>

              {/* Filter Tabs Component */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-2xl self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`recipe-filter-tab px-space-md py-1.5 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold"
                      : "text-on-surface-variant hover:text-on-surface font-medium"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("quick")}
                  className={`recipe-filter-tab px-space-md py-1.5 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
                    activeCategory === "quick"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold"
                      : "text-on-surface-variant hover:text-on-surface font-medium"
                  }`}
                >
                  Nhanh gọn (&lt;30p)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("main")}
                  className={`recipe-filter-tab px-space-md py-1.5 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
                    activeCategory === "main"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold"
                      : "text-on-surface-variant hover:text-on-surface font-medium"
                  }`}
                >
                  Món chính
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("dessert")}
                  className={`recipe-filter-tab px-space-md py-1.5 rounded-xl font-body-sm text-body-sm transition-all cursor-pointer ${
                    activeCategory === "dessert"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm font-semibold"
                      : "text-on-surface-variant hover:text-on-surface font-medium"
                  }`}
                >
                  Món tráng miệng
                </button>
              </div>
            </div>

            {/* 4 Detailed Recipe Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg" id="recipe-card-grid">
              {filteredRecipes.map((card) => {
                const isBookmarked = bookmarkedCards[card.id] || false;
                return (
                  <article
                    key={card.id}
                    className="recipe-card bg-surface-container-lowest rounded-3xl p-3 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container with Padding Rule */}
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-surface-container">
                        <Image
                          src={card.image}
                          alt={card.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm font-label-mono-sm text-label-mono-sm text-on-surface font-medium shadow-sm">
                          {card.time}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCardBookmark(card.id, card.fullName)}
                          title="Lưu công thức"
                          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                            isBookmarked ? "text-primary" : "text-outline hover:text-primary"
                          }`}
                        >
                          <Icon
                            name={isBookmarked ? "bookmark" : "bookmark_border"}
                            filled={isBookmarked}
                            size={18}
                          />
                        </button>
                      </div>

                      {/* Metadata & Title */}
                      <div className="p-space-sm pt-space-md">
                        <div className="flex items-center justify-between text-outline font-label-mono-sm text-label-mono-sm mb-1.5">
                          <span className="flex items-center gap-1 text-secondary font-semibold">
                            <Icon name="star" filled size={16} />
                            {card.rating}
                          </span>
                          <span>{card.portions}</span>
                        </div>

                        <Link href={`/recipes/${card.id}`}>
                          <h3 className="font-title-md text-title-md text-on-surface font-semibold line-clamp-1 mb-1 hover:text-primary transition-colors">
                            {card.title}
                          </h3>
                        </Link>

                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-sm">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Author Strip & Quick Action */}
                    <div className="p-space-sm pt-0 flex items-center justify-between gap-2 border-t-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-label-mono-sm text-label-mono-sm shrink-0">
                          {card.authorInitial}
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">
                          {card.author}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDishName(card.fullName)}
                        title="Xem chi tiết"
                        className="p-2 rounded-xl bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-colors shadow-sm cursor-pointer"
                      >
                        <Icon name="arrow_forward" size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* SECTION 5: HOW RECIPEHUB WORKS (3 STEP INTERACTIVE OVERVIEW) */}
          <section className="w-full px-gutter py-space-xl">
            <div className="p-space-xl lg:p-16 rounded-3xl bg-surface-container-low shadow-sm">
              <div className="max-w-3xl mb-space-xl">
                <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase font-semibold tracking-wider">
                  Trải nghiệm liền mạch
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-background mt-1">
                  Cách RecipeHub đồng hành cùng bạn
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                  Không ép buộc đăng ký, không tường phí nội dung. Gian bếp của bạn vận hành trơn tru chỉ với 3 thao tác cơ bản.
                </p>
              </div>

              {/* 3 Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
                {/* Step 1 */}
                <Link
                  href="/ingredient-search"
                  className="flex flex-col bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center mb-space-md">
                    01
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-space-xs group-hover:text-primary transition-colors">
                    Tìm theo đồ có sẵn trong tủ
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Nhập nguyên liệu bạn đang có (thịt heo, trứng, cà chua), hệ thống tự động gợi ý các món ăn ngon phù hợp
                    ngay lập tức để tránh lãng phí thực phẩm.
                  </p>
                  <div className="mt-space-md pt-space-sm flex items-center gap-1.5 text-primary font-label-mono-sm text-label-mono-sm font-semibold">
                    <span>Thử bộ lọc tủ lạnh</span>
                    <Icon name="tune" size={16} />
                  </div>
                </Link>

                {/* Step 2 */}
                <Link
                  href="/meal-planner"
                  className="flex flex-col bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline-sm text-headline-sm font-bold flex items-center justify-center mb-space-md">
                    02
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-space-xs group-hover:text-primary transition-colors">
                    Lập thực đơn cả tuần trong 2 phút
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Kéo thả công thức vào các ngày trong tuần từ Thứ Hai đến Chủ Nhật. Tự động tính toán khẩu phần ăn, cân
                    bằng calo và chất đạm cho cả gia đình.
                  </p>
                  <div className="mt-space-md pt-space-sm flex items-center gap-1.5 text-secondary font-label-mono-sm text-label-mono-sm font-semibold">
                    <span>Xem lịch mẫu 7 ngày</span>
                    <Icon name="calendar_today" size={16} />
                  </div>
                </Link>

                {/* Step 3 */}
                <Link
                  href="/shopping-list"
                  className="flex flex-col bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface font-headline-sm text-headline-sm font-bold flex items-center justify-center mb-space-md">
                    03
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-space-xs group-hover:text-primary transition-colors">
                    Xuất danh sách đi chợ thông minh
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Hệ thống tự động cộng gộp định lượng thịt, rau, hành tỏi cần mua theo thực đơn đã lên. Đánh dấu tích hoàn
                    thành ngay trên điện thoại khi đi chợ.
                  </p>
                  <div className="mt-space-md pt-space-sm flex items-center gap-1.5 text-on-surface font-label-mono-sm text-label-mono-sm font-semibold">
                    <span>Xem giỏ nguyên liệu</span>
                    <Icon name="checklist" size={16} />
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 6: COMMUNITY CREATOR CTA BANNER */}
          <section className="w-full px-gutter py-space-xl">
            <div className="w-full rounded-3xl bg-surface-container p-space-xl lg:p-14 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-xl">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm mb-space-sm">
                  <Icon name="menu_book" size={16} className="text-primary" />
                  <span>Cùng lan tỏa niềm vui nấu ăn gia đình</span>
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-background mt-2">
                  Bạn có bí quyết nấu ăn đặc trưng muốn chia sẻ?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                  RecipeHub là ngôi nhà chung của các đầu bếp gia đình. Đóng góp công thức gia truyền của bạn, định lượng từng
                  thìa gia vị để gìn giữ hương vị ẩm thực Việt cho thế hệ sau.
                </p>
                <div className="flex items-center gap-space-md mt-space-md">
                  <a
                    href="#"
                    className="font-body-sm text-body-sm text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Xem quy chuẩn nội dung cộng đồng</span>
                    <Icon name="open_in_new" size={16} />
                  </a>
                </div>
              </div>

              {/* Action Box */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-space-sm w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setLoginDialogAction("publish");
                    setIsLoginDialogOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-space-xl py-3.5 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-all active:scale-[0.98] shadow-md text-center cursor-pointer"
                >
                  <Icon name="add_circle" size={20} />
                  <span>Đăng công thức của bạn</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/recipes/new")}
                  className="inline-flex items-center justify-center px-space-lg py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-body-md text-body-md font-medium transition-colors shadow-sm text-center cursor-pointer"
                >
                  <span>Soạn thử bản nháp tự do</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* QUICK MODAL: GUEST INTERACTIVE OVERLAY FOR COOKING PREVIEW */}
      {previewDishName && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-space-lg shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-2">
                <Icon name="restaurant" size={22} className="text-primary" />
                <h3 className="font-title-md text-title-md text-on-surface font-semibold" id="modal-recipe-title">
                  {previewDishName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDishName(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant my-space-sm">
              Công thức này đã sẵn sàng với danh sách nguyên liệu và các bước nấu từng phút. Bạn muốn xem chi tiết hay đưa ngay
              vào kế hoạch thực đơn tuần này?
            </p>

            <div className="p-space-sm rounded-xl bg-surface-container-low mb-space-md">
              <div className="flex items-center justify-between text-outline font-label-mono-sm text-label-mono-sm">
                <span>
                  Lưu trữ trên máy: <b className="text-secondary font-medium">Khả dụng</b>
                </span>
                <span>
                  Chế độ: <b className="text-on-surface font-medium">Nấu rảnh tay</b>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm">
              <button
                type="button"
                onClick={() => setPreviewDishName(null)}
                className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface-variant font-body-sm text-body-sm cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Đã thêm "${previewDishName}" vào Kế hoạch bữa ăn tuần này!`);
                  setPreviewDishName(null);
                }}
                className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm cursor-pointer"
              >
                Thêm vào thực đơn tuần
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GATED ACTION LOGIN DIALOG */}
      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        actionType={loginDialogAction}
        returnUrl="/recipes/new"
        onSuccess={() => {
          showToast("Đăng nhập thành công! Đang chuyển tiếp...");
          router.push("/recipes/new");
        }}
      />

      {/* MERGE DATA DIALOG */}
      <MergeDataDialog
        isOpen={isMergeDialogOpen}
        onClose={() => setIsMergeDialogOpen(false)}
        onMerge={() => {
          showToast("Đã đồng bộ thành công dữ liệu cục bộ vào tài khoản!");
          setIsMergeDialogOpen(false);
        }}
        onSkip={() => {
          showToast("Đã bỏ qua gộp dữ liệu cục bộ.");
          setIsMergeDialogOpen(false);
        }}
      />
    </div>
    </>
  );
}
