"use client";

import { SplitText } from "gsap/SplitText";
import { gsap } from "./gsap";

// Отдельный модуль, чтобы SplitText попадал только в бандл страниц с SplitHeading
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export { SplitText };
