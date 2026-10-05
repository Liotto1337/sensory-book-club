import { cn } from "@/lib/cn";
import type { SensorySet } from "@/types";

interface SetCoverProps {
  set: Pick<SensorySet, "gradient" | "emoji" | "atmosphere">;
  size?: "md" | "lg";
  className?: string;
}

export function SetCover({ set, size = "md", className }: SetCoverProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        size === "lg" ? "aspect-[4/3] rounded-card sm:aspect-[16/10]" : "aspect-[16/10]",
        className,
      )}
      style={{ background: set.gradient }}
      role="img"
      aria-label={`Атмосфера: ${set.atmosphere}`}
    >
      <span className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-linen/30 blur-2xl" />
      <span className="absolute -bottom-12 -right-6 h-48 w-48 rounded-full bg-ink/10 blur-3xl" />
      <span className={cn("relative drop-shadow-sm", size === "lg" ? "text-7xl sm:text-8xl" : "text-5xl")}>
        {set.emoji}
      </span>
    </div>
  );
}
