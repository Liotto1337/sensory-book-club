import type { CatalogFilterTag, PlaceTag, SeasonTag, SensorySet } from "@/types";

export const placeFilters: Array<{ tag: PlaceTag; label: string }> = [
  { tag: "sea", label: "Море" },
  { tag: "forest", label: "Лес" },
  { tag: "home", label: "Дом" },
  { tag: "cafe", label: "Кафе" },
];

export const seasonFilters: Array<{ tag: SeasonTag; label: string }> = [
  { tag: "summer", label: "Лето" },
  { tag: "autumn", label: "Осень" },
  { tag: "winter", label: "Зима" },
  { tag: "spring", label: "Весна" },
];

export const catalogFilterTags: Array<{ tag: CatalogFilterTag; label: string }> = [
  ...placeFilters,
  ...seasonFilters,
];

/** Плашка на карточке набора: «Море · Лето». Если у набора нет тега места или сезона, эта часть пропускается. */
export function getSetBadge(set: Pick<SensorySet, "tags">): string {
  const place = placeFilters.find((filter) => set.tags.includes(filter.tag));
  const season = seasonFilters.find((filter) => set.tags.includes(filter.tag));
  return [place?.label, season?.label].filter(Boolean).join(" · ");
}
