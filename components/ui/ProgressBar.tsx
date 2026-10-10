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
      <div className="label flex justify-between text-ink-muted">
        <span>
          Вопрос {current} / {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-0.5 overflow-hidden bg-ink/15"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <motion.div
          className="h-full bg-terracotta"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
