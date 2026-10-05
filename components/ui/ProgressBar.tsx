"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-ink-muted">
        <span>
          Вопрос {current} из {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-sand"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <motion.div
          className="h-full rounded-full bg-terracotta"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
