import { ScrollVelocity } from "@/components/effects/ScrollVelocity";
import { sets } from "@/data/sets";

const scents = [...new Set(sets.map((set) => set.scent))];

export function ScentMarquee() {
  return (
    <section aria-label="Ароматы наборов" className="border-b border-ink/15 py-6">
      <ScrollVelocity items={scents} className="display text-[clamp(28px,3.4vw,46px)] text-ink" />
    </section>
  );
}
