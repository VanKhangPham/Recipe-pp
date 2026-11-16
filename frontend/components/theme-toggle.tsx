"use client";

import * as React from "react";
import { Icon } from "@/components/ui/icon";

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant/40 transition-all font-body-sm text-body-sm shadow-xs cursor-pointer"
      title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
      aria-label="Chuyển đổi chế độ màu"
    >
      <Icon
        name={isDark ? "light_mode" : "dark_mode"}
        size={18}
        className={isDark ? "text-primary" : "text-on-surface-variant"}
      />
      <span className="font-medium">{isDark ? "Giao diện Tối" : "Giao diện Sáng"}</span>
    </button>
  );
}
