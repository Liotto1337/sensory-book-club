import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-ink/15 bg-linen",
        interactive && "transition-colors duration-300 hover:border-ink/40",
        className,
      )}
      {...props}
    />
  );
}
