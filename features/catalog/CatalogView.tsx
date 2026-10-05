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
      <div className="mt-10 flex flex-col gap-4 rounded-card bg-linen/60 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-20 text-xs uppercase tracking-widest text-ink-muted">Место</span>
          <TagFilter options={placeFilters} activeTags={activeTags} onToggle={toggleTag} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-20 text-xs uppercase tracking-widest text-ink-muted">Сезон</span>
          <TagFilter options={seasonFilters} activeTags={activeTags} onToggle={toggleTag} />
        </div>
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>Найдено наборов: {visibleSets.length}</span>
          {activeTags.length > 0 && (
            <Button variant="ghost" onClick={() => setActiveTags([])} className="h-8 px-3">
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
        <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
