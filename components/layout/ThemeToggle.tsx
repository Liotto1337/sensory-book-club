"use client";

import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { applyTheme, followSystemTheme, getCurrentTheme, saveTheme } from "@/lib/theme";

export function ThemeToggle() {
  useEffect(() => followSystemTheme(), []);

  const toggleTheme = () => {
    const next = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  };

  // Иконка и подпись переключаются через CSS-класс .dark, поэтому разметка одинакова на сервере и клиенте
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Сменить тему"
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand hover:text-ink"
    >
      <MoonIcon className="h-5 w-5 dark:hidden" />
      <SunIcon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only dark:hidden">Включить тёмную тему</span>
      <span className="sr-only hidden dark:inline">Включить светлую тему</span>
    </button>
  );
}
