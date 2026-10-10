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

  // Страница выросла или сжалась уже после загрузки (лента отзывов, шрифты, картинки) — триггеры ниже
  // сдвинулись, и без пересчёта параллакс замирает на полпути. Пересчитываем с небольшой задержкой.
  useEffect(() => {
    let lastHeight = document.body.scrollHeight;
    let timer: number | undefined;
    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // После перехода разметка другая — пересчитываем позиции триггеров
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <ReactLenis root options={{ autoRaf: false, anchors: true, stopInertiaOnNavigate: true }} ref={lenisRef} />;
}
