"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { requestJson } from "@/lib/api";
import { cn } from "@/lib/cn";
import { getSetById } from "@/lib/sets";
import type { LatestReview, SetWithBook } from "@/types";
import { StarRating } from "./StarRating";
import { truncateAtWord } from "./truncate";

// Меньше трёх отзывов — лента выглядит пустой, лучше не показывать её вовсе
const MIN_REVIEWS = 3;
const MAX_TEXT_LENGTH = 220;

interface RibbonItem {
  review: LatestReview;
  set: SetWithBook;
}

/** Лента свежих отзывов на главной. Грузится на клиенте, поэтому главная остаётся статической. */
export function ReviewsRibbon() {
  const [items, setItems] = useState<RibbonItem[]>([]);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let isCancelled = false;
    void requestJson<{ reviews: LatestReview[] }>("/api/reviews/latest").then((result) => {
      if (isCancelled || !result.ok) return;
      // Отзывы на снятые с продажи наборы отбрасываем
      setItems(
        result.data.reviews.flatMap((review) => {
          const set = getSetById(review.setId);
          return set ? [{ review, set }] : [];
        }),
      );
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setEdges({
      atStart: list.scrollLeft <= 1,
      atEnd: list.scrollLeft + list.clientWidth >= list.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [items, updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    if ((direction === -1 && edges.atStart) || (direction === 1 && edges.atEnd)) return;
    const list = listRef.current;
    const card = list?.querySelector("li");
    if (!list || !card) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  if (items.length < MIN_REVIEWS) return null;

  return (
    <section aria-labelledby="reviews-ribbon-heading" className="wrap pb-[clamp(96px,12vw,160px)]">
      <div className="mb-[clamp(32px,4vw,56px)] flex flex-wrap items-end justify-between gap-6">
        <div>
          <Tag>Читатели о наборах</Tag>
          <h2 id="reviews-ribbon-heading" className="display mt-5 text-[clamp(38px,5.8vw,88px)] text-ink">
            Ощущения <em>вслух</em>
          </h2>
        </div>
        <div className="flex gap-2">
          {/* aria-disabled, а не disabled: отключённая кнопка теряет фокус, и клавиатура «выпадает» в начало страницы */}
          <Button
            variant="secondary"
            size="sm"
            aria-label="Предыдущие отзывы"
            aria-disabled={edges.atStart}
            onClick={() => scrollByCard(-1)}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          >
            ←
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Следующие отзывы"
            aria-disabled={edges.atEnd}
            onClick={() => scrollByCard(1)}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
          >
            →
          </Button>
        </div>
      </div>
      <ul
        ref={listRef}
        onScroll={updateEdges}
        data-lenis-prevent-horizontal
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none]"
      >
        {items.map(({ review, set }, index) => {
          const isOnPhoto = index % 2 === 0;
          return (
            <li
              key={review.id}
              className={cn(
                "relative flex min-h-[360px] w-[min(400px,85vw)] shrink-0 snap-start flex-col justify-end overflow-hidden border border-ink/15 p-7",
                isOnPhoto ? "bg-[#111] text-white" : "bg-sand text-ink",
              )}
            >
              {isOnPhoto && (
                <>
                  <Image src={set.image.src} alt="" fill sizes="400px" className="object-cover" />
                  <div className="absolute inset-0 bg-black/55" aria-hidden />
                </>
              )}
              <div className="relative flex min-w-0 flex-col gap-4">
                <span className="font-serif text-5xl leading-none" aria-hidden>
                  “
                </span>
                <p className="break-words text-lg leading-snug">{truncateAtWord(review.text, MAX_TEXT_LENGTH)}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate font-medium">{review.authorName}</p>
                  <StarRating value={review.rating} />
                </div>
                <Link
                  href={`/set/${set.id}`}
                  className={cn("label self-start underline-offset-4 hover:underline", isOnPhoto ? "text-white/80" : "text-ink-muted")}
                >
                  {set.atmosphere} →
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
