import { questions } from "@/data/questions";
import { sets } from "@/data/sets";
import type { SensorySet, SensoryTag, TestAnswers } from "@/types";

const RESULTS_COUNT = 3;
const MIN_MATCHING_TAGS = 2;

function collectAnswerTags(answers: TestAnswers): Set<SensoryTag> {
  const tags = new Set<SensoryTag>();
  for (const question of questions) {
    const selectedOptionId = answers[question.id];
    const option = question.options.find((candidate) => candidate.id === selectedOptionId);
    option?.tags.forEach((tag) => tags.add(tag));
  }
  return tags;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

/**
 * Scores each set by the number of tags shared with the user's answers.
 * Sets below MIN_MATCHING_TAGS are treated as weak matches; if fewer than
 * RESULTS_COUNT strong matches exist, the gap is filled with random sets.
 * Equal scores are shuffled so repeated runs don't always favour the same set.
 */
export function matchSets(answers: TestAnswers, catalog: SensorySet[] = sets): SensorySet[] {
  const answerTags = collectAnswerTags(answers);

  const strongMatches = shuffle(catalog)
    .map((set) => ({
      set,
      score: set.tags.filter((tag) => answerTags.has(tag)).length,
    }))
    .filter(({ score }) => score >= MIN_MATCHING_TAGS)
    .sort((left, right) => right.score - left.score)
    .slice(0, RESULTS_COUNT)
    .map(({ set }) => set);

  if (strongMatches.length === RESULTS_COUNT) {
    return strongMatches;
  }

  const fillers = shuffle(catalog.filter((set) => !strongMatches.includes(set)));
  return [...strongMatches, ...fillers.slice(0, RESULTS_COUNT - strongMatches.length)];
}
