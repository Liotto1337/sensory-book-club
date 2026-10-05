import type { Metadata } from "next";
import { Suspense } from "react";
import { ThanksContent } from "@/features/checkout/ThanksContent";

export const metadata: Metadata = {
  title: "Спасибо за заказ — Сенсорный книжный клуб",
};

export default function ThanksPage() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <ThanksContent />
      </Suspense>
    </section>
  );
}
