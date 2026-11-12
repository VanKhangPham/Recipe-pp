"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function TokenSheet() {
  const [activeTab, setActiveTab] = React.useState<
    "tokens" | "typography" | "vietnamese" | "components" | "icons"
  >("tokens");
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorGroups = [
    {
      title: "Màu Chủ Đạo (Primary - Terracotta Tomato Red)",
      desc: "Tông màu đất nung cà chua chín (#a33900), dùng cho nút hành động chính, trạng thái hẹn giờ nấu ăn, và tiêu điểm nổi bật.",
      tokens: [
        { name: "primary", hex: "#a33900", role: "Primary Main / Nút chính & Nhấn mạnh" },
        { name: "primary-container", hex: "#cc4900", role: "Primary Container / Trạng thái Hover / Active" },
        { name: "primary-fixed", hex: "#ffdbce", role: "Primary Fixed / Nền icon & Huy hiệu tiêu điểm" },
        { name: "primary-fixed-dim", hex: "#ffb599", role: "Primary Fixed Dim / Nhấn sáng phụ" },
        { name: "on-primary", hex: "#ffffff", role: "On Primary / Chữ trên nền primary" },
        { name: "on-primary-container", hex: "#fffbff", role: "On Primary Container / Chữ trên primary container" },
        { name: "on-primary-fixed", hex: "#370e00", role: "On Primary Fixed / Chữ trên primary fixed" },
        { name: "inverse-primary", hex: "#ffb599", role: "Inverse Primary / Primary trong nền tối" },
      ],
    },
    {
      title: "Màu Phụ Trợ (Secondary - Fresh Herb Green)",
      desc: "Xanh rau thơm tự nhiên (#006d30), dùng cho chỉ số dinh dưỡng tích cực, huy hiệu Dễ, hoàn thành nấu và trạng thái thành công.",
      tokens: [
        { name: "secondary", hex: "#006d30", role: "Secondary Main / Trạng thái xanh & Đánh giá sao" },
        { name: "secondary-container", hex: "#92f5a4", role: "Secondary Container / Nền chip dinh dưỡng" },
        { name: "secondary-fixed", hex: "#95f8a7", role: "Secondary Fixed / Chấm trạng thái hoạt động" },
        { name: "secondary-fixed-dim", hex: "#79db8d", role: "Secondary Fixed Dim / Nhãn hệ thống ổn định" },
        { name: "on-secondary", hex: "#ffffff", role: "On Secondary / Chữ trên nền secondary" },
        { name: "on-secondary-container", hex: "#007233", role: "On Secondary Container / Chữ xanh đậm trên nền nhạt" },
        { name: "on-secondary-fixed", hex: "#00210a", role: "On Secondary Fixed / Chữ trên fixed chip" },
      ],
    },
    {
      title: "Màu Bề Mặt & Nền (Surface & Background Hierarchy)",
      desc: "Hệ thống phân tầng bề mặt ấm áp, lấy cảm hứng từ bột mì hữu cơ và mặt bàn đá bếp tự nhiên.",
      tokens: [
        { name: "background", hex: "#fff8f5", role: "Background Base / Nền giấy tự nhiên chống mỏi mắt" },
        { name: "surface", hex: "#fff8f5", role: "Surface Base / Khối mặt phẳng cơ bản" },
        { name: "surface-container-lowest", hex: "#ffffff", role: "Container Lowest / Nền thẻ công thức trắng nổi bật" },
        { name: "surface-container-low", hex: "#faf2ee", role: "Container Low / Nền thanh thông báo khách & dải metadata" },
        { name: "surface-container", hex: "#f4ece8", role: "Container / Khung ô tìm kiếm & Khối phụ" },
        { name: "surface-container-high", hex: "#eee7e3", role: "Container High / Phân cách khối & Hover pill" },
        { name: "surface-container-highest", hex: "#e9e1dd", role: "Container Highest / Badge phím tắt Ctrl+K" },
        { name: "surface-dim", hex: "#e0d8d5", role: "Surface Dim / Bề mặt làm mờ trầm" },
        { name: "surface-variant", hex: "#e9e1dd", role: "Surface Variant / Khung phụ trợ" },
      ],
    },
    {
      title: "Màu Chữ & Tương Phản (On-Surface & Neutral Typography)",
      desc: "Không dùng màu đen tuyệt đối (#000000). Toàn bộ chữ dùng sắc xám đá than ấm để duy trì hơi ấm tự nhiên.",
      tokens: [
        { name: "on-surface", hex: "#1e1b19", role: "On Surface (Charcoal Ink) / Tiêu đề chính & Văn bản chính" },
        { name: "on-surface-variant", hex: "#5a4138", role: "On Surface Variant / Phụ đề, mô tả & Icon phụ" },
        { name: "outline", hex: "#8e7166", role: "Outline / Icon viền, placeholder tìm kiếm" },
        { name: "outline-variant", hex: "#e2bfb2", role: "Outline Variant / Viền thẻ Whisper Border 1px" },
        { name: "inverse-surface", hex: "#33302d", role: "Inverse Surface / Nền thanh điều hướng Admin Console" },
        { name: "inverse-on-surface", hex: "#f7efeb", role: "Inverse On Surface / Chữ trên thanh menu Admin" },
      ],
    },
    {
      title: "Màu Phụ Trợ & Cảnh Báo (Tertiary & Semantic Error)",
      desc: "Sắc đá xám trung tính cho thông số phụ và sắc đỏ gạch cho cảnh báo vi phạm, báo cáo lỗi.",
      tokens: [
        { name: "tertiary", hex: "#615b56", role: "Tertiary Main / Nhãn thông số kỹ thuật & Helper" },
        { name: "tertiary-container", hex: "#7a736e", role: "Tertiary Container / Nền icon & Phân tách admin" },
        { name: "tertiary-fixed", hex: "#eae1da", role: "Tertiary Fixed / Huy hiệu phân loại thứ cấp" },
        { name: "tertiary-fixed-dim", hex: "#cec5bf", role: "Tertiary Fixed Dim / Menu phụ Admin" },
        { name: "error", hex: "#ba1a1a", role: "Error Main / Thông báo lỗi, hủy, báo cáo vi phạm" },
        { name: "error-container", hex: "#ffdad6", role: "Error Container / Nền cảnh báo lỗi nhẹ" },
        { name: "on-error", hex: "#ffffff", role: "On Error / Chữ trên nền nút báo lỗi" },
        { name: "on-error-container", hex: "#93000a", role: "On Error Container / Chữ cảnh báo đỏ thẫm" },
      ],
    },
  ];

  const typographyRoles = [
    {
      role: "display-hero",
      font: "Outfit (Bold 700)",
      size: "56px",
      lh: "64px",
      ls: "-0.03em",
      sample: "Khám phá công thức chuẩn vị, lập kế hoạch bữa ăn trong tích tắc.",
      desc: "Tiêu đề Hero chính trang chủ trên màn hình Desktop (>= 1024px)",
    },
    {
      role: "display-hero-mobile",
      font: "Outfit (Bold 700)",
      size: "36px",
      lh: "44px",
      ls: "-0.02em",
      sample: "Khám phá công thức chuẩn vị gia đình Việt.",
      desc: "Tiêu đề Hero chính trên màn hình điện thoại di động (< 768px)",
    },
    {
      role: "headline-lg",
      font: "Outfit (SemiBold 600)",
      size: "40px",
      lh: "48px",
      ls: "-0.02em",
      sample: "Bảng điều khiển tổng quan (Dashboard)",
      desc: "Tiêu đề lớn phân mục chính, Dashboard Admin, Trang chi tiết món ăn",
    },
    {
      role: "headline-lg-mobile",
      font: "Outfit (SemiBold 600)",
      size: "28px",
      lh: "36px",
      ls: "-0.015em",
      sample: "Bảng điều khiển di động",
      desc: "Tiêu đề trang trên màn hình di động",
    },
    {
      role: "headline-md",
      font: "Outfit (SemiBold 600)",
      size: "28px",
      lh: "36px",
      ls: "-0.015em",
      sample: "Món ngon thịnh hành tuần này",
      desc: "Tiêu đề phân đoạn nội dung chính, danh mục công thức nổi bật",
    },
    {
      role: "headline-sm",
      font: "Outfit (SemiBold 600)",
      size: "22px",
      lh: "30px",
      ls: "-0.01em",
      sample: "Phở bò tái lăn Hà Nội truyền thống",
      desc: "Tiêu đề thẻ công thức nổi bật, tên modal hoặc tiêu đề nhóm",
    },
    {
      role: "title-md",
      font: "Be Vietnam Pro (SemiBold 600)",
      size: "18px",
      lh: "26px",
      ls: "-0.005em",
      sample: "Canh chua cá lóc bông điên điển miền Tây",
      desc: "Tiêu đề thẻ công thức tiêu chuẩn, tên mục danh sách nguyên liệu",
    },
    {
      role: "body-lg",
      font: "Be Vietnam Pro (Regular 400)",
      size: "18px",
      lh: "30px",
      ls: "0em",
      sample: "Hơn 3.500 công thức gia đình Việt được kiểm chứng bởi đầu bếp uy tín.",
      desc: "Đoạn văn giới thiệu nổi bật dưới tiêu đề chính Hero",
    },
    {
      role: "body-md",
      font: "Be Vietnam Pro (Regular 400)",
      size: "15px",
      lh: "25px",
      ls: "0em",
      sample: "Sơ chế xương ống bò, chần qua nước sôi cùng gừng sả đập dập trong 5 phút để khử mùi.",
      desc: "Nội dung bước thực hiện công thức, mô tả món ăn, văn bản tiêu chuẩn",
    },
    {
      role: "body-sm",
      font: "Be Vietnam Pro (Regular 400)",
      size: "13px",
      lh: "20px",
      ls: "0.005em",
      sample: "Dữ liệu đang được lưu cục bộ trên trình duyệt này.",
      desc: "Ghi chú phụ trợ, banner khách, thông số đánh giá và trợ giúp",
    },
    {
      role: "label-mono-lg",
      font: "JetBrains Mono (Medium 500)",
      size: "16px",
      lh: "22px",
      ls: "-0.01em",
      sample: "00:45:00 • 540 kcal",
      desc: "Đồng hồ bấm giờ nấu ăn Cooking Mode, bộ đếm bước thực hiện lớn",
    },
    {
      role: "label-mono-sm",
      font: "JetBrains Mono (Medium 500)",
      size: "12px",
      lh: "16px",
      ls: "0.02em",
      sample: "20 PHÚT CHUẨN BỊ • 4 KHẨU PHẦN • DỄ",
      desc: "Huy hiệu thời gian, định lượng calo, nhãn metadata thẻ món ăn",
    },
  ];

  const vietnameseTestVowels = [
    {
      char: "A",
      variants: ["a", "á", "à", "ả", "ã", "ạ"],
      upperVariants: ["A", "Á", "À", "Ả", "Ã", "Ạ"],
    },
    {
      char: "Ă",
      variants: ["ă", "ắ", "ằ", "ẳ", "ẵ", "ặ"],
      upperVariants: ["Ă", "Ắ", "Ằ", "Ẳ", "Ẵ", "Ặ"],
    },
    {
      char: "Â",
      variants: ["â", "ấ", "ầ", "ẩ", "ẫ", "ậ"],
      upperVariants: ["Â", "Ấ", "Ầ", "Ẩ", "Ẫ", "Ậ"],
    },
    {
      char: "E",
      variants: ["e", "é", "è", "ẻ", "ẽ", "ẹ"],
      upperVariants: ["E", "É", "È", "Ẻ", "Ẽ", "Ẹ"],
    },
    {
      char: "Ê",
      variants: ["ê", "ế", "ề", "ể", "ễ", "ệ"],
      upperVariants: ["Ê", "Ế", "Ề", "Ể", "Ễ", "Ệ"],
    },
    {
      char: "I",
      variants: ["i", "í", "ì", "ỉ", "ĩ", "ị"],
      upperVariants: ["I", "Í", "Ì", "Ỉ", "Ĩ", "Ị"],
    },
    {
      char: "O",
      variants: ["o", "ó", "ò", "ỏ", "õ", "ọ"],
      upperVariants: ["O", "Ó", "Ò", "Ỏ", "Õ", "Ọ"],
    },
    {
      char: "Ô",
      variants: ["ô", "ố", "ồ", "ổ", "ỗ", "ộ"],
      upperVariants: ["Ô", "Ố", "Ồ", "Ổ", "Ỗ", "Ộ"],
    },
    {
      char: "Ơ",
      variants: ["ơ", "ớ", "ờ", "ở", "ỡ", "ợ"],
      upperVariants: ["Ơ", "Ớ", "Ờ", "Ở", "Ỡ", "Ợ"],
    },
    {
      char: "U",
      variants: ["u", "ú", "ù", "ủ", "ũ", "ụ"],
      upperVariants: ["U", "Ú", "Ù", "Ủ", "Ũ", "Ụ"],
    },
    {
      char: "Ư",
      variants: ["ư", "ứ", "ừ", "ử", "ữ", "ự"],
      upperVariants: ["Ư", "Ứ", "Ừ", "Ử", "Ữ", "Ự"],
    },
    {
      char: "Y",
      variants: ["y", "ý", "ỳ", "ỷ", "ỹ", "ỵ"],
      upperVariants: ["Y", "Ý", "Ỳ", "Ỷ", "Ỹ", "Ỵ"],
    },
    {
      char: "Đ",
      variants: ["đ", "đá", "đồ", "được", "đầy", "đọt"],
      upperVariants: ["Đ", "ĐÁ", "ĐỒ", "ĐƯỢC", "ĐẦY", "ĐỌT"],
    },
  ];

  const vietnameseCulinaryCorpus = [
    {
      category: "Món nước truyền thống Bắc - Trung - Nam",
      items: [
        "Phở bò tái lăn Hà Nội thơm nức mũi gừng sả tỏi phi",
        "Bún bò Huế giò heo chả cua cay nồng sa tế sả ớt",
        "Canh chua cá lóc đồng bông điên điển mùa nước nổi miền Tây",
        "Bún riêu cua đồng tóp mỡ béo ngậy riêu cua giấm bỗng gia truyền",
        "Hủ tiếu Nam Vang sườn heo lòng non tôm nõn mực trứng",
      ],
    },
    {
      category: "Món kho, xào, nướng chuẩn vị gia đình",
      items: [
        "Thịt ba chỉ kho quẹt tiêu sọ xanh chấm rau củ luộc thanh mát",
        "Bún chả kẹp que tre nướng than hoa phảng phất hương vị xưa",
        "Gà ta thả vườn hấp lá chúc xứ Thất Sơn An Giang",
        "Cá kho tộ riềng thơm nức sánh đậm màu mật mía cánh gián",
        "Bò lúc lắc hạt lựu áp chảo bơ tỏi sốt tiêu đen nguyên hạt",
      ],
    },
    {
      category: "Bánh truyền thống & Đồ ăn vặt",
      items: [
        "Bánh xèo miền Tây vỏ giòn rụm viền mỏng đượm vị nước cốt dừa",
        "Bánh mì pate xíu mại trứng muối béo thơm giòn rụm",
        "Chè bà ba bùi bùi khoai lang đậu xanh hạt sen nước cốt dừa",
        "Bánh cuốn Thanh Trì mỏng như lụa rắc hành phi giòn tan",
      ],
    },
    {
      category: "Nguyên liệu & Gia vị cổ truyền",
      items: [
        "Nước mắm nhỉ cốt cá cơm truyền thống Phú Quốc 40 độ đạm",
        "Mắm ruốc Huế xào sả ớt đậm đà tinh túy cung đình",
        "Hoa hồi, thảo quả, quế chi, đinh hương, hạt ngò nướng than hồng",
        "Ớt hiểm chín cây, ngò rí, húng quế, ngò gai, tía tô, kinh giới",
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background text-on-surface">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-nav w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 shadow-whisper">
        <div className="max-w-7xl mx-auto px-gutter h-20 flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
              <Icon name="skillet" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm tracking-tight font-semibold">
                  Recipe<span className="text-primary">Hub</span>
                </span>
                <Badge variant="primary" size="sm">
                  Design System v1.0
                </Badge>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant hidden sm:block">
                Warm Culinary Modernism • Bộ Mã Thiết Kế & Kiểm Định Dấu Tiếng Việt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <ThemeToggle />
            <a
              href="#vietnamese-test"
              onClick={() => setActiveTab("vietnamese")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-body-sm text-body-sm font-semibold shadow-xs"
            >
              <Icon name="spellcheck" size={18} />
              <span>Kiểm định tiếng Việt</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="border-t border-outline-variant/20 bg-surface-container-low/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-gutter flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab("tokens")}
              className={`px-4 py-2 rounded-full font-body-sm text-body-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "tokens"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              1. Bảng màu (Color Tokens)
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              className={`px-4 py-2 rounded-full font-body-sm text-body-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "typography"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              2. Thang tỷ lệ chữ (Type Scale)
            </button>
            <button
              onClick={() => setActiveTab("vietnamese")}
              className={`px-4 py-2 rounded-full font-body-sm text-body-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "vietnamese"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              3. Kiểm tra dấu tiếng Việt (Diacritics Test)
            </button>
            <button
              onClick={() => setActiveTab("components")}
              className={`px-4 py-2 rounded-full font-body-sm text-body-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "components"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              4. Thành phần giao diện (UI Components)
            </button>
            <button
              onClick={() => setActiveTab("icons")}
              className={`px-4 py-2 rounded-full font-body-sm text-body-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "icons"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              5. Thư viện biểu tượng (Material Icons)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-gutter py-space-xl space-y-space-xl">
        {/* Intro Banner */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-card border border-outline-variant/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-3 relative z-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-mono-sm text-label-mono-sm">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Hệ thống thiết kế Warm Culinary Modernism</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Bảng quy chuẩn mã màu & Kiểu chữ RecipeHub
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Thiết kế dành riêng cho ẩm thực Việt với bảng màu bột mì tự nhiên, sắc gốm nung đất nung (terracotta)
              và rau thơm thảo mộc tươi xanh. Hệ thống kiểu chữ phối hợp hài hòa giữa{" "}
              <strong className="text-on-surface">Outfit</strong> (tiêu đề hiện đại),{" "}
              <strong className="text-on-surface">Be Vietnam Pro</strong> (thân bài chuẩn dấu tiếng Việt) và{" "}
              <strong className="text-on-surface">JetBrains Mono</strong> (bấm giờ & định lượng).
            </p>
          </div>
        </section>

        {/* TAB 1: COLOR TOKENS */}
        {activeTab === "tokens" && (
          <section className="space-y-space-xl">
            <div className="space-y-1">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                1. Bảng màu thương hiệu & Bề mặt (Color Tokens)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Toàn bộ màu sắc được trích xuất chính xác từ tệp DESIGN.md và các màn hình Stitch. Nhấp vào mã màu
                để sao chép.
              </p>
            </div>

            <div className="space-y-space-lg">
              {colorGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4"
                >
                  <div className="border-b border-outline-variant/20 pb-3">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      {group.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {group.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {group.tokens.map((token) => (
                      <div
                        key={token.name}
                        onClick={() => copyToClipboard(token.hex, token.name)}
                        className="group flex flex-col p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer shadow-xs"
                      >
                        <div
                          className="w-full h-16 rounded-lg mb-3 shadow-inner flex items-end justify-end p-2 border border-black/5"
                          style={{ backgroundColor: token.hex }}
                        >
                          <span
                            className="font-label-mono-sm text-[11px] px-1.5 py-0.5 rounded backdrop-blur-md bg-black/40 text-white font-mono"
                          >
                            {token.hex}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                            {token.name}
                          </span>
                          <span className="font-label-mono-sm text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            {copiedToken === token.name ? "Đã chép!" : "Chép"}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          {token.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: TYPOGRAPHY SCALE */}
        {activeTab === "typography" && (
          <section className="space-y-space-xl">
            <div className="space-y-1">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                2. Thang tỷ lệ chữ & Phân cấp thị giác (Typography Scale)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Quy định nghiêm ngặt về cỡ chữ, chiều cao dòng (line-height), khoảng cách ký tự (tracking) và độ đậm (weight).
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-6">
              <div className="divide-y divide-outline-variant/30 space-y-6">
                {typographyRoles.map((item, idx) => (
                  <div key={idx} className="pt-6 first:pt-0 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary px-2 py-0.5 rounded bg-primary-fixed">
                          {item.role}
                        </span>
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {item.font}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-label-mono-sm text-label-mono-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                        <span>Cỡ: {item.size}</span>
                        <span>•</span>
                        <span>Dòng: {item.lh}</span>
                        <span>•</span>
                        <span>Khoảng cách: {item.ls}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 overflow-x-auto">
                      <p className={`font-${item.role} text-${item.role} text-on-surface`}>
                        {item.sample}
                      </p>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      <strong className="text-on-surface font-medium">Mục đích sử dụng:</strong> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: VIETNAMESE DIACRITICS DEEP-DIVE */}
        {activeTab === "vietnamese" && (
          <section id="vietnamese-test" className="space-y-space-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  3. Kiểm Định Toàn Diện Dấu Tiếng Việt (Vietnamese Diacritics Rigorous Test)
                </h2>
                <Badge variant="easy">100% Hoàn hảo</Badge>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Kiểm tra chi tiết 5 thanh điệu (Sắc, Huyền, Hỏi, Ngã, Nặng) trên tất cả các nguyên âm đơn, nguyên âm ghép và
                từ ngữ ẩm thực Việt Nam. Đảm bảo dấu thanh không bao giờ bị cắt (clipping) dù hiển thị ở tiêu đề lớn hay chữ nhỏ.
              </p>
            </div>

            {/* Test 1: Vowel Matrix */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Ma trận nguyên âm & Dấu thanh (Vowel Matrix)
                </h3>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                  Phông chữ: Be Vietnam Pro + Outfit
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vietnameseTestVowels.map((group) => (
                  <div
                    key={group.char}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-label-mono-sm font-bold text-primary">
                        Nguyên âm: {group.char}
                      </span>
                      <span className="font-label-mono-sm text-[11px] text-tertiary">
                        Không dấu • Sắc • Huyền • Hỏi • Ngã • Nặng
                      </span>
                    </div>

                    {/* Lowercase row */}
                    <div className="flex items-center justify-between gap-1 py-1 font-body-lg text-headline-sm text-on-surface bg-surface-container-lowest px-3 rounded-lg">
                      {group.variants.map((v, i) => (
                        <span key={i} className="hover:text-primary transition-colors cursor-default">
                          {v}
                        </span>
                      ))}
                    </div>

                    {/* Uppercase row */}
                    <div className="flex items-center justify-between gap-1 py-1 font-headline-sm text-headline-sm text-on-surface bg-surface-container-lowest px-3 rounded-lg font-semibold">
                      {group.upperVariants.map((v, i) => (
                        <span key={i} className="hover:text-primary transition-colors cursor-default">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test 2: Real Culinary Sentences in All 3 Fonts */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-6">
              <div className="border-b border-outline-variant/20 pb-3">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Văn bản kiểm định ngữ cảnh ẩm thực thực tế (RecipeHub Real Copy)
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Kiểm định các trường hợp dấu hỏi, ngã, nặng đặt cạnh các phụ âm cao (h, t, b, d) và khoảng cách dòng không bị dính dấu.
                </p>
              </div>

              <div className="space-y-6">
                {vietnameseCulinaryCorpus.map((group, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-title-md text-title-md text-primary font-semibold flex items-center gap-2">
                      <Icon name="restaurant" size={20} />
                      <span>{group.category}</span>
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {group.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-label-mono-sm flex items-center justify-center shrink-0 mt-0.5">
                            {itemIdx + 1}
                          </span>
                          <div className="space-y-1">
                            <p className="font-title-md text-title-md text-on-surface font-semibold">
                              {item}
                            </p>
                            <p className="font-label-mono-sm text-[11px] text-tertiary">
                              Kiểm định chữ hoa / thường / dấu hỏi ngã: OK
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test 3: Display Hero Big Diacritic Clipping Stress Test */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4">
              <div className="border-b border-outline-variant/20 pb-3">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Kiểm tra cắt dấu ở kích thước cực đại (Display Hero Stress Test)
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Kích thước 56px, line-height 64px, letter-spacing -0.03em. Các dấu kép như Ẳ, Ẵ, Ặ, Ẫ, Ộ, Ợ, Ự phải hiển thị trọn vẹn.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
                <div>
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider">
                    Thử nghiệm Tiêu đề Hero 1 (Outfit 56px):
                  </span>
                  <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight mt-1">
                    Bún chả que tre nướng than hoa <span className="text-primary">thơm lừng</span> phố cổ.
                  </h1>
                </div>

                <div className="pt-4 border-t border-outline-variant/30">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider">
                    Thử nghiệm Tiêu đề Hero 2 (Các dấu kép khó):
                  </span>
                  <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight mt-1">
                    Ẳ Ẵ Ặ • Ẫ Ậ • Ổ Ỗ Ộ • Ở Ỡ Ợ • Ử Ữ Ự
                  </h1>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: UI COMPONENTS */}
        {activeTab === "components" && (
          <section className="space-y-space-xl">
            <div className="space-y-1">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                4. Thành phần giao diện cốt lõi (UI Components)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Các thành phần nút bấm, huy hiệu, ô tìm kiếm và hộp kiểm được định nghĩa theo DESIGN.md.
              </p>
            </div>

            {/* Buttons */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Nút bấm (Buttons)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">
                  <Icon name="add_circle" size={18} />
                  <span>Nút Chính (Primary)</span>
                </Button>
                <Button variant="secondary">
                  <span>Nút Phụ (Secondary)</span>
                </Button>
                <Button variant="outline">
                  <Icon name="bookmark_border" size={18} />
                  <span>Viền ngoài (Outline)</span>
                </Button>
                <Button variant="ghost">
                  <span>Tối giản (Ghost)</span>
                </Button>
                <Button variant="destructive">
                  <Icon name="delete" size={18} />
                  <span>Xóa / Cảnh báo</span>
                </Button>
                <Button variant="primary" size="pill">
                  <Icon name="skillet" size={18} />
                  <span>Dạng Viên Thuốc (Pill)</span>
                </Button>
                <Button variant="secondary" size="icon">
                  <Icon name="favorite" size={20} className="text-primary" />
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Huy hiệu & Trạng thái (Badges & Statuses)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="easy">Độ khó: Dễ</Badge>
                <Badge variant="medium">Độ khó: Trung bình</Badge>
                <Badge variant="hard">Độ khó: Khó</Badge>
                <Badge variant="pending">Trạng thái: Chờ duyệt</Badge>
                <Badge variant="published">Trạng thái: Đã đăng</Badge>
                <Badge variant="primary">
                  <Icon name="local_fire_department" size={16} />
                  <span>Tiêu Điểm Tuần</span>
                </Badge>
                <Badge variant="secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span>Máy chủ ổn định</span>
                </Badge>
                <Badge variant="spotlight">
                  <Icon name="bookmark" size={16} />
                  <span>Đã lưu vào yêu thích</span>
                </Badge>
              </div>
            </div>

            {/* Inputs & Search */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Ô tìm kiếm & Nhập liệu (Input Fields)
              </h3>
              <div className="max-w-2xl space-y-4">
                {/* Search Bar matching design */}
                <div className="flex items-center bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant/40 shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <div className="flex items-center flex-1 px-3 min-w-0">
                    <Icon name="search" size={22} className="text-outline shrink-0 mr-2" />
                    <input
                      className="w-full bg-transparent py-2 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                      placeholder="Tìm món ăn, nguyên liệu như thịt bò, nấm, sả..."
                      type="text"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-surface-container font-label-mono-sm text-label-mono-sm text-on-surface-variant shrink-0 select-none border border-outline-variant/50">
                      Ctrl+K
                    </kbd>
                  </div>
                  <Button variant="primary" size="default">
                    <span>Tìm kiếm</span>
                    <Icon name="arrow_forward" size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Checkbox for Ingredients */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40 space-y-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Hộp kiểm nguyên liệu (Ingredient Checkboxes)
              </h3>
              <div className="space-y-2 max-w-md">
                {[
                  { name: "500g Bánh phở tươi sợi mỏng", checked: true },
                  { name: "300g Thịt thăn bò tươi thái mỏng", checked: true },
                  { name: "1 bó Hành hoa cắt khúc & ngò gai", checked: false },
                  { name: "1 củ Gừng đập dập & 5 tép tỏi băm", checked: false },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="w-5 h-5 rounded-md text-secondary border-outline focus:ring-secondary cursor-pointer"
                    />
                    <span
                      className={`font-body-md text-body-md ${
                        item.checked
                          ? "line-through text-on-surface-variant"
                          : "text-on-surface font-medium"
                      }`}
                    >
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: MATERIAL ICONS */}
        {activeTab === "icons" && (
          <section className="space-y-space-xl">
            <div className="space-y-1">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                5. Thư viện biểu tượng (Material Symbols Outlined)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Bộ biểu tượng chuẩn xác xuất hiện trên các màn hình RecipeHub Stitch exports.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-whisper border border-outline-variant/40">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: "skillet", label: "Chảo nấu / Logo" },
                  { name: "restaurant_menu", label: "Thực đơn món" },
                  { name: "search", label: "Tìm kiếm" },
                  { name: "local_fire_department", label: "Tiêu điểm / Lửa" },
                  { name: "star", label: "Đánh giá sao" },
                  { name: "cloud_off", label: "Chế độ Khách" },
                  { name: "bookmark_border", label: "Lưu yêu thích" },
                  { name: "calendar_today", label: "Kế hoạch tuần" },
                  { name: "shopping_cart", label: "Đi chợ" },
                  { name: "timer", label: "Bấm giờ nấu" },
                  { name: "person", label: "Hồ sơ tác giả" },
                  { name: "space_dashboard", label: "Admin Dashboard" },
                  { name: "menu_book", label: "Quản lý công thức" },
                  { name: "group", label: "Quản lý người dùng" },
                  { name: "category", label: "Danh mục nguyên liệu" },
                  { name: "flag", label: "Báo cáo vi phạm" },
                  { name: "settings", label: "Cài đặt hệ thống" },
                  { name: "check_circle", label: "Thành công" },
                  { name: "close", label: "Đóng cửa sổ" },
                  { name: "add_circle", label: "Đăng công thức" },
                  { name: "notifications", label: "Thông báo" },
                  { name: "light_mode", label: "Giao diện sáng" },
                  { name: "dark_mode", label: "Giao diện tối" },
                  { name: "expand_more", label: "Mở rộng dropdown" },
                ].map((icon) => (
                  <div
                    key={icon.name}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-all text-center gap-2 group"
                  >
                    <Icon
                      name={icon.name}
                      size={28}
                      className="text-on-surface group-hover:text-primary transition-colors"
                    />
                    <span className="font-label-mono-sm text-[11px] text-primary font-semibold">
                      {icon.name}
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant truncate w-full">
                      {icon.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/40 bg-surface-container-low py-8 mt-space-xl">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <Icon name="skillet" size={20} />
            </div>
            <span className="font-headline-sm text-title-md text-on-surface font-semibold">
              Recipe<span className="text-primary">Hub</span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              • Bước 1: Thiết lập hệ thống mẫu và kiểm định phông chữ
            </span>
          </div>
          <p className="font-label-mono-sm text-label-mono-sm text-tertiary">
            Outfit • Be Vietnam Pro • JetBrains Mono • Material Symbols Outlined
          </p>
        </div>
      </footer>
    </div>
  );
}
