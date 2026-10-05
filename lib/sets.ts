import { books } from "@/data/books";
import { sets } from "@/data/sets";
import type { SensorySet, SetWithBook } from "@/types";

function attachBook(set: SensorySet): SetWithBook {
  const book = books.find((candidate) => candidate.id === set.bookId);
  if (!book) {
    throw new Error(`Book ${set.bookId} not found for set ${set.id}`);
  }
  return { ...set, book };
}

export function getAllSets(): SetWithBook[] {
  return sets.map(attachBook);
}

export function getSetById(id: string): SetWithBook | undefined {
  const set = sets.find((candidate) => candidate.id === id);
  return set ? attachBook(set) : undefined;
}

export function getSetsByIds(ids: string[]): SetWithBook[] {
  return ids
    .map(getSetById)
    .filter((set): set is SetWithBook => set !== undefined);
}
