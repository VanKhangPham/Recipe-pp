"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="w-full bg-surface-container-lowest rounded-3xl p-space-xl md:p-12 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.06)] relative overflow-hidden border border-outline-variant/30">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-error-container/50 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-semibold">
                  <Icon name="mode_heat" size={15} />
                  MÃ LỖI HTTP 500 • LỖI HỆ THỐNG MÁY CHỦ
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-error font-mono">
                  ID: #{error.digest || "ERR_RECIPE_50291"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight">
                  Bếp lửa đang <span className="text-error underline decoration-error/30">quá nhiệt!</span> Đội kỹ sư đang khẩn trương nêm nếm lại.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Hệ thống xử lý tính toán calo và điều phối công thức đang gặp trục trặc kỹ thuật tạm thời. Đừng lo lắng, dữ liệu thực đơn và nguyên liệu đã lưu của bạn vẫn tuyệt đối an toàn trên máy khách.
                </p>
              </div>

              {/* Diagnostic Telemetry Card */}
              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2 max-w-xl font-label-mono-sm text-label-mono-sm border border-outline-variant/20">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                    Trạng thái cụm máy chủ: <strong className="text-error font-semibold">Tải bất thường (Database Peak 99.4%)</strong>
                  </span>
                  <span className="text-secondary font-semibold">Uptime 99.98%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full w-5/6" />
                </div>
                <div className="flex items-center justify-between text-tertiary pt-1">
                  <span>Vùng dữ liệu: ap-southeast-1 (TP. Hồ Chí Minh)</span>
                  <span>Thời gian tự phục hồi ước tính: ~2 phút</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-space-lg py-3 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Icon name="replay" size={18} />
                  <span>Tải lại trang ngay (F5)</span>
                </button>
                <Link
                  href="/"
                  className="px-space-md py-3 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5"
                >
                  <Icon name="home" size={18} />
                  <span>Về trang chủ</span>
                </Link>
                <button
                  type="button"
                  onClick={() => alert(`Đã gửi báo cáo lỗi ID #${error.digest || "ERR_RECIPE_50291"} tới ban quản trị.`)}
                  className="px-space-md py-3 rounded-xl bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-variant transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="bug_report" size={18} />
                  <span>Báo cáo sự cố cho ban quản trị</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Visual Metaphor */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-surface-container-low p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden border border-outline-variant/20">
                <svg className="w-full h-full text-error max-w-[320px] drop-shadow-md" viewBox="0 0 400 400">
                  <ellipse cx="200" cy="310" fill="#e9e1dd" rx="120" ry="20" />
                  <path d="M 140,310 Q 155,270 170,310 Q 185,260 200,310 Q 215,260 230,310 Q 245,275 260,310 Z" fill="#cc4900" opacity="0.9" />
                  <path d="M 160,310 Q 180,280 200,310 Q 220,280 240,310 Z" fill="#ffb599" />
                  <rect fill="#33302d" height="130" rx="16" width="180" x="110" y="160" />
                  <path d="M 85,190 C 85,175 110,175 110,190" fill="none" stroke="#615b56" strokeLinecap="round" strokeWidth="8" />
                  <path d="M 315,190 C 315,175 290,175 290,190" fill="none" stroke="#615b56" strokeLinecap="round" strokeWidth="8" />
                  <ellipse cx="200" cy="160" fill="#cc4900" rx="90" ry="16" />
                  <path d="M 130,165 Q 120,200 135,210 Q 145,190 145,165" fill="#a33900" />
                  <path d="M 240,165 Q 260,210 245,230 Q 230,200 235,165" fill="#a33900" />
                  <line stroke="#cec5bf" strokeLinecap="round" strokeWidth="6" x1="220" x2="280" y1="170" y2="80" />
                  <ellipse cx="220" cy="170" fill="none" rx="14" ry="24" stroke="#cec5bf" strokeWidth="3" transform="rotate(-35 220 170)" />
                  <path d="M 160,130 Q 150,90 170,70" fill="none" stroke="#a8a29e" strokeDasharray="4 6" strokeLinecap="round" strokeWidth="4" />
                  <path d="M 200,120 Q 215,80 195,50" fill="none" stroke="#a8a29e" strokeDasharray="4 6" strokeLinecap="round" strokeWidth="4" />
                  <rect fill="#ba1a1a" height="26" rx="6" width="110" x="145" y="240" />
                  <text fill="#ffffff" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold" x="156" y="258">
                    QUÁ TẢI 100°C
                  </text>
                </svg>
                <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                  <Icon name="heat" size={16} className="text-error" />
                  <span>Nồi súp đang trào • Kỹ sư đang giảm lửa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Preparedness Info Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
              <Icon name="offline_pin" size={26} />
            </div>
            <div>
              <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                Chế độ nấu ăn ngoại tuyến (Offline Cook Mode)
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Kế hoạch tuần và danh sách nguyên liệu đi chợ đã lưu trong bộ nhớ máy của bạn vẫn sẵn sàng truy cập bình thường.
              </p>
            </div>
          </div>
          <Link
            href="/shopping-list"
            className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md shrink-0"
          >
            Mở Danh Sách Ngoại Tuyến
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
