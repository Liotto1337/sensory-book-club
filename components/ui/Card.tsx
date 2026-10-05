import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-ink/5 bg-linen shadow-soft",
        interactive && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted",
        className,
      )}
      {...props}
    />
  );
}
