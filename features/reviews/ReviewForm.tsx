"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import { REVIEW_MAX_LENGTH, validateReview, type ReviewErrors } from "@/lib/validation";
import { StarRatingInput } from "./StarRating";

interface ReviewFormProps {
  initialRating?: number;
  initialText?: string;
  submitLabel: string;
  onSubmit: (values: { rating: number; text: string }) => Promise<ReviewErrors | null>;
  onCancel?: () => void;
}

export function ReviewForm({ initialRating = 0, initialText = "", submitLabel, onSubmit, onCancel }: ReviewFormProps) {
  const textId = useId();
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateReview({ rating, text });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const serverErrors = await onSubmit({ rating, text });
    setIsSubmitting(false);
    if (serverErrors) setErrors(serverErrors);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-card bg-linen p-5 shadow-soft sm:p-6">
      <StarRatingInput
        value={rating}
        error={errors.rating}
        onChange={(value) => {
          setRating(value);
          setErrors((current) => ({ ...current, rating: undefined }));
        }}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textId} className="text-sm font-medium text-ink-soft">
          Отзыв
        </label>
        <textarea
          id={textId}
          rows={4}
          maxLength={REVIEW_MAX_LENGTH}
          value={text}
          placeholder="Какие ощущения оставил набор? Подошли ли аромат и плейлист к книге?"
          aria-invalid={Boolean(errors.text)}
          aria-describedby={errors.text ? `${textId}-error` : undefined}
          onChange={(event) => {
            setText(event.target.value);
            setErrors((current) => ({ ...current, text: undefined }));
          }}
          className={cn(
            "resize-y rounded-control border bg-linen px-4 py-3 text-ink placeholder:text-ink-muted/70 transition-colors duration-200 focus:outline-none focus:ring-2",
            errors.text ? "border-terracotta focus:ring-terracotta/30" : "border-ink/10 focus:border-terracotta focus:ring-terracotta/20",
          )}
        />
        <div className="flex justify-between gap-4 text-xs">
          <span id={`${textId}-error`} className="text-terracotta-dark">
            {errors.text}
          </span>
          <span className="shrink-0 text-ink-muted">
            {text.length} / {REVIEW_MAX_LENGTH}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
