// Основано на React Bits SplitText (https://reactbits.dev, MIT + Commons Clause), адаптировано
"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

interface SplitHeadingProps {
  as?: "h1" | "h2";
  className?: string;
  /** Текст заголовка; акцентное слово — в <em>, SplitText сохраняет его внутри строки */
  children: ReactNode;
  delay?: number;
}

/**
 * Заголовок выезжает по строкам из-под маски. Строки определяются фактическим переносом,
 * а autoSplit пересобирает их при смене ширины и после загрузки шрифтов.
 * До разбивки заголовок скрыт классом .split-pending (globals.css), чтобы не мигать.
 * SplitText ставит на элемент aria-label с полным текстом, а строки прячет от скринридеров.
 */
export function SplitHeading({ as: Tag = "h2", className, children, delay = 0 }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            el.classList.remove("split-pending");
            return gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.12, delay });
          },
        });
        return () => split.revert();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.classList.remove("split-pending");
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn("split-pending", className)}>
      {children}
    </Tag>
  );
}
