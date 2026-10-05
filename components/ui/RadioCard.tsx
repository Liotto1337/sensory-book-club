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
        "group flex cursor-pointer items-center gap-4 rounded-card border-2 bg-linen p-4 transition-all duration-300 sm:p-5",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta/40",
        checked
          ? "border-terracotta shadow-lifted"
          : "border-transparent shadow-soft hover:border-terracotta/30 hover:-translate-y-0.5",
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
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-control text-2xl transition-colors duration-300",
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
          "ml-auto h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-300",
          checked ? "border-terracotta bg-terracotta shadow-[inset_0_0_0_3px_#FFFDF9]" : "border-ink/20",
        )}
        aria-hidden
      />
    </label>
  );
}
