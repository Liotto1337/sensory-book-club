import Link from "next/link";

const socialLinks = ["Telegram", "VK", "Instagram"];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/5 bg-sand/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-xs">
          <p className="font-serif text-xl text-ink">Сенсорный книжный клуб</p>
          <p className="mt-2 text-sm text-ink-muted">
            Подбираем книги по воспоминаниям, а не по жанрам.
          </p>
        </div>
        <nav className="flex gap-8 text-sm text-ink-soft">
          <div className="flex flex-col gap-2">
            <Link href="/catalog" className="hover:text-terracotta-dark">Каталог</Link>
            <Link href="/test" className="hover:text-terracotta-dark">Сенсорный тест</Link>
            <Link href="/cart" className="hover:text-terracotta-dark">Корзина</Link>
          </div>
          <div className="flex flex-col gap-2">
            {socialLinks.map((name) => (
              <a key={name} href="#" className="hover:text-terracotta-dark">
                {name}
              </a>
            ))}
          </div>
        </nav>
      </div>
      <div className="border-t border-ink/5 py-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Сенсорный книжный клуб. Все ароматы — воображаемые.
      </div>
    </footer>
  );
}
