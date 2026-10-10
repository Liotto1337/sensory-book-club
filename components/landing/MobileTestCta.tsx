"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

// Где кнопка не нужна: там уже есть своя кнопка теста, а подвал она бы перекрыла
const HIDE_OVER_IDS = ["hero", "cta-band", "site-footer"];

/** Закреплённая внизу экрана кнопка теста — только на телефоне и только на главной. */
export function MobileTestCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targets = HIDE_OVER_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target);
        else intersecting.delete(entry.target);
      }
      setIsVisible(intersecting.size === 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        "fixed inset-x-3 bottom-3 z-30 transition-[transform,opacity] duration-300 sm:hidden",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0",
      )}
    >
      <ButtonLink href="/test" size="lg" tabIndex={isVisible ? undefined : -1} className="w-full">
        Пройти сенсорный тест
        <ArrowRightIcon className="h-4 w-4" />
      </ButtonLink>
    </div>
  );
}
