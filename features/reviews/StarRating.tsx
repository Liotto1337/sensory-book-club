"use client";

import { useId, useState } from "react";
import { StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const STARS = [1, 2, 3, 4, 5];

export function StarRating({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value);
  return (
    <span role="img" aria-label={`Оценка ${value.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} из 5`} className={cn("inline-flex gap-0.5 text-terracotta", className)}>
      {STARS.map((star) => (
        <StarIcon key={star} filled={star <= rounded} className="h-4 w-4" />
      ))}
    </span>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

/** Обычные радиокнопки, визуально заменённые звёздами: работают стрелки и Tab, читаются скринридером. */
export function StarRatingInput({ value, onChange, error }: StarRatingInputProps) {
  const name = useId();
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-sm font-medium text-ink-soft">Оценка</legend>
      <div className="mt-1.5 flex gap-1" onMouseLeave={() => setHovered(0)}>
        {STARS.map((star) => (
          <label
            key={star}
            onMouseEnter={() => setHovered(star)}
            className="cursor-pointer rounded-full p-1 text-terracotta transition-transform hover:scale-110 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta"
          >
            <input
              type="radio"
              name={name}
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className="sr-only"
            />
            <StarIcon filled={star <= shown} className="h-7 w-7" />
            <span className="sr-only">{star} из 5</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-terracotta-dark">
          {error}
        </p>
      )}
    </fieldset>
  );
}
