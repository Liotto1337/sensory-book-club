import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-terracotta">{eyebrow}</p>
      )}
      <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-base text-ink-soft sm:text-lg">{description}</p>}
    </div>
  );
}
