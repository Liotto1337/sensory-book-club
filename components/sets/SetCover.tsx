import Image from "next/image";
import { cn } from "@/lib/cn";
import type { SensorySet } from "@/types";

type CoverSize = "md" | "lg" | "thumb";

interface SetCoverProps {
  set: Pick<SensorySet, "gradient" | "image">;
  size?: CoverSize;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

const SIZE_CLASSES: Record<CoverSize, string> = {
  md: "aspect-[1/1.02]",
  lg: "aspect-[4/5]",
  thumb: "h-full",
};

const DEFAULT_SIZES: Record<CoverSize, string> = {
  md: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  lg: "(min-width: 1024px) 50vw, 100vw",
  thumb: "128px",
};

export function SetCover({ set, size = "md", sizes, className, imageClassName }: SetCoverProps) {
  return (
    // Градиент набора — подложка, пока фото грузится
    <div className={cn("relative overflow-hidden", SIZE_CLASSES[size], className)} style={{ background: set.gradient }}>
      <Image
        src={set.image.src}
        alt={set.image.alt}
        fill
        sizes={sizes ?? DEFAULT_SIZES[size]}
        priority={size === "lg"}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
