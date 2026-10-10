"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

interface ParallaxProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Доля высоты кадра, на которую фото смещается за время прохода через экран */
  strength?: number;
  /** Позиционирование задаёт вызывающий код (absolute inset-0 или relative с высотой) */
  className?: string;
}

/** Фото сдвигается медленнее страницы. Кадр с запасом 15% сверху и снизу, чтобы края не открывались. */
export function Parallax({ src, alt, sizes, priority = false, strength = 0.15, className }: ParallaxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -strength * 50 },
          {
            yPercent: strength * 50,
            ease: "none",
            scrollTrigger: { trigger: wrapperRef.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: wrapperRef, dependencies: [strength] },
  );

  return (
    <div ref={wrapperRef} className={cn("overflow-hidden", className)}>
      <div ref={innerRef} className="absolute inset-x-0 -inset-y-[15%]">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
}
