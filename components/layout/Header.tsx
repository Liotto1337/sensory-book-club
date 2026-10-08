"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BagIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/useHydrated";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/test", label: "Тест" },
];

export function Header() {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const cartCount = useCartStore(selectCartCount);
  const visibleCount = isHydrated ? cartCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg text-ink sm:text-xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-sm text-linen">
            С
          </span>
          <span className="hidden sm:inline">Сенсорный книжный клуб</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-control px-3 py-2 text-sm transition-colors duration-200",
                pathname.startsWith(link.href)
                  ? "text-terracotta-dark"
                  : "text-ink-soft hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href="/cart"
            aria-label={`Корзина, товаров: ${visibleCount}`}
            className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-sand"
          >
            <BagIcon className="h-5 w-5" />
            {visibleCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-semibold text-linen">
                {visibleCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
