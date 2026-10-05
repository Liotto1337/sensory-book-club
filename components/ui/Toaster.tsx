"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useToastStore } from "@/store/toastStore";
import type { ToastVariant } from "@/types";

const variantStyles: Record<ToastVariant, string> = {
  success: "border-l-terracotta",
  info: "border-l-ink-muted",
  error: "border-l-red-700",
};

const variantIcons: Record<ToastVariant, string> = {
  success: "✓",
  info: "i",
  error: "!",
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={() => dismissToast(toast.id)}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-control border-l-4 bg-ink px-4 py-3 text-left text-sm text-linen shadow-lifted",
              variantStyles[toast.variant],
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linen/10 text-xs font-bold">
              {variantIcons[toast.variant]}
            </span>
            {toast.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
