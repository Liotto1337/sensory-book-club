"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { BagIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/useHydrated";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import { MobileMenu } from "./MobileMenu";
import { navLinks } from "./navLinks";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Header() {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const cartCount = useCartStore(selectCartCount);
  const visibleCount = isHydrated ? cartCount : 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  // Стабильная ссылка: эффекты меню зависят от onClose и не должны перезапускаться на каждый рендер шапки
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-cream">
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="display whitespace-nowrap text-xl text-ink sm:text-[23px]">
          Сенсорный <em>книжный</em> клуб
        </Link>
        <nav aria-label="Основное меню" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = !link.href.includes("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "label relative whitespace-nowrap py-1.5 transition-colors duration-200",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
                  isActive ? "text-terracotta-dark" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* До 1024 px тема и аккаунт живут в мобильном меню: в шапке им не хватает места */}
          <div className="hidden items-center gap-1 lg:flex">
            <ThemeToggle />
            <UserMenu />
          </div>
          <Link
            href="/cart"
            aria-label={`Корзина, товаров: ${visibleCount}`}
            className="label hidden h-10 items-center whitespace-nowrap px-2 text-ink transition-colors duration-200 hover:text-terracotta-dark lg:flex"
          >
            Корзина [{visibleCount}]
          </Link>
          <Link
            href="/cart"
            aria-label={`Корзина, товаров: ${visibleCount}`}
            className="relative flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          >
            <BagIcon className="h-5 w-5" />
            {visibleCount > 0 && (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-terracotta px-1 font-mono text-[11px] font-semibold text-linen">
                {visibleCount}
              </span>
            )}
          </Link>
          {pathname !== "/test" && (
            <div className="ml-2 hidden lg:block">
              <ButtonLink href="/test" size="sm">
                Пройти тест
              </ButtonLink>
            </div>
          )}
          <button
            ref={burgerRef}
            type="button"
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center border border-ink/15 text-ink lg:hidden"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M0 1h18M0 6h18M0 11h18" />
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu open={isMenuOpen} onClose={closeMenu} returnFocusRef={burgerRef} />
    </header>
  );
}
