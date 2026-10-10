import { cn } from "@/lib/cn";
import type { SensorySet } from "@/types";

interface SensoryDetailsProps {
  set: Pick<SensorySet, "scent" | "sound" | "feeling">;
  /** boxed — в рамке на странице набора, compact — в карточке */
  variant?: "boxed" | "compact";
}

export function SensoryDetails({ set, variant = "boxed" }: SensoryDetailsProps) {
  const rows = [
    { label: "Запах", value: set.scent },
    { label: "Звук", value: set.sound },
    { label: "Ощущение", value: set.feeling },
  ];
  const isBoxed = variant === "boxed";

  return (
    <dl className={cn(isBoxed ? "divide-y divide-ink/15 border border-ink/15" : "flex flex-col gap-2")}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn("grid gap-4", isBoxed ? "grid-cols-[120px_1fr] px-5 py-4" : "grid-cols-[88px_1fr]")}
        >
          <dt className="label pt-0.5 text-ink-muted">{row.label}</dt>
          <dd className={isBoxed ? "text-ink" : "text-sm text-ink-soft"}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
