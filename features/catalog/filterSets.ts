import type { CatalogFilterTag, SetWithBook } from "@/types";
import { placeFilters, seasonFilters } from "./filterTags";

function matchesGroup(set: SetWithBook, selectedInGroup: CatalogFilterTag[]): boolean {
  return selectedInGroup.length === 0 || selectedInGroup.some((tag) => set.tags.includes(tag));
}

/** Tags are OR-ed within a group (place or season) and AND-ed across groups. */
export function filterSetsByTags(
  allSets: SetWithBook[],
  activeTags: CatalogFilterTag[],
): SetWithBook[] {
  const selectedPlaces = activeTags.filter((tag) => placeFilters.some((filter) => filter.tag === tag));
  const selectedSeasons = activeTags.filter((tag) => seasonFilters.some((filter) => filter.tag === tag));

  return allSets.filter(
    (set) => matchesGroup(set, selectedPlaces) && matchesGroup(set, selectedSeasons),
  );
}
