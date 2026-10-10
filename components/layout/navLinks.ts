export interface NavLink {
  href: string;
  label: string;
}

/** Основная навигация: шапка на десктопе и мобильное меню. */
export const navLinks: NavLink[] = [
  { href: "/catalog", label: "Каталог" },
  { href: "/test", label: "Сенсорный тест" },
  { href: "/#how", label: "Как это работает" },
];
