"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Плагины регистрируются один раз и только в браузере; все компоненты берут GSAP отсюда.
// SplitText — отдельно, в lib/gsap-split.ts: он нужен только заголовку главной и не должен попадать на каждую страницу.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Условие для gsap.matchMedia(): эффекты движения только для тех, кто не просил их уменьшить. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
