"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { useFavorites } from "@/lib/context/favorites-context";
import { useShoppingList } from "@/lib/context/shopping-list-context";

interface FavoriteRecipe {
  id: string;
  title: string;
  categoryTag: string;
  difficultyTag: string;
  image: string;
  time: string;
  servings: string;
  calories: string;
  authorName: string;
  authorAvatarText: string;
  rating: number;
  reviewsCount: number;
  note?: string;
  collectionName?: string;
}

const FAVORITE_RECIPES: FavoriteRecipe[] = [
  {
    id: "ca-loc-kho-to",
    title: "Cá lóc kho tộ nước màu dừa Bến Tre",
    categoryTag: "Món mặn",
    difficultyTag: "Dễ nấu",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQIiW-vV668HOpqJr1qgACSHyA9BXjNvP12m3EQ6xYHIQ9DaVP2EaQBM4F84AQdRiXCLbiDi6HYF6Cft2kYx2kvIYgG63EpK0y259GRyLe8cgcwlWfzBCsuVkVqbsz7lGNrZdJ2_x0xa-tuvaOG5wisVteglQWNFqYEXODf5BE6kFvR0O0HKM09-TOSjuzxl9676TyE63QRyq7CdqJ_gqL3YkJrfEObjab9qF3wvGY",
    time: "35 phút",
    servings: "4 người ăn",
    calories: "340 kcal",
    authorName: "Bếp Mẹ Ba",
    authorAvatarText: "MB",
    rating: 4.9,
    reviewsCount: 184,
    note: "Mẹ dặn cho thêm chút tiêu sọ đập dập cuối bữa và để lửa riu riu cho thấm.",
  },
  {
    id: "canh-chua-ca-loc",
    title: "Canh chua cá lóc miền Tây chuẩn vị",
    categoryTag: "Canh & Tiềm",
    difficultyTag: "Dễ nấu",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqMX01eIVFd1fedR0vRV1DHkkMHzwpwF_Hl8zhGQb4-V9ecGaV5e14AX9xGX8lEUcVBoNSZhWdkWvk0e9lpAbH-brrDO1d5DDmByzp6bfOOmNWjjLYfiFa4xk3oWBx1V4649l1HjxMCh6rCMZpWXWJ6p6Emi67zMjxRq4kDMcrqCIb_HOZCpK3n03EKAKZmfpWDGTRyPNsuLyZeX-MT0Hqt0z2ZCDKtZ8HZViuZEB3",
    time: "30 phút",
    servings: "4 người ăn",
    calories: "210 kcal",
    authorName: "Bếp Mẹ Ba",
    authorAvatarText: "MB",
    rating: 4.8,
    reviewsCount: 96,
    collectionName: "Mâm cơm Nam Bộ",
  },
  {
    id: "bun-cha-quat-ha-noi",
    title: "Bún chả quạt Hà Nội nước mắm ấm",
    categoryTag: "Món nướng & Bún",
    difficultyTag: "Độ khó vừa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADsDlG_to41PVmgRZkQ6MZdd3gBxUHuz8br1d0ccIqFS-8C96fLqgf6wRQK9qXFiD6QALVsinW4aFMNS3fJgDGQGwZRML0RMWlmj2AKp8sHPwXVu3rZCvKbH_gonGHjF8E1pmdp5ybpeX_IgmIkO4yO2dm9UCwW-SUphhOsNmO5QT4wNg68Phy6uFaVd2m19GbXqVYhsjky8oeKdlAy2C2zfElMEKdW3CxhLm1MWpe",
    time: "45 phút",
    servings: "4 người ăn",
    calories: "520 kcal",
    authorName: "Bếp Cô Lan",
    authorAvatarText: "CL",
    rating: 4.9,
    reviewsCount: 210,
    note: "Nướng than hoa hai mặt thơm vàng, nước mắm giữ ấm trước khi chan.",
  },
  {
    id: "thit-kho-hot-vit",
    title: "Thịt kho hột vịt nước dừa xiêm béo mềm",
    categoryTag: "Món kho",
    difficultyTag: "Độ khó vừa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmLuPed58sCh6tTnr4G2vraJv2r-tzfG1Jxf_PuJQeoGc9l09VUMUa6933JCXtmHBf_J0iHg9wZxpI8PQ0MCUyNH6h7lBhvHzTACXG1U9zsVp9H4-1p79TjXScpE7ZsNqBUw9FE60EPs8V-UaW9DPDCHoA49bO1ao1YKaifJKIIoaRYC4E9OSEzkiEvYJefmILAr1FsfCEGrr0FcGMLdua_ywg2KtTj3wLVy63HbaZ",
    time: "60 phút",
    servings: "6 người ăn",
    calories: "480 kcal",
    authorName: "Bếp Mẹ Ba",
    authorAvatarText: "MB",
    rating: 4.9,
    reviewsCount: 140,
    collectionName: "Món kho kẹo đưa cơm",
  },
  {
    id: "goi-cuon-tom-thit",
    title: "Gỏi cuốn tôm thịt chấm tương đậu phộng",
    categoryTag: "Món cuốn",
    difficultyTag: "Rất dễ",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs4OebX_F-JnCtMCvTuyx1OvyZtmX8KgTcGzKjDi8Y8GBSxy2WUowCgnJBA83hvgKG7EI3LMZ-zdi3Ym9gj8R-0Tki7uFkGaiCSyQIPjdiCWmhdzeaCHvaAs1vbOOYK3W9UW3QrnFaybq3tBAbtq-6nY1ADWUx7lBnaR8ZdXSn3vBKg4xMpPtO6s7XuTlu_ZVnhOc01X1T1s6HQXo_Xj0owMo03WSihj68Pd4WnXs8",
    time: "20 phút",
    servings: "4 người ăn",
    calories: "190 kcal",
    authorName: "Bếp Chú Năm",
    authorAvatarText: "CN",
    rating: 4.8,
    reviewsCount: 75,
    note: "Pha tương đen với bơ đậu phộng đun ấm, thêm ớt hiểm băm nhuyễn.",
  },
  {
    id: "che-thung-nuoc-cot-dua",
    title: "Chè thưng nước cốt dừa hạt sen bùi béo",
    categoryTag: "Tráng miệng & Chè",
    difficultyTag: "Dễ nấu",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbxm3wVEz3iY215_jgRJuLjLSE48RVOIqGCVBvYSpu1_v3IayKukORea4gId_JuU4d0ZlHcq5kTVbvDsXBPE4Ai4pMzjq4REi1CDCdpwfrSdrttSLiP3E4nyq5_CpQbMlxYDs22fnp8NZisfMTzWLbFVKLGpJaYchMqqltrAUWQ0WPe1_0YES6drEQr1G0NTuQgU42SZ3LeIUDZ46hRfbw_8yF4uctODK4B7w-PKpi",
    time: "40 phút",
    servings: "6 người ăn",
    calories: "290 kcal",
    authorName: "Bếp Mẹ Ba",
    authorAvatarText: "MB",
    rating: 4.9,
    reviewsCount: 115,
    collectionName: "Món ngon đãi khách",
  },
];

