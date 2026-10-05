"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PageHeading } from "@/components/layout/PageHeading";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/formatPrice";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { CartItemRow } from "./CartItemRow";
import { getCartLines, getCartTotal } from "./getCartLines";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const showToast = useToastStore((state) => state.showToast);
  const lines = getCartLines(items);

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl" aria-hidden>🕯️</p>
        <PageHeading
          title="Корзина пока пуста"
          description="Загляните в каталог или пройдите тест — мы поможем найти вашу атмосферу."
        />
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/catalog" size="lg">В каталог</ButtonLink>
          <ButtonLink href="/test" size="lg" variant="secondary">Пройти тест</ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-serif text-3xl text-ink sm:text-5xl">Корзина</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.li
                key={line.set.id}
                layout
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <CartItemRow
                  line={line}
                  onChangeQuantity={(delta) => changeQuantity(line.set.id, delta)}
                  onRemove={() => {
                    removeItem(line.set.id);
                    showToast(`«${line.set.atmosphere}» удалён из корзины`, "info");
                  }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <aside className="h-fit rounded-card bg-linen p-6 shadow-soft lg:sticky lg:top-24">
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Доставка</span>
            <span>на следующем шаге</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-ink/5 pt-4">
            <span className="text-ink-soft">Итого</span>
            <span className="font-serif text-3xl text-ink">{formatPrice(getCartTotal(lines))}</span>
          </div>
          <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
            Оформить заказ
          </ButtonLink>
        </aside>
      </div>
    </section>
  );
}
