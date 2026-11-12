"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";

export default function GuestModeBannersPage() {
  const [isBanner1Visible, setIsBanner1Visible] = React.useState(true);
  const [isBanner2Visible, setIsBanner2Visible] = React.useState(true);
  const [isFloatingOpen, setIsFloatingOpen] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-background flex-1 flex flex-col">
        {/* System Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <Icon name="check_circle" size={20} className="text-secondary" />
            <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Top Section: Header & System Context */}
        <section className="w-full px-gutter py-space-xl bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <Icon name="folder_open" size={16} />
                <span>Hệ thống thiết kế RecipeHub</span>
              </Link>
              <span className="text-outline-variant font-label-mono-sm text-label-mono-sm">/</span>
              <span className="hover:text-primary transition-colors">Thành phần dùng chung</span>
              <span className="text-outline-variant font-label-mono-sm text-label-mono-sm">/</span>
              <span className="text-on-surface font-semibold">Banner &amp; Cảnh báo Chế độ Khách (Guest Mode UX)</span>
            </nav>

            {/* Editorial Intro Block */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pt-space-xs">
              <div className="flex flex-col gap-space-sm max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant w-fit font-label-mono-sm text-label-mono-sm font-semibold">
                  <Icon name="database" size={15} />
                  <span>SPEC: LOCALSTORAGE &amp; INDEXEDDB STATE MANAGEMENT</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Hệ thống Banner Chế độ Khách &amp; Trạng thái Cảnh báo Bộ nhớ
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Chế độ trải nghiệm mở (<span className="text-primary font-semibold">Open Access</span>) cho phép người dùng lưu trữ công thức, thực đơn tuần và giỏ đi chợ trực tiếp trên bộ nhớ trình duyệt mà không bắt buộc tạo tài khoản. Các module banner bên dưới đảm bảo tính minh bạch, giúp người dùng làm chủ dữ liệu và thúc đẩy chuyển đổi đăng nhập tự nhiên khi cần đồng bộ đa thiết bị.
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap items-center gap-space-sm shrink-0">
                <button
                  onClick={() => showToast("Đã sao chép mã component TypeScript / React vào clipboard!")}
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high transition-all font-body-md text-body-md font-medium cursor-pointer"
                  type="button"
                >
                  <Icon name="content_copy" size={18} className="text-primary" />
                  <span>Sao chép mã component</span>
                </button>
                <button
                  onClick={() => showToast("Ma trận quyền Guest: Đầy đủ tính năng đọc, tạo thực đơn & giỏ chợ Local.")}
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high transition-all font-body-md text-body-md font-medium cursor-pointer"
                  type="button"
                >
                  <Icon name="verified_user" size={18} className="text-secondary" />
                  <span>Ma trận quyền Guest</span>
                </button>
                <button
                  onClick={() => showToast("Đang chuẩn bị tệp tài liệu UX (.PDF)...")}
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary shadow-sm hover:bg-primary-container transition-all font-body-md text-body-md font-medium cursor-pointer"
                  type="button"
                >
                  <Icon name="download" size={18} />
                  <span>Tải tài liệu UX (.PDF)</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-sm">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">Mô hình truy cập</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Mở hoàn toàn</span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                  <Icon name="lock_open" size={14} /> Không chặn tường đăng ký
                </span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">Hạn mức máy khách</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">5.0 MB Quota</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">IndexedDB + LocalStorage</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">Thời gian hồi phục đóng</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">7 Ngày</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tự xuất hiện khi &gt; 10 mục</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">Tỷ lệ đồng bộ hóa</span>
                <span className="font-headline-sm text-headline-sm text-primary">38.4%</span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                  <Icon name="trending_up" size={14} /> Tăng từ tuần trước
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Component States Matrix */}
        <section className="w-full px-gutter py-space-xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
              <div>
                <span className="font-label-mono-sm text-label-mono-sm uppercase text-primary font-semibold">Tương tác trực quan</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">4 Trạng thái thành phần cốt lõi</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Mỗi biến thể phục vụ một ngữ cảnh tương tác riêng biệt: từ toàn trang, ghim thanh trên cùng, thu gọn góc dưới đến cảnh báo nguy cơ xóa cache.
              </p>
            </div>

            {/* State 1: Banner Tiêu Chuẩn (Full / Expanded Banner) */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    1
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Banner Tiêu Chuẩn (Full-width Contextual Banner)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm">
                    Khuyên dùng
                  </span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                  Component ID: GUEST_BANNER_DEFAULT
                </span>
              </div>

              {/* Rendered Component 1 */}
              {isBanner1Visible ? (
                <div className="w-full bg-surface-container-low rounded-2xl p-space-md sm:p-space-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
                    {/* Icon & Content */}
                    <div className="flex items-start gap-space-md flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Icon name="devices" size={26} />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                            Dữ liệu đang lưu tạm trên trình duyệt này
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                            Lưu trữ cục bộ: 42 KB / 5 MB khả dụng
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Bạn đã lưu <strong className="text-on-surface font-semibold">5 món yêu thích</strong> và{" "}
                          <strong className="text-on-surface font-semibold">1 kế hoạch bữa ăn tuần</strong> trên thiết bị hiện tại. Đăng nhập hoặc tạo tài khoản miễn phí để đồng bộ vĩnh viễn trên điện thoại và máy tính khác.
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-space-sm w-full lg:w-auto justify-end pt-2 lg:pt-0 shrink-0">
                      <Link
                        className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface px-space-sm py-2 rounded-xl hover:bg-surface-container transition-colors"
                        href="/login"
                      >
                        Tìm hiểu thêm
                      </Link>
                      <Link
                        className="px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all font-body-md text-body-md font-semibold shadow-sm inline-flex items-center gap-1.5"
                        href="/login"
                      >
                        <Icon name="sync" size={18} />
                        <span>Đăng nhập để đồng bộ ngay</span>
                      </Link>
                      <button
                        aria-label="Tạm ẩn banner trong 7 ngày"
                        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors shrink-0 cursor-pointer"
                        title="Tạm ẩn banner trong 7 ngày"
                        type="button"
                        onClick={() => setIsBanner1Visible(false)}
                      >
                        <Icon name="close" size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>Banner Tiêu Chuẩn đã được tạm ẩn trong 7 ngày.</span>
                  <button
                    onClick={() => setIsBanner1Visible(true)}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Khôi phục hiển thị
                  </button>
                </div>
              )}

              <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm px-1">
                <Icon name="info" size={16} className="text-secondary" />
                <span>Hiển thị trên đầu các trang cá nhân hóa (Thực đơn tuần, Đi chợ) khi phát hiện ít nhất 1 mục trong LocalStorage.</span>
              </div>
            </div>

            {/* State 2: Banner Tinh Gọn (Compact / Sticky Bar Variant) */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    2
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Banner Tinh Gọn (Compact / Sticky Bar Variant)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                    Tiết kiệm diện tích
                  </span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                  Component ID: GUEST_BANNER_COMPACT
                </span>
              </div>

              {/* Rendered Component 2 */}
              {isBanner2Visible ? (
                <div className="w-full bg-surface-container-low px-space-md py-3 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-sm">
                  {/* Indicator & Text */}
                  <div className="flex items-center gap-space-md min-w-0 w-full md:w-auto">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm font-semibold text-secondary uppercase tracking-wider">
                        Chế độ Khách (Guest)
                      </span>
                    </div>
                    <span className="text-outline-variant font-label-mono-sm text-label-mono-sm hidden sm:inline">|</span>
                    <p className="font-body-md text-body-md text-on-surface truncate">
                      <strong className="font-semibold">5 món trong sổ tay</strong> • Đăng nhập để tự động sao lưu dữ liệu lên đám mây và chia sẻ thực đơn.
                    </p>
                  </div>
                  {/* Quick Action */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    <Link
                      className="px-3.5 py-1.5 rounded-full bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-all text-on-surface font-body-sm text-body-sm font-semibold inline-flex items-center gap-1.5 shadow-xs"
                      href="/login"
                    >
                      <Icon name="cloud_sync" size={16} />
                      <span>Đồng bộ ngay</span>
                    </Link>
                    <button
                      aria-label="Đóng cảnh báo"
                      className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                      type="button"
                      onClick={() => setIsBanner2Visible(false)}
                    >
                      <Icon name="close" size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>Banner Tinh Gọn đã được đóng.</span>
                  <button
                    onClick={() => setIsBanner2Visible(true)}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Hiển thị lại
                  </button>
                </div>
              )}

              <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm px-1">
                <Icon name="pin_invoke" size={16} className="text-primary" />
                <span>Dùng để neo cố định dưới navigation bar khi người dùng bắt đầu thao tác cuộn trang hoặc trên màn hình máy tính bảng.</span>
              </div>
            </div>

            {/* State 3: Trạng thái Thu Gọn / Đã đóng (Floating Dock Pill Trigger) */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    3
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Trạng thái Thu Gọn / Đã đóng (Floating Minimized Pill Trigger)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-label-mono-sm">
                    Sau khi Dismiss
                  </span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                  Component ID: GUEST_BANNER_MINIMIZED
                </span>
              </div>

              {/* Rendered Component 3 Box showcase */}
              <div className="w-full bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg">
                <div className="flex flex-col gap-1 max-w-xl">
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold">Hộp điều khiển thu gọn góc màn hình</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Khi khách hàng nhấn nút <span className="font-label-mono-sm text-label-mono-sm bg-surface-container px-1.5 py-0.5 rounded">X</span> để tắt banner chính, giao diện không biến mất hoàn toàn mà thu gọn về góc dưới bên phải nhằm tôn trọng tập trung nấu ăn nhưng vẫn cho phép mở lại bất kỳ lúc nào.
                  </p>
                </div>
                {/* Interactive preview of the floating dock element */}
                <div className="p-3 bg-surface-container-low rounded-2xl shadow-sm flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsBanner1Visible(true);
                      showToast("Đã mở rộng lại Banner Chế độ khách trên toàn màn hình.");
                    }}
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface shadow-md hover:shadow-lg hover:bg-surface-container-high transition-all cursor-pointer"
                    type="button"
                  >
                    <div className="relative flex items-center justify-center">
                      <Icon name="cloud_off" size={20} className="text-primary" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">Dữ liệu máy khách</span>
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">5 mục chưa đồng bộ</span>
                    </div>
                    <Icon name="expand_less" size={18} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform ml-1" />
                  </button>
                  <div className="hidden sm:flex flex-col text-xs text-on-surface-variant font-label-mono-sm pr-2">
                    <span>Position: fixed; bottom: 24px; right: 24px;</span>
                    <span>z-index: 40;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* State 4: Cảnh báo Dung lượng & Nguy cơ mất dữ liệu */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="w-6 h-6 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    4
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Cảnh báo Dung lượng &amp; Nguy cơ mất dữ liệu (Critical Warning)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">
                    Khẩn cấp
                  </span>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                  Component ID: GUEST_ALERT_DATALOSS
                </span>
              </div>

              {/* Rendered Component 4 */}
              <div className="w-full bg-error-container/40 rounded-2xl p-space-md sm:p-space-lg shadow-sm">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-space-md">
                  {/* Icon & Urgent Copy */}
                  <div className="flex items-start gap-space-md flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-error text-on-error flex items-center justify-center shrink-0 shadow-sm">
                      <Icon name="warning" size={28} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-mono-sm text-label-mono-sm font-bold tracking-wider">
                          CẢNH BÁO NGUY CƠ MẤT DỮ LIỆU
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-error font-medium">
                          Phát hiện duyệt web Ẩn danh
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                        Trình duyệt đang ở chế độ Ẩn danh (Incognito) hoặc bộ nhớ sắp đầy!
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                        Khi bạn đóng cửa sổ ẩn danh hoặc xoá cache trình duyệt, toàn bộ <strong className="text-on-surface font-semibold">14 món ăn trong Kế hoạch tuần</strong> và <strong className="text-on-surface font-semibold">18 nguyên liệu trong Giỏ đi chợ</strong> sẽ bị xóa vĩnh viễn không thể khôi phục. Hãy tải bản lưu dự phòng hoặc đăng ký tài khoản ngay.
                      </p>
                      {/* Data Risk Meter Bar */}
                      <div className="mt-2 flex flex-col gap-1 max-w-md">
                        <div className="flex items-center justify-between text-body-sm font-label-mono-sm text-on-surface-variant">
                          <span>Mức độ rủi ro bộ nhớ:</span>
                          <span className="text-error font-bold">100% Phiên tạm thời</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                          <div className="h-full bg-error w-full rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 w-full lg:w-60 pt-2 lg:pt-0">
                    <Link
                      className="px-space-md py-2.5 rounded-xl bg-error text-on-error hover:opacity-95 transition-all font-body-md text-body-md font-semibold shadow-sm inline-flex items-center justify-center gap-2 text-center"
                      href="/login"
                    >
                      <Icon name="verified" size={18} />
                      <span>Đăng nhập lưu tức thì</span>
                    </Link>
                    <button
                      onClick={() => showToast("Đang chuẩn bị file JSON sao lưu 14 món ăn và 18 nguyên liệu...")}
                      className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-all font-body-md text-body-md font-medium shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
                      type="button"
                    >
                      <Icon name="file_download" size={18} className="text-primary" />
                      <span>Tải file sao lưu (.JSON)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm px-1">
                <Icon name="security_update_warning" size={16} className="text-error" />
                <span>Kích hoạt tự động khi `navigator.storage.estimate()` vượt 90% quota hoặc `storage.persist()` trả về false trong phiên Private.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Realistic In-Context Preview Sections */}
        <section className="w-full px-gutter py-space-xl bg-surface-container-low/40">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col gap-1">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-secondary font-semibold">Mô phỏng thực tế</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Ngữ cảnh hiển thị thực tế trên RecipeHub</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Minh họa cách các biến thể banner tích hợp mượt mà vào luồng thao tác của người dùng không tài khoản mà không làm gián đoạn trải nghiệm nấu bếp.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
              {/* Preview A: Trong trang Kế hoạch bữa ăn tuần */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Window Header bar */}
                <div className="px-4 py-3 bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">/meal-planner</span>
                  <Link href="/meal-planner" className="hover:text-primary transition-colors">
                    <Icon name="open_in_new" size={16} className="text-on-surface-variant" />
                  </Link>
                </div>
                {/* Simulation Content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Thực đơn Tuần 18</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-xs font-label-mono-sm">7 ngày</span>
                  </div>
                  {/* In-context Banner placement */}
                  <div className="bg-surface-container-low rounded-xl p-3 shadow-xs flex items-start gap-2.5">
                    <Icon name="cloud_off" size={20} className="text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="text-body-sm font-body-sm text-on-surface font-medium leading-snug">
                        Đang lưu tại máy này (3 món).
                      </p>
                      <Link className="text-xs text-primary font-semibold hover:underline" href="/login">
                        Đăng nhập để xem trên iPad bàn bếp →
                      </Link>
                    </div>
                  </div>
                  {/* Fake Calendar Grid mini preview */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="p-2 rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <span className="font-label-mono-sm text-xs text-on-surface-variant">Thứ 2</span>
                      <div className="h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-xs text-on-surface font-medium text-center px-1">
                        Phở bò tái lăn
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <span className="font-label-mono-sm text-xs text-on-surface-variant">Thứ 3</span>
                      <div className="h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-xs text-on-surface font-medium text-center px-1">
                        Cá kho tộ
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-container-low flex flex-col gap-1">
                      <span className="font-label-mono-sm text-xs text-on-surface-variant">Thứ 4</span>
                      <div className="h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-xs text-on-surface font-medium text-center px-1">
                        Canh chua cá lóc
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-auto pt-2 italic">
                    Vị trí: Ngay phía trên lưới tuần để người dùng luôn biết dữ liệu chưa lên mây.
                  </p>
                </div>
              </div>

              {/* Preview B: Trong trang Danh sách mua sắm */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Window Header bar */}
                <div className="px-4 py-3 bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">/shopping-list</span>
                  <Link href="/shopping-list" className="hover:text-primary transition-colors">
                    <Icon name="open_in_new" size={16} className="text-on-surface-variant" />
                  </Link>
                </div>
                {/* Simulation Content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Đi chợ chiều nay</span>
                    <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-xs font-label-mono-sm">
                      6 nguyên liệu
                    </span>
                  </div>
                  {/* Compact Banner inside shopping list */}
                  <div className="bg-surface-container-low rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      <span className="text-xs font-body-sm text-on-surface truncate">
                        Chưa đồng bộ cho người thân đi siêu thị
                      </span>
                    </div>
                    <Link href="/login" className="px-2 py-1 bg-primary text-on-primary rounded-lg text-xs font-semibold shrink-0">
                      Chia sẻ
                    </Link>
                  </div>
                  {/* Fake Checklist items */}
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer">
                      <input defaultChecked className="w-4 h-4 rounded text-secondary" type="checkbox" />
                      <span className="line-through text-on-surface-variant">Thịt bò thăn • 500g</span>
                    </label>
                    <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer">
                      <input defaultChecked className="w-4 h-4 rounded text-secondary" type="checkbox" />
                      <span className="line-through text-on-surface-variant">Bánh phở tươi • 1kg</span>
                    </label>
                    <label className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer">
                      <input className="w-4 h-4 rounded text-secondary" type="checkbox" />
                      <span>Hành lá, rau mùi tàu • 1 bó</span>
                    </label>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-auto pt-2 italic">
                    Vị trí: Cảnh báo người dùng khi ra ngoài mua sắm không xem được trên điện thoại khác.
                  </p>
                </div>
              </div>

              {/* Preview C: Toast / Micro-Banner tại Chi tiết công thức */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Window Header bar */}
                <div className="px-4 py-3 bg-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  </div>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">/recipes/pho-bo-ha-noi</span>
                  <Link href="/recipes/pho-bo-ha-noi" className="hover:text-primary transition-colors">
                    <Icon name="open_in_new" size={16} className="text-on-surface-variant" />
                  </Link>
                </div>
                {/* Simulation Content */}
                <div className="p-4 flex flex-col gap-3 flex-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-semibold truncate">Phở Bò Truyền Thống</span>
                    <button className="p-1.5 text-primary bg-primary-fixed rounded-xl flex items-center justify-center cursor-pointer">
                      <Icon name="favorite" size={18} />
                    </button>
                  </div>
                  {/* Simulated Toast in corner */}
                  <div className="bg-inverse-surface text-inverse-on-surface rounded-xl p-3 shadow-lg flex items-start gap-2.5">
                    <Icon name="check_circle" size={20} className="text-secondary-fixed shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-inverse-on-surface">Đã lưu vào bộ nhớ máy này!</span>
                      <span className="text-[11px] text-inverse-on-surface/80 leading-normal">
                        Bạn đang ở chế độ khách. Đăng nhập để công thức này xuất hiện trên điện thoại của bạn.
                      </span>
                      <Link className="text-xs text-secondary-fixed hover:underline font-semibold mt-1" href="/login">
                        Đăng nhập tài khoản →
                      </Link>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low flex flex-col gap-1 mt-2">
                    <span className="text-xs font-label-mono-sm text-on-surface-variant">Thời gian chuẩn bị: 45 phút</span>
                    <span className="text-xs font-label-mono-sm text-on-surface-variant">Khẩu phần: 4 người ăn</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-auto pt-2 italic">
                    Vị trí: Toast phản hồi thời gian thực khi khách nhấn nút "Yêu thích" công thức.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs & Engineering Handoff */}
        <section className="w-full px-gutter py-space-xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
            <div className="flex flex-col gap-1">
              <span className="font-label-mono-sm text-label-mono-sm uppercase text-primary font-semibold">
                Tài liệu kỹ thuật Frontend
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Quy chuẩn lập trình &amp; Quản trị bộ nhớ
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* Storage Keys Table */}
              <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center gap-2">
                  <Icon name="storage" size={22} className="text-primary" />
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">Quy ước Khóa lưu trữ (Storage Schema)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                        <th className="p-2.5 rounded-l-lg">Khóa LocalStorage</th>
                        <th className="p-2.5">Loại dữ liệu</th>
                        <th className="p-2.5 rounded-r-lg">Mục đích sử dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      <tr>
                        <td className="p-2.5 font-label-mono-sm text-primary font-medium">recipehub_guest_favs</td>
                        <td className="p-2.5 text-on-surface-variant">Array&lt;RecipeId&gt;</td>
                        <td className="p-2.5 text-on-surface">Mảng ID các công thức người dùng bấm yêu thích</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-label-mono-sm text-primary font-medium">recipehub_guest_mealplan</td>
                        <td className="p-2.5 text-on-surface-variant">WeeklyPlanJSON</td>
                        <td className="p-2.5 text-on-surface">Thực đơn 7 ngày gồm các món ăn phân bổ theo bữa</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-label-mono-sm text-primary font-medium">recipehub_guest_grocery</td>
                        <td className="p-2.5 text-on-surface-variant">ShoppingListJSON</td>
                        <td className="p-2.5 text-on-surface">Danh sách nguyên liệu mua sắm và trạng thái check</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-label-mono-sm text-primary font-medium">recipehub_dismissed_until</td>
                        <td className="p-2.5 text-on-surface-variant">Timestamp (ms)</td>
                        <td className="p-2.5 text-on-surface">Mốc thời gian hết hạn tắt banner (Mặc định +7 ngày)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Logic & Accessibility Specifications */}
              <div className="bg-surface-container-lowest p-space-md sm:p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center gap-2">
                  <Icon name="rule" size={22} className="text-secondary" />
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">Quy tắc Logic &amp; Tiếp cận (Accessibility)</h3>
                </div>
                <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
                  <div className="flex items-start gap-2.5">
                    <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-1" />
                    <p>
                      <strong className="text-on-surface">Cơ chế Hồi sinh Banner (Resurface Rule):</strong> Dù người dùng đã đóng banner, nếu số lượng món ăn lưu cục bộ vượt mốc 10 công thức, banner chính sẽ tự động xuất hiện trở lại ở phiên duyệt kế tiếp.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-1" />
                    <p>
                      <strong className="text-on-surface">Hỗ trợ ARIA Live Region:</strong> Thành phần cảnh báo bắt buộc cấu hình{" "}
                      <code className="font-label-mono-sm text-xs bg-surface-container px-1 py-0.5 rounded text-on-surface">role=&quot;status&quot;</code> và{" "}
                      <code className="font-label-mono-sm text-xs bg-surface-container px-1 py-0.5 rounded text-on-surface">aria-atomic=&quot;true&quot;</code> để máy đọc màn hình kịp thông báo người khiếm thị.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-1" />
                    <p>
                      <strong className="text-on-surface">Di chuyển phím bấm (Keyboard Navigation):</strong> Người dùng sử dụng phím{" "}
                      <kbd className="font-label-mono-sm text-xs bg-surface-container px-1.5 py-0.5 rounded text-on-surface">Tab</kbd> di chuyển mượt mà qua các nút hành động; nút{" "}
                      <kbd className="font-label-mono-sm text-xs bg-surface-container px-1.5 py-0.5 rounded text-on-surface">Esc</kbd> kích hoạt thu gọn thành pill widget.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Icon name="check_circle" size={18} className="text-secondary shrink-0 mt-1" />
                    <p>
                      <strong className="text-on-surface">Chuẩn độ tương phản (WCAG AAA):</strong> Đảm bảo toàn bộ chữ trên nền Amber và Rose đạt tỷ lệ tương phản tối thiểu 4.8:1, hiển thị rõ ràng trên màn hình điện thoại dưới ánh nắng trực tiếp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Floating Widget Preview in Action */}
        {isFloatingOpen && (
          <aside className="fixed bottom-6 right-6 z-40 hidden md:block animate-in fade-in slide-in-from-bottom-2">
            <div
              onClick={() => {
                setIsBanner1Visible(true);
                showToast("Đã mở rộng lại Banner Chế độ khách.");
              }}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <Icon name="cloud_off" size={20} className="text-primary" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">Chế độ Khách (Offline)</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">5 mục chưa đồng bộ</span>
              </div>
              <button
                aria-label="Mở rộng banner"
                className="p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFloatingOpen(false);
                }}
              >
                <Icon name="open_in_full" size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
              </button>
            </div>
          </aside>
        )}
      </main>

      <Footer />
    </div>
  );
}
