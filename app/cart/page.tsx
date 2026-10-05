"use client";

import { CartView } from "@/features/cart/CartView";
import { useHydrated } from "@/lib/useHydrated";

export default function CartPage() {
  const isHydrated = useHydrated();
  return isHydrated ? <CartView /> : <div className="min-h-[60vh]" />;
}
