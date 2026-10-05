"use client";

import { CheckoutView } from "@/features/checkout/CheckoutView";
import { useHydrated } from "@/lib/useHydrated";

export default function CheckoutPage() {
  const isHydrated = useHydrated();
  return isHydrated ? <CheckoutView /> : <div className="min-h-[60vh]" />;
}
