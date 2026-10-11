"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type RefObject } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { navLinks } from "./navLinks";
import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({ open, onClose, returnFocusRef }: MobileMenuProps) {
  const lenis = useLenis();
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.showToast);

  // Пока меню открыто, страница под ним не скроллится; закрывают Esc и расширение окна до 1024 px
  useEffect(() => {
    if (!open) return;
    const returnFocus = returnFocusRef.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") keepFocusInside(event);
    };
    // Меню модальное: Tab и Shift+Tab ходят по кругу внутри, а не уходят на страницу под ним
    const keepFocusInside = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isOutside = !dialog.contains(active);
      if (event.shiftKey && (active === first || isOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || isOutside)) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      document.body.style.overflow = "";
      lenis?.start();
      returnFocus?.focus();
    };
  }, [open, lenis, onClose, returnFocusRef]);

  useEffect(() => onClose(), [pathname, onClose]);

  if (!open) return null;

  const handleLogout = async () => {
    onClose();
    if (await logout()) showToast("Вы вышли из аккаунта", "info");
    else showToast("Не получилось выйти. Попробуйте ещё раз", "error");
  };

  return (
    <div
      ref={dialogRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      data-lenis-prevent
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-cream lg:hidden"
    >
      <div className="wrap flex h-[68px] w-full shrink-0 items-center justify-between border-b border-ink/15">
        <span className="display text-[clamp(15px,5.2vw,20px)] text-ink">
          Сенсорный <em>книжный</em> клуб
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть меню"
          className="flex h-10 w-10 items-center justify-center border border-ink/15 text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>
      <nav aria-label="Мобильное меню" className="wrap flex w-full flex-col py-6">
        {navLinks.map((link, index) => (
          <Link
            key={link.href}
            ref={index === 0 ? firstLinkRef : undefined}
            href={link.href}
            onClick={onClose}
            className="display border-b border-ink/15 py-4 text-5xl text-ink transition-colors hover:text-terracotta-dark"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="wrap mt-auto flex w-full flex-col gap-4 pb-8">
        <div className="flex items-center justify-between border-y border-ink/15 py-2">
          <span className="label text-ink-muted">Тема</span>
          <ThemeToggle />
        </div>
        {status === "authenticated" && user ? (
          <button type="button" onClick={handleLogout} className="label py-2 text-left text-ink hover:text-terracotta-dark">
            Выйти · {user.name}
          </button>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            onClick={onClose}
            className="label py-2 text-ink hover:text-terracotta-dark"
          >
            Войти
          </Link>
        )}
        <ButtonLink href="/test" size="lg" onClick={onClose} className="w-full">
          Пройти тест
        </ButtonLink>
      </div>
    </div>
  );
}
