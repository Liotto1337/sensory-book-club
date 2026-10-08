import Link from "next/link";
import { SetCover } from "@/components/sets/SetCover";
import { TrashIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/formatPrice";
import type { CartLine } from "./getCartLines";

interface CartItemRowProps {
  line: CartLine;
  onChangeQuantity: (delta: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ line, onChangeQuantity, onRemove }: CartItemRowProps) {
  const { set, quantity, subtotal } = line;

  return (
    <div className="flex gap-4 rounded-card bg-linen p-3 shadow-soft sm:p-4">
      <Link href={`/set/${set.id}`} className="w-24 shrink-0 overflow-hidden rounded-control sm:w-32">
        <SetCover set={set} sizes="128px" className="h-full" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/set/${set.id}`} className="font-serif text-lg leading-tight text-ink hover:text-terracotta-dark">
              {set.atmosphere}
            </Link>
            <p className="text-sm text-ink-muted">«{set.book.title}»</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Удалить «${set.atmosphere}»`}
            className="rounded-full p-2 text-ink-muted transition-colors hover:bg-sand hover:text-terracotta-dark"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-control border border-ink/10">
            <button type="button" onClick={() => onChangeQuantity(-1)} aria-label="Уменьшить количество" className="h-8 w-8 text-ink-soft hover:text-ink">
              −
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button type="button" onClick={() => onChangeQuantity(1)} aria-label="Увеличить количество" className="h-8 w-8 text-ink-soft hover:text-ink">
              +
            </button>
          </div>
          <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
