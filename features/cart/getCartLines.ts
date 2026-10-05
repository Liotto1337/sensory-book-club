import { getSetById } from "@/lib/sets";
import type { CartItem, SetWithBook } from "@/types";

export interface CartLine {
  set: SetWithBook;
  quantity: number;
  subtotal: number;
}

export function getCartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const set = getSetById(item.setId);
    return set ? [{ set, quantity: item.quantity, subtotal: set.price * item.quantity }] : [];
  });
}

export function getCartTotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.subtotal, 0);
}
