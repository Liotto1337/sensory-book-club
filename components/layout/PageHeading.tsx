import type { ReactNode } from "react";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

interface PageHeadingProps {
  eyebrow?: string;
  /** Может содержать одно акцентное слово в <em> */
  title: ReactNode;
  description?: ReactNode;
  /** Короткая подпись справа, например «12 наборов» */
  aside?: ReactNode;
  align?: "left" | "center";
}

export function PageHeading({ eyebrow, title, description, aside, align = "left" }: PageHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        isCentered ? "items-center text-center" : "text-left lg:flex-row lg:items-end lg:justify-between",
      )}
    >
      <div className={cn("flex flex-col", isCentered ? "items-center" : "items-start")}>
        {eyebrow && <Tag>{eyebrow}</Tag>}
        <h1 className={cn("display text-[clamp(52px,9vw,104px)] text-ink", eyebrow && "mt-5")}>{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg text-ink-soft">{description}</p>}
      </div>
      {aside && <p className="label shrink-0 text-ink-muted">{aside}</p>}
    </div>
  );
}
