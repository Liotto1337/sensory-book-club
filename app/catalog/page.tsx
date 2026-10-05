import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { CatalogView } from "@/features/catalog/CatalogView";
import { getAllSets } from "@/lib/sets";

export const metadata: Metadata = {
  title: "Каталог атмосфер — Сенсорный книжный клуб",
};

export default function CatalogPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeading
        eyebrow="Каталог"
        title="12 атмосфер для чтения"
        description="Выбирайте по месту и времени года. Книга внутри каждого набора — сюрприз до открытия карточки."
      />
      <CatalogView sets={getAllSets()} />
    </section>
  );
}
