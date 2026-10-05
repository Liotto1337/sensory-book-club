import type { SensorySet } from "@/types";

interface SensoryDetailsProps {
  set: Pick<SensorySet, "scent" | "sound" | "feeling">;
}

export function SensoryDetails({ set }: SensoryDetailsProps) {
  const rows = [
    { label: "Запах", value: set.scent, icon: "🌿" },
    { label: "Звук", value: set.sound, icon: "🎧" },
    { label: "Ощущение", value: set.feeling, icon: "🤍" },
  ];

  return (
    <dl className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-3">
          <span className="text-base leading-6" aria-hidden>
            {row.icon}
          </span>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink-muted">{row.label}</dt>
            <dd className="text-sm text-ink-soft">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