export default function FavoritesPage() {
  const { favoriteItems, collections, addCollection, removeFavorite } = useFavorites();
  const { addIngredientsFromRecipe } = useShoppingList();

  const [showGuestBanner, setShowGuestBanner] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"all" | "collections" | "recent" | "planned">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [timeFilter, setTimeFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("recent");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState("");
  const [newCollectionDesc, setNewCollectionDesc] = React.useState("");
  const [newCollectionPrivacy, setNewCollectionPrivacy] = React.useState("public");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    addCollection(newCollectionName.trim());
    setIsModalOpen(false);
    showToast(`Đã tạo bộ sưu tập "${newCollectionName}" thành công!`);
    setNewCollectionName("");
    setNewCollectionDesc("");
  };

  const displayedFavorites = React.useMemo(() => {
    return favoriteItems
      .filter((item) => {
        if (activeTab === "collections" && !item.collectionName) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.recipe.title.toLowerCase().includes(q);
          const matchAuthor = item.recipe.author.name.toLowerCase().includes(q);
          const matchNote = item.note?.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchNote) return false;
        }
        if (selectedCategory !== "all") {
          if (selectedCategory === "man" && item.recipe.category !== "kho-rim" && item.recipe.category !== "xao") return false;
          if (selectedCategory === "canh" && item.recipe.category !== "canh-sup") return false;
          if (selectedCategory === "cuon" && item.recipe.category !== "bun-pho" && item.recipe.category !== "nuong") return false;
          if (selectedCategory === "trangmieng" && item.recipe.category !== "trang-mieng") return false;
        }
        const totalMinutes = item.recipe.prepTimeMinutes + item.recipe.cookTimeMinutes;
        if (timeFilter === "under30" && totalMinutes > 30) return false;
        if (timeFilter === "30to60" && (totalMinutes < 30 || totalMinutes > 60)) return false;
        if (timeFilter === "over60" && totalMinutes < 60) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "alpha") return a.recipe.title.localeCompare(b.recipe.title, "vi");
        if (sortBy === "rating") return b.recipe.rating - a.recipe.rating;
        if (sortBy === "quickest") {
          return (
            a.recipe.prepTimeMinutes +
            a.recipe.cookTimeMinutes -
            (b.recipe.prepTimeMinutes + b.recipe.cookTimeMinutes)
          );
        }
        return 0;
      });
  }, [favoriteItems, activeTab, searchQuery, selectedCategory, timeFilter, sortBy]);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* TOP CONTEXT & GUEST STORAGE BANNER */}
          <div className="w-full px-margin-mobile lg:px-margin pt-space-md pb-space-lg">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mb-space-sm"
            >
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <Icon name="home" className="text-[18px]" />
                <span>Trang chủ</span>
              </Link>
              <Icon name="chevron_right" className="text-[16px] text-outline" />
              <Link className="hover:text-primary transition-colors" href="/my-recipes">
                Gian bếp của tôi
              </Link>
              <Icon name="chevron_right" className="text-[16px] text-outline" />
              <span aria-current="page" className="text-on-surface font-semibold">
                Yêu thích &amp; Bộ sưu tập
              </span>
            </nav>

            {/* Guest Storage Notice Banner */}
            {showGuestBanner && (
              <div
                className="w-full mb-space-lg bg-surface-container-high rounded-xl p-space-md shadow-sm transition-all duration-300"
                id="guest-sync-banner"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
                  <div className="flex items-start sm:items-center gap-space-md">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5 sm:mt-0">
                      <Icon name="cloud_sync" className="text-[22px]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          Chế độ lưu trữ nội bộ (LocalStorage)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px] font-semibold">
                          An toàn
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Dữ liệu đang được lưu an toàn trên trình duyệt này. Hãy đăng nhập để tự động
                        sao lưu và đồng bộ danh bạ món lên điện thoại hoặc máy tính bảng khi đi chợ.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm w-full sm:w-auto shrink-0 justify-end">
                    <button
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-space-md py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium shadow-md hover:bg-primary-container active:scale-[0.98] transition-all"
                      onClick={() => showToast("Chuyển tới đăng nhập...")}
                      type="button"
                    >
                      <Icon name="sync" className="text-[18px]" />
                      <span>Đăng nhập để đồng bộ</span>
                    </button>
                    <button
                      aria-label="Đóng thông báo"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
                      onClick={() => setShowGuestBanner(false)}
                      type="button"
                    >
                      <Icon name="close" className="text-[20px]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Page Header & Action Controls */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg pb-space-lg">
              <div className="max-w-3xl space-y-space-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold tracking-wide uppercase">
                  <Icon name="bookmark_heart" className="text-[16px] text-primary" />
                  <span>Kho báu hương vị cá nhân</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Yêu thích &amp; Bộ sưu tập
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Lưu giữ những món ngon bạn tâm đắc, phân loại thành từng thực đơn và bộ sưu tập để
                  dễ dàng chuẩn bị bữa cơm gia đình mỗi ngày mà không phải đắn đo &ldquo;Hôm nay ăn
                  gì?&rdquo;.
                </p>

                {/* Quick Statistics Ribbon */}
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs text-on-surface">
                  <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-1.5 rounded-full shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="font-label-mono-sm text-label-mono-sm font-semibold text-primary">
                      {favoriteItems.length}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Món yêu thích
                    </span>
                  </div>
                  <span className="text-outline-variant font-label-mono-sm">•</span>
                  <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-1.5 rounded-full shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="font-label-mono-sm text-label-mono-sm font-semibold text-secondary">
                      {collections.length}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Bộ sưu tập chủ đề
                    </span>
                  </div>
                  <span className="text-outline-variant font-label-mono-sm">•</span>
                  <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-1.5 rounded-full shadow-sm">
                    <Icon name="schedule" className="text-[16px] text-outline" />
                    <span className="font-label-mono-sm text-label-mono-sm font-semibold text-tertiary">
                      {favoriteItems.reduce((acc, f) => acc + (f.recipe.prepTimeMinutes + f.recipe.cookTimeMinutes), 0)} phút
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Nấu dự kiến
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Cluster */}
              <div className="flex flex-wrap items-center gap-space-sm shrink-0">
                <button
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-sm hover:bg-surface-container transition-all"
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                >
                  <Icon name="create_new_folder" className="text-[20px] text-primary" />
                  <span>Tạo bộ sưu tập mới</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium shadow-sm hover:bg-surface-container transition-all"
                  onClick={() => showToast("Đã sao chép liên kết chia sẻ danh sách!")}
                  type="button"
                >
                  <Icon name="share" className="text-[20px] text-tertiary" />
                  <span>Chia sẻ danh sách</span>
                </button>
                <Link
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-medium shadow-md hover:bg-primary-container transition-all"
                  href="/meal-planner"
                >
                  <Icon name="calendar_add_on" className="text-[20px]" />
                  <span>Lên lịch tuần này</span>
                </Link>
              </div>
            </div>

            {/* TABS NAVIGATION */}
            <div className="w-full bg-surface-container-low rounded-2xl p-1.5 mb-space-xl shadow-inner">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                <button
                  className={`flex items-center justify-center gap-2 py-3 px-space-md rounded-xl transition-all ${
                    activeTab === "all"
                      ? "bg-surface-container-lowest text-primary shadow-sm font-title-md text-title-md font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-md text-body-md font-medium"
                  }`}
                  onClick={() => setActiveTab("all")}
                  type="button"
                >
                  <Icon name="favorite" className="text-[22px] text-primary" />
                  <span className="truncate">Tất cả món yêu thích (42)</span>
                </button>
                <button
                  className={`flex items-center justify-center gap-2 py-3 px-space-md rounded-xl transition-all ${
                    activeTab === "collections"
                      ? "bg-surface-container-lowest text-primary shadow-sm font-title-md text-title-md font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-md text-body-md font-medium"
                  }`}
                  onClick={() => setActiveTab("collections")}
                  type="button"
                >
                  <Icon name="folder_special" className="text-[20px]" />
                  <span className="truncate">Bộ sưu tập của tôi (5)</span>
                </button>
                <button
                  className={`flex items-center justify-center gap-2 py-3 px-space-md rounded-xl transition-all ${
                    activeTab === "recent"
                      ? "bg-surface-container-lowest text-primary shadow-sm font-title-md text-title-md font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-md text-body-md font-medium"
                  }`}
                  onClick={() => setActiveTab("recent")}
                  type="button"
                >
                  <Icon name="history_edu" className="text-[20px]" />
                  <span className="truncate">Đã nấu gần đây (8)</span>
                </button>
                <button
                  className={`flex items-center justify-center gap-2 py-3 px-space-md rounded-xl transition-all ${
                    activeTab === "planned"
                      ? "bg-surface-container-lowest text-primary shadow-sm font-title-md text-title-md font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-body-md text-body-md font-medium"
                  }`}
                  onClick={() => setActiveTab("planned")}
                  type="button"
                >
                  <Icon name="event_upcoming" className="text-[20px]" />
                  <span className="truncate">Dự định nấu tuần này (6)</span>
                </button>
              </div>
            </div>

            {/* SECTION: FEATURED COLLECTIONS SHELF */}
            <div className="w-full mb-space-xl">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                    Bộ sưu tập món ngon tuyển chọn
                  </h2>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary bg-surface-container-high px-2 py-0.5 rounded-full">
                    5 Thư mục
                  </span>
                </div>
                <Link
                  className="inline-flex items-center gap-1 font-body-sm text-body-sm font-semibold text-primary hover:text-primary-container transition-colors"
                  href="#"
                >
                  <span>Xem tất cả bộ sưu tập</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
              </div>

              {/* Horizontal Grid of Collection Folders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
                {/* Collection Card 1 */}
                <div className="group bg-surface-container-lowest rounded-2xl p-3 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Triple Photo Composite Cover */}
                    <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-surface-container">
                      <div className="col-span-2 row-span-2 relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9u_cu3zG25p289EFV2L2F9lhhdZ9StIhQ0INAu8vnz4ySobYl11VbKHu9jeD0IMRKv7cEWtckF58s6VWGwz4mhKCYdt6dYKal1pR8jJVtTJr1ggxQPj5biX8Q4xjqF2JrdQp93OZyxXJ8hDDg03zuo6QapOL9YjSdQ8lPKmZPnT2CTpejrH-_6LqmGnWcy3vvRjFN1BdoU11bl5i01xGWMLjHrNCHtMesHTpJEByW"
                          alt="Cá kho tộ"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="grid grid-rows-2 gap-1 col-span-1">
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Izr3_0qUAwjeYfPtTH3fqowEPtqd1IJ4nCaZZVTR-XfJUvmKfP82fEdPZaItbpWFBqDiBp2_CZ5nr1PPMu6N7Djt2w14x3tDb4TlHfFj5JJ5bV6a1oUxqEFSrYxAZysChn52YifWRMqtGFHRNlTWhff8u-k_ocvcLrsGLEFCZx1BrH2mCxlx95Q3S71O9OqVyaFKXMd5gtpGDz9bS94DJNCxB-yljztkJ-J4Lzxb"
                            alt="Canh chua cá lóc"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB71hPYYiMDGqQtroA0Lv8PcxdohMdFXuFJyFLedDBwP5yb4g9IVEvXFsgXCmhjNEX7T31sGUrg0AFQ_ui5rP6lJhhcB2yaqCQzLcn0UCKsHQlEQxlyqnjYMoYkBHNJA8dszagfnXTupWx9Uk0Pa-twbuYJ_jnOSKDSJ_UtPpSyDmq7bysDqe5I4U5i3P8d6mrebLaTfnmixa2yHxnga4KyuzbYTofiWAq0ktjdD1Y3"
                            alt="Tôm rim mặn ngọt"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold">
                        <Icon name="public" className="text-[13px]" /> Đã chia sẻ
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">
                        12 món
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      Mâm cơm Nam Bộ cuối tuần
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                      Đậm vị phù sa, cá kho tộ kèm canh chua bông điên điển ấm nồng.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-none flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-mono-sm text-[11px] text-tertiary">
                      Cập nhật 2 ngày trước
                    </span>
                    <Icon
                      name="folder_open"
                      className="text-[18px] text-outline group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Collection Card 2 */}
                <div className="group bg-surface-container-lowest rounded-2xl p-3 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-surface-container">
                      <div className="col-span-2 row-span-2 relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE6z6LrN7kkvOtrusFgoqas_6PqaDNiqs7XBn-LBPTkshs8DDosRf9-lrJ-73Lr8XlLiB6OZQ9mcgLCk5BbzJE8MDuxdyjVmyglynbFQapDC6s9GdpromNeM0n0oN9SlsvZzyWEUHhyoUnd3DPSYj6jZuE3quZjifs0C2qQZdgn50YEL15BxWqBaAXLzUhWV3AHXh4Dy48OseCQwiNtyu5icnGkjFRGAXydYH__m6u"
                          alt="Bún mọc"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="grid grid-rows-2 gap-1 col-span-1">
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn4ewzTryIz_JC9zXujBtrXMj45kPoZ-LGrjt1oPnDg9VsBCvr5lf5Z-oxi9uH16XNTHw_VY0L5i8pkHccWUbvW14Uh5ELVocvlUISBZUYuO-BIlKHYbUpN7HL6tfZgYsSXJ1bqkMqkF24nmGkYvVMwTIOdjOYORSDqmoXMOPD4T7FEZTz3IZs1WDyqfM5LwlcnsnP-w9xAH3p3BVtAa3esAkqDWRhucRMAg-dkIUP"
                            alt="Bánh mì"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJfuNcnXC-utVOkM1uiXZcD7V3xENeC4rIr2qnyt8c82BzP_4hY_uVQ2-tvXP2w4-lPSoLrO-rGCcy5Zq5WnehJEAoddsZGM1nXdaX_R2yMHizi9oqAmcPoy3Yqp7GC4TjxlVtFztKiLjJ2qvxJBkSZuwpH3hJCBOFpiF2HeL86xUKnpNIq2irnB9q0ra13nCr4MQBsk3v_aN-wNrgHWyvOWfhERKh-TvDO31RUdvi"
                            alt="Phở bò tái"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-[11px] font-semibold">
                        <Icon name="lock" className="text-[13px]" /> Riêng tư
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">
                        8 món
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      Nhanh dưới 20 phút cho sáng
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                      Các món điểm tâm tốc hành, đủ năng lượng cho cả ngày bận rộn.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-none flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-mono-sm text-[11px] text-tertiary">
                      Cập nhật hôm qua
                    </span>
                    <Icon
                      name="folder_open"
                      className="text-[18px] text-outline group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Collection Card 3 */}
                <div className="group bg-surface-container-lowest rounded-2xl p-3 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-surface-container">
                      <div className="col-span-2 row-span-2 relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2-mmy3dIEQO5P8Za7J19O4QaWh4uNIGpyCf23e6Ll3gbE0IEvO2fDrdrVMRZ3E2HZ8dvqFtf5XxOjx3O9Z7-ziDmiC0VivANUQAgeZ4i6dI1ig9Vvb1_RTK8XGAt5IqckrDvHzMNDb8XguFoL2nHpIDd4bpCU5S3OGVX0qtQQDGJMfUPrA8RTGSS-BYM05tfX71VCAGE_Ae68wXyQ_c7esmOqmSam3zKIjuV1z5tn"
                          alt="Canh cua"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="grid grid-rows-2 gap-1 col-span-1">
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6u_yKBLdwT4VFcL5ndClX5HRq3avQstLbn4id3-7tDs1rW7a6Uo5ZTFq3foINd74UFkZTMyPE7Y6_FS72VDxaPPKPnxXdfjyoW9lzJ8zF4Qv6SSJLvjWRpuebx_kkmf_7gIsB2YI61WSTcYXZl85cL1PhkD6CNMQWHDkxwSglU0A5OkfXxRp49Y1FAcwPlnn5F7CuXuidLEL1eaIXNFGOqwNoSHR5uh1tst92rzpX"
                            alt="Chè hạt sen"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDON24_Ki7kh_76MupnwGjSVq-lNh8zbhbNE4iSNOiQbL8P1ir9k9rbBSwCfaSqDeFDMWZViv83udoTY3uH-MdE9JBIW676QWxp7ituvqdpiTHvhqO7PtoqR7b4vR8Gf1bimb2SZxSjev00a0OcwyOv4HK_vfbraY_E4V4VtqUDUEzc3YyyVx0b08CKixn8TYZTOsVZkOqiO7cxqxDEI4Dzq0Rc3E96Tpo-q8Mpmp1L"
                            alt="Gỏi cuốn"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] font-semibold">
                        <Icon name="public" className="text-[13px]" /> Công khai
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">
                        9 món
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      Thực đơn giải nhiệt mùa hè
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                      Canh cua đồng mát ruột, gỏi tôm chua ngọt nhẹ bụng thanh nhiệt.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-none flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-mono-sm text-[11px] text-tertiary">
                      Cập nhật 4 ngày trước
                    </span>
                    <Icon
                      name="folder_open"
                      className="text-[18px] text-outline group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Collection Card 4 */}
                <div className="group bg-surface-container-lowest rounded-2xl p-3 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-surface-container">
                      <div className="col-span-2 row-span-2 relative">
                        <Image
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd0IxHi_n7OS08o-vlbv5Gq4W-mLBv50PvHuhHgWNVCLFDRZyh5H4guHR9qzaTjF_Qwn1OkXRye2og1P6narlGV2ixWnPaozb36fdo4r530uL1SQnMJ6xSUuQ_5OsowZDbfmdSwDx6HA_K4phESKVSheYud1QZkCK446TFyZ_ukYFQS8zDp97ETff7BRCCxFnDdfXaOpRBTSblUVWs6AqPNF9bVsCd1D7KnZBJ3Z5t"
                          alt="Thịt kho tàu"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="grid grid-rows-2 gap-1 col-span-1">
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkQPNg3Rn42nFBlcG0-Sgorp1qlrJFvD5B9PkISMlEtkhCexMYeY_XJjtADHFYfIwT45m8B6uCIAYO99Rg8mT2LN4D2q6ZwosLlk6Ek356p1IrzCF4-0vZ5akvswQCQ0ZlSLGxYoXHaXnsczWKEhMGvg-1-xSmoO33qHwPB6bK42wJvn9argQiD3BoWcdnkJ7wuWNMNwjOzU3MGBEnisMFbcNtV9ktypetfauH3ZEe"
                            alt="Cá bống kho"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpokR3tIHdz-9R1OlFhWFvtj8FADgdWXQJddgv3TRFd8SzSYiNFHES1GHSsNZ1fdCTMFvDyVWVf-IUPjxWIzra6YaBCLi8xPEg7DgxNRzQQxquatBZP578aQIcYwQuNGErTUl4B08FZq6vShfmv1A8ZdOhRZnAkasCTYTRuCIkO9RAgtXrUu7YlFCx6TjVqqI0B_AaaIf_LUs71AJ9BwexVY04xx6seH-7gtZ6TIcp"
                            alt="Đậu hũ kho"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-[11px] font-semibold">
                        <Icon name="lock" className="text-[13px]" /> Riêng tư
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">
                        7 món
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      Bí quyết món kho kẹo đưa cơm
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                      Hương thơm nước màu dừa, tiêu sọ cay nồng sánh quyện hạt cơm trắng.
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-none flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-mono-sm text-[11px] text-tertiary">
                      Cập nhật 1 tuần trước
                    </span>
                    <Icon
                      name="folder_open"
                      className="text-[18px] text-outline group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Add New Collection Card (Dashed Slot) */}
                <button
                  className="group relative bg-surface-container-low rounded-2xl p-6 shadow-sm hover:bg-surface-container hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-3 shadow-inner">
                    <Icon name="add_circle" className="text-[30px]" />
                  </div>
                  <span className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Tạo bộ sưu tập mới
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-[180px]">
                    Gom các món theo sở thích, tiệc gia đình hoặc thực đơn riêng
                  </p>
                </button>
              </div>
            </div>

            {/* FILTER & SEARCH CONTROL TOOLBAR */}
            <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-md mb-space-lg space-y-space-md">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
                {/* Search Input */}
                <div className="relative flex-1 max-w-xl">
                  <Icon
                    name="search"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                  />
                  <input
                    className="w-full pl-11 pr-20 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary/30 transition-all shadow-inner"
                    placeholder="Tìm nhanh trong 42 món yêu thích (tên món, nguyên liệu, tác giả)..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-[11px] pointer-events-none">
                    <span>Ctrl</span>
                    <span>K</span>
                  </div>
                </div>

                {/* Filter Sub-Controls & View Modes */}
                <div className="flex flex-wrap items-center gap-space-sm justify-between lg:justify-end">
                  {/* Cooking Time Filter */}
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-xl text-on-surface font-body-sm text-body-sm">
                    <Icon name="timer" className="text-outline text-[18px]" />
                    <select
                      className="bg-transparent text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer pr-2"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    >
                      <option value="all">Thời gian: Mọi mức độ</option>
                      <option value="under30">&lt; 30 phút (Nhanh gọn)</option>
                      <option value="30to60">30 - 60 phút (Cơm nhà)</option>
                      <option value="over60">&gt; 60 phút (Ninh kho kỹ)</option>
                    </select>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-xl text-on-surface font-body-sm text-body-sm">
                    <Icon name="sort" className="text-outline text-[18px]" />
                    <select
                      className="bg-transparent text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer pr-2"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="recent">Sắp xếp: Mới lưu gần đây</option>
                      <option value="alpha">Tên món A - Z</option>
                      <option value="rating">Đánh giá cao nhất (★)</option>
                      <option value="quickest">Nấu nhanh nhất trước</option>
                    </select>
                  </div>

                  {/* Grid/List View Toggles */}
                  <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
                    <button
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        viewMode === "grid"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setViewMode("grid")}
                      title="Chế độ lưới"
                      type="button"
                    >
                      <Icon name="grid_view" className="text-[20px]" />
                    </button>
                    <button
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        viewMode === "list"
                          ? "bg-surface-container-lowest text-primary shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setViewMode("list")}
                      title="Chế độ danh sách"
                      type="button"
                    >
                      <Icon name="view_list" className="text-[20px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories / Filter Pills Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                <span className="font-label-mono-sm text-[11px] text-outline uppercase tracking-wider shrink-0 pr-1">
                  Danh mục:
                </span>
                {[
                  { id: "all", label: `Tất cả (${favoriteItems.length})` },
                  { id: "man", label: "Món kho & mặn" },
                  { id: "canh", label: "Canh & Tiềm" },
                  { id: "cuon", label: "Món cuốn & bún" },
                  { id: "trangmieng", label: "Tráng miệng" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    className={`px-3.5 py-1.5 rounded-full font-body-sm text-body-sm whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-primary text-on-primary font-semibold shadow-sm"
                        : "bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-medium"
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                    type="button"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN FAVORITE RECIPES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg mb-space-xl">
              {displayedFavorites.length === 0 ? (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Icon name="favorite_border" size={32} />
                  </div>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Chưa có món ăn nào trong mục này</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-1 mb-6">
                    Hãy khám phá thư viện công thức và nhấn vào biểu tượng trái tim để lưu lại những món ngon bạn yêu thích.
                  </p>
                  <Link
                    href="/recipes"
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-colors shadow-sm"
                  >
                    Khám phá công thức ngay
                  </Link>
                </div>
              ) : (
                displayedFavorites.map((item) => {
                  const recipe = item.recipe;
                  return (
                    <div
                      key={item.id}
                      className="group bg-surface-container-lowest rounded-3xl p-3.5 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Visual & Overlay Badges */}
                        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-space-sm bg-surface-container">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur text-primary font-label-mono-sm text-[11px] font-semibold shadow-sm">
                              {recipe.categoryName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px] font-semibold">
                              {recipe.difficulty}
                            </span>
                          </div>

                          {/* Favorite Active Heart Button */}
                          <button
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/95 backdrop-blur flex items-center justify-center text-primary shadow-md hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => {
                              removeFavorite(item.recipeId);
                              showToast(`Đã bỏ "${recipe.title}" khỏi yêu thích`);
                            }}
                            title="Bỏ khỏi yêu thích"
                            type="button"
                          >
                            <Icon name="favorite" filled size={20} className="text-primary" />
                          </button>

                          {/* Prep metadata strip */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-inverse-surface/80 backdrop-blur text-inverse-on-surface font-label-mono-sm text-[11px]">
                            <span className="flex items-center gap-1">
                              <Icon name="timer" className="text-[14px]" /> {recipe.totalTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="group" className="text-[14px]" /> {recipe.servings} người
                            </span>
                            <span className="flex items-center gap-1 text-primary-fixed-dim font-semibold">
                              <Icon name="local_fire_department" className="text-[14px]" />{" "}
                              {recipe.calories} kcal
                            </span>
                          </div>
                        </div>

                        {/* Content Details */}
                        <div className="space-y-space-xs px-1">
                          <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                                {recipe.author.avatarText}
                              </div>
                              <span className="text-on-surface font-medium">{recipe.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-primary font-semibold font-label-mono-sm text-label-mono-sm">
                              <Icon name="star" filled className="text-[16px] text-amber-500" />
                              <span>{recipe.rating}</span>
                              <span className="text-outline font-normal">({recipe.reviewsCount})</span>
                            </div>
                          </div>

                          <Link href={`/recipes/${recipe.id}`}>
                            <h3 className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                              {recipe.title}
                            </h3>
                          </Link>

                          {/* Private Cook's Sticky Note or Collection Belonging Tag */}
                          {item.note && (
                            <div className="p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2 text-on-surface-variant text-[13px] leading-relaxed">
                              <Icon name="edit_note" className="text-[16px] text-primary shrink-0 mt-0.5" />
                              <p className="italic text-on-surface font-body-sm">
                                <span className="font-semibold not-italic text-primary">Ghi chú bếp:</span>{" "}
                                &ldquo;{item.note}&rdquo;
                              </p>
                            </div>
                          )}

                          {item.collectionName && (
                            <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2 text-on-surface-variant text-[13px]">
                              <Icon name="folder_special" className="text-[16px] text-secondary" />
                              <span className="font-body-sm text-body-sm">
                                Thuộc bộ sưu tập:{" "}
                                <strong className="text-on-surface">{item.collectionName}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-space-md mt-space-sm px-1 border-none flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1">
                          <Link
                            className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium transition-colors"
                            href="/meal-planner"
                            title="Thêm vào kế hoạch bữa ăn"
                          >
                            <Icon name="calendar_month" className="text-[16px] text-primary" />
                            <span className="truncate">Kế hoạch tuần</span>
                          </Link>
                          <button
                            className="inline-flex items-center justify-center py-2 px-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                            onClick={() => {
                              addIngredientsFromRecipe(recipe.title, recipe.ingredients);
                              showToast(`Đã thêm ${recipe.ingredients.length} nguyên liệu của "${recipe.title}" vào giỏ đi chợ!`);
                            }}
                            title="Thêm vào danh sách mua sắm"
                            type="button"
                          >
                            <Icon name="add_shopping_cart" className="text-[16px] text-secondary" />
                          </button>
                        </div>
                        {/* More dropdown button */}
                        <Link
                          href={`/recipes/${recipe.id}/cook`}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          title="Vào chế độ nấu"
                        >
                          <Icon name="outdoor_grill" className="text-[18px]" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* QUICK SYNC & MEAL PLANNING ACTION DOCK */}
            <div className="w-full bg-gradient-to-r from-surface-container-high via-surface-container-lowest to-surface-container-low rounded-3xl p-space-lg shadow-md mb-space-xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-space-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                    <Icon name="checklist_rtl" className="text-[32px]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Đi chợ nhanh cho mâm cơm yêu thích
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-[11px] font-semibold">
                        Tiện ích thông minh
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                      Tự động gộp nguyên liệu của 3 món đã chọn (Cá lóc kho tộ, Canh chua cá lóc,
                      Gỏi cuốn) và tối ưu hóa theo quầy sạp chợ truyền thống.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm shrink-0 w-full lg:w-auto justify-end">
                  <Link
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-space-lg py-3 rounded-xl bg-secondary text-on-secondary font-body-md text-body-md font-semibold shadow-md hover:bg-secondary/90 transition-all"
                    href="/shopping-list"
                  >
                    <Icon name="add_shopping_cart" className="text-[20px]" />
                    <span>Gộp vào Danh sách mua sắm (14 nguyên liệu)</span>
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-surface-container text-on-surface font-body-md text-body-md font-medium hover:bg-surface-container-highest transition-colors"
                    href="/recipes"
                  >
                    <span>Tùy chỉnh chọn món</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* PAGINATION & METRIC FOOTER */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md pb-space-lg">
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Hiển thị <span className="font-semibold text-on-surface">{displayedFavorites.length}</span> trên tổng số{" "}
                <span className="font-semibold text-on-surface">{favoriteItems.length}</span> món đã lưu
              </p>
              <nav aria-label="Phân trang công thức" className="flex items-center gap-1.5">
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
                  disabled
                  type="button"
                >
                  <Icon name="chevron_left" className="text-[20px]" />
                </button>
                <button
                  className="w-9 h-9 rounded-xl bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold shadow-sm"
                  type="button"
                >
                  1
                </button>
                <button
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-mono-sm text-label-mono-sm font-medium transition-colors"
                  type="button"
                >
                  2
                </button>
                <button
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-mono-sm text-label-mono-sm font-medium transition-colors"
                  type="button"
                >
                  3
                </button>
                <span className="w-7 text-center font-label-mono-sm text-outline">...</span>
                <button
                  className="w-9 h-9 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-mono-sm text-label-mono-sm font-medium transition-colors"
                  type="button"
                >
                  7
                </button>
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                  type="button"
                >
                  <Icon name="chevron_right" className="text-[20px]" />
                </button>
              </nav>
            </div>
          </div>

          {/* MODAL / DIALOG COMPONENT: CREATE NEW COLLECTION */}
          {isModalOpen && (
            <div
              aria-labelledby="modal-title"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm"
              role="dialog"
            >
              <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl p-space-lg shadow-2xl space-y-space-md animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shadow-inner">
                      <Icon name="create_new_folder" className="text-[24px]" />
                    </div>
                    <div>
                      <h3
                        className="font-headline-sm text-headline-sm text-on-surface font-bold"
                        id="modal-title"
                      >
                        Tạo bộ sưu tập mới
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Gom các món yêu thích thành từng thực đơn riêng
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    <Icon name="close" className="text-[20px]" />
                  </button>
                </div>

                {/* Form Inputs */}
                <form className="space-y-space-md" onSubmit={handleCreateCollection}>
                  {/* Collection Name */}
                  <div className="space-y-1.5">
                    <label className="block font-body-sm text-body-sm font-semibold text-on-surface">
                      Tên bộ sưu tập <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ví dụ: Mâm cơm cúng Rằm, Tiệc đãi bạn bè cuối tuần..."
                      required
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block font-body-sm text-body-sm font-semibold text-on-surface">
                      Mô tả ngắn
                    </label>
                    <textarea
                      className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Ghi chú về dịp nấu, sở thích gia đình hoặc khẩu vị các thành viên..."
                      rows={2}
                      value={newCollectionDesc}
                      onChange={(e) => setNewCollectionDesc(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Visibility / Privacy Options */}
                  <div className="space-y-1.5">
                    <label className="block font-body-sm text-body-sm font-semibold text-on-surface">
                      Quyền riêng tư
                    </label>
                    <div className="grid grid-cols-2 gap-space-sm">
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                        <input
                          checked={newCollectionPrivacy === "public"}
                          className="mt-1 accent-primary"
                          name="privacy"
                          type="radio"
                          value="public"
                          onChange={() => setNewCollectionPrivacy("public")}
                        />
                        <div>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1">
                            <Icon name="public" className="text-[16px] text-secondary" /> Công khai
                          </span>
                          <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">
                            Mọi người trong cộng đồng có thể xem và nấu theo
                          </p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                        <input
                          checked={newCollectionPrivacy === "private"}
                          className="mt-1 accent-primary"
                          name="privacy"
                          type="radio"
                          value="private"
                          onChange={() => setNewCollectionPrivacy("private")}
                        />
                        <div>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1">
                            <Icon name="lock" className="text-[16px] text-outline" /> Riêng tư
                          </span>
                          <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">
                            Chỉ hiển thị cho riêng bạn trong gian bếp cá nhân
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Cover Choice Hint */}
                  <div className="p-3 rounded-xl bg-surface-container-low flex items-center gap-3">
                    <Icon name="auto_awesome" className="text-primary text-[24px]" />
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight">
                      Ảnh bìa bộ sưu tập sẽ được hệ thống tự động ghép từ 3 món đầu tiên bạn lưu vào
                      thư mục này.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                    <button
                      className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors"
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold shadow-md hover:bg-primary-container transition-all"
                      type="submit"
                    >
                      <Icon name="add" className="text-[18px]" />
                      <span>Tạo bộ sưu tập</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-xl">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                  <Icon name="check" className="text-[14px]" />
                </span>
                <p className="font-body-sm text-body-sm font-medium">{toastMessage}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
