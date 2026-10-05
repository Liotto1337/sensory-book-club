"use client";

import { TestFlow } from "@/features/test/TestFlow";
import { useHydrated } from "@/lib/useHydrated";

export default function TestPage() {
  const isHydrated = useHydrated();
  return isHydrated ? <TestFlow /> : <div className="min-h-[70vh]" />;
}
