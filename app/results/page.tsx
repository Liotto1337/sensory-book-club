"use client";

import { ResultsView } from "@/features/results/ResultsView";
import { useHydrated } from "@/lib/useHydrated";

export default function ResultsPage() {
  const isHydrated = useHydrated();
  return isHydrated ? <ResultsView /> : <div className="min-h-[70vh]" />;
}
