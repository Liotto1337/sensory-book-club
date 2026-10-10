import { FadeUp } from "@/components/effects/FadeUp";
import { SetCard } from "@/components/sets/SetCard";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import type { SensorySet } from "@/types";

export function FeaturedSets({ sets }: { sets: SensorySet[] }) {
  return (
    <section className="wrap pb-[clamp(96px,12vw,160px)]">
      <div className="mb-[clamp(40px,5vw,64px)] flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Tag>Примеры наборов</Tag>
          <h2 className="display mt-5 text-[clamp(38px,5.8vw,88px)] text-ink">
            Двенадцать <em>атмосфер</em>
          </h2>
        </div>
        <ButtonLink href="/catalog" variant="ghost">
          Весь каталог →
        </ButtonLink>
      </div>
      <FadeUp className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <SetCard key={set.id} set={set} />
        ))}
      </FadeUp>
    </section>
  );
}
