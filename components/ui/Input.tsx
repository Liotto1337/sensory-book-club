import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-12 rounded-control border bg-linen px-4 text-ink placeholder:text-ink-muted/70 transition-colors duration-200 focus:outline-none focus:ring-2",
          error
            ? "border-terracotta focus:ring-terracotta/30"
            : "border-ink/10 focus:border-terracotta focus:ring-terracotta/20",
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-terracotta-dark">
          {error}
        </p>
      )}
    </div>
  );
});
