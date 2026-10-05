import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaylistEmbed } from "@/components/sets/PlaylistEmbed";
import { SensoryDetails } from "@/components/sets/SensoryDetails";
import { SetContents } from "@/components/sets/SetContents";
import { SetCover } from "@/components/sets/SetCover";
import { sets } from "@/data/sets";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import { formatPrice } from "@/lib/formatPrice";
import { getSetById } from "@/lib/sets";

interface SetPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return sets.map((set) => ({ id: set.id }));
}

export function generateMetadata({ params }: SetPageProps): Metadata {
  const set = getSetById(params.id);
  return { title: set ? `${set.atmosphere} — Сенсорный книжный клуб` : "Набор не найден" };
}

export default function SetPage({ params }: SetPageProps) {
  const set = getSetById(params.id);
  if (!set) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/catalog" className="text-sm text-ink-muted transition-colors hover:text-ink">
        ← Все наборы
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-6">
          <SetCover set={set} size="lg" className="shadow-soft" />
          <PlaylistEmbed src={set.playlist} title={set.playlistTitle} />
        </div>
        <div className="flex flex-col gap-8">
          <header>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-terracotta">
              {set.atmosphere}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              {set.book.title}
            </h1>
            <p className="mt-2 text-lg text-ink-soft">
              {set.book.author}, {set.book.year}
            </p>
          </header>
          <div className="space-y-4 text-ink-soft">
            <p className="text-lg leading-relaxed">{set.description}</p>
            <p className="text-sm leading-relaxed text-ink-muted">{set.book.annotation}</p>
          </div>
          <SensoryDetails set={set} />
          <div className="flex flex-col gap-4 rounded-card border border-terracotta/20 bg-terracotta-light/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-muted">Стоимость набора</p>
              <p className="font-serif text-3xl text-ink">{formatPrice(set.price)}</p>
            </div>
            <AddToCartButton setId={set.id} atmosphere={set.atmosphere} />
          </div>
          <section>
            <h2 className="mb-4 font-serif text-2xl text-ink">Что входит в набор</h2>
            <SetContents set={set} />
          </section>
        </div>
      </div>
    </article>
  );
}
