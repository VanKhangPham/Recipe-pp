"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { useRecipes } from "@/lib/context/recipes-context";

interface Recipe {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "pending" | "rejected";
  statusText: string;
  image: string;
  time: string;
  servings?: string;
  rating?: number;
  reviewsCount?: number;
  bookmarksCount?: number;
  cookedCount?: number;
  description?: string;
  pendingNote?: string;
  draftProgress?: string;
  draftMissing?: string;
  feedback?: string;
  updatedAt?: string;
}

const MY_RECIPES: Recipe[] = [
  {
    id: "ca-loc-kho-to",
    title: "Cá lóc kho tộ nước màu dừa Bến Tre",
    category: "Món kho Nam Bộ",
    status: "published",
    statusText: "Đã đăng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD2pDRxTfNt_CGwRzQxziio-DtGR7wDVDzlPuS9ZlZcN_MPf4LrpP929KuEpZ7iofBzDnzf0YVByaKy6yIIkOcYGTHsDEwmoEmALIsbR3zoi35fOizzxU3affcPt-MFY6EARs0cYOOu4GqdzsJHV4TR09KlrGIu4lBmac2qB1JaDMDxmeNx9SlhoRdHIp_8PbMjWmvJS8fcDkmr779tK0gO5q9_wrPytwduyx_H8sj",
    time: "35 phút",
    servings: "4 người",
    rating: 4.9,
    reviewsCount: 184,
    bookmarksCount: 1250,
    cookedCount: 410,
    description: "Vị mặn ngọt đầm đà, thịt cá săn chắc thơm nồng hạt tiêu Đắk Lắk cùng nước hàng dừa xiêm béo ngậy.",
    updatedAt: "3 ngày trước",
  },
  {
    id: "canh-chua-ca-loc",
    title: "Canh chua cá lóc miền Tây chuẩn vị",
    category: "Món canh miền Tây",
    status: "published",
    statusText: "Đã đăng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoIYy-CphdumjMAW8NhejLYkgye0vyS6sdwz9_si5zl9acDy4vameqFEE18-XhxIYzicaOnvErAb1XxW_Wi3wdhqT4mWtrJ4e1UX-PdnPzqYDzKqZR_NXzluPySGgeeYdOo4lLqMs9z5-WFAkHY6dCntFwBt6SgtvuYA9xtl5XHYllmSXdIaKN-7GN_Skd6nIx4M3qNyCEzJtvxGuoA9s61vAlRZmg5XeGLMCa1SFB",
    time: "30 phút",
    servings: "4 người",
    rating: 4.8,
    reviewsCount: 96,
    bookmarksCount: 980,
    cookedCount: 320,
    description: "Nước dùng thanh tao vị me chín, thơm dứa hòa quyện cá lóc ngọt thịt cùng bông súng và ngò om chuẩn phong vị sông nước.",
    updatedAt: "1 tuần trước",
  },
  {
    id: "thit-kho-hot-vit",
    title: "Thịt kho hột vịt nước dừa thơm béo",
    category: "Món kho truyền thống",
    status: "published",
    statusText: "Đã đăng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIMK5C97J2uWZnHMr_RfA4QurQ4cxkYcyggsFX2S7i0wS-3KE_B8JwRrgcqeJXm9Y3MI2b1GlvaI9lX4Ljl_4y9knCaEmn3k9ayS8qqiUxmsT0H0aayDF98VSLR71KnLvtv4bktiTp5dfQL-V7NuSbo4ai53vUqQLJAz9H_RsUQkTSbR7QNcEFA3XiRejVcrnLFmGH95cfeM8C0Fg0zBVVloWafjcRpBPuzBZ8bhBv",
    time: "60 phút",
    servings: "6 người",
    rating: 4.9,
    reviewsCount: 140,
    bookmarksCount: 1120,
    cookedCount: 520,
    description: "Ba chỉ heo kho mềm tan, ngập trong nước dừa xiêm tự nhiên, trứng vịt thấm đẫm gia vị mặn mà quen thuộc.",
    updatedAt: "2 tuần trước",
  },
  {
    id: "suon-non-ram-man-ngot",
    title: "Sườn non ram mặn ngọt đưa cơm",
    category: "Đang kiểm định",
    status: "pending",
    statusText: "Chờ duyệt",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGx0AMc6O4EmXP1ACOfDgVkpDhUhiGwpgwIHsJWuEvUm46dmOyIk6EZd1d7bn54lKd7jb9q9PRmmL7qTauXAaI-Pwh8tUiI94kbjscakFebdbMpnvl8XX4ZTi-vw78ODBvGvM_GUWkRqricu8LUvbcmk0uH0sSNUBEwvJU1f6deRRsWJBsEfpqirs7iizsbx0mGyBUOL14jT4fTM5rk2tjz8pV8VLJkQUIGF-LXq2e",
    time: "40 phút",
    servings: "4 người",
    pendingNote: "Dự kiến phản hồi trước 14:00 từ ban biên tập ẩm thực.",
    updatedAt: "Gửi lúc 10:15 hôm nay",
  },
  {
    id: "bun-cha-quat-ha-noi",
    title: "Bún chả quạt Hà Nội nước mắm ấm",
    category: "Chưa xuất bản",
    status: "draft",
    statusText: "Bản nháp",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIGD6xleJCUeqGoMFCRPcEy6A7eaosJZ0-xaabvnADOcZhJ6fLySmRHIG6ekGR64toXoq_yQ3V60iOBL4coxzmXmWes3RtwMMZsiN962g9zpjH6lvR8jcF1VV4OL4RU0uzIZNwz4W-bT-YAJCXTn5MdS2mW11PvccyNUaucGOzumd_oodhcVwE-TVkkeLJINZhLVXtmGHfmikNaRE_Cr0IFNMx9beJn7RUaDTrTkKI",
    time: "50 phút",
    draftProgress: "Đã điền 3/5 bước",
    draftMissing: "Còn thiếu: hình ảnh hoàn thiện món ăn và định lượng chuẩn của nước chấm quất.",
    updatedAt: "Cập nhật 2 ngày trước",
  },
  {
    id: "lau-ga-la-e",
    title: "Lẩu gà lá é chua cay Phú Yên",
    category: "Phản hồi kiểm duyệt",
    status: "rejected",
    statusText: "Cần chỉnh sửa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiSHoIU6k9M91p8i2Pu3OqHVQ1Z9u0AVYgJl6CihFK9nfG-kYc00dOhAw2GcxpPymFrYJ0eoviYAIPxw3UYHxAyntN8PhCcIfXziRf5LSdF8V1kcNsw1KD-3EQ57pYx4Bg-h8DQ6iQagjMNXrcm-SvcTwXIyq7D_NVb1hqGzbJNTqyMohvjRasiOAIRSi_U7DaXqRx8f0p1UpRI7BtOSAll7pyISqebwMOGk6XPRyx",
    time: "45 phút",
    feedback: "Vui lòng bổ sung rõ định lượng lá é tươi và ảnh công đoạn sơ chế gà để người nấu dễ làm theo.",
    updatedAt: "Hôm qua lúc 16:30",
  },
];

