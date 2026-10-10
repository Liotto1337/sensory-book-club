import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { CatalogView } from "@/features/catalog/CatalogView";
import { pluralize } from "@/lib/pluralize";
import { getAllSets } from "@/lib/sets";

export const metadata: Metadata = {
  title: "Каталог атмосфер — Сенсорный книжный клуб",
};

export default function CatalogPage() {
  const sets = getAllSets();

  return (
    <section className="wrap py-12 sm:py-16">
      <PageHeading
        eyebrow="Каталог"
        title={
          <>
            Все <em>атмосферы</em>
          </>
        }
        description="Выбирайте по месту и времени года. Книга внутри каждого набора — сюрприз до открытия карточки."
        aside={`${sets.length} ${pluralize(sets.length, ["набор", "набора", "наборов"])}`}
      />
      <CatalogView sets={sets} />
    </section>
  );
}
