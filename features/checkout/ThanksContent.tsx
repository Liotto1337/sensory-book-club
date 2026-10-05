"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";

export function ThanksContent() {
  const orderNumber = useSearchParams().get("order");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-xl flex-col items-center rounded-card bg-linen px-6 py-12 text-center shadow-soft sm:px-12"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-light text-3xl">
        🕊️
      </span>
      <h1 className="mt-6 font-serif text-3xl leading-tight text-ink sm:text-4xl">
        Спасибо! Мы свяжемся с вами в течение дня
      </h1>
      <p className="mt-4 text-ink-soft">
        Мы уже начали собирать ваш набор: подбираем аромат и завязываем ленту.
      </p>
      {orderNumber && (
        <p className="mt-8 rounded-control border border-dashed border-terracotta/40 px-6 py-3 text-sm text-ink-soft">
          Номер заказа: <span className="font-semibold tracking-wider text-ink">{orderNumber}</span>
        </p>
      )}
      <ButtonLink href="/" size="lg" className="mt-10">
        Вернуться на главную
      </ButtonLink>
    </motion.div>
  );
}
