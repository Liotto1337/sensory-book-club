"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageHeading } from "@/components/layout/PageHeading";
import { SetCard } from "@/components/sets/SetCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getSetsByIds } from "@/lib/sets";
import { useTestStore } from "@/store/testStore";

export function ResultsView() {
  const router = useRouter();
  const resultIds = useTestStore((state) => state.resultIds);
  const resetTest = useTestStore((state) => state.resetTest);
  const results = getSetsByIds(resultIds);

  const restartTest = () => {
    resetTest();
    router.push("/test");
  };

  if (results.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <PageHeading
          title="Сначала вспомним вместе"
          description="Пройдите короткий тест, и мы подберём атмосферы под ваше воспоминание."
        />
        <ButtonLink href="/test" size="lg" className="mt-10">
          Пройти сенсорный тест
        </ButtonLink>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <PageHeading
        eyebrow="Ваш подбор"
        title="Мы подобрали для вас 3 атмосферы"
        description="Название книги откроется на странице набора. Доверьтесь ощущениям."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {results.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.12 }}
          >
            <SetCard set={set} />
          </motion.div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button variant="secondary" onClick={restartTest}>
          Пройти тест заново
        </Button>
        <ButtonLink href="/catalog" variant="ghost">
          Смотреть весь каталог
        </ButtonLink>
      </div>
    </section>
  );
}
