"use client";

import * as React from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";

interface UserProfile {
  id: string;
  code: string;
  name: string;
  handle: string;
  email: string;
  verifiedEmail: boolean;
  twoFactor: string;
  role: string;
  roleBadge: string;
  roleColor: string;
  recipesCount: number;
  bookmarksCount: string;
  aiScore: number;
  aiLabel: string;
  aiColor: string;
  isOnline: boolean;
  isBanned?: boolean;
  isSpam?: boolean;
  avatar: string;
  bio: string;
  device: string;
  location: string;
  recipes: {
    title: string;
    stats: string;
    status: string;
    image: string;
  }[];
}

const USERS_DATA: UserProfile[] = [
  {
    id: "bepmeba",
    code: "#USR-1024",
    name: "Nguyễn Thu Hà",
    handle: "@bepmeba",
    email: "thuha.bepmeba@gmail.com",
    verifiedEmail: true,
    twoFactor: "2FA Bật (Authenticator)",
    role: "Tác giả tinh hoa",
    roleBadge: "Tác giả tinh hoa",
    roleColor: "bg-primary-fixed text-on-primary-fixed",
    recipesCount: 28,
    bookmarksCount: "4.15k",
    aiScore: 99,
    aiLabel: "Tuyệt vời",
    aiColor: "text-secondary",
    isOnline: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAp8hCQP5qNhuhKoCibi5LQRpQi-F1iZjpbef0HosYyc9DfDzV_2cDpcaq9r9pQrZDtyH9c56GqzMb7w0rnMJFOZD8oNDI6O6-GcFN8KlhewniAnn-GI2wKRwDIfFRIybQAD1btXy6c7xvdJqtjyDx0p2nssGDqmmEOBDkKB8Gf0TlVKYo5XWvHSxj17XZ0QWtKLKp6ULcTRPcwhNy-ey9OiiGLZf4OroFqjkznEQRN",
    bio: "Yêu thích ẩm thực ba miền, chuyên về các món canh thanh mát và mâm cơm gia đình chuẩn vị Bắc.",
    device: "MacBook Pro (macOS Sonoma)",
    location: "118.70.182.4 • Hà Nội, VN",
    recipes: [
      {
        title: "Canh chua cá lóc chuẩn vị miền Tây",
        stats: "1.820 lượt lưu • 4.9 sao",
        status: "Đã duyệt",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBNuu_l5cW2-eklUgkOV8oOrzsnSJq_jY2UY4pTS5QPVBxaLhzT7umhwoYgcYSITBbAGviKDnOFBLIkzl2QHbsSJpOqj2AOUmt_o1mDMBJkVvUqUPVCAWcZstX_gc-HJSd_LBOVS3jyuu7lAX4MBeCBEDGQrmty1L4qp19z5A8JvCunmVgH2grARfjlRp7_QYg0BsUA6S4krBDxR9yGMVeEx21tAuT9hkfUZTvq3x88",
      },
      {
        title: "Thịt kho hột vịt nước dừa xiêm",
        stats: "2.330 lượt lưu • 5.0 sao",
        status: "Đã duyệt",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA7IlCwVWtkmo_lR-WU5MrzTF042VbPVz9VWWSUkByY5z08WxPUS8LGst5-FwGJz-Oi8oLwIrY4WlYgQIpKtYNbkfbZyUjuwPIBYP3KggPpb_zfTXUjvZKN2L7u-lEEmZxDL5oZT0yzEYWD0Naw5jnpZvLgXN_Mcx2_nlegjHO2SDt-jXicwQnCKYpmSNbcsJ9clJUr_eSgiVRJuuaNbT5niv4vf04OEid4iF2EFBlR",
      },
    ],
  },
  {
    id: "hoanghai",
    code: "#USR-8842",
    name: "Lê Hoàng Hải",
    handle: "@hoanghai_chef",
    email: "hoanghai.chef@gmail.com",
    verifiedEmail: true,
    twoFactor: "Chưa bật 2FA",
    role: "Thành viên",
    roleBadge: "Thành viên mới (3 ngày)",
    roleColor: "bg-surface-container-high text-on-surface",
    recipesCount: 1,
    bookmarksCount: "0",
    aiScore: 88,
    aiLabel: "Tốt",
    aiColor: "text-primary",
    isOnline: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC35FZtabq5HISV3y93SCyxaosCd5UOaidCwBMSfaYteem_Lm7ectmS2Jxh3jrvFygJgVVcAyt9MzaWjMaKVY4Nb1AHUFfV57qJRcP-zSJAlbQMSwQgik-N7VdFzaspxUYSKh6jbWPIz_-5qExAUmfnbylnjin4Ge1DuLGEgDSywNs2blWSB-PhctL-eD9k3VMX0jLDNg-8OwU_bB2Yqgl0YB0iSx1XhA8bvhF8igx0",
    bio: "Nhiệt huyết với các món nướng than hoa truyền thống Hà Thành, tìm kiếm công thức chuẩn vị mẹ nấu.",
    device: "iPhone 15 Pro (iOS 17.4)",
    location: "14.241.112.5 • Hà Nội, VN",
    recipes: [
      {
        title: "Bún chả nướng than hoa Hà Nội",
        stats: "Đang chờ duyệt • 10:21 hôm nay",
        status: "Chờ duyệt",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAHIi_DjUxjL-5dLLxaTIvYoPnf73gDzOC3uckC-2MP1lJxAUkrYYWpgyL6gQPrBYCgFMQr-Wf76sEOTyrkSEakPQ_Gxfl-U8b639eVeRPf_S7cQTENHyg_RR_lB4-lD2Fn27nWDLWR5gTsFMdCH3RIHrDfLak-xgsweys02fXIkPEHYw_31Ewf8cU-zU2aaku6vlZMda0dQ5akVnZ8eAUAlEu6kM8CHCwzG2HhyTB3",
      },
    ],
  },
  {
    id: "quocbao",
    code: "#USR-4412",
    name: "Đặng Quốc Bảo",
    handle: "@quocbao_cook",
    email: "quocbao.food@vnn.vn",
    verifiedEmail: true,
    twoFactor: "IP 118.69.12.*",
    role: "Thành viên",
    roleBadge: "Thành viên",
    roleColor: "bg-surface-container-high text-on-surface",
    recipesCount: 3,
    bookmarksCount: "140",
    aiScore: 91,
    aiLabel: "Uy tín",
    aiColor: "text-secondary",
    isOnline: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsQ-ZVwJay1vbzijL3n3HGObomqFY3oEMja2N_qjo2eBx9fIXzqnpS7NVPUaajfcDGcPYdY02yspcxEHbrrttTQVOiX7n9j80nPP1OTIDU62agDLd259BUMC1ILqIcGa8HE6-YJrFjPo0mpXdmfNyin99LxCEDVblntx9y58X79W-V-Yl-BsljBXv9ynSV9jRw_t5MMXUrsT0QsL_VH7h-o4A5fV6cnF6gMq6fiqf2",
    bio: "Đam mê gỏi cuốn và đặc sản miệt vườn miền Tây Nam Bộ.",
    device: "Windows 11 (Chrome 125)",
    location: "118.69.12.80 • Cần Thơ, VN",
    recipes: [],
  },
  {
    id: "botspam",
    code: "#USR-9921",
    name: "bot_recipe_cheap99",
    handle: "@cheap_food99",
    email: "botpromotion882@tempmail.org",
    verifiedEmail: false,
    twoFactor: "IP Ngoại tuyến",
    role: "Spam Bot",
    roleBadge: "Nghi vấn SPAM",
    roleColor: "bg-error text-on-error",
    recipesCount: 0,
    bookmarksCount: "0",
    aiScore: 18,
    aiLabel: "Nguy hiểm",
    aiColor: "text-error",
    isOnline: false,
    isSpam: true,
    avatar: "",
    bio: "Tài khoản bot tự động spam liên kết quảng cáo cá độ trên bài viết cộng đồng.",
    device: "Automated Headless Chrome",
    location: "103.22.18.99 • Proxy / VPN",
    recipes: [],
  },
  {
    id: "hoangnam",
    code: "#USR-0042",
    name: "Trần Hoàng Nam",
    handle: "@nam_chefadmin",
    email: "nam.admin@recipehub.vn",
    verifiedEmail: true,
    twoFactor: "Hardware Key 2FA",
    role: "Kiểm duyệt viên",
    roleBadge: "Kiểm duyệt viên",
    roleColor: "bg-tertiary-container text-on-tertiary-container",
    recipesCount: 15,
    bookmarksCount: "8.2k",
    aiScore: 100,
    aiLabel: "Đặc quyền",
    aiColor: "text-secondary",
    isOnline: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfZuSHL2m03Y-4TF9fXtrTd39U13eT9PW9xXhiAm_Kg1Iqqq4DKvsXASsJwc5QITmux9Kps_AOoiGLZrmLnPk-uMt8HiSAU_pJTZzvZT7NQSWWcye645BJJpVUCVI_pWZ7z0g2ebLUMHSHF0ULdUBgKFAFCd_ZioX8FO7mjaWD2AnGmsh6sBKs40nEbi2gVacTVWrNv_x0TbAWEIxPs45pQSR2GJPBJrg321oj2QVa",
    bio: "Ban biên tập RecipeHub. Chuyên trách kiểm định chất lượng hình ảnh và tiêu chuẩn an toàn thực phẩm.",
    device: "MacBook Air M2 (macOS)",
    location: "14.162.24.18 • TP. Hồ Chí Minh, VN",
    recipes: [],
  },
  {
    id: "vuhoa",
    code: "#USR-7731",
    name: "Vũ Thị Hoa",
    handle: "@hoa_bepchay",
    email: "hoavu.chay@gmail.com",
    verifiedEmail: true,
    twoFactor: "2FA Chưa bật",
    role: "Tác giả ẩm thực",
    roleBadge: "Bếp Chay chứng nhận",
    roleColor: "bg-secondary-container text-on-secondary-container",
    recipesCount: 12,
    bookmarksCount: "2.89k",
    aiScore: 96,
    aiLabel: "Rất cao",
    aiColor: "text-secondary",
    isOnline: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMIacwT6fxqL_ptpqJURYSdwGUeiWur7XUj5kb-U174U1P0g2v6bH9Y0cfIMv6c7GvjwQImVT7eXE2ucOyomlip2LdX_CQZdjaK6qzYSk-YWb8uNzx0sMYjmIwzC1ndRvBZsiM1ixrvfyVnHIZzrmNRj2ZpaZQ62uROxhvQmqeAq7r3Q6_FIALVhh2Q35RW5wWrHDRZ3k8XjrdSouRbDuAG3NjEmlXs5-jq23bYZ7w",
    bio: "Chuyên gia món chay thực dưỡng và ẩm thực thuần chay thanh tịnh từ rau củ quả thuần Việt.",
    device: "iPad Air 5 (iPadOS 17)",
    location: "115.79.42.10 • Đà Nẵng, VN",
    recipes: [],
  },
  {
    id: "hoangduy",
    code: "#USR-6620",
    name: "Hoàng Duy",
    handle: "@duy_foodie",
    email: "duy.nguyen@yahoo.com",
    verifiedEmail: true,
    twoFactor: "Vi phạm BQ",
    role: "Thành viên",
    roleBadge: "Khóa 7 ngày",
    roleColor: "bg-surface-container-highest text-error",
    recipesCount: 2,
    bookmarksCount: "12",
    aiScore: 32,
    aiLabel: "Cảnh cáo",
    aiColor: "text-outline",
    isOnline: false,
    isBanned: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAy-hru3556qFCfTZpCBTdtRd5-J5om9QGpjyOtbUD_U11jFPC0k9A44gYb85szcF4invIjtuyhtPjNshdq4Y43z-4RJzpFK-OSyBmkGSCRkXvtkBjz1d4araD1SCISNh93AVJd2d-2z8hsrHbumvk2aszowhQRNnxzSbGTxo7n_j0taRp-ZEsyLP3i7SaEs5GrEJmKCZZO2figGSF-be6574cwhAl3Z_Ir0wCEepGD",
    bio: "Tài khoản đang bị tạm đình chỉ đăng bài do sao chép nội dung bài viết và hình ảnh bản quyền.",
    device: "Samsung Galaxy S23 (Android 14)",
    location: "171.244.18.2 • Hải Phòng, VN",
    recipes: [],
  },
];

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = React.useState<UserProfile>(USERS_DATA[0]);
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>(["bepmeba", "botspam"]);
  const [activeFilterTab, setActiveFilterTab] = React.useState("all");

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col w-full gap-y-space-lg">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span>Hệ thống quản trị</span>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span className="text-primary font-semibold">Quản lý người dùng</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-mono-sm text-label-mono-sm text-secondary">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Cập nhật theo thời gian thực (Websocket)</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Danh sách người dùng &amp; Phân quyền
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Quản lý 12.840 tài khoản trên toàn hệ thống RecipeHub, giám sát trạng thái xác thực email, cấp quyền quản trị và xử lý tài khoản có dấu hiệu vi phạm hoặc spam.
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-space-sm shrink-0">
            <button
              type="button"
              onClick={() => alert("Đang xuất dữ liệu người dùng ra Excel/CSV...")}
              className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Icon name="download" size={18} />
              <span>Xuất Excel/CSV</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Mở modal cấu hình vai trò RBAC...")}
              className="px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Icon name="admin_panel_settings" size={18} />
              <span>Cấu hình RBAC</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Mở form thêm người dùng mới...")}
              className="px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-medium flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Icon name="person_add" size={18} />
              <span>Thêm người dùng mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* Stat 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-tertiary">
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Tổng người dùng</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <Icon name="group" size={18} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">12.840</div>
            <div className="flex items-center gap-1.5 mt-1 font-label-mono-sm text-label-mono-sm text-secondary">
              <Icon name="trending_up" size={16} />
              <span>+18.4% tháng này</span>
            </div>
          </div>
          <div className="font-body-sm text-body-sm text-tertiary truncate">9.420 khách đã chuyển đổi</div>
        </div>

        {/* Stat 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-tertiary">
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Đã xác thực Email</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
              <Icon name="verified_user" size={18} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">11.230</div>
            <div className="flex items-center gap-1.5 mt-1 font-label-mono-sm text-label-mono-sm text-secondary">
              <span>94.2% tỷ lệ an toàn</span>
            </div>
          </div>
          <div className="font-body-sm text-body-sm text-tertiary truncate">Đủ điều kiện đăng công thức</div>
        </div>

        {/* Stat 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-tertiary">
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Tác giả &amp; Bếp</span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <Icon name="skillet" size={18} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">1.450</div>
            <div className="flex items-center gap-1.5 mt-1 font-label-mono-sm text-label-mono-sm text-primary">
              <Icon name="menu_book" size={16} />
              <span>4.520 mâm cơm đã lưu</span>
            </div>
          </div>
          <div className="font-body-sm text-body-sm text-tertiary truncate">Đã qua xác thực hồ sơ ẩm thực</div>
        </div>

        {/* Stat 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-tertiary">
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Nghi vấn Spam</span>
            <div className="w-8 h-8 rounded-lg bg-error-container/60 flex items-center justify-center text-error">
              <Icon name="smart_toy" size={18} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-md text-headline-md font-bold text-error tracking-tight">24</div>
            <div className="flex items-center gap-1.5 mt-1 font-label-mono-sm text-label-mono-sm text-error">
              <Icon name="warning" size={16} />
              <span>Cần rà soát AI Turnstile</span>
            </div>
          </div>
          <div className="font-body-sm text-body-sm text-tertiary truncate">Spam liên kết &amp; bot đăng ký</div>
        </div>

        {/* Stat 5 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between text-tertiary">
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">Đã tạm khóa / Cấm</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
              <Icon name="lock" size={18} />
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">16</div>
            <div className="flex items-center gap-1.5 mt-1 font-label-mono-sm text-label-mono-sm text-tertiary">
              <span>Vi phạm bản quyền &amp; bình luận</span>
            </div>
          </div>
          <div className="font-body-sm text-body-sm text-tertiary truncate">Thi hành kỷ luật tài khoản</div>
        </div>
      </section>

      {/* 3. Filter & Search Console */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        {/* Status Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-on-surface">
          {[
            { id: "all", label: "Tất cả", count: "12.840", badgeColor: "bg-primary-container" },
            { id: "active", label: "Thành viên hoạt động", count: "11.190", badgeColor: "" },
            { id: "pending_email", label: "Chờ xác thực Email", count: "1.610", badgeColor: "" },
            { id: "spam", label: "Nghi vấn Spam", count: "24", badgeColor: "bg-error-container text-on-error-container font-semibold" },
            { id: "locked", label: "Đang bị khóa", count: "16", badgeColor: "bg-surface-container-highest" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full font-body-sm text-body-sm font-medium flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeFilterTab === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface hover:bg-surface-variant"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded-full ${tab.badgeColor || "opacity-75"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Detailed Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          <div className="md:col-span-4 relative flex items-center">
            <Icon name="search" size={18} className="absolute left-3 text-tertiary" />
            <input
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-surface-container-low text-on-surface placeholder:text-tertiary font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30"
              placeholder="Tìm theo tên, email, @handle, IP..."
              type="text"
            />
            <kbd className="absolute right-3 px-1.5 py-0.5 rounded font-label-mono-sm text-label-mono-sm bg-surface-container text-tertiary">
              Ctrl+K
            </kbd>
          </div>
          <div className="md:col-span-2">
            <select className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer border border-outline-variant/30">
              <option>Tất cả vai trò</option>
              <option>Khách vãng lai (Guest)</option>
              <option>Thành viên (Member)</option>
              <option>Tác giả uy tín (Author)</option>
              <option>Kiểm duyệt viên (Moderator)</option>
              <option>Quản trị viên (Super Admin)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer border border-outline-variant/30">
              <option>Trạng thái Email: Tất cả</option>
              <option>Đã xác thực</option>
              <option>Chưa xác thực</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer border border-outline-variant/30">
              <option>Mức độ tin cậy: Tất cả</option>
              <option>Uy tín cao (90-100)</option>
              <option>Bình thường (50-89)</option>
              <option>Rủi ro cao (&lt;40)</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center justify-end">
            <select className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer border border-outline-variant/30">
              <option>Mới tham gia nhất</option>
              <option>Điểm tín nhiệm giảm dần</option>
              <option>Đóng góp nhiều nhất</option>
              <option>Tên A - Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Contextual Bulk Actions Bar */}
      {selectedRowIds.length > 0 && (
        <div className="p-space-md rounded-2xl bg-surface-container-highest flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-sm transition-all">
          <div className="flex items-center gap-space-sm">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-on-primary">
              <Icon name="check" size={16} />
            </div>
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Đã chọn {selectedRowIds.length} tài khoản
            </span>
            <span className="font-body-sm text-body-sm text-tertiary">
              | Thao tác nhanh hàng loạt:
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => alert(`Đã gửi lại email kích hoạt tới ${selectedRowIds.length} tài khoản.`)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Icon name="mail" size={16} className="text-secondary" />
              <span>Gửi email kích hoạt</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Mở modal phân quyền hàng loạt...")}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Icon name="manage_accounts" size={16} className="text-primary" />
              <span>Nâng cấp vai trò</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Đã khóa các tài khoản được chọn.")}
              className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Icon name="block" size={16} />
              <span>Khóa tài khoản</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRowIds([])}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-tertiary hover:text-on-surface font-body-sm text-body-sm font-medium transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Split Layout: Data Table (8 Cols) + Quick Drawer Preview (4 Cols) */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-space-lg items-start">
        {/* User Data Table Container */}
        <div className="2xl:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-tertiary font-label-mono-sm text-label-mono-sm uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-3.5 pl-space-md pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === USERS_DATA.length}
                      onChange={() => {
                        if (selectedRowIds.length === USERS_DATA.length) setSelectedRowIds([]);
                        else setSelectedRowIds(USERS_DATA.map((u) => u.id));
                      }}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer accent-primary"
                    />
                  </th>
                  <th className="py-3.5 px-space-sm">Người dùng &amp; Gian bếp</th>
                  <th className="py-3.5 px-space-sm">Email &amp; Bảo mật</th>
                  <th className="py-3.5 px-space-sm">Vai trò</th>
                  <th className="py-3.5 px-space-sm text-center">Đóng góp</th>
                  <th className="py-3.5 px-space-sm">Độ tin cậy AI</th>
                  <th className="py-3.5 pr-space-md pl-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface font-body-sm text-body-sm">
                {USERS_DATA.map((user) => {
                  const isChecked = selectedRowIds.includes(user.id);
                  const isCurrentSelected = selectedUser.id === user.id;

                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`transition-colors group cursor-pointer ${
                        user.isSpam
                          ? "bg-error-container/30 hover:bg-error-container/40"
                          : isCurrentSelected
                          ? "bg-surface-container/60 hover:bg-surface-container/80"
                          : "hover:bg-surface-container-low"
                      }`}
                    >
                      <td className="py-4 pl-space-md pr-2" onClick={(e) => toggleSelectRow(user.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className={`w-4 h-4 rounded cursor-pointer ${user.isSpam ? "accent-error" : "accent-primary"}`}
                        />
                      </td>
                      <td className="py-4 px-space-sm">
                        <div className="flex items-center gap-space-sm">
                          <div className={`relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm ${user.isSpam ? "bg-error-container flex items-center justify-center text-error" : "bg-surface-container"}`}>
                            {user.avatar ? (
                              <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <Icon name="smart_toy" size={24} />
                            )}
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-surface ${
                                user.isOnline ? "bg-secondary" : user.isBanned ? "bg-error" : "bg-tertiary"
                              }`}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-title-md text-title-md font-semibold truncate ${user.isSpam ? "text-error" : "text-on-surface"}`}>
                                {user.name}
                              </span>
                              {user.id === "bepmeba" && <Icon name="verified" size={16} className="text-primary" />}
                              {user.id === "vuhoa" && <Icon name="spa" size={16} className="text-secondary" />}
                              {user.isSpam && (
                                <span className="px-1.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-error text-on-error font-medium">
                                  Spam Bot
                                </span>
                              )}
                              {user.isBanned && (
                                <span className="px-1.5 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-surface-container-highest text-error font-medium">
                                  Khóa 7 ngày
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 font-label-mono-sm text-label-mono-sm text-tertiary">
                              <span>{user.handle}</span>
                              <span>•</span>
                              <span className={user.isSpam ? "text-error/80" : "text-primary font-medium"}>
                                {user.code}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-space-sm">
                        <div className="flex flex-col">
                          <span className={`font-medium truncate ${user.isSpam ? "text-error" : "text-on-surface"}`}>
                            {user.email}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm ${
                                user.verifiedEmail
                                  ? "bg-secondary-container text-on-secondary-container"
                                  : "bg-error-container text-on-error-container"
                              }`}
                            >
                              {user.verifiedEmail ? "Đã xác thực" : "Chưa xác thực"}
                            </span>
                            <span className="px-1.5 py-0.5 rounded font-label-mono-sm text-label-mono-sm bg-surface-container text-tertiary">
                              {user.twoFactor}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-space-sm">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-title-md text-body-sm font-semibold ${user.roleColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{user.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-space-sm text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-label-mono-lg text-label-mono-lg font-semibold ${user.isSpam ? "text-error" : "text-on-surface"}`}>
                            {user.recipesCount}
                          </span>
                          <span className={`font-label-mono-sm text-label-mono-sm ${user.isSpam ? "text-error font-medium" : "text-tertiary"}`}>
                            {user.isSpam ? "42 link rác" : `${user.bookmarksCount} lưu`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-space-sm">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                            <span className={`font-semibold ${user.aiColor}`}>{user.aiScore}/100</span>
                            <span className="text-tertiary">{user.aiLabel}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                user.aiScore > 90
                                  ? "bg-secondary"
                                  : user.aiScore > 50
                                  ? "bg-primary"
                                  : "bg-error"
                              }`}
                              style={{ width: `${user.aiScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-space-md pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {user.isSpam ? (
                            <>
                              <button
                                type="button"
                                onClick={() => alert("Đã xóa vĩnh viễn bot spam.")}
                                className="px-2 py-1 rounded-lg bg-error text-on-error hover:bg-on-error-container font-label-mono-sm text-label-mono-sm font-semibold transition-colors shadow-sm cursor-pointer"
                              >
                                Xóa vĩnh viễn
                              </button>
                              <button
                                type="button"
                                onClick={() => alert("Đã chặn IP trên Cloudflare WAF.")}
                                className="p-1.5 rounded-lg text-error hover:bg-error-container transition-colors cursor-pointer"
                              >
                                <Icon name="security" size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setSelectedUser(user)}
                                className="p-1.5 rounded-lg text-tertiary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                                title="Xem hồ sơ"
                              >
                                <Icon name="visibility" size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => alert(`Chỉnh sửa vai trò cho ${user.name}`)}
                                className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                                title="Chỉnh sửa phân quyền"
                              >
                                <Icon name="edit_note" size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => alert(`Khóa tài khoản ${user.name}`)}
                                className="p-1.5 rounded-lg text-tertiary hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                                title="Khóa tài khoản"
                              >
                                <Icon name="lock" size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-space-md bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
            <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
              <span>
                Hiển thị <span className="font-semibold text-on-surface font-label-mono-sm">1 - 7</span> trong tổng số{" "}
                <span className="font-semibold text-on-surface font-label-mono-sm">12.840</span> người dùng
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-tertiary">Số dòng:</span>
                <select className="px-2 py-1 rounded-lg bg-surface-container text-on-surface font-label-mono-sm text-label-mono-sm focus:outline-none">
                  <option>10 dòng</option>
                  <option defaultValue="25">25 dòng</option>
                  <option>50 dòng</option>
                  <option>100 dòng</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button disabled className="p-1.5 rounded-lg bg-surface-container text-tertiary disabled:opacity-40" type="button">
                <Icon name="first_page" size={18} />
              </button>
              <button disabled className="p-1.5 rounded-lg bg-surface-container text-tertiary disabled:opacity-40" type="button">
                <Icon name="chevron_left" size={18} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold flex items-center justify-center shadow-sm" type="button">
                1
              </button>
              <button className="w-8 h-8 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-mono-sm text-label-mono-sm font-medium flex items-center justify-center transition-colors" type="button">
                2
              </button>
              <button className="w-8 h-8 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-mono-sm text-label-mono-sm font-medium flex items-center justify-center transition-colors" type="button">
                3
              </button>
              <span className="px-1 text-tertiary font-label-mono-sm text-label-mono-sm">...</span>
              <button className="w-8 h-8 rounded-lg bg-surface-container text-on-surface hover:bg-surface-variant font-label-mono-sm text-label-mono-sm font-medium flex items-center justify-center transition-colors" type="button">
                1.835
              </button>
              <button className="p-1.5 rounded-lg bg-surface-container text-tertiary hover:text-on-surface transition-colors" type="button">
                <Icon name="chevron_right" size={18} />
              </button>
              <button className="p-1.5 rounded-lg bg-surface-container text-tertiary hover:text-on-surface transition-colors" type="button">
                <Icon name="last_page" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick User Drawer / Detail Preview Sheet (4 cols) */}
        <aside className="2xl:col-span-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-lg flex flex-col gap-space-lg sticky top-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Chi tiết tài khoản
              </h2>
            </div>
            <div className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-tertiary bg-surface-container px-2.5 py-1 rounded-full">
              <span>ID:</span>
              <span className="font-semibold text-on-surface">{selectedUser.code}</span>
            </div>
          </div>

          {/* User Card Banner Profile */}
          <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-md">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-surface-container shrink-0">
                  {selectedUser.avatar ? (
                    <Image src={selectedUser.avatar} alt={selectedUser.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-error-container text-error">
                      <Icon name="smart_toy" size={28} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                    {selectedUser.name}
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
                    {selectedUser.handle}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm font-semibold ${selectedUser.roleColor}`}>
                      {selectedUser.roleBadge}
                    </span>
                    <span className="inline-flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {selectedUser.isOnline ? "Hoạt động" : "Ngoại tuyến"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Đã sao chép liên kết hồ sơ của ${selectedUser.name}`)}
                className="p-1.5 rounded-lg text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Sao chép liên kết"
              >
                <Icon name="share" size={18} />
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant italic mt-1 bg-surface-container-lowest/60 p-2.5 rounded-xl border border-outline-variant/10">
              &ldquo;{selectedUser.bio}&rdquo;
            </p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="font-label-mono-sm text-label-mono-sm text-tertiary block">Công thức</span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {selectedUser.recipesCount}
              </span>
            </div>
            <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="font-label-mono-sm text-label-mono-sm text-tertiary block">Lượt lưu</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                {selectedUser.bookmarksCount}
              </span>
            </div>
            <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="font-label-mono-sm text-label-mono-sm text-tertiary block">Điểm AI</span>
              <span className={`font-headline-sm text-headline-sm font-bold ${selectedUser.aiColor}`}>
                {selectedUser.aiScore}
              </span>
            </div>
          </div>

          {/* Security & Device Footprint Section */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-tertiary tracking-wider font-semibold">
              Thông tin bảo mật &amp; Phiên đăng nhập
            </span>
            <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-2 font-body-sm text-body-sm border border-outline-variant/20">
              <div className="flex items-center justify-between text-on-surface">
                <span className="text-tertiary flex items-center gap-1.5">
                  <Icon name="mail" size={16} /> Email chính:
                </span>
                <span className="font-medium font-label-mono-sm text-label-mono-sm truncate max-w-[180px]">
                  {selectedUser.email}
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <span className="text-tertiary flex items-center gap-1.5">
                  <Icon name="phonelink_lock" size={16} /> 2FA:
                </span>
                <span className="text-secondary font-medium font-label-mono-sm text-label-mono-sm">
                  {selectedUser.twoFactor}
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <span className="text-tertiary flex items-center gap-1.5">
                  <Icon name="devices" size={16} /> Thiết bị:
                </span>
                <span className="font-label-mono-sm text-label-mono-sm truncate max-w-[180px]">
                  {selectedUser.device}
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <span className="text-tertiary flex items-center gap-1.5">
                  <Icon name="location_on" size={16} /> IP &amp; Vị trí:
                </span>
                <span className="font-label-mono-sm text-label-mono-sm truncate max-w-[180px]">
                  {selectedUser.location}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Recipe Highlights */}
          {selectedUser.recipes && selectedUser.recipes.length > 0 && (
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-sm text-label-mono-sm uppercase text-tertiary tracking-wider font-semibold">
                  Công thức tiêu biểu gần đây
                </span>
                <span className="font-label-mono-sm text-label-mono-sm text-primary cursor-pointer hover:underline">
                  Xem tất cả
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {selectedUser.recipes.map((recipe, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-surface-container flex items-center gap-space-sm">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
                      <Image src={recipe.image} alt={recipe.title} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-title-md text-body-sm font-semibold text-on-surface truncate">
                        {recipe.title}
                      </span>
                      <span className="font-label-mono-sm text-label-mono-sm text-tertiary truncate">
                        {recipe.stats}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-label-mono-sm text-label-mono-sm bg-secondary-container text-on-secondary-container shrink-0">
                      {recipe.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer for Selected User */}
          <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => alert(`Cập nhật vai trò cho ${selectedUser.name}`)}
              className="w-full py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-title-md text-body-sm font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="manage_accounts" size={18} />
              <span>Chỉnh sửa vai trò &amp; Quyền hạn</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => alert(`Gửi cảnh báo vi phạm tới ${selectedUser.name}`)}
                className="py-2 px-space-sm rounded-xl bg-surface-container text-on-surface hover:bg-surface-variant font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Icon name="warning" size={16} className="text-primary" />
                <span>Gửi cảnh báo</span>
              </button>
              <button
                type="button"
                onClick={() => alert(`Khóa tài khoản ${selectedUser.name}`)}
                className="py-2 px-space-sm rounded-xl bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Icon name="lock" size={16} />
                <span>Khóa tài khoản</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
