"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

export function ThanksContent() {
  const orderNumber = useSearchParams().get("order");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto flex max-w-4xl flex-col items-center text-center"
    >
      <h1 className="display text-[clamp(64px,12vw,160px)] text-ink">
        Спасибо <em className="whitespace-nowrap">за заказ</em>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Мы свяжемся с вами в течение дня. Уже начали собирать ваш набор: подбираем аромат и завязываем ленту.
      </p>
      {orderNumber && <Tag className="mt-8">Заказ {orderNumber}</Tag>}
      <ButtonLink href="/" size="lg" className="mt-10">
        На главную
      </ButtonLink>
    </motion.div>
  );
}
