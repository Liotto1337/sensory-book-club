import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "band";
export type ButtonSize = "sm" | "md" | "lg";

// Последняя иконка (стрелка) сдвигается при наведении
const baseClasses =
  "inline-flex items-center justify-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-40 [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-300 hover:[&>svg:last-child]:translate-x-1";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-terracotta text-linen hover:bg-terracotta-dark",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-cream",
  ghost: "text-ink underline-offset-4 hover:underline",
  // Поверх фото: светлый контур в обеих темах
  inverse: "border border-white/70 text-white hover:bg-white hover:text-[#1B1510]",
  // Полоса-призыв: чёрная в светлой теме, терракотовая в тёмной — кнопка на ней меняет цвет вместе с ней
  band: "bg-terracotta text-linen hover:bg-terracotta-dark dark:bg-on-band dark:text-band dark:hover:bg-linen",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-[46px] px-5",
  lg: "h-[54px] px-8",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}
