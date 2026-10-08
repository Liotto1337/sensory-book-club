import Image from "next/image";
import { cn } from "@/lib/cn";
import type { SensorySet } from "@/types";

interface SetCoverProps {
  set: Pick<SensorySet, "gradient" | "image">;
  size?: "md" | "lg";
  sizes?: string;
  className?: string;
}

const DEFAULT_SIZES: Record<NonNullable<SetCoverProps["size"]>, string> = {
  md: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  lg: "(min-width: 1024px) 50vw, 100vw",
};

export function SetCover({ set, size = "md", sizes, className }: SetCoverProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        size === "lg" ? "aspect-[4/3] rounded-card sm:aspect-[16/10]" : "aspect-[16/10]",
        className,
      )}
      style={{ background: set.gradient }}
    >
      <Image
        src={set.image.src}
        alt={set.image.alt}
        fill
        sizes={sizes ?? DEFAULT_SIZES[size]}
        priority={size === "lg"}
        className="object-cover"
      />
    </div>
  );
}
