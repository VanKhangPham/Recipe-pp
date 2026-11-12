"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

interface RecipeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  servings: string;
  difficulty: string;
  rating: number;
  reviewsCount: number;
  triedCount?: number;
  savedCount: number;
  category: string;
  isSpecial?: boolean;
}

const AUTHOR_RECIPES: RecipeItem[] = [
  {
    id: "ca-loc-kho-to",
    title: "Cá lóc kho tộ nước màu dừa Bến Tre",
    description: "Thịt cá dẽ chặt, nước kho sánh kẹo màu cánh gián từ kẹo dừa mộc, thơm nồng tiêu sọ hạt rang giã dập đưa cơm ngày mưa.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1XxtZXimWPoiMfUGEOvUUONMaizlXcIJsFL36v0ixAPa0U8HdglJIBBdkJyNeAQy795fvH8MfshzmzKwhXUdJwEPCujoCAkA1cDSZ1MVYbVvvLldfPW8Pxfj2Nh3d-QEyJiFNaV7bbqpuBoU0gSOMjeMO1ExQYJjIeud5QswoHUvVUXJs5KRRL2Wq8KmIKjUPIrNTiYkTq2LWOu8yjcxhWxOC7_ZbTsyH5OpJAv0q",
    time: "35 phút",
    servings: "4 người",
    difficulty: "Dễ",
    rating: 4.9,
    reviewsCount: 184,
    triedCount: 1250,
    savedCount: 3840,
    category: "Món kho đậm đà",
    isSpecial: true,
  },
  {
    id: "canh-chua-ca-loc",
    title: "Canh chua cá lóc miền Tây chuẩn vị bông súng",
    description: "Nước dùng thanh ngọt từ me dốt chín cây, bông súng giòn mát quyện mùi thơm đặc trưng của ngò gai và rau om thái nhuyễn.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2ijU7PdwfSpaPBCrlc2IYGXgc2VVxL0cPhMLwUsW6xi4FicocI-ku2vdVAabdwRa5Rq7V8kX7riXjE3TR3REo15XNZXV0AfN4plA4ojBCv4052p69IxXxGy5YmxEbP9SOgyTrq4MA_IXikt0IkLCGV0EfU1d3UD208Vq70XYb-pNF8uNDjkuAquA7V5XStgQhl3ks5JdwyHXCZPgiZ-j3LnFsVClqC2m-T3qWxDIU",
    time: "30 phút",
    servings: "4 người",
    difficulty: "Dễ",
    rating: 4.8,
    reviewsCount: 96,
    savedCount: 980,
    category: "Canh chua giải nhiệt",
  },
  {
    id: "thit-kho-hot-vit",
    title: "Thịt kho hột vịt nước dừa xiêm béo mềm",
    description: "Từng miếng ba chỉ vuông vức trong veo mỡ nạc, ninh hoàn toàn với nước dừa tươi ngọt lịm mang trọn hương vị Tết đoàn viên.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQOzWMhUCJzxSk4NSyCX-WnszT5_xT8QrmR50qcobmh6Um2kmnrfgsZQwSzoOtToNVFufPaC5N7GTdYIT91cqcGUtz-RP5FylliktCqLSs1JmNCkjFXux6dl7Vv9T9AIkY3dLJTwJ31XuysBRhbd8pmNCc4btd-oR8C4kx-Q48c22OE5me8S7WSTV4_C_S15VNCDXlnsaf2Ze2s1zCGhZ2owuAVsB-Ut56OSw3lKNE",
    time: "60 phút",
    servings: "6 người",
    difficulty: "Trung bình",
    rating: 4.9,
    reviewsCount: 140,
    savedCount: 1120,
    category: "Món kho đậm đà",
  },
  {
    id: "tom-rim-man-ngot",
    title: "Tôm rim mặn ngọt nước dừa cùi dày",
    description: "Tôm sông vỏ giòn óng ánh sốt kẹo, thơm nức mũi mùi tỏi ớt phi cùng những lát cùi dừa già giòn béo ngậy.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVKCHXP99tmIpANszUo1mwdruqtzz_Mz52SzDRHidW4PncpdYb9UZEtFxi_K92aPVsJaZSmxGm7y1oTfEQf1yEvqYta-R0QUSbtEibxITv0nW0fRfkBSql5PcqdizySCgQ8zr1BkQ5tYem4N83qNnEVW8t4iAsOrZuHQObmmPl9zwBzaoxvIjfbjzQHvu_I1yvTW3H2NJsTy09iUJIBTYza58ZGZIe1WHSp4na0Add",
    time: "25 phút",
    servings: "4 người",
    difficulty: "Dễ",
    rating: 4.9,
    reviewsCount: 88,
    savedCount: 750,
    category: "Món kho đậm đà",
  },
  {
    id: "goi-tep-trau-bong-dien-dien",
    title: "Gỏi tép trấu bông điên điển mùa nước nổi",
    description: "Vị chát ngọt thanh tao của hoa điên điển đầu mùa hòa quyện cùng tép trấu rang giòn rụm và nước mắm tỏi ớt chua cay.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmVxF6k-5Kf_WTClUuBc6NDo_mlLPjxdcefH9gyxCv9gCO5uvQcXqVomRjUOJbJcKMcFoFGRCRU7G2XMZxToMPMwY0aRBYxqC5YW--OtyjBnq0nSw9c5nOqbjUNdmpafSENj3JszFBg_pNgrA0z7ive0H3tQIWa6lLM8uvQDn1AQHh2MBrPjnQWod8LA99OCZ3lJG-j3O8AlNJM481QaaW64XvL0Wtcy9lwGEXKrNE",
    time: "20 phút",
    servings: "4 người",
    difficulty: "Dễ",
    rating: 4.8,
    reviewsCount: 72,
    savedCount: 620,
    category: "Món cuốn & thanh mát",
  },
  {
    id: "che-thung-nuoc-cot-dua",
    title: "Chè thưng nước cốt dừa hạt sen bùi béo",
    description: "Món chè ấm nóng tráng miệng với hạt sen Đồng Tháp bùi ngậy, nấm mèo giòn sần sật chan đẫm nước cốt dừa dẻo thơm.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSNGDxwjWvBmamaBru4IX8J_STKrZHRURfX3b-nHG4iH2oqhlfbmCL36cdDVeOMUVcBVjwpCdu_MC5yd7ID5t9NqGuF-NnUSfQblPE2LIxhMZl4j_c5NHOi-dEuyeqvIAFZWkaCVAvSDTs1C8VMptEk6gQKeeIQBztrb8B_HYN1xIoF8KQjsRh8Z8b9JlyIRMOCrVIL2war64cCTAwUDsdEgxhhigTmnuvKrk5-r4t",
    time: "40 phút",
    servings: "6 người",
    difficulty: "Dễ",
    rating: 4.9,
    reviewsCount: 115,
    savedCount: 890,
    category: "Bánh truyền thống",
  },
];

