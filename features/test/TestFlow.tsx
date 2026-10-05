"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { questions } from "@/data/questions";
import { useTestStore } from "@/store/testStore";
import { matchSets } from "./matchSets";
import { QuestionStep } from "./QuestionStep";

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -48 }),
};

export function TestFlow() {
  const router = useRouter();
  const answers = useTestStore((state) => state.answers);
  const setAnswer = useTestStore((state) => state.setAnswer);
  const setResults = useTestStore((state) => state.setResults);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const question = questions[stepIndex];
  const selectedOptionId = answers[question.id];
  const isLastStep = stepIndex === questions.length - 1;

  const goBack = () => {
    setDirection(-1);
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const goNext = () => {
    if (!selectedOptionId) return;
    if (isLastStep) {
      setResults(matchSets(answers).map((set) => set.id));
      router.push("/results");
      return;
    }
    setDirection(1);
    setStepIndex((index) => index + 1);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16">
      <ProgressBar current={stepIndex + 1} total={questions.length} />
      <div className="relative min-h-[460px] overflow-hidden sm:min-h-[340px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <QuestionStep
              question={question}
              selectedOptionId={selectedOptionId}
              onSelect={(optionId) => setAnswer(question.id, optionId)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeftIcon className="h-4 w-4" />
          Назад
        </Button>
        <Button size="lg" onClick={goNext} disabled={!selectedOptionId}>
          {isLastStep ? "Подобрать атмосферу" : "Далее"}
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
