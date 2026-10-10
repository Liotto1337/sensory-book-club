"use client";

import { useState } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getCartLines, getCartTotal } from "@/features/cart/getCartLines";
import { useCartStore } from "@/store/cartStore";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";

export function CheckoutView() {
  const items = useCartStore((state) => state.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lines = getCartLines(items);

  if (lines.length === 0 && !isSubmitting) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <PageHeading
          align="center"
          title={
            <>
              Оформлять пока <em>нечего</em>
            </>
          }
          description="Добавьте хотя бы один набор в корзину."
        />
        <ButtonLink href="/catalog" size="lg" className="mt-10">
          В каталог
        </ButtonLink>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="display text-[clamp(44px,7vw,88px)] text-ink">
        Оформление <em>заказа</em>
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="border border-ink/15 bg-linen p-5 sm:p-8">
          <CheckoutForm onSubmittingChange={setIsSubmitting} />
        </div>
        {lines.length > 0 && <OrderSummary lines={lines} total={getCartTotal(lines)} />}
      </div>
    </section>
  );
}
