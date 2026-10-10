import Link from "next/link";
import type { ReactNode } from "react";
import { Tag } from "@/components/ui/Tag";
import { getSetsByIds } from "@/lib/sets";

const navigation = [
  { href: "/catalog", label: "Каталог" },
  { href: "/test", label: "Сенсорный тест" },
  { href: "/cart", label: "Корзина" },
  { href: "/login", label: "Войти" },
];

const footerSets = getSetsByIds(["set-1", "set-2", "set-3", "set-4"]);

const socialLinks = ["Telegram", "VK"];

const linkClasses = "label text-[13px] tracking-[0.08em] text-ink transition-colors hover:text-terracotta-dark";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 border-b border-ink/15 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <Tag className="mb-3">{title}</Tag>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-ink/15 bg-sand pt-[clamp(56px,7vw,96px)]">
      <div className="wrap">
        <div className="grid border border-ink/15 sm:grid-cols-3">
          <FooterColumn title="Навигация">
            {navigation.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses}>
                {link.label}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Атмосферы">
            {footerSets.map((set) => (
              <Link key={set.id} href={`/set/${set.id}`} className={linkClasses}>
                {set.atmosphere}
              </Link>
            ))}
          </FooterColumn>
          <FooterColumn title="Клуб">
            <p className="label text-[13px] tracking-[0.08em] text-ink">
              Подписка <span className="text-ink-muted">[ скоро ]</span>
            </p>
            {socialLinks.map((name) => (
              <a key={name} href="#" className={linkClasses}>
                {name}
              </a>
            ))}
          </FooterColumn>
        </div>
        <p className="display mt-[clamp(48px,6vw,80px)] whitespace-nowrap text-[clamp(52px,11.2vw,190px)] leading-[0.85] text-ink">
          Сенсорный <em>клуб</em>
        </p>
        <div className="label flex flex-wrap justify-between gap-3 py-7 text-[11px] text-ink-muted">
          <span>© {new Date().getFullYear()} Сенсорный книжный клуб</span>
          <span>Все ароматы — воображаемые</span>
        </div>
      </div>
    </footer>
  );
}
