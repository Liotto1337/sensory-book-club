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
    <div className="flex gap-4 border border-ink/15 bg-linen p-3 sm:p-4">
      <Link href={`/set/${set.id}`} className="w-24 shrink-0 overflow-hidden sm:w-32">
        <SetCover set={set} size="thumb" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/set/${set.id}`} className="text-lg font-medium leading-tight text-ink hover:text-terracotta-dark">
              {set.atmosphere}
            </Link>
            <p className="text-sm text-ink-muted">«{set.book.title}»</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Удалить «${set.atmosphere}»`}
            className="p-2 text-ink-muted transition-colors hover:bg-sand hover:text-terracotta-dark"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-ink/20">
            <button type="button" onClick={() => onChangeQuantity(-1)} aria-label="Уменьшить количество" className="h-8 w-8 text-ink-soft hover:text-ink">
              −
            </button>
            <span className="w-8 text-center font-mono text-sm">{quantity}</span>
            <button type="button" onClick={() => onChangeQuantity(1)} aria-label="Увеличить количество" className="h-8 w-8 text-ink-soft hover:text-ink">
              +
            </button>
          </div>
          <span className="font-display text-2xl text-ink">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
