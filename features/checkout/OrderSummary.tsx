import { formatPrice } from "@/lib/formatPrice";
import type { CartLine } from "@/features/cart/getCartLines";

interface OrderSummaryProps {
  lines: CartLine[];
  total: number;
}

export function OrderSummary({ lines, total }: OrderSummaryProps) {
  return (
    <aside className="h-fit rounded-card bg-linen p-6 shadow-soft lg:sticky lg:top-24">
      <h2 className="font-serif text-xl text-ink">Ваш заказ</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {lines.map(({ set, quantity, subtotal }) => (
          <li key={set.id} className="flex justify-between gap-3 text-sm">
            <span className="text-ink-soft">
              {set.atmosphere}
              {quantity > 1 && <span className="text-ink-muted"> × {quantity}</span>}
            </span>
            <span className="shrink-0 text-ink">{formatPrice(subtotal)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t border-ink/5 pt-4">
        <span className="text-ink-soft">Итого</span>
        <span className="font-serif text-2xl text-ink">{formatPrice(total)}</span>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        Это тестовая версия: оплата имитируется, деньги не списываются.
      </p>
    </aside>
  );
}
