"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

interface MobileIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface MobileStep {
  id: string;
  number: number;
  title: string;
  content: string;
  timerMinutes: number;
  image?: string;
}

export function RecipeEditorMobile() {
  const router = useRouter();

  // Basic info states
  const [title, setTitle] = React.useState("Canh chua cá lóc miền Tây");
  const [desc, setDesc] = React.useState(
    "Hương vị chua thanh mát dịu từ nước cốt me, cá lóc đồng ngọt bùi chắc thịt hòa quyện cùng bạc hà giòn rụm và mùi thơm ngát của ngò om."
  );
  const [prepTime, setPrepTime] = React.useState(20);
  const [cookTime, setCookTime] = React.useState(35);
  const [servings, setServings] = React.useState(4);
  const [difficulty, setDifficulty] = React.useState<"easy" | "medium" | "hard">("medium");

  // Stepper state
  const [currentStepIndex, setCurrentStepIndex] = React.useState(1);

  // Ingredients state
  const [ingredients, setIngredients] = React.useState<MobileIngredient[]>([
    { id: "1", name: "Cá lóc đồng làm sạch", amount: "500", unit: "g" },
    { id: "2", name: "Dọc mùng (bạc hà tươi)", amount: "200", unit: "g" },
    { id: "3", name: "Thơm mật (dứa)", amount: "1/2", unit: "quả" },
    { id: "4", name: "Cà chua chín mọng", amount: "2", unit: "quả" },
    { id: "5", name: "Me chín ngào lấy nước cốt", amount: "3", unit: "muỗng" },
  ]);

  // Steps state
  const [steps, setSteps] = React.useState<MobileStep[]>([
    {
      id: "s1",
      number: 1,
      title: "Sơ chế cá và các loại rau gia vị",
      content:
        "Cá lóc xát muối và rượu trắng rửa sạch nhớt, cắt khúc dày 2-3cm. Bạc hà tước vỏ xéo khúc, bóp nhẹ chút muối cho bớt ngứa rồi rửa sạch vắt ráo.",
      timerMinutes: 10,
    },
    {
      id: "s2",
      number: 2,
      title: "Nấu nước dùng chua ngọt & nêm vị",
      content:
        "Phi thơm tỏi băm trong nồi, xào sơ cà chua và dứa cho thơm. Đổ 1.2 lít nước vào đun sôi, chắt nước cốt me vào nêm 2 muỗng nước mắm ngon, 1.5 muỗng đường.",
      timerMinutes: 15,
    },
  ]);

  // Toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length <= 1) {
      showToast("Cần tối thiểu 1 nguyên liệu");
      return;
    }
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    showToast("Đã xóa nguyên liệu");
  };

  const addIngredient = () => {
    const newId = Date.now().toString();
    setIngredients((prev) => [
      ...prev,
      { id: newId, name: "", amount: "", unit: "g" },
    ]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) {
      showToast("Cần tối thiểu 1 bước thực hiện");
      return;
    }
    setSteps((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, number: idx + 1 }))
    );
    showToast("Đã xóa bước");
  };

  const addStep = () => {
    const nextNum = steps.length + 1;
    setSteps((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        number: nextNum,
        title: `Bước ${nextNum}`,
        content: "",
        timerMinutes: 10,
      },
    ]);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* ── Mobile Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(40,25,18,0.04)] pt-safe">
        <div className="h-16 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <button
              aria-label="Quay lại"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface hover:text-primary active:scale-95 transition-transform cursor-pointer"
              onClick={() => router.back()}
              type="button"
            >
              <Icon name="arrow_back" size={24} />
            </button>
            <h1 className="font-title-md text-title-md text-on-surface font-semibold truncate pr-2">
              Biên Soạn Công Thức
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Thao tác phụ"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary active:scale-95 transition-transform cursor-pointer"
              type="button"
              onClick={() => showToast("Đã mở menu tùy chọn")}
            >
              <Icon name="more_vert" size={22} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Form Content ── */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-safe bg-surface">
        <div className="flex flex-col w-full pb-32">
          {/* Top Bar State & Progress Indicator */}
          <section className="px-5 pt-2 pb-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
                <span>Đã lưu tự động lúc 10:24</span>
              </div>
              <button
                className="px-3 py-1.5 rounded-full text-on-surface-variant font-body-sm text-body-sm hover:text-primary hover:bg-surface-container active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
                type="button"
                onClick={() => showToast("Đã lưu bản nháp thành công!")}
              >
                <Icon name="bookmark" size={16} />
                <span>Lưu nháp</span>
              </button>
            </div>

            {/* Stepper Indicator */}
            <div className="bg-surface-container-low p-2 rounded-xl flex items-center justify-between gap-1 shadow-sm">
              <div
                className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => setCurrentStepIndex(1)}
              >
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <span className="font-body-sm text-body-sm font-semibold text-primary truncate">
                  Cơ bản
                </span>
              </div>
              <div className="w-3 h-0.5 bg-outline-variant shrink-0" />
              <div
                className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => setCurrentStepIndex(2)}
              >
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container font-label-mono-sm text-label-mono-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <span className="font-body-sm text-body-sm text-on-surface truncate">
                  Nguyên liệu
                </span>
              </div>
              <div className="w-3 h-0.5 bg-outline-variant shrink-0" />
              <div
                className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => setCurrentStepIndex(3)}
              >
                <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-label-mono-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Các bước
                </span>
              </div>
              <div className="w-3 h-0.5 bg-outline-variant shrink-0" />
              <div
                className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                onClick={() => setCurrentStepIndex(4)}
              >
                <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-label-mono-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Thẻ
                </span>
              </div>
            </div>
          </section>

          {/* Phần 1: Thông tin cơ bản */}
          <section className="px-5 pt-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                1. Thông tin món ăn
              </h2>
              <span className="font-label-mono-sm text-label-mono-sm text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-medium">
                Bắt buộc
              </span>
            </div>

            {/* Media Cover Upload Box */}
            <div className="flex flex-col gap-1">
              <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                Ảnh bìa đại diện món ăn
              </label>
              <div
                className="relative w-full h-48 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden group active:scale-[0.99] transition-transform border border-dashed border-outline/30"
                onClick={() => showToast("Chọn ảnh bìa từ thư viện")}
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-2 group-hover:bg-primary-fixed transition-colors">
                  <Icon name="add_a_photo" size={26} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body-md text-body-md font-semibold text-primary">
                    Chạm để tải ảnh lên
                  </span>
                  <span className="text-on-surface-variant font-body-sm text-body-sm">hoặc</span>
                  <span className="font-body-md text-body-md font-semibold text-secondary">
                    chụp mới
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Khuyến nghị tỷ lệ ngang 16:9, độ phân giải tối thiểu 1280x720px
                </p>
                <div className="absolute bottom-2 right-2 bg-inverse-surface/80 text-inverse-on-surface px-2 py-1 rounded-md text-[11px] font-label-mono-sm tracking-wide flex items-center gap-1">
                  <Icon name="aspect_ratio" size={13} />
                  16:9
                </div>
              </div>
            </div>

            {/* Dish Title */}
            <div className="flex flex-col gap-1">
              <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="m-recipe-title">
                Tên món ăn
              </label>
              <input
                className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-title-md text-title-md placeholder:text-outline shadow-sm focus:outline-none focus:shadow-md"
                id="m-recipe-title"
                placeholder="vd: Canh chua cá lóc miền Tây"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Dish Description */}
            <div className="flex flex-col gap-1">
              <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="m-recipe-desc">
                Mô tả hương vị &amp; nguồn gốc
              </label>
              <textarea
                className="w-full p-4 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline shadow-sm focus:outline-none focus:shadow-md resize-none"
                id="m-recipe-desc"
                placeholder="Hương vị chua thanh mát từ me chín, cá lóc ngọt thịt tự nhiên cùng các loại rau thơm đặc trưng Nam Bộ..."
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            {/* Recipe Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col justify-between min-h-[90px]">
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <Icon name="timer" size={18} />
                  <span className="font-body-sm text-body-sm">Chuẩn bị</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-16 font-headline-sm text-headline-sm font-bold text-on-surface bg-transparent focus:outline-none"
                  />
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">phút</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col justify-between min-h-[90px]">
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <Icon name="skillet" size={18} />
                  <span className="font-body-sm text-body-sm">Thời gian nấu</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="w-16 font-headline-sm text-headline-sm font-bold text-primary bg-transparent focus:outline-none"
                  />
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">phút</span>
                </div>
              </div>
              <div className="col-span-2 bg-surface-container-lowest p-3 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="group" size={20} />
                  </div>
                  <div>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Khẩu phần phục vụ
                    </div>
                    <div className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Tiêu chuẩn bàn ăn
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-container px-2 py-1 rounded-lg">
                  <button
                    aria-label="Giảm khẩu phần"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface active:scale-90 transition-transform cursor-pointer"
                    type="button"
                    onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                  >
                    <Icon name="remove" size={18} />
                  </button>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface px-1.5 min-w-[32px] text-center">
                    {servings}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mr-1">người</span>
                  <button
                    aria-label="Tăng khẩu phần"
                    className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                    type="button"
                    onClick={() => setServings((prev) => Math.min(20, prev + 1))}
                  >
                    <Icon name="add" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Difficulty Level Choice */}
            <div className="flex flex-col gap-1">
              <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                Mức độ thử thách kỹ thuật
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`py-2.5 px-3 rounded-full font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
                    difficulty === "easy"
                      ? "bg-primary text-on-primary font-semibold shadow-md"
                      : "bg-surface-container-lowest text-on-surface shadow-sm"
                  }`}
                  type="button"
                  onClick={() => setDifficulty("easy")}
                >
                  <span className="w-2 h-2 rounded-full bg-secondary-container" />
                  <span>Dễ làm</span>
                </button>
                <button
                  className={`py-2.5 px-3 rounded-full font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
                    difficulty === "medium"
                      ? "bg-primary text-on-primary font-semibold shadow-md"
                      : "bg-surface-container-lowest text-on-surface shadow-sm"
                  }`}
                  type="button"
                  onClick={() => setDifficulty("medium")}
                >
                  {difficulty === "medium" && <Icon name="check_circle" size={16} />}
                  <span>Vừa phải</span>
                </button>
                <button
                  className={`py-2.5 px-3 rounded-full font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
                    difficulty === "hard"
                      ? "bg-primary text-on-primary font-semibold shadow-md"
                      : "bg-surface-container-lowest text-on-surface shadow-sm"
                  }`}
                  type="button"
                  onClick={() => setDifficulty("hard")}
                >
                  <span className="w-2 h-2 rounded-full bg-error-container" />
                  <span>Thử thách</span>
                </button>
              </div>
            </div>
          </section>

          {/* Phần 2: Nguyên liệu cần thiết */}
          <section className="px-5 pt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  2. Định lượng nguyên liệu
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tối thiểu 3 nguyên liệu để người đọc tiện chuẩn bị
                </p>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary bg-secondary-fixed px-2.5 py-1 rounded-full font-semibold">
                {ingredients.length} món
              </span>
            </div>

            {/* Ingredient Rows */}
            <div className="flex flex-col gap-2">
              {ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex items-center gap-2"
                >
                  <Icon name="drag_indicator" size={20} className="text-outline cursor-grab shrink-0" />
                  <div className="flex-1 min-w-0">
                    <input
                      className="w-full bg-transparent font-body-md text-body-md font-medium text-on-surface focus:outline-none"
                      type="text"
                      value={ing.name}
                      placeholder="Tên nguyên liệu"
                      onChange={(e) => {
                        const val = e.target.value;
                        setIngredients((prev) =>
                          prev.map((i) => (i.id === ing.id ? { ...i, name: val } : i))
                        );
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      className="w-14 text-right bg-surface-container-low px-2 py-1 rounded-lg font-label-mono-sm text-label-mono-sm font-semibold text-on-surface focus:outline-none"
                      type="text"
                      value={ing.amount}
                      placeholder="SL"
                      onChange={(e) => {
                        const val = e.target.value;
                        setIngredients((prev) =>
                          prev.map((i) => (i.id === ing.id ? { ...i, amount: val } : i))
                        );
                      }}
                    />
                    <input
                      className="w-14 text-center bg-transparent font-body-sm text-body-sm text-on-surface-variant focus:outline-none"
                      type="text"
                      value={ing.unit}
                      placeholder="ĐVT"
                      onChange={(e) => {
                        const val = e.target.value;
                        setIngredients((prev) =>
                          prev.map((i) => (i.id === ing.id ? { ...i, unit: val } : i))
                        );
                      }}
                    />
                    <button
                      aria-label="Xoá nguyên liệu"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container/40 active:scale-90 transition-transform cursor-pointer"
                      type="button"
                      onClick={() => removeIngredient(ing.id)}
                    >
                      <Icon name="delete" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Button */}
            <button
              className="w-full h-12 rounded-xl bg-surface-container-low text-primary font-body-md text-body-md font-semibold flex items-center justify-center gap-2 hover:bg-primary-fixed active:scale-[0.98] transition-all cursor-pointer border border-dashed border-primary/30"
              type="button"
              onClick={addIngredient}
            >
              <Icon name="add_circle" size={20} />
              <span>Thêm dòng nguyên liệu</span>
            </button>
          </section>

          {/* Phần 3: Các bước thực hiện */}
          <section className="px-5 pt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  3. Các bước thực hiện
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chia nhỏ từng công đoạn giúp người xem dễ làm theo
                </p>
              </div>
            </div>

            {/* Step Cards */}
            {steps.map((st) => (
              <div
                key={st.id}
                className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-bold flex items-center justify-center shrink-0">
                      {st.number}
                    </span>
                    <input
                      className="font-title-md text-title-md font-bold text-on-surface bg-transparent focus:outline-none flex-1"
                      type="text"
                      value={st.title}
                      placeholder="Tiêu đề bước"
                      onChange={(e) => {
                        const val = e.target.value;
                        setSteps((prev) =>
                          prev.map((s) => (s.id === st.id ? { ...s, title: val } : s))
                        );
                      }}
                    />
                  </div>
                  <button
                    aria-label={`Xoá bước ${st.number}`}
                    className="text-outline hover:text-error transition-colors cursor-pointer"
                    type="button"
                    onClick={() => removeStep(st.id)}
                  >
                    <Icon name="close" size={20} />
                  </button>
                </div>
                <textarea
                  className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none resize-none"
                  rows={3}
                  value={st.content}
                  placeholder="Mô tả chi tiết bước thực hiện..."
                  onChange={(e) => {
                    const val = e.target.value;
                    setSteps((prev) =>
                      prev.map((s) => (s.id === st.id ? { ...s, content: val } : s))
                    );
                  }}
                />
                {/* Step Media & Step Timer Control */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div
                    className="h-24 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:bg-surface-container transition-colors border border-dashed border-outline/30"
                    onClick={() => showToast(`Chọn ảnh cho bước ${st.number}`)}
                  >
                    <Icon name="image" size={24} className="text-primary mb-1" />
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">
                      Thêm ảnh minh họa
                    </span>
                  </div>
                  <div className="h-24 rounded-xl bg-surface-container-low p-2 flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Icon name="hourglass_bottom" size={16} className="text-primary" />
                      <span className="font-body-sm text-body-sm font-medium">Bấm giờ bước</span>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-lowest rounded-lg p-1 justify-center">
                      <Icon name="schedule" size={16} className="text-outline" />
                      <input
                        className="w-12 text-center font-label-mono-sm text-label-mono-sm font-bold bg-transparent focus:outline-none"
                        type="number"
                        value={st.timerMinutes}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSteps((prev) =>
                            prev.map((s) => (s.id === st.id ? { ...s, timerMinutes: val } : s))
                          );
                        }}
                      />
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        phút
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Step Add Button */}
            <button
              className="w-full h-12 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md font-semibold flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all cursor-pointer"
              type="button"
              onClick={addStep}
            >
              <Icon name="post_add" size={20} className="text-primary" />
              <span>Thêm bước tiếp theo</span>
            </button>
          </section>

          {/* Spam & Community Review Notice */}
          <section className="px-5 pt-6">
            <div className="bg-primary-fixed/60 p-4 rounded-2xl flex items-start gap-3 text-on-primary-fixed shadow-sm">
              <Icon name="verified_user" size={24} className="text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-title-md text-title-md font-bold text-on-primary-fixed">
                  Kiểm duyệt chống nội dung rác
                </span>
                <p className="font-body-sm text-body-sm text-on-primary-fixed-variant leading-relaxed">
                  Tài khoản thành viên mới: Công thức sẽ được đội ngũ ẩm thực kiểm duyệt trong vòng 60 phút trước khi hiển thị công khai trên cộng đồng RecipeHub.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(40,25,18,0.06)] pb-safe">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center gap-3">
          {/* Preview button */}
          <button
            className="flex-1 h-12 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            type="button"
            onClick={() => showToast("Đang chuẩn bị bản xem trước...")}
          >
            <Icon name="visibility" size={20} />
            <span>Xem trước</span>
          </button>
          {/* Primary Publish button */}
          <button
            className="flex-[1.4] h-12 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            type="button"
            onClick={() => showToast("Đã gửi công thức thành công! Đang chờ kiểm duyệt.")}
          >
            <span>Gửi duyệt</span>
            <Icon name="send" size={20} />
          </button>
        </div>
      </div>

      {/* Dynamic Toast */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-5 z-50 transition-all duration-300">
          <div className="p-3.5 rounded-xl bg-on-surface text-surface shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Icon name="check_circle" size={22} className="text-secondary-fixed" />
            <span className="font-body-sm text-body-sm text-surface font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