const CATEGORIES = [
  { name: "Tất cả", count: 28 },
  { name: "Món kho đậm đà", count: 9 },
  { name: "Canh chua giải nhiệt", count: 6 },
  { name: "Món cuốn & thanh mát", count: 5 },
  { name: "Bánh truyền thống", count: 4 },
  { name: "Món chay gia đình", count: 4 },
];

function AuthorProfileContent() {
  const params = useParams();
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [followerTotal, setFollowerTotal] = React.useState(14820);
  const [activeTab, setActiveTab] = React.useState<"recipes" | "collections" | "reviews" | "stories">("recipes");
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("popular");
  const [savedRecipes, setSavedRecipes] = React.useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false);
  const [inquiryName, setInquiryName] = React.useState("");
  const [inquiryContent, setInquiryContent] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleFollow = () => {
    if (isFollowed) {
      setIsFollowed(false);
      setFollowerTotal((prev) => prev - 1);
      showToast("Đã hủy theo dõi tác giả.");
    } else {
      setIsFollowed(true);
      setFollowerTotal((prev) => prev + 1);
      showToast("Đã theo dõi gian bếp của Bếp Mẹ Ba thành công!");
    }
  };

  const handleToggleSave = (recipeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedRecipes((prev) => {
      const isSaved = !!prev[recipeId];
      if (isSaved) {
        showToast("Đã bỏ lưu món ăn khỏi sổ tay.");
      } else {
        showToast("Đã lưu công thức vào Sổ tay Nấu ăn của bạn!");
      }
      return { ...prev, [recipeId]: !isSaved };
    });
  };

  const handleCopyProfileLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết hồ sơ Bếp Mẹ Ba vào bộ nhớ tạm!");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInquiryModalOpen(false);
    setInquiryName("");
    setInquiryContent("");
    showToast("Lời nhắn của bạn đã được gửi tới Bếp Mẹ Ba!");
  };

  const filteredRecipes = AUTHOR_RECIPES.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* BREADCRUMB */}
          <div className="w-full px-margin-mobile lg:px-margin pt-4 pb-2">
            <nav
              aria-label="Đường dẫn liên kết"
              className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm"
            >
              <Link
                className="hover:text-primary transition-colors flex items-center gap-1"
                href="/"
              >
                <Icon name="home" className="text-[16px]" />
                <span>Trang chủ</span>
              </Link>
              <span className="text-outline/40">/</span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Cộng đồng đầu bếp
              </span>
              <span className="text-outline/40">/</span>
              <span className="text-on-surface font-medium">
                Bếp Mẹ Ba (Nguyễn Thu Hà)
              </span>
            </nav>
          </div>

          {/* COVER BANNER & PROFILE CARD SECTION */}
          <section className="w-full px-margin-mobile lg:px-margin pb-space-lg">
            {/* Cover Banner */}
            <div className="relative w-full h-56 md:h-64 rounded-3xl overflow-hidden shadow-sm">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjhoEDSJGS8vso_N7NTvlMj6URGWPEjexQcCbi1to5jh7Xw0BgITb43rAM7V1kaoi0Y9TRN0QObHCodvNorgmZnvi_OoE5IOu1UvpmgKCFDflIFEgIO7kwG5jCw-spJZAPrOLwxF9CqgmNWRs5oOdFqUxk9fPeX-kUntDEMyrU7-aYnYIxT3dAK3eSTcHOsWPvRb6lR61rNRwdl2sRD9CuHbnWdQ0Mvyzsyd9xKyrH"
                alt="Gian bếp quê Nam Bộ"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent"></div>

              {/* Decorative subtle tag on cover */}
              <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-sm text-on-surface text-body-sm font-medium">
                <Icon name="verified_user" className="text-[18px] text-secondary" />
                <span>Gian bếp gia đình kiểm định</span>
              </div>
            </div>

            {/* Floating Author Profile Box */}
            <div className="relative -mt-16 sm:-mt-20 mx-2 sm:mx-6 rounded-3xl bg-surface-container-lowest shadow-md p-space-md sm:p-space-lg">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg">
                {/* Left: Avatar + Details */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-space-md sm:gap-space-lg">
                  {/* Avatar with white rim shadow */}
                  <div className="relative flex-shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-md ring-4 ring-surface-container-lowest relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5v0pwbfRQlAaWhAQvg7e4Y3ZycHwORNH7sAQcKvBjD4ldqOm5OpDaMfBTUx0ikIgNrwkVyzKXrw-JeK6EK0OKcGfYMI1YwoWBvCNzwmhGYokQKmkAjAKpJV20ZrM_maAYANCHKfVwaF8OKUDlq9LCWe66nJDDqwG1Y0eKAjj9jopI5LVixbFn5T0AoMItTaaOl2m-bmf1I1dGMYCnZDD1QMbxbiRNYFTw8PDAuIu4"
                        alt="Bếp Mẹ Ba"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span
                      className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm"
                      title="Tác giả được xác thực"
                    >
                      <Icon name="check" className="text-[14px]" />
                    </span>
                  </div>

                  {/* Name & Bios */}
                  <div className="flex flex-col space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                        Bếp Mẹ Ba
                      </h1>
                      <span className="font-body-md text-on-surface-variant font-normal">
                        (Nguyễn Thu Hà)
                      </span>

                      {/* Badges */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-mono-sm text-label-mono-sm font-semibold">
                        <Icon name="military_tech" className="text-[16px] text-secondary" />
                        Đầu bếp tinh hoa
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <Icon name="history" className="text-[14px]" />
                        Thành viên tích cực 3 năm
                      </span>
                    </div>

                    <p className="font-title-md text-title-md text-primary font-medium">
                      Người gìn giữ hương vị cơm nhà Nam Bộ &amp; món kho truyền thống
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      “Người mẹ miền Tây mê nấu nướng và gìn giữ những công thức kho tộ, nấu canh chua từ ngoại truyền lại. Chia sẻ với tình yêu thương để mọi gian bếp trẻ luôn ấm lửa cơm chiều.”
                    </p>

                    {/* Metadata info tags */}
                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="location_on" className="text-[16px] text-outline" />
                        Bến Tre &amp; TP. Hồ Chí Minh
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="calendar_today" className="text-[16px] text-outline" />
                        Gia nhập: Tháng 10/2021
                      </span>
                      <a
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        href="#youtube"
                      >
                        <Icon name="smart_display" className="text-[16px]" />
                        Bếp Mẹ Ba Cooking
                      </a>
                      <a
                        className="inline-flex items-center gap-1 text-on-surface hover:text-primary transition-colors font-label-mono-sm"
                        href="#tiktok"
                      >
                        <Icon name="music_note" className="text-[16px] text-outline" />
                        @bepmeba
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons Group */}
                <div className="flex flex-row lg:flex-col sm:items-center lg:items-end justify-center gap-space-sm flex-shrink-0 pt-2 lg:pt-0">
                  {/* Follow Button */}
                  <button
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-space-md py-2.5 rounded-xl font-body-sm text-body-sm font-medium shadow-sm transition-all active:scale-[0.98] ${
                      isFollowed
                        ? "bg-surface-container-highest text-on-surface hover:bg-surface-container-high"
                        : "bg-primary hover:bg-primary-container text-on-primary"
                    }`}
                    onClick={handleToggleFollow}
                    type="button"
                  >
                    <Icon
                      name={isFollowed ? "person_check" : "person_add"}
                      className="text-[18px]"
                    />
                    <span>{isFollowed ? "Đang theo dõi" : "Theo dõi tác giả"}</span>
                    <span className="font-label-mono-sm text-label-mono-sm bg-on-primary/20 px-2 py-0.5 rounded-full">
                      {(followerTotal / 1000).toFixed(1)}K
                    </span>
                  </button>

                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    {/* Share Profile */}
                    <button
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-colors"
                      onClick={handleCopyProfileLink}
                      title="Sao chép liên kết"
                      type="button"
                    >
                      <Icon name="share" className="text-[18px] text-outline" />
                      <span>Chia sẻ</span>
                    </button>

                    {/* Message / Inquiry Button */}
                    <button
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-colors"
                      onClick={() => setIsInquiryModalOpen(true)}
                      title="Hỏi kinh nghiệm nấu nướng"
                      type="button"
                    >
                      <Icon name="chat_bubble_outline" className="text-[18px] text-outline" />
                      <span className="hidden sm:inline">Hỏi kinh nghiệm</span>
                      <span className="sm:hidden">Nhắn tin</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* IMPACT & ACHIEVEMENTS STATS BAR */}
          <section className="w-full px-margin-mobile lg:px-margin pb-space-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm sm:gap-space-md">
              {/* Stat 1 */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Công thức xuất bản
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                    <Icon name="menu_book" className="text-[18px]" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-headline-md text-headline-md text-on-surface font-bold">
                    28
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-secondary font-medium mt-0.5">
                    100% đạt chuẩn định lượng
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Người theo dõi gian bếp
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                    <Icon name="group" className="text-[18px]" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-headline-md text-headline-md text-on-surface font-bold">
                    14.8K
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-outline mt-0.5">
                    +480 thành viên tháng này
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Lượt lưu &amp; nấu thử
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                    <Icon name="favorite" className="text-[18px]" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-headline-md text-headline-md text-on-surface font-bold">
                    125.4K
                  </div>
                  <p className="font-label-mono-sm text-label-mono-sm text-secondary font-medium mt-0.5">
                    Tỉ lệ nấu thành công 98.4%
                  </p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Đánh giá trung bình
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                    <Icon name="grade" className="text-[18px]" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="font-headline-md text-headline-md text-on-surface font-bold">
                    4.95
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">
                    / 5.0 (1.840 nhận xét)
                  </span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-secondary h-1.5 rounded-full w-[99%]"></div>
                </div>
              </div>
            </div>
          </section>

          {/* MAIN TABBED CONTENT SECTION WITH ASYMMETRIC GRID */}
          <section className="w-full px-margin-mobile lg:px-margin pb-space-xl">
            {/* Tab Navigation Bar */}
            <div className="flex items-center gap-2 border-b border-surface-container-high overflow-x-auto no-scrollbar mb-space-lg">
              <button
                className={`px-space-md py-3 font-title-md text-title-md flex items-center gap-2 flex-shrink-0 transition-colors ${
                  activeTab === "recipes"
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setActiveTab("recipes")}
                type="button"
              >
                <Icon name="description" className="text-[20px]" />
                <span>Công thức đã đăng</span>
                <span
                  className={`font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full ${
                    activeTab === "recipes"
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-container text-outline"
                  }`}
                >
                  28
                </span>
              </button>

              <button
                className={`px-space-md py-3 font-title-md text-title-md flex items-center gap-2 flex-shrink-0 transition-colors ${
                  activeTab === "collections"
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setActiveTab("collections")}
                type="button"
              >
                <Icon name="folder_special" className="text-[20px]" />
                <span>Bộ sưu tập tuyển chọn</span>
                <span className="font-label-mono-sm text-label-mono-sm bg-surface-container text-outline px-2 py-0.5 rounded-full">
                  6
                </span>
              </button>

              <button
                className={`px-space-md py-3 font-title-md text-title-md flex items-center gap-2 flex-shrink-0 transition-colors ${
                  activeTab === "reviews"
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setActiveTab("reviews")}
                type="button"
              >
                <Icon name="chat" className="text-[20px]" />
                <span>Đánh giá từ cộng đồng</span>
                <span className="font-label-mono-sm text-label-mono-sm bg-surface-container text-outline px-2 py-0.5 rounded-full">
                  342
                </span>
              </button>

              <button
                className={`px-space-md py-3 font-title-md text-title-md flex items-center gap-2 flex-shrink-0 transition-colors ${
                  activeTab === "stories"
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "font-medium text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setActiveTab("stories")}
                type="button"
              >
                <Icon name="auto_stories" className="text-[20px]" />
                <span>Câu chuyện gian bếp</span>
                <span className="font-label-mono-sm text-label-mono-sm bg-surface-container text-outline px-2 py-0.5 rounded-full">
                  5 bài
                </span>
              </button>
            </div>

            {/* Active Tab Body: Asymmetric Grid Layout (8 cols : 4 cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
              {/* MAIN COLUMN (8 cols) */}
              <div className="xl:col-span-8 flex flex-col space-y-space-md">
                {/* Search & Filter Controls */}
                <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                    {/* Search Inside Author Recipes */}
                    <div className="relative w-full sm:flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline flex items-center pointer-events-none">
                        <Icon name="search" className="text-[18px]" />
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Tìm trong 28 công thức của Bếp Mẹ Ba..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Sorting Select */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span className="text-on-surface-variant font-body-sm text-body-sm whitespace-nowrap">
                        Sắp xếp:
                      </span>
                      <select
                        className="px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="popular">Được yêu thích nhất</option>
                        <option value="newest">Mới nhất</option>
                        <option value="rating">Đánh giá cao nhất</option>
                        <option value="quick">Nấu nhanh dưới 30 phút</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        className={`px-3.5 py-1.5 rounded-full font-body-sm text-body-sm flex-shrink-0 transition-colors ${
                          selectedCategory === cat.name
                            ? "bg-primary text-on-primary font-medium shadow-sm"
                            : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                        }`}
                        onClick={() => setSelectedCategory(cat.name)}
                        type="button"
                      >
                        {cat.name} ({cat.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipe Cards Grid (2 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {filteredRecipes.map((recipe) => (
                    <article
                      key={recipe.id}
                      className="group rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="p-space-sm pb-0 relative">
                        <div className="w-full h-52 rounded-2xl overflow-hidden relative">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {recipe.isSpecial && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold shadow-sm">
                              Món tủ của Mẹ Ba
                            </span>
                          )}

                          {/* Favorite Heart Button */}
                          <button
                            aria-label="Lưu vào danh sách yêu thích"
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors shadow-sm"
                            onClick={(e) => handleToggleSave(recipe.id, e)}
                            type="button"
                          >
                            <Icon
                              name={savedRecipes[recipe.id] ? "favorite" : "favorite_border"}
                              className={`text-[20px] ${
                                savedRecipes[recipe.id] ? "text-primary" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="p-space-md flex-1 flex flex-col justify-between">
                        <div>
                          {/* Metadata strip */}
                          <div className="flex items-center gap-3 font-label-mono-sm text-label-mono-sm text-outline mb-2">
                            <span className="inline-flex items-center gap-1">
                              <Icon name="schedule" className="text-[14px]" />
                              {recipe.time}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Icon name="group" className="text-[14px]" />
                              {recipe.servings}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                              Độ khó: {recipe.difficulty}
                            </span>
                          </div>

                          <Link href={`/recipes/${recipe.id}`}>
                            <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {recipe.title}
                            </h3>
                          </Link>

                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            {recipe.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-surface-container-high flex items-center justify-between font-label-mono-sm text-label-mono-sm text-outline">
                          <div className="flex items-center gap-1 text-on-surface font-medium">
                            <Icon name="star" className="text-[16px] text-primary" />
                            <span>{recipe.rating}</span>
                            <span className="text-outline font-normal">
                              ({recipe.reviewsCount})
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {recipe.triedCount && (
                              <>
                                <span>{recipe.triedCount.toLocaleString("vi-VN")} nấu thử</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{recipe.savedCount.toLocaleString("vi-VN")} đã lưu</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm mt-4">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Hiển thị <span className="font-semibold text-on-surface">1 - 6</span> trên
                    tổng số <span className="font-semibold text-on-surface">28</span> công thức
                  </p>
                  <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm">
                    <button
                      className="w-9 h-9 rounded-xl bg-surface-container-low text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors disabled:opacity-40"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      type="button"
                    >
                      <Icon name="chevron_left" className="text-[18px]" />
                    </button>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        className={`w-9 h-9 rounded-xl font-bold transition-colors ${
                          currentPage === page
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                        }`}
                        onClick={() => setCurrentPage(page)}
                        type="button"
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors"
                      onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                      type="button"
                    >
                      <Icon name="chevron_right" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SIDEBAR COLUMN (4 cols) */}
              <div className="xl:col-span-4 flex flex-col space-y-space-md">
                {/* Curated Collections Module */}
                <div className="p-space-md rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col space-y-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                        <Icon name="folder_special" className="text-[18px]" />
                      </div>
                      <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                        Bộ sưu tập tuyển chọn
                      </h2>
                    </div>
                    <Link
                      className="font-label-mono-sm text-label-mono-sm text-primary hover:underline font-semibold"
                      href="#"
                    >
                      Xem tất cả (6)
                    </Link>
                  </div>

                  {/* Collection item 1 */}
                  <Link
                    className="group p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3"
                    href="#"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGyo4wKZIgFtcEiznU32GmpeQYG-R6glCpzpnJV-P3Wc8hwM9V_0YzaC-8XYlolUiT4z2mV7xy_9zf02TEiBfkopNPoqO58HRmEGdfRiZk9X3PCYDMB6Ar57V9eMSEmH8cWVjVWqYTEcqJUoSrqpaQP-yrfMbLZjowVQPLccRigNWAnzii1KvmJLjzz3AbJYZElnxJcxlUlNJ1KoS2Meee53TfNvCHSr7Rdd32J2S7"
                        alt="Mâm cơm Nam Bộ"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                        Mâm cơm Nam Bộ 7 ngày đưa cơm không ngấy
                      </h4>
                      <p className="font-label-mono-sm text-label-mono-sm text-outline mt-0.5">
                        7 món ngon • 4.2k người lưu
                      </p>
                    </div>
                    <div className="text-outline group-hover:text-primary transition-colors">
                      <Icon name="chevron_right" className="text-[18px]" />
                    </div>
                  </Link>

                  {/* Collection item 2 */}
                  <Link
                    className="group p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3"
                    href="#"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCekss7etWuKNidOhZIbgYvqjwS4daGjvPw_Fi-75mybD_6MuJmuoj1jZ6Rf1XkTr2EsAbdtPHfZZJYnIquXTey_1raEdTTfcqSs1ZFCESkOp-VnXIHgl4qWHKC-C8JMlmjCF648O9nTDWJZZSoO4FcWbg0FoU00qXjBkL1JsO4B1xIE0iACTaGD9iOe5xlFvMSl_MhAqY_ymeURq2nTuKZuetWErzKZpoW3q9HaFr"
                        alt="Kho quẹt & kho tộ"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                        Bí quyết kho quẹt &amp; kho tộ chuẩn vị bếp xưa
                      </h4>
                      <p className="font-label-mono-sm text-label-mono-sm text-outline mt-0.5">
                        5 món ngon • 3.1k người lưu
                      </p>
                    </div>
                    <div className="text-outline group-hover:text-primary transition-colors">
                      <Icon name="chevron_right" className="text-[18px]" />
                    </div>
                  </Link>

                  {/* Collection item 3 */}
                  <Link
                    className="group p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3"
                    href="#"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBexqztBYbYRGd8WxDbFYDwDMtyivagjf9SFQi_NcQRbHnNZ3L1WOMjPsiNeUTzr1D-5vqjNGzBvrKOUl2ocSkgCxODs_z2bwgmpnUxMViJNSLfq5MaXi5lX6GcoMiB1l7bGIVFR_VeiaNZljZYR06A7C54czmjOBSRFUZayyiTKNI8P4619XaTwPHCqksbZ79H-lOJ5Bo5UouebMPWA6dpbYSfYFdjSyxh4MTVFJJo"
                        alt="Canh chua"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                        Các món canh chua xoa dịu nắng hè
                      </h4>
                      <p className="font-label-mono-sm text-label-mono-sm text-outline mt-0.5">
                        6 món ngon • 2.8k người lưu
                      </p>
                    </div>
                    <div className="text-outline group-hover:text-primary transition-colors">
                      <Icon name="chevron_right" className="text-[18px]" />
                    </div>
                  </Link>
                </div>

                {/* Author Honors & Culinary Badges */}
                <div className="p-space-md rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col space-y-space-md">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                      <Icon name="military_tech" className="text-[18px]" />
                    </div>
                    <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                      Huy hiệu &amp; Vinh danh ẩm thực
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="star" className="text-[20px]" />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface font-semibold leading-tight">
                          Top 10 Tác giả xuất sắc năm 2023
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Bình chọn bởi cộng đồng hơn 500.000 thành viên RecipeHub Việt Nam.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="verified_user" className="text-[20px]" />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface font-semibold leading-tight">
                          Chuyên gia Món truyền thống phương Nam
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Được thẩm định chuyên môn bởi Hội đồng Nghiên cứu Ẩm thực Bản địa.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="local_fire_department" className="text-[20px]" />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md text-on-surface font-semibold leading-tight">
                          Công thức tương tác cao nhất tháng
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Món “Cá lóc kho tộ nước màu dừa” đạt hơn 35.000 lượt tương tác.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kitchen Philosophy Quote Card */}
                <div className="p-space-md rounded-3xl bg-primary-fixed/30 shadow-sm flex flex-col space-y-2 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                    <Icon name="format_quote" className="text-[20px]" />
                  </div>
                  <p className="font-title-md text-title-md text-on-primary-fixed font-semibold">
                    Lời gửi gắm từ Mẹ Ba
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                    “Nấu ăn không cần cao lương mỹ vị, chỉ cần nêm vào đó chút tỉ mẩn và lòng thương người ăn. Tộ cá kho dẫu mộc mạc nhưng chan cùng bát canh rau mát lòng cũng đủ giữ ấm hạnh phúc gia đình.”
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-primary"></span>
                    <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold uppercase tracking-wider">
                      Nguyễn Thu Hà • Bếp Mẹ Ba
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

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

          {/* Message / Question Modal Dialog */}
          {isInquiryModalOpen && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
              <div className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary">
                      <Icon name="chat" className="text-[20px]" />
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      Gửi lời nhắn tới Bếp Mẹ Ba
                    </h3>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
                    onClick={() => setIsInquiryModalOpen(false)}
                    type="button"
                  >
                    <Icon name="close" className="text-[18px]" />
                  </button>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Bạn có thắc mắc về định lượng gia vị, mẹo kho cá không tanh hay cách chọn nguyên liệu Nam Bộ? Hãy nhắn tin, Mẹ Ba sẽ hồi đáp bạn sớm nhất!
                </p>

                <form className="space-y-3" onSubmit={handleSendMessage}>
                  <div>
                    <label
                      className="block font-label-mono-sm text-label-mono-sm text-on-surface font-medium mb-1"
                      htmlFor="user-name"
                    >
                      Họ và tên của bạn
                    </label>
                    <input
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                      id="user-name"
                      placeholder="Ví dụ: Hoàng Mai Linh"
                      required
                      type="text"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-label-mono-sm text-label-mono-sm text-on-surface font-medium mb-1"
                      htmlFor="inquiry-content"
                    >
                      Nội dung câu hỏi hoặc lời chúc
                    </label>
                    <textarea
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                      id="inquiry-content"
                      placeholder="Mẹ Ba ơi, cho con hỏi nấu canh chua me non với me chín thì me nào dậy vị hơn ạ..."
                      required
                      rows={4}
                      value={inquiryContent}
                      onChange={(e) => setInquiryContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-colors"
                      onClick={() => setIsInquiryModalOpen(false)}
                      type="button"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium shadow-sm transition-colors"
                      type="submit"
                    >
                      Gửi câu hỏi ngay
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AuthorProfilePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[100dvh] bg-surface flex items-center justify-center">
          <div className="text-on-surface font-headline-sm text-headline-sm animate-pulse">
            Đang tải hồ sơ tác giả...
          </div>
        </div>
      }
    >
      <AuthorProfileContent />
    </React.Suspense>
  );
}
