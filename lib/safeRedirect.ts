/** Разрешает переход после входа только на страницы этого сайта: «/set/set-1» — да, «//evil.com» — нет. */
export function safeRedirectPath(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
