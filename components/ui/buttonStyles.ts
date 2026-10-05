import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-40";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-terracotta text-linen shadow-soft hover:bg-terracotta-dark hover:shadow-lifted active:scale-[0.98]",
  secondary: "border border-ink/15 bg-linen text-ink hover:border-terracotta hover:text-terracotta-dark",
  ghost: "text-ink-soft hover:bg-sand hover:text-ink",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}
