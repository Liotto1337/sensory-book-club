import { cn } from "@/lib/cn";
import type { CatalogFilterTag } from "@/types";

interface TagFilterProps {
  options: Array<{ tag: CatalogFilterTag; label: string }>;
  activeTags: CatalogFilterTag[];
  onToggle: (tag: CatalogFilterTag) => void;
}

export function TagFilter({ options, activeTags, onToggle }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ tag, label }) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(tag)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all duration-200",
              isActive
                ? "border-terracotta bg-terracotta text-linen shadow-soft"
                : "border-ink/10 bg-linen text-ink-soft hover:border-terracotta/40 hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
