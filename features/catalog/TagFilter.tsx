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
              "border px-3.5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-200",
              isActive
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 bg-linen text-ink-soft hover:border-ink/40 hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
