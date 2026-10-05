import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { QuestionId, TestAnswers } from "@/types";

interface TestState {
  answers: TestAnswers;
  resultIds: string[];
  setAnswer: (questionId: QuestionId, optionId: string) => void;
  setResults: (resultIds: string[]) => void;
  resetTest: () => void;
}

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      answers: {},
      resultIds: [],
      setAnswer: (questionId, optionId) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: optionId } })),
      setResults: (resultIds) => set({ resultIds }),
      resetTest: () => set({ answers: {}, resultIds: [] }),
    }),
    {
      name: "sensory-book-club-test",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
