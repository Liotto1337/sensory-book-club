import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/formatPrice";
import type { SensorySet } from "@/types";
import { SensoryDetails } from "./SensoryDetails";
import { SetCover } from "./SetCover";

interface SetCardProps {
  set: SensorySet;
  showDetails?: boolean;
}

export function SetCard({ set, showDetails = true }: SetCardProps) {
  return (
    <Card interactive className="flex h-full flex-col">
      <SetCover set={set} />
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div>
          <h3 className="font-serif text-2xl leading-tight text-ink">{set.atmosphere}</h3>
          {!showDetails && <p className="mt-2 text-sm text-ink-muted">{set.scent}</p>}
        </div>
        {showDetails && <SensoryDetails set={set} />}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-lg font-semibold text-ink">{formatPrice(set.price)}</span>
          <ButtonLink href={`/set/${set.id}`} variant="secondary">
            Подробнее
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
