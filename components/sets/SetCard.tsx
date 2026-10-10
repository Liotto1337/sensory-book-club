import Link from "next/link";
import { getSetBadge } from "@/features/catalog/filterTags";
import { formatPrice } from "@/lib/formatPrice";
import type { SensorySet } from "@/types";
import { SensoryDetails } from "./SensoryDetails";
import { SetCover } from "./SetCover";

interface SetCardProps {
  set: SensorySet;
  showDetails?: boolean;
}

// Фото приглушено и проявляется в цвет при наведении. На тач-экранах наведения нет — там фото сразу цветное.
const imageClasses =
  "transition-[filter,transform] duration-700 group-hover:scale-105 [@media(hover:hover)]:saturate-[.6] [@media(hover:hover)]:sepia-[.2] [@media(hover:hover)]:group-hover:saturate-100 [@media(hover:hover)]:group-hover:sepia-0";

export function SetCard({ set, showDetails = true }: SetCardProps) {
  const badge = getSetBadge(set);

  return (
    <Link
      href={`/set/${set.id}`}
      className="group flex h-full flex-col border border-ink/15 bg-linen transition-colors duration-300 hover:border-ink/40"
    >
      <div className="relative overflow-hidden">
        <SetCover set={set} imageClassName={imageClasses} />
        {badge && (
          <span className="label absolute left-4 top-4 bg-black/60 px-2 py-1 text-white backdrop-blur-sm">{badge}</span>
        )}
        <span
          className="absolute right-4 top-3 text-2xl text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        >
          ↗
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-2xl font-medium leading-tight tracking-tight text-ink">{set.atmosphere}</h3>
          <span className="shrink-0 font-display text-2xl text-ink">{formatPrice(set.price)}</span>
        </div>
        {showDetails ? (
          <SensoryDetails set={set} variant="compact" />
        ) : (
          <p className="label text-ink-muted">{set.scent}</p>
        )}
      </div>
    </Link>
  );
}
