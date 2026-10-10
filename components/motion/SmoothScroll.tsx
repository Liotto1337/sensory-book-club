"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Плавный скролл всего сайта. Кадры Lenis ведёт тикер GSAP, поэтому Lenis и ScrollTrigger
 * обновляются в одном кадре и параллакс не отстаёт от прокрутки.
 * Прокрутку при переходах (наверх, «назад» на прежнюю позицию) делает сам Next:
 * stopInertiaOnNavigate гасит инерцию Lenis при клике по внутренней ссылке, чтобы она не перебила его.
 */
export function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  useLenis(() => ScrollTrigger.update());

  // После перехода разметка другая — пересчитываем позиции триггеров
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <ReactLenis root options={{ autoRaf: false, anchors: true, stopInertiaOnNavigate: true }} ref={lenisRef} />;
}
