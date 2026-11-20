"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";

export function ThemeToggle() {
  const isDark = React.useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      let theme: string | null = null;
      try {
        theme = localStorage.getItem("theme");
      } catch {
        /* Use the system preference when storage is blocked. */
      }
      document.documentElement.classList.toggle("dark", theme === "dark" || (theme === null && media.matches));
    };
    applyTheme();
    window.addEventListener("storage", applyTheme);
    media.addEventListener("change", applyTheme);
    return () => {
      window.removeEventListener("storage", applyTheme);
      media.removeEventListener("change", applyTheme);
    };
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark", !isDark);
    try {
      localStorage.setItem("theme", isDark ? "light" : "dark");
    } catch {
      /* Keep the current page usable without storage. */
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="inline-flex items-center gap-1.5 px-2.5 2xl:px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/40 transition-all font-body-sm text-body-sm shadow-xs cursor-pointer shrink-0"
      title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
      aria-label="Chuyển đổi chế độ màu"
    >
      <Icon
        name={isDark ? "light_mode" : "dark_mode"}
        size={18}
        className={isDark ? "text-primary" : "text-on-surface-variant"}
      />
      <span className="hidden 2xl:inline font-medium whitespace-nowrap">
        {isDark ? "Tối" : "Sáng"}
      </span>
    </button>
  );
}

function subscribeToTheme(listener: () => void) {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
