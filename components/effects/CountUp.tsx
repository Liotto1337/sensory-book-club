// Основано на React Bits CountUp (https://reactbits.dev, MIT + Commons Clause), адаптировано
"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const numberFormat = new Intl.NumberFormat("ru-RU");

interface CountUpProps {
  to: number;
  from?: number;
  /** Секунды досчёта */
  duration?: number;
  className?: string;
}

/**
 * Число досчитывает до `to`, когда попадает в зону видимости.
 * В HTML с сервера сразу итоговое число — его же видят при reduced motion и без JS.
 * Вместо пружины React Bits — анимация с фиксированной длительностью: у пружины долгий хвост,
 * и последняя цифра «доползает» секундами.
 */
export function CountUp({ to, from = 0, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion) {
      element.textContent = numberFormat.format(to);
      return;
    }
    if (!isInView) {
      element.textContent = numberFormat.format(from);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        element.textContent = numberFormat.format(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {numberFormat.format(to)}
    </span>
  );
}
