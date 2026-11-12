"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

function AdminRecipeModerationDetailContent() {
  const params = useParams();
  const router = useRouter();

  const [feedbackTemplate, setFeedbackTemplate] = React.useState("safe-grill");
  const [feedbackText, setFeedbackText] = React.useState(
    "Công thức rất chi tiết và chuẩn vị Hà Nội. Tuy nhiên bạn nên bổ sung thêm lưu ý không nướng bằng than tổ ong độc hại để đảm bảo an toàn tuyệt đối cho sức khỏe người nấu nhé!"
  );
  const [checklist, setChecklist] = React.useState({
    photoClear: true,
    exactQty: true,
    stepClear: true,
    foodSafety: true,
    noViolation: true,
    badgeAuthentic: false,
  });
  const [isApproving, setIsApproving] = React.useState(false);
  const [isApproved, setIsApproved] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  const templateTexts: Record<string, string> = {
    "safe-grill":
      "Công thức rất chi tiết và chuẩn vị Hà Nội. Tuy nhiên bạn nên bổ sung thêm lưu ý không nướng bằng than tổ ong độc hại để đảm bảo an toàn tuyệt đối cho sức khỏe người nấu nhé!",
    "missing-qty":
      "Chào bạn, công thức hiện tại thiếu định lượng chính xác ở phần nước mắm và nước màu dừa (chưa ghi rõ bao nhiêu ml hoặc muỗng). Bạn vui lòng cập nhật lại để bài được duyệt nhé!",
    "blurry-photo":
      "Ảnh chụp ở Bước 3 còn hơi mờ và chụp ngược sáng. Bạn hãy thay ảnh có độ nét cao hơn để công thức được nổi bật trên trang chủ RecipeHub nhé!",
    "spam-detected":
      "Nội dung này có dấu hiệu sao chép từ một trang tin tức bên ngoài. RecipeHub chỉ khuyến khích các công thức do chính thành viên trải nghiệm và tự chụp.",
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFeedbackTemplate(val);
    if (templateTexts[val]) {
      setFeedbackText(templateTexts[val]);
    }
  };

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsApproved(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full gap-y-space-lg">
      {/* Top Header & Breadcrumb Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Hệ thống quản trị
            </Link>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <Link href="/admin/recipes" className="hover:text-primary transition-colors">
              Quản lý công thức
            </Link>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span className="text-primary font-semibold">Thẩm định #REC-8842</span>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap mt-0.5">
            <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Thẩm định công thức
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm font-semibold shadow-sm">
              <Icon name="new_releases" size={14} />
              Tài khoản mới (Đăng bài lần đầu)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-label-mono-sm">
              <Icon name="hourglass_top" size={14} />
              Hàng chờ kiểm duyệt
            </span>
          </div>
        </div>

        {/* Quick Navigation Queue Pill */}
        <div className="flex items-center gap-space-sm bg-surface-container-low p-1.5 rounded-2xl shadow-sm self-start lg:self-auto border border-outline-variant/30">
          <div className="flex items-center gap-2 px-space-md py-1 border-r border-outline-variant/30">
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Hàng đợi:</span>
            <span className="font-label-mono-lg text-label-mono-lg font-bold text-primary">02</span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary">/ 14</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-variant text-on-surface font-body-sm text-body-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Bài trước"
              type="button"
              onClick={() => router.push("/admin/recipes/item-1")}
            >
              <Icon name="chevron_left" size={18} />
              <span className="hidden sm:inline">Trước</span>
            </button>
            <button
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-variant text-on-surface font-body-sm text-body-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Bài tiếp"
              type="button"
              onClick={() => router.push("/admin/recipes/item-3")}
            >
              <span className="hidden sm:inline">Sau</span>
              <Icon name="chevron_right" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Side-by-Side Review Workspace (7 Cols Live Preview + 5 Cols Control Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT PANEL: Recipe Live Preview (7 Cols on lg) */}
        <section className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Meta Verification Callout Card */}
          <div className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm font-bold">
                  H
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface-container-lowest flex items-center justify-center text-on-secondary">
                  <Icon name="check" size={10} />
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-title-md text-title-md text-on-surface font-bold truncate">
                    Lê Hoàng Hải
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    @hoanghai_chef
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary">
                  Tham gia 3 ngày trước • Đã xác thực Email • 0 công thức đã đăng
                </p>
              </div>
            </div>
            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                Nộp: 10:21 hôm nay
              </span>
              <span className="text-tertiary font-label-mono-sm text-label-mono-sm">
                Phiên bản bài nộp v1.0
              </span>
            </div>
          </div>

          {/* Live Mock Recipe Viewer */}
          <article className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg">
            {/* Recipe Header & Title */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary-fixed/60 text-primary font-label-mono-sm text-label-mono-sm font-medium">
                  Món nước &amp; Bún - Phở
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  Ẩm thực Miền Bắc
                </span>
                <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-mono-sm text-label-mono-sm">
                  Hà Nội Phố Cổ
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight font-bold">
                Bún chả nướng than hoa Hà Nội truyền thống
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Bí quyết làm chả miếng ba chỉ nướng vàng ươm và chả viên thơm mềm đậm vị nướng kẹp que tre than hoa, nước mắm dấm ớt chua ngọt ấm nóng ăn kèm đu đủ bắp cải giòn rụm giữ trọn phong vị ẩm thực đất kinh kỳ.
              </p>
            </div>

            {/* Recipe Quick Attributes Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm bg-surface-container-low p-space-md rounded-2xl">
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-lowest">
                <Icon name="signal_cellular_alt" size={22} className="text-primary mb-1" />
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase">Độ khó</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Trung bình</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-lowest">
                <Icon name="timer" size={22} className="text-primary mb-1" />
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase">Chuẩn bị</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">40 phút</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-lowest">
                <Icon name="local_fire_department" size={22} className="text-primary mb-1" />
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase">Nướng &amp; Nấu</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">25 phút</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-surface-container-lowest">
                <Icon name="group" size={22} className="text-primary mb-1" />
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary uppercase">Khẩu phần</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">4 người</span>
              </div>
            </div>

            {/* Hero Photo with AI Integrity Metadata Badge */}
            <div className="flex flex-col gap-space-xs">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-surface-container">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHIi_DjUxjL-5dLLxaTIvYoPnf73gDzOC3uckC-2MP1lJxAUkrYYWpgyL6gQPrBYCgFMQr-Wf76sEOTyrkSEakPQ_Gxfl-U8b639eVeRPf_S7cQTENHyg_RR_lB4-lD2Fn27nWDLWR5gTsFMdCH3RIHrDfLak-xgsweys02fXIkPEHYw_31Ewf8cU-zU2aaku6vlZMda0dQ5akVnZ8eAUAlEu6kM8CHCwzG2HhyTB3"
                  alt="Bún chả nướng than hoa Hà Nội"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface font-label-mono-sm text-label-mono-sm flex items-center gap-1 shadow-sm">
                    <Icon name="verified" size={14} className="text-secondary-fixed" />
                    1920 x 1080px (Đạt chuẩn HD)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface font-label-mono-sm text-label-mono-sm flex items-center gap-1 shadow-sm">
                    <Icon name="image_search" size={14} className="text-secondary-fixed" />
                    Ảnh gốc tự chụp (12% tương đồng mạng)
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur text-on-surface font-label-mono-sm text-label-mono-sm">
                    Tệp: bun-cha-ha-noi-final.jpg • 2.4 MB
                  </span>
                </div>
              </div>
              <span className="font-body-sm text-body-sm text-tertiary italic text-center">
                Hình 1: Đĩa bún chả thành phẩm với màu vàng cánh gián của chả nướng than hoa thơm lừng.
              </span>
            </div>

            {/* Ingredients Table */}
            <div className="flex flex-col gap-space-sm pt-space-sm">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <Icon name="kitchen" size={24} className="text-primary" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Định lượng nguyên liệu
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
                  8 mục chuẩn xác
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                {[
                  { name: "Thịt ba chỉ rút sườn", qty: "500 g (thái mỏng)" },
                  { name: "Thịt nạc vai băm nhuyễn", qty: "500 g" },
                  { name: "Hành khô & tỏi tím", qty: "4 củ băm nhuyễn" },
                  { name: "Nước hàng dừa thắng màu", qty: "2 muỗng canh" },
                  { name: "Nước mắm cốt truyền thống", qty: "3 muỗng canh (35°N)" },
                  { name: "Đu đủ xanh & cà rốt tỉa hoa", qty: "1/2 củ mỗi loại" },
                  { name: "Mớ rau thơm kinh kỳ (tía tô, kinh giới)", qty: "300 g" },
                  { name: "Bún tươi sợi nhỏ Phú Đô", qty: "1.0 kg" },
                ].map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="font-body-md text-body-md text-on-surface font-medium">{ing.name}</span>
                    </div>
                    <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-semibold">
                      {ing.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="flex flex-col gap-space-md pt-space-sm">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <Icon name="format_list_numbered" size={24} className="text-primary" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Các bước thực hiện
                  </h3>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">4 bước chi tiết</span>
              </div>

              {/* Step 1 */}
              <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold">
                    Bước 1 / 4
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant flex items-center gap-1">
                    <Icon name="schedule" size={15} /> Thời gian ướp: 120 phút
                  </span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">
                  Sơ chế và ướp thịt ba chỉ &amp; thịt viên tròn
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Thịt ba chỉ thái bản mỏng vừa ăn. Thịt nạc vai băm nhỏ ướp chung công thức: nước hàng thắng hổ phách, hành tím khô băm, nước mắm cốt, mì chính, chút hạt tiêu xay và 1 thìa dầu ăn giúp thịt mềm mọng khi nướng. Ướp tối thiểu 2 giờ hoặc bọc kín để qua đêm trong ngăn mát tủ lạnh.
                </p>
                <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-surface-container mt-1">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkJxhW8JLkq3a35SI__Mn1ChCA0gKpGCphDfOMBLf0R-Ji-nF4ArHfWJ0tmTF7O5S9s4vBHgW-WPmPgNCbMsn2v9be9fHltT-D2omgQubpjHLYNej1B-s8SpBr28f30-HdFLCjpH9AwLep6G5C3GjEofjfvM5qLkdDEu3T5DR2Gj1uWBPHKILNF8Sf-0EQc02ST8meEXVP1zvrcubIywZo28eoPgEBm7wa0l_hxO1K"
                    alt="Ướp thịt bún chả"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold">
                    Bước 2 / 4
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant flex items-center gap-1">
                    <Icon name="tune" size={15} /> Tỷ lệ: 1 đường : 1 mắm : 1 giấm : 5 nước
                  </span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">
                  Nấu nước mắm dấm đường ấm và làm dưa góp đu đủ giòn
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Đu đủ và cà rốt nạo lát mỏng tỉa hoa, bóp muối hạt xả sạch vắt ráo rồi ngâm với dấm đường để tạo độ giòn sần sật. Nước chấm pha ấm tỷ lệ vàng: 1 bát con mắm cốt, 1 bát đường hoa mơ, 1 bát dấm gạo thanh và 5 bát nước lọc đun ấm nhẹ, thêm tỏi ớt băm nổi lên bề mặt.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold">
                    Bước 3 / 4
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-error flex items-center gap-1 font-medium">
                    <Icon name="warning" size={15} /> Than hoa đượm hồng, không khói
                  </span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">
                  Nướng chả than hoa bằng vỉ kẹp que tre truyền thống
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Xếp thịt đều lên vỉ kẹp nẹp tre, quét lớp mỏng dầu màu điều. Đặt lên bếp than củi hoa đã rực đỏ không còn khói đen. Quạt đều tay và trở mặt liên tục đến khi mỡ chảy xèo xèo, thịt sém cạnh màu cánh gián vàng ươm tỏa hương thơm nức.
                </p>
                <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-surface-container mt-1">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4jlv1fbqH3hmaaPZBFEt_mU1S-uefyRKlxavGrdWbh62lu7jY_iFbOlf01hMASW5mJG1uQGDvqTUcY3RQHVIYEV2r78TDS0QCy0B-H5kNm3xpTkr-VvrFfqBFc6E2hLjSo_8p2TC0Um3cIvUdxX8SfdG9P4bxMlQh74Hr824qgzinfgbmMylR74TtvKfhF5YRwUWHwg7n9fzBs5sXQYGJNzOgHX8lGE4-wKaU11Sn"
                    alt="Nướng chả than hoa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold">
                    Bước 4 / 4
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary flex items-center gap-1 font-medium">
                    <Icon name="restaurant" size={15} /> Thưởng thức nóng
                  </span>
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">
                  Trình bày và thưởng thức cùng mâm rau thơm Hà Nội
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Thả chả miếng và chả viên vừa nướng nóng hổi trực tiếp vào bát nước mắm chua ngọt ấm cùng dưa góp đu đủ giòn. Ăn kèm đĩa bún tươi sợi nhỏ và rổ rau ghém gồm kinh giới, xà lách non, húng láng và tía tô.
                </p>
              </div>
            </div>

            {/* Nutrition Macro Strip */}
            <div className="p-space-md rounded-2xl bg-surface-container flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant tracking-wider">
                  Thông tin dinh dưỡng sơ bộ
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">
                  Hệ thống AI đối soát hợp lệ
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-headline-sm text-headline-sm text-primary font-bold">620</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Kcal / khẩu phần</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-headline-sm text-headline-sm text-on-surface font-bold">38g</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Chất đạm (Protein)</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-headline-sm text-headline-sm text-on-surface font-bold">68g</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Carbohydrate</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-headline-sm text-headline-sm text-on-surface font-bold">22g</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Chất béo (Lipid)</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* RIGHT PANEL: Sticky Moderator Review & Decision Panel (5 Cols on lg) */}
        <aside className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-20">
          <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg">
            {/* Checklist Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Icon name="fact_check" size={22} className="text-primary" />
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Tiêu chí kiểm định bắt buộc
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm font-semibold">
                {Object.values(checklist).filter(Boolean).length} / 6 Tiêu chuẩn
              </span>
            </div>

            {/* Interactive Checklist Items */}
            <div className="flex flex-col gap-space-sm">
              <label className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer select-none">
                <input
                  checked={checklist.photoClear}
                  onChange={(e) => setChecklist({ ...checklist, photoClear: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                  type="checkbox"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    Ảnh bìa &amp; các bước chụp rõ nét
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Không dính watermark/logo bán hàng, tỷ lệ đạt chuẩn.
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium mt-0.5">
                    Điểm chất lượng ảnh: 4.5 / 5.0
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer select-none">
                <input
                  checked={checklist.exactQty}
                  onChange={(e) => setChecklist({ ...checklist, exactQty: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                  type="checkbox"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    Định lượng nguyên liệu chuẩn xác
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Có đơn vị gam/thìa cụ thể, không ghi chung chung &ldquo;nêm vừa ăn&rdquo;.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer select-none">
                <input
                  checked={checklist.stepClear}
                  onChange={(e) => setChecklist({ ...checklist, stepClear: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                  type="checkbox"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    Quy trình bước nấu rõ ràng, dễ hiểu
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Mô tả cụ thể thời gian ướp và nhiệt độ ngọn lửa than hoa.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer select-none">
                <input
                  checked={checklist.foodSafety}
                  onChange={(e) => setChecklist({ ...checklist, foodSafety: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                  type="checkbox"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    An toàn thực phẩm &amp; Cảnh báo dị ứng
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Đã có lưu ý nướng chín kỹ và kiểm soát khói than.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer select-none">
                <input
                  checked={checklist.noViolation}
                  onChange={(e) => setChecklist({ ...checklist, noViolation: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                  type="checkbox"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    Không vi phạm chính sách nội dung
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Không chèn liên kết ngoài, số điện thoại bán hàng trục lợi.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-space-sm p-3 rounded-xl bg-primary-fixed/20 hover:bg-primary-fixed/30 transition-colors cursor-pointer select-none">
                <input
                  checked={checklist.badgeAuthentic}
                  onChange={(e) => setChecklist({ ...checklist, badgeAuthentic: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                  type="checkbox"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md text-primary font-semibold">
                    Gắn huy hiệu: &ldquo;Mâm cơm chuẩn vị&rdquo;
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Đề xuất danh hiệu món xuất sắc tuần (Tùy chọn).
                  </span>
                </div>
              </label>
            </div>

            {/* AI Signals Panel */}
            <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-on-surface font-title-md text-body-md font-bold">
                  <Icon name="smart_toy" size={18} className="text-primary" />
                  <span>Trợ lý quét tự động RecipeHub AI</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                  92 / 100 Điểm
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-label-mono-lg text-label-mono-lg font-bold text-secondary">8.2%</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Trùng lặp text</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-label-mono-lg text-label-mono-lg font-bold text-secondary">0 từ</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Từ cấm / SPAM</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-container-lowest">
                  <span className="block font-label-mono-lg text-label-mono-lg font-bold text-primary">2 / 5</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Độ tin cậy</span>
                </div>
              </div>
            </div>

            {/* Feedback & Decision Note Box */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-title-md text-body-md text-on-surface font-semibold flex items-center gap-1" htmlFor="feedback-content">
                  <Icon name="rate_review" size={18} className="text-tertiary" />
                  Ý kiến phản hồi gửi tác giả
                </label>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary">Gửi kèm thông báo app</span>
              </div>
              <div className="relative">
                <select
                  value={feedbackTemplate}
                  onChange={handleTemplateChange}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer border border-outline-variant/30"
                  id="quick-template"
                >
                  <option value="">-- Chọn mẫu góp ý nhanh --</option>
                  <option value="safe-grill">Nội dung đạt chuẩn xuất sắc - Nhắc thêm an toàn khói than</option>
                  <option value="missing-qty">Yêu cầu bổ sung định lượng gia vị chính xác hơn</option>
                  <option value="blurry-photo">Ảnh các bước thực hiện còn mờ hoặc thiếu ánh sáng</option>
                  <option value="spam-detected">Nội dung nghi vấn sao chép nguyên văn từ trang báo</option>
                </select>
                <span className="absolute right-3 top-2.5 text-tertiary pointer-events-none">
                  <Icon name="arrow_drop_down" size={18} />
                </span>
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline resize-none transition-all border border-outline-variant/30"
                id="feedback-content"
                rows={3}
              />
            </div>

            {/* Advanced Publishing Flags */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input defaultChecked className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer" type="checkbox" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  Cấp huy hiệu &ldquo;Tác giả đã xác minh bài viết đầu tiên&rdquo;
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input defaultChecked className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer" type="checkbox" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  Đẩy bài viết lên mục &ldquo;Món ngon thịnh hành tuần này&rdquo;
                </span>
              </label>
            </div>

            {/* Action Decision Buttons */}
            <div className="flex flex-col gap-space-sm pt-2">
              <button
                type="button"
                onClick={handleApprove}
                disabled={isApproving}
                className={`w-full py-3 px-space-md rounded-xl font-title-md text-title-md font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
                  isApproved
                    ? "bg-secondary text-on-secondary"
                    : "bg-secondary hover:bg-secondary/90 text-on-secondary"
                }`}
              >
                {isApproving ? (
                  <>
                    <Icon name="sync" size={20} className="animate-spin" />
                    <span>Đang phát hành công thức...</span>
                  </>
                ) : isApproved ? (
                  <>
                    <Icon name="check_circle" size={22} />
                    <span>Đã xuất bản (Hoàn thành)</span>
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" size={22} />
                    <span>Phê duyệt &amp; Xuất bản công khai</span>
                    <span className="font-label-mono-sm text-label-mono-sm opacity-80 font-normal ml-1">
                      (Ctrl + Enter)
                    </span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-space-sm">
                <button
                  type="button"
                  onClick={() => alert("Đã gửi thông báo yêu cầu sửa đổi tới tác giả!")}
                  className="w-full py-2.5 px-space-sm rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-body-md text-body-md font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                >
                  <Icon name="edit_note" size={18} className="text-primary" />
                  <span>Yêu cầu sửa đổi</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Đã từ chối bài nộp này.")}
                  className="w-full py-2.5 px-space-sm rounded-xl bg-error-container hover:bg-error-container/80 text-on-error-container font-body-md text-body-md font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                >
                  <Icon name="cancel" size={18} />
                  <span>Từ chối bài</span>
                </button>
              </div>
            </div>

            {/* Audit Trail Accordion */}
            <div className="border-t border-outline-variant/30 pt-space-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-tertiary font-label-mono-sm text-label-mono-sm">
                <span className="flex items-center gap-1">
                  <Icon name="history" size={15} />
                  Nhật ký kiểm toán hệ thống
                </span>
                <span>3 sự kiện</span>
              </div>
              <div className="flex flex-col gap-2 pt-1 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="text-tertiary shrink-0">10:45:12</span>
                  <span>Kiểm duyệt viên <strong>Lê Hoàng Phúc</strong> mở hồ sơ thẩm định bài viết.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-tertiary shrink-0">10:22:04</span>
                  <span>Hệ thống AI đối soát hoàn tất (Điểm tin cậy hình ảnh: 94%, Đạo văn: 8.2%).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-tertiary shrink-0">10:21:40</span>
                  <span>Thành viên <strong>@hoanghai_chef</strong> nộp bài từ ứng dụng Mobile.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 max-w-md bg-inverse-surface text-inverse-on-surface p-space-md rounded-2xl shadow-2xl z-50 flex items-center gap-space-sm transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <Icon name="task_alt" size={18} className="text-on-secondary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-body-md font-bold text-surface-container-lowest">
              Đã phê duyệt thành công!
            </span>
            <span className="font-body-sm text-body-sm text-tertiary-fixed-dim">
              Công thức #REC-2024-8842 đã lên trang chủ và gửi thông báo tới tác giả.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRecipeModerationDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="text-on-surface font-headline-sm text-headline-sm animate-pulse">
            Đang tải dữ liệu kiểm duyệt...
          </div>
        </div>
      }
    >
      <AdminRecipeModerationDetailContent />
    </React.Suspense>
  );
}
