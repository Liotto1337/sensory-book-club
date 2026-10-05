import { SetCard } from "@/components/sets/SetCard";
import { ButtonLink } from "@/components/ui/Button";
import type { SensorySet } from "@/types";

export function FeaturedSets({ sets }: { sets: SensorySet[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Примеры наборов</h2>
          <p className="mt-2 text-ink-soft">Название книги остаётся тайной до последнего шага.</p>
        </div>
        <ButtonLink href="/catalog" variant="ghost">
          Все 12 атмосфер →
        </ButtonLink>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <SetCard key={set.id} set={set} />
        ))}
      </div>
    </section>
  );
}
