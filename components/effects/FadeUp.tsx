"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  /** Пауза между появлением соседних детей, секунды */
  stagger?: number;
  /** ol/ul — чтобы анимируемые дети оставались элементами списка */
  as?: "div" | "ol" | "ul";
}

/** Прямые дети поочерёдно поднимаются и проявляются, когда блок входит в экран. Один раз. */
export function FadeUp({ children, className, stagger = 0.12, as: Tag = "div" }: FadeUpProps) {
  // Пересечение типов: один ref подходит любому из трёх тегов
  const ref = useRef<HTMLDivElement & HTMLOListElement & HTMLUListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(el.children, {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-fade-up className={className}>
      {children}
    </Tag>
  );
}
