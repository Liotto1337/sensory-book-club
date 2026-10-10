import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Чёрная плашка-метка над заголовком секции: «Как это работает», «Каталог». */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-ink px-2.5 pb-1 pt-1.5 font-mono text-xs font-medium uppercase leading-none tracking-[0.12em] text-cream",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** Светлый текст для подписи поверх фото */
  onPhoto?: boolean;
}

/** Подпись с квадратным маркером акцентного цвета. */
export function Eyebrow({ children, className, onPhoto = false }: EyebrowProps) {
  return (
    <p className={cn("label flex items-center gap-2.5", onPhoto ? "text-white/85" : "text-ink-soft", className)}>
      <span className="h-[9px] w-[9px] shrink-0 bg-terracotta" aria-hidden />
      {children}
    </p>
  );
}
