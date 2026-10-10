import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function RadioCard({
  name,
  value,
  checked,
  onSelect,
  title,
  description,
  icon,
  className,
}: RadioCardProps) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-4 border bg-linen p-4 transition-colors duration-300 sm:p-5",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
        checked ? "border-ink ring-1 ring-ink" : "border-ink/15 hover:border-ink/40",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      {icon && (
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center text-2xl transition-colors duration-300",
            checked ? "bg-terracotta-light" : "bg-sand",
          )}
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="flex flex-col">
        <span className="font-medium text-ink">{title}</span>
        {description && <span className="text-sm text-ink-muted">{description}</span>}
      </span>
      <span
        className={cn(
          "ml-auto h-4 w-4 shrink-0 border transition-colors duration-300",
          checked ? "border-terracotta bg-terracotta" : "border-ink/30",
        )}
        aria-hidden
      />
    </label>
  );
}
