// Основано на React Bits ScrollReveal (https://reactbits.dev, MIT + Commons Clause), адаптировано
"use client";

import { Fragment, useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

interface RevealTextProps {
  children: string;
  className?: string;
}

/**
 * Абзац проявляется по словам, пока его прокручивают. Слова размечены уже в HTML,
 * так что без движения (reduced motion, без JS) текст просто виден целиком.
 */
export function RevealText({ children, className }: RevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = children.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".reveal-word",
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="reveal-word">{word}</span>
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </p>
  );
}
