export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "sensory-book-club-theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Выполняется в <head> до отрисовки, чтобы страница не мигала светлой темой.
 * Без сохранённого выбора следует системной настройке.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="dark":window.matchMedia("${DARK_QUERY}").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Хранилище недоступно (приватный режим) — тема просто не запомнится
  }
}

export function hasSavedTheme(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Следит за системной темой, пока пользователь не выбрал свою. Возвращает функцию отписки. */
export function followSystemTheme(): () => void {
  const media = window.matchMedia(DARK_QUERY);
  const onChange = (event: MediaQueryListEvent) => {
    if (!hasSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  };
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
