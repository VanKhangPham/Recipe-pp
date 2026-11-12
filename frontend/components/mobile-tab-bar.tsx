"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

const tabs = [
  {
    label: "Trang chủ",
    href: "/",
    icon: "home",
    exact: true,
  },
  {
    label: "Khám phá",
    href: "/recipes",
    icon: "explore",
    exact: false,
  },
  {
    label: "Kế hoạch",
    href: "/meal-planner",
    icon: "calendar_today",
    exact: false,
  },
  {
    label: "Đi chợ",
    href: "/shopping-list",
    icon: "shopping_basket",
    exact: false,
  },
  {
    label: "Tài khoản",
    href: "/profile",
    icon: "person_outline",
    exact: false,
  },
];

function MobileTabBarInner() {
  const pathname = usePathname();

  // Hide on admin routes and full screen cook mode
  if (pathname.startsWith("/admin") || pathname.includes("/cook")) {
    return null;
  }

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(43,30,22,0.05)] border-t border-surface-container"
    >
      <div className="flex items-center justify-around h-16 px-space-xs max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] w-14 transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface font-normal"
              }`}
            >
              <Icon name={tab.icon} size={22} />
              <span className="font-body-sm text-[11px] leading-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileTabBar() {
  return (
    <React.Suspense fallback={null}>
      <MobileTabBarInner />
    </React.Suspense>
  );
}
