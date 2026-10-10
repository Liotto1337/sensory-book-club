// Основано на React Bits ScrollVelocity (https://reactbits.dev, MIT + Commons Clause), адаптировано
"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Fragment, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";

const COPIES = 3;

interface ScrollVelocityProps {
  items: string[];
  /** Пикселей в секунду без прокрутки */
  baseVelocity?: number;
  className?: string;
}

function useElementWidth(ref: RefObject<HTMLElement>): number {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    // ResizeObserver, а не resize: ширина меняется и когда догружается шрифт
    const observer = new ResizeObserver(() => setWidth(element.offsetWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/** Бегущая строка: едет сама и ускоряется вместе со скоростью прокрутки. При reduced motion стоит. */
export function ScrollVelocity({ items, baseVelocity = 60, className }: ScrollVelocityProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const copyRef = useRef<HTMLDivElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const x = useTransform(baseX, (value) => (copyWidth === 0 ? "0px" : `${wrap(-copyWidth, 0, value)}px`));
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  const row = items.map((item) => (
    <Fragment key={item}>
      <span>{item}</span>
      <span className="font-sans text-[0.55em] text-terracotta" aria-hidden>
        ✦
      </span>
    </Fragment>
  ));

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            aria-hidden={copy > 0 || undefined}
            className="flex shrink-0 items-center gap-[0.6em] pr-[0.6em]"
          >
            {row}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
