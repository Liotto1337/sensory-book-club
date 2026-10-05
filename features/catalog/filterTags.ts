import type { CatalogFilterTag, PlaceTag, SeasonTag } from "@/types";

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
