import { RadioCard } from "@/components/ui/RadioCard";
import type { DeliveryMethod } from "@/types";
import { deliveryOptions } from "./deliveryOptions";

const deliveryIcons: Record<DeliveryMethod, string> = {
  cdek: "📦",
  post: "✉️",
  courier: "🚲",
};

interface DeliveryOptionsProps {
  value: DeliveryMethod;
  onChange: (value: DeliveryMethod) => void;
}

function isDeliveryMethod(value: string): value is DeliveryMethod {
  return deliveryOptions.some((option) => option.id === value);
}

export function DeliveryOptions({ value, onChange }: DeliveryOptionsProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-ink-soft">Способ доставки</legend>
      <div className="grid gap-3">
        {deliveryOptions.map((option) => (
          <RadioCard
            key={option.id}
            name="delivery"
            value={option.id}
            checked={value === option.id}
            onSelect={(selected) => isDeliveryMethod(selected) && onChange(selected)}
            title={option.label}
            description={option.hint}
            icon={deliveryIcons[option.id]}
          />
        ))}
      </div>
    </fieldset>
  );
}
