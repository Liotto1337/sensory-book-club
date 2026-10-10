import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaylistEmbed } from "@/components/sets/PlaylistEmbed";
import { SensoryDetails } from "@/components/sets/SensoryDetails";
import { SetContents } from "@/components/sets/SetContents";
import { SetCover } from "@/components/sets/SetCover";
import { Eyebrow } from "@/components/ui/Tag";
import { sets } from "@/data/sets";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import { ReviewsSection } from "@/features/reviews/ReviewsSection";
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
    <article className="wrap py-8 sm:py-12">
      <Link href="/catalog" className="label text-ink-muted transition-colors hover:text-ink">
        ← Все наборы
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-5 lg:sticky lg:top-[92px] lg:self-start">
          <SetCover set={set} size="lg" />
          <PlaylistEmbed src={set.playlist} title={set.playlistTitle} />
        </div>
        <div className="flex flex-col gap-8">
          <header>
            <Eyebrow>{set.atmosphere}</Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(40px,5vw,72px)] italic leading-[1.02] text-ink">{set.book.title}</h1>
            <p className="label mt-4 text-ink-muted">
              {set.book.author} · {set.book.year}
            </p>
          </header>
          <div className="space-y-4">
            <p className="text-xl leading-relaxed text-ink-soft">{set.description}</p>
            <p className="leading-relaxed text-ink-muted">{set.book.annotation}</p>
          </div>
          <SensoryDetails set={set} variant="boxed" />
          <div className="flex flex-col gap-4 border border-ink/15 bg-linen p-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label text-ink-muted">Стоимость набора</p>
              <p className="mt-2 font-display text-[56px] leading-none text-ink">{formatPrice(set.price)}</p>
            </div>
            <AddToCartButton setId={set.id} atmosphere={set.atmosphere} />
          </div>
          <section>
            <h2 className="display mb-4 text-4xl text-ink">Что входит</h2>
            <SetContents set={set} />
          </section>
        </div>
      </div>
      <ReviewsSection setId={set.id} />
    </article>
  );
}
