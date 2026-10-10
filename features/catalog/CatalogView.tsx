"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SetCard } from "@/components/sets/SetCard";
import { Button } from "@/components/ui/Button";
import type { CatalogFilterTag, SetWithBook } from "@/types";
import { filterSetsByTags } from "./filterSets";
import { placeFilters, seasonFilters } from "./filterTags";
import { TagFilter } from "./TagFilter";

export function CatalogView({ sets }: { sets: SetWithBook[] }) {
  const [activeTags, setActiveTags] = useState<CatalogFilterTag[]>([]);
  const visibleSets = useMemo(() => filterSetsByTags(sets, activeTags), [sets, activeTags]);

  const toggleTag = (tag: CatalogFilterTag) =>
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 border border-ink/15 bg-linen p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="label w-20 text-ink-muted">Место</span>
            <TagFilter options={placeFilters} activeTags={activeTags} onToggle={toggleTag} />
          </div>
          <span className="hidden h-8 w-px bg-ink/15 lg:block" aria-hidden />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="label w-20 text-ink-muted">Сезон</span>
            <TagFilter options={seasonFilters} activeTags={activeTags} onToggle={toggleTag} />
          </div>
        </div>
        <div className="flex min-h-9 items-center justify-between border-t border-ink/15 pt-4">
          <span className="label text-ink-muted">Найдено: {visibleSets.length}</span>
          {activeTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setActiveTags([])}>
              Сбросить
            </Button>
          )}
        </div>
      </div>
      {visibleSets.length === 0 ? (
        <p className="py-20 text-center text-ink-muted">
          Такого сочетания пока нет. Попробуйте убрать один из фильтров.
        </p>
      ) : (
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleSets.map((set) => (
              <motion.div
                key={set.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <SetCard set={set} showDetails={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
