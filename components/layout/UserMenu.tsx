"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoutIcon, UserIcon } from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

const iconButtonClasses =
  "flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand hover:text-ink";

export function UserMenu() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const loadUser = useAuthStore((state) => state.loadUser);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.showToast);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [isOpen]);

  useEffect(() => setIsOpen(false), [pathname]);

  if (status !== "authenticated" || !user) {
    // Пока статус неизвестен, показываем ту же иконку, чтобы шапка не прыгала
    const isAuthPage = pathname === "/login" || pathname === "/register";
    return (
      <Link
        href={isAuthPage ? "/login" : `/login?next=${encodeURIComponent(pathname)}`}
        aria-label="Войти"
        title="Войти"
        className={iconButtonClasses}
      >
        <UserIcon className="h-5 w-5" />
      </Link>
    );
  }

  const handleLogout = async () => {
    setIsOpen(false);
    if (await logout()) showToast("Вы вышли из аккаунта", "info");
    else showToast("Не получилось выйти. Попробуйте ещё раз", "error");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Аккаунт: ${user.name}`}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-light font-serif text-sm text-terracotta-dark transition-colors duration-200 hover:bg-sand"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-60 rounded-card border border-ink/5 bg-linen p-2 shadow-lifted"
        >
          <div className="px-3 py-2">
            <p className="truncate font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-sand hover:text-ink"
          >
            <LogoutIcon className="h-4 w-4" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