export default function MyRecipesPage() {
  const { userRecipes, deleteRecipe } = useRecipes();

  const [showVerifiedBanner, setShowVerifiedBanner] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"all" | "draft" | "pending" | "rejected">("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");
  const [recipeToDelete, setRecipeToDelete] = React.useState<string | null>(null);

  const allMyRecipes = React.useMemo(() => {
    const mappedUserRecipes: Recipe[] = userRecipes.map((ur) => ({
      id: ur.id,
      title: ur.title,
      category: ur.categoryName || "Món ngon gia đình",
      status: (ur.status as any) || "published",
      statusText:
        ur.status === "draft"
          ? "Bản nháp"
          : ur.status === "pending"
          ? "Chờ duyệt"
          : ur.status === "rejected"
          ? "Cần chỉnh sửa"
          : "Đã đăng",
      image: ur.image,
      time: ur.totalTime,
      servings: `${ur.servings} người`,
      rating: ur.rating || 5.0,
      reviewsCount: ur.reviewsCount || 0,
      bookmarksCount: ur.bookmarksCount || 0,
      cookedCount: 0,
      description: ur.description,
      updatedAt: ur.createdAt || "Vừa xong",
    }));

    const userIds = new Set(mappedUserRecipes.map((r) => r.id));
    const remainingMock = MY_RECIPES.filter((r) => !userIds.has(r.id));
    return [...mappedUserRecipes, ...remainingMock];
  }, [userRecipes]);

  const [recipes, setRecipes] = React.useState<Recipe[]>(allMyRecipes);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setRecipes(allMyRecipes);
  }, [allMyRecipes]);

  const filteredRecipes = recipes.filter((r) => {
    if (activeTab === "all" && r.status !== "published") return false;
    if (activeTab === "draft" && r.status !== "draft") return false;
    if (activeTab === "pending" && r.status !== "pending") return false;
    if (activeTab === "rejected" && r.status !== "rejected") return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (categoryFilter) {
      if (categoryFilter === "kho" && !r.category.toLowerCase().includes("kho")) return false;
      if (categoryFilter === "canh" && !r.category.toLowerCase().includes("canh")) return false;
      if (categoryFilter === "xao" && !r.category.toLowerCase().includes("xào")) return false;
      if (categoryFilter === "trangmieng" && !r.category.toLowerCase().includes("tráng miệng")) return false;
    }

    return true;
  });

  const handleDeleteRecipe = () => {
    if (recipeToDelete) {
      deleteRecipe(recipeToDelete);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete && r.title !== recipeToDelete));
      setRecipeToDelete(null);
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full px-margin-mobile lg:px-margin py-space-lg flex flex-col gap-space-lg">
            {/* 1. BANNER THÔNG BÁO XÁC THỰC EMAIL */}
            {showVerifiedBanner && (
              <div className="w-full bg-secondary-container/20 rounded-xl p-space-md flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-space-sm text-on-secondary-container">
                  <Icon name="verified" className="text-[22px] text-secondary" />
                  <p className="font-body-sm text-body-sm font-medium leading-relaxed">
                    Tài khoản của bạn đã xác thực thành công. Bạn có thể xuất bản không giới hạn công thức chất lượng cao vào thư viện ẩm thực RecipeHub.
                  </p>
                </div>
                <button
                  aria-label="Đóng thông báo"
                  className="text-on-secondary-container/70 hover:text-on-secondary-container transition-colors p-1"
                  onClick={() => setShowVerifiedBanner(false)}
                  type="button"
                >
                  <Icon name="close" className="text-[18px]" />
                </button>
              </div>
            )}

            {/* 2. THANH TIÊU ĐỀ & NÚT TẠO CÔNG THỨC */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="space-y-space-xs max-w-2xl">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary tracking-wider uppercase font-semibold">
                    Gian bếp số cá nhân
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    Bếp Mẹ Ba
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Công thức của tôi
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Quản lý kho tàng ẩm thực, theo dõi lượt nấu và tương tác từ cộng đồng yêu bếp.
                </p>
              </div>
              <div className="flex items-center gap-space-sm">
                <Link
                  className="inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium px-space-lg py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  href="/recipes/new"
                >
                  <Icon name="add" className="text-[20px]" />
                  <span>Tạo công thức mới</span>
                </Link>
              </div>
            </div>

            {/* 4 THẺ KPI TỔNG QUAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* KPI 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm font-medium">Tổng công thức</span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Icon name="menu_book" className="text-[20px]" />
                  </div>
                </div>
                <div className="mt-space-md">
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      14
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">món</span>
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-secondary mt-1 flex items-center gap-1">
                    <Icon name="trending_up" className="text-[14px]" /> +2 món tháng này
                  </p>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm font-medium">Lượt lưu yêu thích</span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Icon name="bookmark" className="text-[20px]" />
                  </div>
                </div>
                <div className="mt-space-md">
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      3.840
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">lượt</span>
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-secondary mt-1 flex items-center gap-1">
                    <Icon name="arrow_upward" className="text-[14px]" /> Tăng 18% so với tháng trước
                  </p>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm font-medium">Nấu thử thành công</span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                    <Icon name="skillet" className="text-[20px]" />
                  </div>
                </div>
                <div className="mt-space-md">
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      1.250
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">lượt</span>
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-outline mt-1">
                    Đầu bếp gia đình đánh giá
                  </p>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm font-medium">Đánh giá trung bình</span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                    <Icon name="star" className="text-[20px]" />
                  </div>
                </div>
                <div className="mt-space-md">
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      4.85
                    </span>
                    <span className="font-body-sm text-body-sm text-primary font-semibold">★</span>
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-outline mt-1">
                    Từ 342 lượt nhận xét
                  </p>
                </div>
              </div>
            </div>

            {/* 3. TABS TRẠNG THÁI & BỘ LỌC TÌM KIẾM */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md lg:p-space-lg flex flex-col gap-space-md">
              {/* Tabs Bar */}
              <div className="flex flex-wrap items-center gap-space-xs border-b border-surface-variant/40 pb-space-sm">
                <button
                  className={`px-space-md py-2.5 rounded-xl font-body-sm text-body-sm transition-all flex items-center gap-space-xs ${
                    activeTab === "all"
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : "font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  onClick={() => setActiveTab("all")}
                  type="button"
                >
                  <span>Đã đăng</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-label-mono-sm ${
                      activeTab === "all"
                        ? "bg-white/20 text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    8
                  </span>
                </button>

                <button
                  className={`px-space-md py-2.5 rounded-xl font-body-sm text-body-sm transition-all flex items-center gap-space-xs ${
                    activeTab === "draft"
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : "font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  onClick={() => setActiveTab("draft")}
                  type="button"
                >
                  <span>Bản nháp</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-label-mono-sm ${
                      activeTab === "draft"
                        ? "bg-white/20 text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    3
                  </span>
                </button>

                <button
                  className={`px-space-md py-2.5 rounded-xl font-body-sm text-body-sm transition-all flex items-center gap-space-xs ${
                    activeTab === "pending"
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : "font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  onClick={() => setActiveTab("pending")}
                  type="button"
                >
                  <span>Chờ duyệt</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-label-mono-sm ${
                      activeTab === "pending"
                        ? "bg-white/20 text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    2
                  </span>
                </button>

                <button
                  className={`px-space-md py-2.5 rounded-xl font-body-sm text-body-sm transition-all flex items-center gap-space-xs ${
                    activeTab === "rejected"
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : "font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  onClick={() => setActiveTab("rejected")}
                  type="button"
                >
                  <span>Bị từ chối / Cần chỉnh sửa</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-label-mono-sm ${
                      activeTab === "rejected"
                        ? "bg-white/20 text-on-primary"
                        : "bg-error-container text-on-error-container"
                    }`}
                  >
                    1
                  </span>
                </button>
              </div>

              {/* Filters & View Switcher */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
                {/* Search Input */}
                <div className="md:col-span-5 relative">
                  <Icon
                    name="search"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                    placeholder="Tìm theo tên món, nguyên liệu chính..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <select
                      aria-label="Bộ lọc danh mục món ăn"
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 bg-surface rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">Tất cả danh mục</option>
                      <option value="kho">Món kho</option>
                      <option value="canh">Món canh</option>
                      <option value="xao">Món xào</option>
                      <option value="trangmieng">Món tráng miệng</option>
                    </select>
                    <Icon
                      name="expand_more"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none"
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <select
                      aria-label="Sắp xếp danh sách món ăn"
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 bg-surface rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="favorite">Được yêu thích nhất</option>
                      <option value="cooked">Nhiều lượt nấu nhất</option>
                      <option value="rating">Đánh giá cao nhất</option>
                    </select>
                    <Icon
                      name="sort"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none"
                    />
                  </div>
                </div>

                {/* Grid/Table Toggle */}
                <div className="md:col-span-1 flex justify-end">
                  <div className="flex items-center bg-surface p-1 rounded-xl shadow-inner gap-0.5">
                    <button
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-outline hover:text-on-surface"
                      }`}
                      onClick={() => setViewMode("grid")}
                      title="Hiển thị dạng lưới"
                      type="button"
                    >
                      <Icon name="grid_view" className="text-[18px]" />
                    </button>
                    <button
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "table"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-outline hover:text-on-surface"
                      }`}
                      onClick={() => setViewMode("table")}
                      title="Hiển thị dạng bảng"
                      type="button"
                    >
                      <Icon name="view_list" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DANH SÁCH CÔNG THỨC (GRID VIEW) */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {filteredRecipes.map((recipe) => {
                  if (recipe.status === "published") {
                    return (
                      <article
                        key={recipe.id}
                        className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                      >
                        <div className="p-space-sm pb-0 relative">
                          <div className="w-full h-52 rounded-xl overflow-hidden relative">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-label-mono-sm font-semibold bg-emerald-100 text-emerald-800 shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              {recipe.statusText}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md text-on-surface font-label-mono-sm text-[12px] flex items-center gap-1.5 shadow-sm">
                              <Icon name="schedule" className="text-[14px] text-primary" />
                              <span>{recipe.time}</span>
                              <span>•</span>
                              <Icon name="group" className="text-[14px] text-secondary" />
                              <span>{recipe.servings}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-space-md flex-1 flex flex-col justify-between gap-space-md">
                          <div className="space-y-space-xs">
                            <div className="flex items-center justify-between text-outline">
                              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-primary">
                                {recipe.category}
                              </span>
                              <span className="font-label-mono-sm text-[12px] font-semibold text-primary flex items-center gap-0.5">
                                {recipe.rating} ★{" "}
                                <span className="text-outline font-normal">
                                  ({recipe.reviewsCount})
                                </span>
                              </span>
                            </div>
                            <Link href={`/recipes/${recipe.id}`}>
                              <h2 className="font-title-md text-title-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                {recipe.title}
                              </h2>
                            </Link>
                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                              {recipe.description}
                            </p>
                          </div>

                          <div className="pt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant">
                            <div className="flex items-center gap-space-sm font-label-mono-sm text-[12px] text-outline">
                              <span className="flex items-center gap-1">
                                <Icon name="bookmark" className="text-[16px] text-primary" />
                                {recipe.bookmarksCount?.toLocaleString("vi-VN")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="skillet" className="text-[16px] text-secondary" />
                                {recipe.cookedCount?.toLocaleString("vi-VN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                                title="Chỉnh sửa công thức"
                                type="button"
                              >
                                <Icon name="edit" className="text-[18px]" />
                              </button>
                              <button
                                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                                title="Nhân bản"
                                type="button"
                              >
                                <Icon name="content_copy" className="text-[18px]" />
                              </button>
                              <button
                                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors"
                                title="Xem thống kê"
                                type="button"
                              >
                                <Icon name="insights" className="text-[18px]" />
                              </button>
                              <button
                                className="w-8 h-8 rounded-lg hover:bg-error-container/40 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                                onClick={() => setRecipeToDelete(recipe.title)}
                                title="Xóa"
                                type="button"
                              >
                                <Icon name="delete" className="text-[18px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  if (recipe.status === "pending") {
                    return (
                      <article
                        key={recipe.id}
                        className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                      >
                        <div className="p-space-sm pb-0 relative">
                          <div className="w-full h-52 rounded-xl overflow-hidden relative">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-label-mono-sm font-semibold bg-amber-100 text-amber-800 shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                              {recipe.statusText}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md text-on-surface font-label-mono-sm text-[12px] flex items-center gap-1.5 shadow-sm">
                              <Icon name="schedule" className="text-[14px] text-primary" />
                              <span>{recipe.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-space-md flex-1 flex flex-col justify-between gap-space-md">
                          <div className="space-y-space-xs">
                            <div className="flex items-center justify-between text-outline">
                              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-amber-700 font-semibold">
                                {recipe.category}
                              </span>
                              <span className="font-label-mono-sm text-[11px] text-outline">
                                {recipe.updatedAt}
                              </span>
                            </div>
                            <h2 className="font-title-md text-title-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                              {recipe.title}
                            </h2>
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 font-body-sm text-[12px] flex items-center gap-2">
                              <Icon
                                name="hourglass_top"
                                className="text-[16px] text-amber-700 shrink-0"
                              />
                              <span>{recipe.pendingNote}</span>
                            </div>
                          </div>

                          <div className="pt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant">
                            <Link
                              className="font-body-sm text-body-sm text-primary font-medium hover:underline flex items-center gap-1"
                              href={`/recipes/${recipe.id}`}
                            >
                              <Icon name="visibility" className="text-[16px]" /> Xem trước
                            </Link>
                            <div className="flex items-center gap-1">
                              <button
                                className="px-3 py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm font-medium hover:bg-surface-container-high transition-colors"
                                type="button"
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                className="px-3 py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-error hover:bg-error-container transition-colors"
                                type="button"
                              >
                                Rút duyệt
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  if (recipe.status === "draft") {
                    return (
                      <article
                        key={recipe.id}
                        className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group opacity-95"
                      >
                        <div className="p-space-sm pb-0 relative">
                          <div className="w-full h-52 rounded-xl overflow-hidden relative">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale-[25%]"
                            />
                            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-label-mono-sm font-semibold bg-stone-200 text-stone-700 shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
                              {recipe.statusText}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md text-on-surface font-label-mono-sm text-[12px] flex items-center gap-1.5 shadow-sm">
                              <Icon name="pending_actions" className="text-[14px] text-outline" />
                              <span>{recipe.draftProgress}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-space-md flex-1 flex flex-col justify-between gap-space-md">
                          <div className="space-y-space-xs">
                            <div className="flex items-center justify-between text-outline">
                              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-outline">
                                {recipe.category}
                              </span>
                              <span className="font-label-mono-sm text-[11px] text-outline">
                                {recipe.updatedAt}
                              </span>
                            </div>
                            <h2 className="font-title-md text-title-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                              {recipe.title}
                            </h2>
                            <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full rounded-full w-3/5"></div>
                            </div>
                            <p className="font-body-sm text-body-sm text-outline pt-1">
                              {recipe.draftMissing}
                            </p>
                          </div>

                          <div className="pt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant">
                            <button
                              className="font-body-sm text-body-sm text-error hover:underline flex items-center gap-1"
                              onClick={() => setRecipeToDelete(recipe.title)}
                              type="button"
                            >
                              <Icon name="delete" className="text-[16px]" /> Xóa nháp
                            </button>
                            <Link
                              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container shadow-sm transition-all flex items-center gap-1"
                              href="/recipes/new"
                            >
                              <span>Tiếp tục viết</span>
                              <Icon name="arrow_forward" className="text-[16px]" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  if (recipe.status === "rejected") {
                    return (
                      <article
                        key={recipe.id}
                        className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group border-l-4 border-error"
                      >
                        <div className="p-space-sm pb-0 relative">
                          <div className="w-full h-52 rounded-xl overflow-hidden relative">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-label-mono-sm font-semibold bg-rose-100 text-rose-800 shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                              {recipe.statusText}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md text-on-surface font-label-mono-sm text-[12px] flex items-center gap-1.5 shadow-sm">
                              <Icon name="priority_high" className="text-[14px] text-error" />
                              <span>Có 2 góp ý</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-space-md flex-1 flex flex-col justify-between gap-space-md">
                          <div className="space-y-space-xs">
                            <div className="flex items-center justify-between text-outline">
                              <span className="font-label-mono-sm text-[11px] uppercase tracking-wider text-error font-semibold">
                                {recipe.category}
                              </span>
                              <span className="font-label-mono-sm text-[11px] text-outline">
                                {recipe.updatedAt}
                              </span>
                            </div>
                            <h2 className="font-title-md text-title-md font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                              {recipe.title}
                            </h2>
                            <div className="p-2.5 rounded-xl bg-error-container/40 text-on-error-container font-body-sm text-[12px] space-y-1">
                              <p className="font-semibold flex items-center gap-1 text-error">
                                <Icon name="chat" className="text-[16px]" /> Góp ý của ban biên tập:
                              </p>
                              <p className="line-clamp-2">
                                &ldquo;{recipe.feedback}&rdquo;
                              </p>
                            </div>
                          </div>

                          <div className="pt-space-sm border-t border-surface-variant/40 flex items-center justify-between text-on-surface-variant">
                            <button
                              className="font-body-sm text-body-sm text-outline hover:text-on-surface flex items-center gap-1"
                              type="button"
                            >
                              <Icon name="info" className="text-[16px]" /> Chi tiết
                            </button>
                            <Link
                              className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container transition-all flex items-center gap-1"
                              href="/recipes/new"
                            >
                              <Icon name="edit_note" className="text-[16px]" /> Sửa theo góp ý
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  return null;
                })}
              </div>
            )}

            {/* DANH SÁCH CÔNG THỨC (TABLE VIEW) */}
            {viewMode === "table" && (
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant border-b border-surface-variant/40 font-semibold font-label-mono-sm text-[12px] uppercase tracking-wider">
                        <th className="py-3.5 px-space-md">Công thức</th>
                        <th className="py-3.5 px-space-md">Trạng thái</th>
                        <th className="py-3.5 px-space-md">Thời gian &amp; Khẩu phần</th>
                        <th className="py-3.5 px-space-md">Tương tác</th>
                        <th className="py-3.5 px-space-md">Đánh giá</th>
                        <th className="py-3.5 px-space-md text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-variant/30 text-on-surface">
                      {filteredRecipes.map((recipe) => (
                        <tr key={recipe.id} className="hover:bg-surface/50 transition-colors">
                          <td className="py-space-md px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-variant relative">
                                <Image
                                  src={recipe.image}
                                  alt={recipe.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-title-md text-[15px] font-bold text-on-surface hover:text-primary transition-colors cursor-pointer">
                                  {recipe.title}
                                </h3>
                                <p className="font-label-mono-sm text-[11px] text-outline">
                                  {recipe.category} • Cập nhật {recipe.updatedAt}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-label-mono-sm font-semibold ${
                                recipe.status === "published"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : recipe.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : recipe.status === "draft"
                                  ? "bg-stone-200 text-stone-700"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {recipe.statusText}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md font-label-mono-sm text-[12px] text-outline">
                            {recipe.time} {recipe.servings ? `• ${recipe.servings}` : ""}
                          </td>
                          <td className="py-space-md px-space-md font-label-mono-sm text-[12px]">
                            {recipe.bookmarksCount ? (
                              <div className="flex items-center gap-3 text-outline">
                                <span className="flex items-center gap-1 text-primary">
                                  <Icon name="bookmark" className="text-[14px]" />{" "}
                                  {recipe.bookmarksCount.toLocaleString("vi-VN")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Icon name="skillet" className="text-[14px]" />{" "}
                                  {recipe.cookedCount?.toLocaleString("vi-VN")}
                                </span>
                              </div>
                            ) : (
                              <span className="text-outline">Chưa công khai</span>
                            )}
                          </td>
                          <td className="py-space-md px-space-md font-label-mono-sm text-[13px] font-semibold text-primary">
                            {recipe.rating ? (
                              <>
                                {recipe.rating} ★{" "}
                                <span className="text-outline font-normal text-[11px]">
                                  ({recipe.reviewsCount})
                                </span>
                              </>
                            ) : (
                              <span className="text-outline font-normal">—</span>
                            )}
                          </td>
                          <td className="py-space-md px-space-md text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary"
                                title="Chỉnh sửa"
                                type="button"
                              >
                                <Icon name="edit" className="text-[18px]" />
                              </button>
                              <button
                                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary"
                                title="Nhân bản"
                                type="button"
                              >
                                <Icon name="content_copy" className="text-[18px]" />
                              </button>
                              <button
                                className="p-1.5 rounded-lg hover:bg-error-container/40 text-on-surface-variant hover:text-error"
                                onClick={() => setRecipeToDelete(recipe.title)}
                                title="Xóa"
                                type="button"
                              >
                                <Icon name="delete" className="text-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. THANH PHÂN TRANG (PAGINATION) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm pb-space-md">
              <p className="font-label-mono-sm text-label-mono-sm text-outline order-2 sm:order-1">
                Hiển thị <span className="font-semibold text-on-surface">1 - {filteredRecipes.length}</span> trên tổng số{" "}
                <span className="font-semibold text-on-surface">14</span> công thức
              </p>
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  className="w-9 h-9 rounded-xl bg-surface-container-high/50 text-outline/50 flex items-center justify-center cursor-not-allowed"
                  disabled={currentPage === 1}
                  type="button"
                >
                  <Icon name="chevron_left" className="text-[18px]" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`w-9 h-9 rounded-xl font-label-mono-sm text-[13px] font-semibold flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                    onClick={() => setCurrentPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  type="button"
                >
                  <Icon name="chevron_right" className="text-[18px]" />
                </button>
              </div>
            </div>

            {/* 7. BẢNG GỢI Ý & BÍ QUYẾT TĂNG TƯƠNG TÁC CHO TÁC GIẢ */}
            <section className="bg-gradient-to-r from-surface-container to-surface-container-low rounded-2xl p-space-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
                <div className="space-y-space-xs max-w-xl">
                  <div className="flex items-center gap-space-xs text-primary">
                    <Icon name="lightbulb" className="text-[20px]" />
                    <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider font-bold">
                      Bí quyết ẩm thực
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Làm sao để công thức của bạn được lên Trang chủ?
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Các món ăn được lựa chọn giới thiệu hàng tuần bởi ban biên tập RecipeHub luôn đạt chuẩn chất lượng hình ảnh và định lượng chi tiết.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md flex-1">
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold">
                      <Icon name="camera_alt" className="text-[18px]" />
                    </div>
                    <h3 className="font-title-md text-[14px] font-bold text-on-surface">
                      Ảnh ngang 16:9 sắc nét
                    </h3>
                    <p className="font-body-sm text-[12px] text-outline">
                      Chụp ở nơi có ánh sáng tự nhiên ban ngày, không chụp bóng mờ.
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary font-bold">
                      <Icon name="scale" className="text-[18px]" />
                    </div>
                    <h3 className="font-title-md text-[14px] font-bold text-on-surface">
                      Định lượng g / ml
                    </h3>
                    <p className="font-body-sm text-[12px] text-outline">
                      Tránh ghi chung chung &ldquo;nêm vừa ăn&rdquo; để người mới nấu không bị bối rối.
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface font-bold">
                      <Icon name="timer" className="text-[18px]" />
                    </div>
                    <h3 className="font-title-md text-[14px] font-bold text-on-surface">
                      Hẹn giờ từng bước
                    </h3>
                    <p className="font-body-sm text-[12px] text-outline">
                      Gắn đồng hồ bấm giờ chuẩn xác cho khâu ướp, ninh hầm hay xào nhanh.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 5. DIALOG XÁC NHẬN XÓA (CONFIRMATION MODAL) */}
          {recipeToDelete && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-space-md transition-opacity">
              <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl space-y-space-md animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-2xl bg-error-container text-error flex items-center justify-center">
                  <Icon name="delete_forever" className="text-[28px]" />
                </div>
                <div className="space-y-space-xs">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Xóa công thức nấu ăn?
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Bạn có chắc chắn muốn xóa công thức{" "}
                    <strong className="text-on-surface">&ldquo;{recipeToDelete}&rdquo;</strong>? Dữ liệu, hình ảnh và đánh giá từ cộng đồng liên quan đến món này sẽ không thể khôi phục.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                  <button
                    className="px-space-md py-2.5 rounded-xl font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
                    onClick={() => setRecipeToDelete(null)}
                    type="button"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className="px-space-lg py-2.5 rounded-xl bg-error text-on-error font-body-sm text-body-sm font-medium hover:bg-error/90 shadow-sm transition-all"
                    onClick={handleDeleteRecipe}
                    type="button"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
