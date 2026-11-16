"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { RecipeEditorMobile } from "@/components/mobile/recipe-editor-mobile";
import { useRecipes } from "@/lib/context/recipes-context";
import { useAuth } from "@/lib/context/auth-context";

interface IngredientItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  note: string;
}

interface IngredientGroup {
  id: string;
  name: string;
  items: IngredientItem[];
}

interface StepItem {
  id: string;
  number: number;
  title: string;
  content: string;
  timerMinutes?: number;
  timerLabel?: string;
  image?: string;
}

export default function RecipeEditorPage() {
  // Form States
  const [recipeTitle, setRecipeTitle] = React.useState("Cá lóc kho tộ nước màu dừa Bến Tre");
  const [recipeStory, setRecipeStory] = React.useState(
    "Món cá lóc kho tộ sánh đậm theo chuẩn phong vị Nam Bộ, ngấm vị ngọt thanh từ nước dừa tươi Bến Tre, quyện tiêu đen Phú Quốc cay ấm nồng nàn đưa cơm chiều mưa."
  );
  const [prepTime, setPrepTime] = React.useState(15);
  const [cookTime, setCookTime] = React.useState(35);
  const [servings, setServings] = React.useState(4);
  const [difficulty, setDifficulty] = React.useState<"Dễ" | "Vừa" | "Khó">("Vừa");
  const [cuisineRegion, setCuisineRegion] = React.useState("Nam");
  const [category, setCategory] = React.useState("mon-kho");
  const [showNutrition, setShowNutrition] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Ingredient Groups
  const [ingredientGroups, setIngredientGroups] = React.useState<IngredientGroup[]>([
    {
      id: "group-1",
      name: "Nhóm 1: Phần cá & gia vị ướp",
      items: [
        { id: "i1", name: "Cá lóc đồng làm sạch", quantity: "800", unit: "g", note: "Cắt khúc dày 2.5cm" },
        { id: "i2", name: "Thịt ba chỉ rút sườn", quantity: "150", unit: "g", note: "Thái con chì ngón tay" },
        { id: "i3", name: "Hành tím băm nhuyễn", quantity: "2", unit: "củ", note: "Phi thơm vàng" },
        { id: "i4", name: "Ớt hiểm đập dập", quantity: "3", unit: "quả", note: "Điều chỉnh theo khẩu vị" },
      ],
    },
    {
      id: "group-2",
      name: "Nhóm 2: Phần nước kho kẹo & tạo màu",
      items: [
        { id: "i5", name: "Nước dừa xiêm ngọt", quantity: "250", unit: "ml", note: "Dừa tươi mới chặt" },
        { id: "i6", name: "Nước mắm nhĩ Phú Quốc", quantity: "4", unit: "muỗng canh", note: "Độ đạm 40N nguyên chất" },
        { id: "i7", name: "Đường thốt nốt An Giang", quantity: "1.5", unit: "muỗng canh", note: "Vị ngọt thanh dịu mát" },
      ],
    },
  ]);

  // Steps
  const [steps, setSteps] = React.useState<StepItem[]>([
    {
      id: "s1",
      number: 1,
      title: "Sơ chế và khử tanh cá lóc",
      content:
        "Cá lóc đánh vảy, cạo sạch màng đen trong bụng để không bị tanh. Chà xát kỹ với muối hạt và nước cốt chanh trong 3 phút, sau đó rửa lại bằng nước sạch, để thật ráo nước rồi khứa nhẹ lên mình cá để gia vị ngấm sâu.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA3QFwlRCatGkVqJX2QMow3h40_zNetPoMnntpwGOKW2A3dZ9IRQqsne4jbbuXMpYmpqy5mbCbSOcjFgks0Z5SThanal1iaGEt2yBfdI05FShhKndddCofTe2oJ05tZQipCRahrRVSeZr9MFKJm6BxZ3nzDoKbfbS4ZDot9e67sUR9vTFJF3m-AZTJyiHvDYr1NvRnPkWNQftLEpkMrN-Z8rhE3CsKO_R3zB06X0YTw",
    },
    {
      id: "s2",
      number: 2,
      title: "Ướp cá và thịt ba chỉ cho ngấm vị",
      content:
        "Cho cá và thịt ba chỉ vào thố. Ướp cùng 3 muỗng canh nước mắm Phú Quốc, 1 muỗng đường thốt nốt, hành tím băm, đầu hành trắng giã nhuyễn và 1 thìa tiêu đen đập dập. Trộn đều rồi để ngấm trong ít nhất 20 phút.",
      timerMinutes: 20,
      timerLabel: "Hẹn giờ ướp: 20 phút",
    },
    {
      id: "s3",
      number: 3,
      title: "Thắng nước màu dừa & xào săn thịt ba chỉ",
      content:
        "Đặt tộ đất lên bếp, cho nửa muỗng đường thốt nốt và chút dầu ăn thắng đến khi chuyển màu cánh gián hổ phách đẹp mắt. Đổ thịt ba chỉ vào đảo đều tay cho thịt xém cạnh thơm lừng rồi tắt lửa hạ nhiệt.",
      timerMinutes: 5,
      timerLabel: "Hẹn giờ nấu: 5 phút",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDz6BCWCkm7OcRpNVSbTOJ7L-5UtoeXwNxaJ_fxPVlc9sPpFHeSIA1r01sELVd1uCXQK0koewaWOXHkHoDAnMDBUtW3igu0MLxUSAgmYiAx25TKUJwMMDvYuNhQAvwaiE95sN_OmoSqe-K3o-pseuJyNsWiNqtFQijndFPmEeT-gBdhzP8qVofdq7j8RJsVFg4vkSQ0eQG4C0tPR3hTsxhJCG8eCeI8fBZKtiMhRjHN",
    },
    {
      id: "s4",
      number: 4,
      title: "Kho cá liu riu với nước dừa tươi",
      content:
        "Xếp các khúc cá lóc lên trên lớp thịt ba chỉ, rưới toàn bộ nước ướp vào. Đổ 250ml nước dừa xiêm ngập ngang mặt cá. Đun lửa lớn cho sôi bùng, vớt bọt sạch rồi hạ lửa liu riu, đậy hở vung kho trong 25 phút đến khi nước cạn sánh kẹo.",
      timerMinutes: 25,
      timerLabel: "Hẹn giờ kho: 25 phút",
    },
  ]);

  // Dietary Chips
  const [selectedChips, setSelectedChips] = React.useState<string[]>([
    "Đậm đà đưa cơm",
    "Giàu đạm nạc",
    "Tốt cho tim mạch",
  ]);

  // Tags
  const [tags, setTags] = React.useState<string[]>([
    "cá kho tộ",
    "ẩm thực nam bộ",
    "món ngon đưa cơm",
    "nước dừa tươi",
  ]);
  const [tagInput, setTagInput] = React.useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddIngredient = (groupId: string) => {
    setIngredientGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            items: [
              ...g.items,
              {
                id: `item-${Date.now()}`,
                name: "",
                quantity: "",
                unit: "",
                note: "",
              },
            ],
          };
        }
        return g;
      })
    );
  };

  const handleRemoveIngredient = (groupId: string, itemId: string) => {
    setIngredientGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            items: g.items.filter((i) => i.id !== itemId),
          };
        }
        return g;
      })
    );
  };

  const handleAddGroup = () => {
    const newGroupNum = ingredientGroups.length + 1;
    setIngredientGroups((prev) => [
      ...prev,
      {
        id: `group-${Date.now()}`,
        name: `Nhóm ${newGroupNum}: Nhóm nguyên liệu mới`,
        items: [
          {
            id: `item-${Date.now()}`,
            name: "",
            quantity: "",
            unit: "",
            note: "",
          },
        ],
      },
    ]);
  };

  const handleAddStep = () => {
    const nextNum = steps.length + 1;
    setSteps((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        number: nextNum,
        title: `Bước ${nextNum}: Tiêu đề bước mới`,
        content: "",
      },
    ]);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    // update step numbers
    newSteps.forEach((s, idx) => {
      s.number = idx + 1;
    });
    setSteps(newSteps);
  };

  const handleRemoveStep = (id: string) => {
    setSteps((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      filtered.forEach((s, idx) => {
        s.number = idx + 1;
      });
      return filtered;
    });
  };

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(val)) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const router = useRouter();
  const { createRecipe } = useRecipes();
  const { user } = useAuth();

  const handleSaveDraft = () => {
    const allFlattenedIngredients = ingredientGroups.flatMap((g) =>
      g.items.map((i) => ({
        id: i.id,
        name: i.name,
        amount: i.quantity,
        unit: i.unit,
        note: i.note,
      }))
    );

    const formattedSteps = steps.map((s, idx) => ({
      number: idx + 1,
      title: s.title,
      description: s.content,
      durationMinutes: s.timerMinutes || 10,
      image: s.image,
    }));

    const created = createRecipe({
      title: recipeTitle || "Công thức mới",
      description: recipeStory,
      author: {
        id: user?.id || "usr-author",
        name: user?.name || "Bếp Trưởng Gia Đình",
        avatar: user?.avatar,
        avatarText: user?.avatarText || "BT",
      },
      region: (cuisineRegion === "Bac" ? "Bắc" : cuisineRegion === "Trung" ? "Trung" : "Nam") as any,
      category: "kho-rim",
      categoryName: category === "mon-kho" ? "Món kho & rim" : category === "mon-canh" ? "Canh & Tiềm" : "Món xào & cuốn",
      difficulty: difficulty === "Dễ" ? "Dễ làm" : difficulty === "Vừa" ? "Trung bình" : "Cầu kỳ",
      difficultyBadgeColor: difficulty === "Dễ" ? "secondary" : "primary",
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      totalTime: `${prepTime + cookTime} phút`,
      servings,
      calories: 420,
      rating: 5.0,
      reviewsCount: 0,
      bookmarksCount: 0,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQIiW-vV668HOpqJr1qgACSHyA9BXjNvP12m3EQ6xYHIQ9DaVP2EaQBM4F84AQdRiXCLbiDi6HYF6Cft2kYx2kvIYgG63EpK0y259GRyLe8cgcwlWfzBCsuVkVqbsz7lGNrZdJ2_x0xa-tuvaOG5wisVteglQWNFqYEXODf5BE6kFvR0O0HKM09-TOSjuzxl9676TyE63QRyq7CdqJ_gqL3YkJrfEObjab9qF3wvGY",
      imageAlt: recipeTitle,
      tags: tags.length > 0 ? tags : ["Món ngon gia đình"],
      dietTags: ["Thanh đạm"],
      ingredients: allFlattenedIngredients,
      steps: formattedSteps,
      reviews: [],
      status: "draft",
    });

    showToast(`Đã lưu bản nháp "${created.title}" thành công!`);
    setTimeout(() => router.push("/my-recipes"), 800);
  };

  const handlePublish = () => {
    const allFlattenedIngredients = ingredientGroups.flatMap((g) =>
      g.items.map((i) => ({
        id: i.id,
        name: i.name,
        amount: i.quantity,
        unit: i.unit,
        note: i.note,
      }))
    );

    const formattedSteps = steps.map((s, idx) => ({
      number: idx + 1,
      title: s.title,
      description: s.content,
      durationMinutes: s.timerMinutes || 10,
      image: s.image,
    }));

    const created = createRecipe({
      title: recipeTitle || "Công thức mới",
      description: recipeStory,
      author: {
        id: user?.id || "usr-author",
        name: user?.name || "Bếp Trưởng Gia Đình",
        avatar: user?.avatar,
        avatarText: user?.avatarText || "BT",
      },
      region: (cuisineRegion === "Bac" ? "Bắc" : cuisineRegion === "Trung" ? "Trung" : "Nam") as any,
      category: "kho-rim",
      categoryName: category === "mon-kho" ? "Món kho & rim" : category === "mon-canh" ? "Canh & Tiềm" : "Món xào & cuốn",
      difficulty: difficulty === "Dễ" ? "Dễ làm" : difficulty === "Vừa" ? "Trung bình" : "Cầu kỳ",
      difficultyBadgeColor: difficulty === "Dễ" ? "secondary" : "primary",
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      totalTime: `${prepTime + cookTime} phút`,
      servings,
      calories: 420,
      rating: 5.0,
      reviewsCount: 0,
      bookmarksCount: 0,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQIiW-vV668HOpqJr1qgACSHyA9BXjNvP12m3EQ6xYHIQ9DaVP2EaQBM4F84AQdRiXCLbiDi6HYF6Cft2kYx2kvIYgG63EpK0y259GRyLe8cgcwlWfzBCsuVkVqbsz7lGNrZdJ2_x0xa-tuvaOG5wisVteglQWNFqYEXODf5BE6kFvR0O0HKM09-TOSjuzxl9676TyE63QRyq7CdqJ_gqL3YkJrfEObjab9qF3wvGY",
      imageAlt: recipeTitle,
      tags: tags.length > 0 ? tags : ["Món ngon gia đình"],
      dietTags: ["Thanh đạm"],
      ingredients: allFlattenedIngredients,
      steps: formattedSteps,
      reviews: [],
      status: "pending",
    });

    showToast("Công thức đã được gửi tới ban biên tập ẩm thực để duyệt!");
    setTimeout(() => router.push("/my-recipes"), 800);
  };

  return (
    <>
    {/* ═══════ MOBILE LAYOUT ═══════ */}
    <div className="md:hidden">
      <RecipeEditorMobile />
    </div>

    {/* ═══════ DESKTOP LAYOUT ═══════ */}
    <div className="hidden md:flex bg-surface font-body-md text-body-md text-on-surface min-h-screen flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Sticky Editor Command & Action Bar */}
          <header className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              <div className="flex flex-col gap-0.5">
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-1.5 font-label-mono-sm text-label-mono-sm text-outline"
                >
                  <Link className="hover:text-primary transition-colors" href="/">
                    Trang chủ
                  </Link>
                  <span className="text-[10px]">/</span>
                  <Link className="hover:text-primary transition-colors" href="/my-recipes">
                    Công thức của tôi
                  </Link>
                  <span className="text-[10px]">/</span>
                  <span className="text-on-surface font-semibold">Tạo công thức</span>
                </nav>
                <div className="flex items-center gap-space-sm">
                  <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                    Tạo công thức món mới
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px] font-semibold">
                    <Icon name="cloud_done" className="text-[13px] text-secondary" />
                    <span>Đã tự động lưu 14:32</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs sm:gap-space-sm">
                <button
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
                  onClick={handleSaveDraft}
                  type="button"
                >
                  <Icon name="save" className="text-[18px] text-tertiary" />
                  <span className="hidden sm:inline">Lưu nháp</span>
                </button>
                <Link
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors"
                  href="/recipes/ca-loc-kho-to"
                >
                  <Icon name="visibility" className="text-[18px] text-tertiary" />
                  <span>Xem trước</span>
                </Link>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
                  onClick={handlePublish}
                  type="button"
                >
                  <Icon name="send" className="text-[18px]" />
                  <span>Gửi duyệt công thức</span>
                </button>
              </div>
            </div>
          </header>

          {/* Editorial Workspace Container */}
          <div className="w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg flex flex-col gap-space-lg">
            {/* Notice & Moderation Policy Banner */}
            <aside className="relative overflow-hidden bg-surface-container-low rounded-2xl p-space-md shadow-sm">
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon name="verified_user" className="text-[24px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      Quy chuẩn cộng đồng và kiểm duyệt RecipeHub
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-mono-sm text-[11px] font-semibold">
                      Tác giả tin cậy
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Tài khoản bếp của bạn đang có{" "}
                    <strong className="text-on-surface font-semibold">2 công thức đã xuất bản</strong>{" "}
                    được đánh giá cao. Công thức gửi duyệt sẽ được ban biên tập ẩm thực kiểm tra định
                    lượng và phản hồi duyệt nhanh trong vòng{" "}
                    <strong className="text-on-surface font-semibold">2–4 giờ</strong> trước khi xuất
                    hiện chính thức trong thư viện.
                  </p>
                </div>
              </div>
            </aside>

            {/* Two-column Workspace layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column: Sticky Progress Stepper */}
              <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-40 flex flex-col gap-space-md">
                <section
                  aria-label="Tiến độ hoàn thiện"
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md"
                >
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      Tiến độ nội dung
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm font-semibold text-primary">
                      75%
                    </span>
                  </div>
                  {/* Progress Ring & Bar Representation */}
                  <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500 w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between px-space-xs py-1 rounded-lg bg-surface-container-low font-label-mono-sm text-[11px] text-tertiary">
                    <span>Chất lượng bài viết</span>
                    <span className="text-secondary font-semibold">Rất tốt (8.8/10)</span>
                  </div>
                  {/* Interactive Stepper Navigation List */}
                  <nav aria-label="Điều hướng các phần" className="flex flex-col gap-1.5">
                    <a
                      className="group flex items-center justify-between p-2 rounded-xl bg-surface-container-high text-on-surface transition-colors"
                      href="#section-thong-tin-co-ban"
                    >
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                          <Icon name="check" className="text-[14px]" />
                        </div>
                        <span className="font-body-sm text-body-sm font-semibold">
                          1. Thông tin cơ bản
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-secondary font-medium">
                        Xong
                      </span>
                    </a>
                    <a
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low text-on-surface transition-colors"
                      href="#section-nguyen-lieu"
                    >
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-mono-sm text-[11px] font-bold">
                          2
                        </div>
                        <span className="font-body-sm text-body-sm font-semibold">
                          2. Nguyên liệu
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-primary font-medium">
                        7 món
                      </span>
                    </a>
                    <a
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low text-on-surface transition-colors"
                      href="#section-cac-buoc"
                    >
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-mono-sm text-[11px] font-bold">
                          3
                        </div>
                        <span className="font-body-sm text-body-sm font-semibold">
                          3. Các bước nấu
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-primary font-medium">
                        {steps.length} bước
                      </span>
                    </a>
                    <a
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
                      href="#section-dinh-duong"
                    >
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-surface-container-highest text-tertiary flex items-center justify-center font-label-mono-sm text-[11px] font-bold">
                          4
                        </div>
                        <span className="font-body-sm text-body-sm font-normal">
                          4. Dinh dưỡng &amp; thẻ
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-outline font-medium">
                        Đang nhập
                      </span>
                    </a>
                    <a
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
                      href="#section-xuat-ban"
                    >
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-surface-container-highest text-tertiary flex items-center justify-center font-label-mono-sm text-[11px] font-bold">
                          5
                        </div>
                        <span className="font-body-sm text-body-sm font-normal">
                          5. Sẵn sàng gửi
                        </span>
                      </div>
                      <span className="font-label-mono-sm text-[11px] text-outline font-medium">
                        Khả dụng
                      </span>
                    </a>
                  </nav>
                </section>

                {/* Quick Tips Callout */}
                <section
                  aria-label="Mẹo viết bài"
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-xs"
                >
                  <div className="flex items-center gap-1.5 text-primary">
                    <Icon name="lightbulb" className="text-[18px]" />
                    <span className="font-body-sm text-body-sm font-bold">
                      Bí quyết được duyệt ngay
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                    Nêu rõ độ dày miếng cá và thời gian ướp để người mới nấu lần đầu dễ áp dụng thành
                    công.
                  </p>
                </section>
              </aside>

              {/* Right Column: Multi-section Detailed Form */}
              <section
                aria-label="Biểu mẫu công thức chi tiết"
                className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-xl"
              >
                {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
                <section
                  className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-28"
                  id="section-thong-tin-co-ban"
                >
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-mono-sm text-[13px] font-bold">
                        01
                      </span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          Thông tin cơ bản
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Đặt tiêu đề hấp dẫn và câu chuyện gợi mở cảm hứng bữa cơm gia đình
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-[11px] font-semibold">
                      Bắt buộc
                    </span>
                  </header>

                  {/* Recipe Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="font-title-md text-title-md font-semibold text-on-surface"
                        htmlFor="recipe-title"
                      >
                        Tên món ăn <span className="text-error">*</span>
                      </label>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">
                        {recipeTitle.length}/80 ký tự
                      </span>
                    </div>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-surface text-on-surface font-title-md text-title-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                      id="recipe-title"
                      placeholder="Ví dụ: Phở bò gia truyền Hà Nội 1985..."
                      type="text"
                      value={recipeTitle}
                      onChange={(e) => setRecipeTitle(e.target.value)}
                    />
                  </div>

                  {/* Recipe Description & Origin Story */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        className="font-body-sm text-body-sm font-semibold text-on-surface"
                        htmlFor="recipe-story"
                      >
                        Câu chuyện món ăn &amp; Gợi mở hương vị
                      </label>
                      <span className="font-label-mono-sm text-label-mono-sm text-outline">
                        {recipeStory.length}/300 ký tự
                      </span>
                    </div>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-surface text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all resize-none"
                      id="recipe-story"
                      placeholder="Chia sẻ kỷ niệm, lý do bạn thích món này, hoặc mẹo chọn cá ngon..."
                      rows={3}
                      value={recipeStory}
                      onChange={(e) => setRecipeStory(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Cover Photo Upload Section (16:9 ratio) */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Ảnh bìa đại diện công thức <span className="text-error">*</span>
                    </label>
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm group">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQu45RO0Lk8rfIwknMgVfFnO5LG68k4BC7MNjhJ7GMkg-_mByQp1asyTeBFvI-YStXVz44cpa7qqZfo3DyjYQpNhrPAneTaqv6s6dbjVDgxe7QsRYp0Cffjzv-5MiboKl2O6WkWikp-IvKPnKshO2E94mV5_C5qdf7djYOM5ZKtzNz-I2rAq7TbQnnDTPLeyCf1BsqkStEJv7QnNUVgapNg4OJGW6qsYlgUJPxJ4MP"
                        alt="Cá lóc kho tộ"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent flex flex-col justify-between p-space-md">
                        <div className="flex justify-end">
                          <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-mono-sm text-[11px] font-semibold">
                            Tỉ lệ 16:9 • Độ phân giải cao
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-on-primary font-body-sm text-body-sm font-medium drop-shadow-sm">
                            caloc_khoto_bentre_main.webp (2.4 MB)
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium backdrop-blur-sm transition-colors shadow-sm"
                              type="button"
                            >
                              <Icon name="crop" className="text-[16px]" />
                              <span>Cắt ảnh</span>
                            </button>
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium backdrop-blur-sm transition-colors shadow-sm"
                              type="button"
                            >
                              <Icon name="sync" className="text-[16px]" />
                              <span>Thay đổi</span>
                            </button>
                            <button
                              aria-label="Xóa ảnh bìa"
                              className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center hover:opacity-90 transition-opacity"
                              type="button"
                            >
                              <Icon name="delete" className="text-[16px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="font-label-mono-sm text-[11px] text-outline">
                      Định dạng JPG, PNG hoặc WebP. Kích thước khuyến nghị tối thiểu 1200x675px, dung
                      lượng &lt; 5MB.
                    </span>
                  </div>

                  {/* Metadata Grid: Prep time, Cook time, Servings, Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-xs">
                    <div className="flex flex-col gap-1.5 p-space-sm rounded-xl bg-surface-container-low">
                      <label
                        className="font-body-sm text-body-sm text-on-surface-variant font-medium flex items-center gap-1"
                        htmlFor="prep-time-input"
                      >
                        <Icon name="timer" className="text-[16px] text-tertiary" />
                        Chuẩn bị
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          className="w-full px-2 py-1 rounded bg-surface text-on-surface font-label-mono-lg text-label-mono-lg font-bold text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          id="prep-time-input"
                          min="1"
                          type="number"
                          value={prepTime}
                          onChange={(e) => setPrepTime(Number(e.target.value))}
                        />
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                          phút
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-space-sm rounded-xl bg-surface-container-low">
                      <label
                        className="font-body-sm text-body-sm text-on-surface-variant font-medium flex items-center gap-1"
                        htmlFor="cook-time-input"
                      >
                        <Icon name="skillet" className="text-[16px] text-tertiary" />
                        Thời gian nấu
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          className="w-full px-2 py-1 rounded bg-surface text-on-surface font-label-mono-lg text-label-mono-lg font-bold text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          id="cook-time-input"
                          min="1"
                          type="number"
                          value={cookTime}
                          onChange={(e) => setCookTime(Number(e.target.value))}
                        />
                        <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                          phút
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-space-sm rounded-xl bg-surface-container-low">
                      <label className="font-body-sm text-body-sm text-on-surface-variant font-medium flex items-center gap-1">
                        <Icon name="group" className="text-[16px] text-tertiary" />
                        Khẩu phần chuẩn
                      </label>
                      <div className="flex items-center justify-between bg-surface rounded px-2 py-0.5">
                        <button
                          aria-label="Giảm khẩu phần"
                          className="w-6 h-6 rounded flex items-center justify-center text-tertiary hover:text-on-surface"
                          onClick={() => setServings((s) => Math.max(1, s - 1))}
                          type="button"
                        >
                          <Icon name="remove" className="text-[16px]" />
                        </button>
                        <span className="font-label-mono-lg text-label-mono-lg font-bold text-on-surface">
                          {servings} người
                        </span>
                        <button
                          aria-label="Tăng khẩu phần"
                          className="w-6 h-6 rounded flex items-center justify-center text-tertiary hover:text-on-surface"
                          onClick={() => setServings((s) => s + 1)}
                          type="button"
                        >
                          <Icon name="add" className="text-[16px]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-space-sm rounded-xl bg-surface-container-low">
                      <label className="font-body-sm text-body-sm text-on-surface-variant font-medium flex items-center gap-1">
                        <Icon name="signal_cellular_alt" className="text-[16px] text-tertiary" />
                        Độ khó chế biến
                      </label>
                      <div className="flex items-center gap-1">
                        {(["Dễ", "Vừa", "Khó"] as const).map((diff) => (
                          <button
                            key={diff}
                            className={`flex-1 py-1 rounded text-center font-label-mono-sm text-[11px] transition-colors ${
                              difficulty === diff
                                ? "bg-[#FEF3C7] text-[#B45309] font-bold shadow-sm"
                                : "bg-surface hover:bg-surface-container text-tertiary font-semibold"
                            }`}
                            onClick={() => setDifficulty(diff)}
                            type="button"
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* PHẦN 2: NGUYÊN LIỆU & GIA VỊ */}
                <section
                  className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-28"
                  id="section-nguyen-lieu"
                >
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-mono-sm text-[13px] font-bold">
                        02
                      </span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          Nguyên liệu &amp; Gia vị
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Tách nhóm nguyên liệu để người đọc dễ chuẩn bị tại chợ hoặc siêu thị
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-surface-container-high font-label-mono-sm text-[11px] text-on-surface-variant">
                        Quy chuẩn: {servings} khẩu phần
                      </span>
                    </div>
                  </header>

                  {ingredientGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-space-md rounded-2xl bg-surface flex flex-col gap-space-sm shadow-sm"
                    >
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2">
                          <Icon name="drag_indicator" className="text-[18px] text-primary" />
                          <h3 className="font-title-md text-title-md font-bold text-on-surface">
                            {group.name}
                          </h3>
                          <button
                            aria-label="Sửa tên nhóm"
                            className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline"
                            type="button"
                          >
                            <Icon name="edit" className="text-[16px]" />
                          </button>
                        </div>
                        <span className="font-label-mono-sm text-[11px] text-tertiary">
                          {group.items.length} mục
                        </span>
                      </div>

                      {/* List rows */}
                      <div className="flex flex-col gap-2">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow transition-shadow"
                          >
                            <Icon
                              name="drag_indicator"
                              className="text-[18px] text-outline cursor-grab"
                            />
                            <input
                              className="flex-1 px-3 py-1.5 rounded-lg bg-surface font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Tên nguyên liệu"
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredientGroups((prev) =>
                                  prev.map((g) =>
                                    g.id === group.id
                                      ? {
                                          ...g,
                                          items: g.items.map((i) =>
                                            i.id === item.id ? { ...i, name: val } : i
                                          ),
                                        }
                                      : g
                                  )
                                );
                              }}
                            />
                            <input
                              className="w-20 px-2 py-1.5 rounded-lg bg-surface font-label-mono-sm text-label-mono-sm text-center font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Lượng"
                              type="text"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredientGroups((prev) =>
                                  prev.map((g) =>
                                    g.id === group.id
                                      ? {
                                          ...g,
                                          items: g.items.map((i) =>
                                            i.id === item.id ? { ...i, quantity: val } : i
                                          ),
                                        }
                                      : g
                                  )
                                );
                              }}
                            />
                            <input
                              className="w-16 px-2 py-1.5 rounded-lg bg-surface font-label-mono-sm text-label-mono-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Đơn vị"
                              type="text"
                              value={item.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredientGroups((prev) =>
                                  prev.map((g) =>
                                    g.id === group.id
                                      ? {
                                          ...g,
                                          items: g.items.map((i) =>
                                            i.id === item.id ? { ...i, unit: val } : i
                                          ),
                                        }
                                      : g
                                  )
                                );
                              }}
                            />
                            <input
                              className="w-48 hidden sm:block px-3 py-1.5 rounded-lg bg-surface font-body-sm text-body-sm text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Ghi chú sơ chế"
                              type="text"
                              value={item.note}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredientGroups((prev) =>
                                  prev.map((g) =>
                                    g.id === group.id
                                      ? {
                                          ...g,
                                          items: g.items.map((i) =>
                                            i.id === item.id ? { ...i, note: val } : i
                                          ),
                                        }
                                      : g
                                  )
                                );
                              }}
                            />
                            <button
                              aria-label="Xóa dòng"
                              className="w-8 h-8 rounded-lg hover:bg-error-container text-tertiary hover:text-on-error-container flex items-center justify-center transition-colors"
                              onClick={() => handleRemoveIngredient(group.id, item.id)}
                              type="button"
                            >
                              <Icon name="close" className="text-[18px]" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-body-sm font-semibold transition-colors"
                          onClick={() => handleAddIngredient(group.id)}
                          type="button"
                        >
                          <Icon name="add" className="text-[18px]" />
                          <span>Thêm nguyên liệu</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Group Button */}
                  <div className="flex justify-center pt-space-xs">
                    <button
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-all"
                      onClick={handleAddGroup}
                      type="button"
                    >
                      <Icon name="playlist_add" className="text-[20px] text-primary" />
                      <span>+ Thêm nhóm nguyên liệu mới (Rau ăn kèm, Nước chấm...)</span>
                    </button>
                  </div>
                </section>

                {/* PHẦN 3: CÁC BƯỚC THỰC HIỆN CHI TIẾT */}
                <section
                  className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-28"
                  id="section-cac-buoc"
                >
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-mono-sm text-[13px] font-bold">
                        03
                      </span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          Các bước thực hiện
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Hướng dẫn rõ ràng kèm thời gian bấm giờ để người nấu dễ làm theo
                        </p>
                      </div>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-medium">
                      {steps.length} bước hoàn chỉnh
                    </span>
                  </header>

                  <div className="flex flex-col gap-space-md">
                    {steps.map((step, idx) => (
                      <article
                        key={step.id}
                        className="p-space-md rounded-2xl bg-surface shadow-sm flex flex-col gap-space-sm relative"
                      >
                        <div className="flex items-start justify-between gap-space-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-primary text-on-primary font-label-mono-sm text-[12px] font-bold flex items-center justify-center">
                              {step.number}
                            </span>
                            <input
                              className="font-title-md text-title-md font-bold text-on-surface bg-transparent focus:bg-surface-container-lowest rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-80"
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSteps((prev) =>
                                  prev.map((s) => (s.id === step.id ? { ...s, title: val } : s))
                                );
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              aria-label="Di chuyển lên"
                              className="w-7 h-7 rounded-lg hover:bg-surface-container text-outline flex items-center justify-center"
                              onClick={() => handleMoveStep(idx, "up")}
                              type="button"
                            >
                              <Icon name="keyboard_arrow_up" className="text-[18px]" />
                            </button>
                            <button
                              aria-label="Di chuyển xuống"
                              className="w-7 h-7 rounded-lg hover:bg-surface-container text-outline flex items-center justify-center"
                              onClick={() => handleMoveStep(idx, "down")}
                              type="button"
                            >
                              <Icon name="keyboard_arrow_down" className="text-[18px]" />
                            </button>
                            <button
                              aria-label="Xóa bước"
                              className="w-7 h-7 rounded-lg hover:bg-error-container text-tertiary hover:text-on-error-container flex items-center justify-center"
                              onClick={() => handleRemoveStep(step.id)}
                              type="button"
                            >
                              <Icon name="delete" className="text-[18px]" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md pt-1">
                          <div className="md:col-span-8 flex flex-col gap-space-sm">
                            <textarea
                              className="w-full p-3 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
                              rows={3}
                              value={step.content}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSteps((prev) =>
                                  prev.map((s) => (s.id === step.id ? { ...s, content: val } : s))
                                );
                              }}
                            ></textarea>

                            <div className="flex items-center gap-2">
                              {step.timerMinutes ? (
                                <>
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF3C7] text-[#B45309] font-label-mono-sm text-label-mono-sm font-bold shadow-sm">
                                    <Icon name="timer" className="text-[16px]" />
                                    <span>{step.timerLabel}</span>
                                  </span>
                                  <button
                                    className="w-7 h-7 rounded-lg hover:bg-surface-container text-outline flex items-center justify-center"
                                    type="button"
                                  >
                                    <Icon name="edit" className="text-[16px]" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-tertiary font-label-mono-sm text-label-mono-sm hover:text-on-surface transition-colors"
                                  onClick={() => {
                                    setSteps((prev) =>
                                      prev.map((s) =>
                                        s.id === step.id
                                          ? {
                                              ...s,
                                              timerMinutes: 10,
                                              timerLabel: "Hẹn giờ: 10 phút",
                                            }
                                          : s
                                      )
                                    );
                                  }}
                                  type="button"
                                >
                                  <Icon name="timer_off" className="text-[16px]" />
                                  <span>Không đặt hẹn giờ</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-4">
                            {step.image ? (
                              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm group">
                                <Image
                                  src={step.image}
                                  alt={step.title}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-inverse-surface/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                  <button
                                    aria-label="Đổi ảnh minh họa"
                                    className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-md"
                                    type="button"
                                  >
                                    <Icon name="photo_camera" className="text-[18px]" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full aspect-video rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-outline gap-1 border border-dashed border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                                <Icon name="add_a_photo" className="text-[24px]" />
                                <span className="font-body-sm text-body-sm font-medium">
                                  Thêm ảnh minh họa
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Add Next Step Full Width CTA */}
                  <button
                    className="w-full py-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary font-title-md text-title-md font-bold flex items-center justify-center gap-2 transition-all"
                    onClick={handleAddStep}
                    type="button"
                  >
                    <Icon name="add_circle" className="text-[22px]" />
                    <span>+ Thêm bước tiếp theo vào quy trình</span>
                  </button>
                </section>

                {/* PHẦN 4: DINH DƯỠNG & PHÂN LOẠI */}
                <section
                  className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-lg scroll-mt-28"
                  id="section-dinh-duong"
                >
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-mono-sm text-[13px] font-bold">
                        04
                      </span>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          Dinh dưỡng &amp; Phân loại
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Giúp người dùng dễ dàng tìm thấy công thức qua bộ lọc tìm kiếm thông minh
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-mono-sm text-[11px]">
                      Tùy chọn nâng cao
                    </span>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                    {/* Category Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-body-sm text-body-sm font-semibold text-on-surface"
                        htmlFor="select-category"
                      >
                        Danh mục món ăn
                      </label>
                      <select
                        className="w-full px-4 py-2.5 rounded-xl bg-surface text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        id="select-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="mon-kho">Món chính • Món cá kho tộ</option>
                        <option value="mon-canh">Món canh • Canh chua / Canh rau</option>
                        <option value="mon-xao">Món xào • Xào lăn / Rang xém</option>
                        <option value="mon-chay">Món chay • Thanh tịnh thuần thực vật</option>
                      </select>
                    </div>

                    {/* Regional Cuisine Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Ẩm thực vùng miền
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["Bắc", "Trung", "Nam", "Tây Bắc"].map((region) => (
                          <button
                            key={region}
                            className={`py-2 rounded-xl font-body-sm text-body-sm font-medium text-center transition-colors ${
                              cuisineRegion === region
                                ? "bg-primary text-on-primary font-bold shadow-sm"
                                : "bg-surface hover:bg-surface-container text-tertiary"
                            }`}
                            onClick={() => setCuisineRegion(region)}
                            type="button"
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dietary & Health Chips */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Đặc tính bữa ăn &amp; Lợi ích
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Đậm đà đưa cơm",
                        "Giàu đạm nạc",
                        "Cay nồng",
                        "Ít dầu mỡ",
                        "Tốt cho tim mạch",
                        "Không đường tinh luyện",
                      ].map((chip) => (
                        <button
                          key={chip}
                          className={`px-3.5 py-1.5 rounded-full font-body-sm text-body-sm transition-colors ${
                            selectedChips.includes(chip)
                              ? "bg-secondary-fixed text-on-secondary-fixed font-semibold"
                              : "bg-surface hover:bg-surface-container text-on-surface-variant font-medium"
                          }`}
                          onClick={() => toggleChip(chip)}
                          type="button"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Tags Management */}
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-body-sm text-body-sm font-semibold text-on-surface"
                      htmlFor="input-add-tag"
                    >
                      Từ khóa tìm kiếm (Tags)
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-surface shadow-sm">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-highest font-label-mono-sm text-label-mono-sm text-on-surface font-medium"
                        >
                          #{tag}
                          <button
                            aria-label="Xóa thẻ"
                            className="hover:text-error"
                            onClick={() => handleRemoveTag(tag)}
                            type="button"
                          >
                            <Icon name="close" className="text-[14px]" />
                          </button>
                        </span>
                      ))}
                      <input
                        className="flex-1 min-w-[200px] px-2 py-1 bg-transparent font-body-sm text-body-sm focus:outline-none text-on-surface placeholder:text-outline"
                        id="input-add-tag"
                        placeholder="+ Nhập thêm tag rồi nhấn Enter..."
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                    </div>
                  </div>

                  {/* Automated Nutrition Estimate Box with Switch */}
                  <div className="p-space-md rounded-2xl bg-surface flex flex-col gap-space-sm shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="monitor_heart" className="text-[20px] text-secondary" />
                        <span className="font-title-md text-title-md font-bold text-on-surface">
                          Ước tính dinh dưỡng (Tự động theo khẩu phần)
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={showNutrition}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={(e) => setShowNutrition(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        <span className="ml-2 font-body-sm text-body-sm text-on-surface-variant font-medium">
                          Hiển thị
                        </span>
                      </label>
                    </div>

                    {/* Nutrient Stats Cards */}
                    {showNutrition && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-1">
                        <div className="p-3 rounded-xl bg-surface-container-lowest text-center shadow-sm">
                          <span className="font-label-mono-sm text-[11px] text-tertiary block">
                            Năng lượng
                          </span>
                          <span className="font-headline-sm text-headline-sm font-bold text-primary">
                            ~385
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-tertiary">
                            kcal / phần
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-surface-container-lowest text-center shadow-sm">
                          <span className="font-label-mono-sm text-[11px] text-tertiary block">
                            Chất đạm
                          </span>
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            36
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-tertiary">gram</span>
                        </div>
                        <div className="p-3 rounded-xl bg-surface-container-lowest text-center shadow-sm">
                          <span className="font-label-mono-sm text-[11px] text-tertiary block">
                            Chất béo
                          </span>
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            18
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-tertiary">gram</span>
                        </div>
                        <div className="p-3 rounded-xl bg-surface-container-lowest text-center shadow-sm">
                          <span className="font-label-mono-sm text-[11px] text-tertiary block">
                            Tinh bột
                          </span>
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            8
                          </span>
                          <span className="font-label-mono-sm text-[10px] text-tertiary">gram</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* PHẦN 5: THANH ĐIỀU HƯỚNG CUỐI TRANG */}
                <section
                  className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md scroll-mt-28"
                  id="section-xuat-ban"
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                      <Icon name="check_circle" className="text-[20px] text-secondary" />
                    </div>
                    <div>
                      <p className="font-title-md text-title-md font-bold text-on-surface leading-tight">
                        Đã điền đủ tất cả các trường bắt buộc
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                        Công thức của bạn đã sẵn sàng chuyển tới ban ẩm thực xét duyệt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs sm:gap-space-sm w-full sm:w-auto justify-end">
                    <button
                      className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors"
                      onClick={() => showToast("Đã lưu bản nháp thành công!")}
                      type="button"
                    >
                      Lưu bản nháp
                    </button>
                    <Link
                      className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-colors"
                      href="/recipes/ca-loc-kho-to"
                    >
                      Xem trước
                    </Link>
                    <button
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-2"
                      onClick={() => showToast("Công thức đã được gửi tới ban biên tập ẩm thực để duyệt!")}
                      type="button"
                    >
                      <Icon name="task_alt" className="text-[20px]" />
                      <span>Gửi duyệt ngay</span>
                    </button>
                  </div>
                </section>
              </section>
            </div>
          </div>

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
    </>
  );
}
