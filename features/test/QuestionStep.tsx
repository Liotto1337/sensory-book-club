import { RadioCard } from "@/components/ui/RadioCard";
import type { Question } from "@/types";

interface QuestionStepProps {
  question: Question;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
}

export function QuestionStep({ question, selectedOptionId, onSelect }: QuestionStepProps) {
  return (
    <fieldset>
      <legend className="w-full text-center">
        <span className="block font-serif text-2xl leading-tight text-ink sm:text-4xl">
          {question.title}
        </span>
        <span className="mt-3 block text-ink-muted">{question.subtitle}</span>
      </legend>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {question.options.map((option) => (
          <RadioCard
            key={option.id}
            name={question.id}
            value={option.id}
            checked={selectedOptionId === option.id}
            onSelect={onSelect}
            title={option.label}
            description={option.hint}
            icon={option.emoji}
          />
        ))}
      </div>
    </fieldset>
  );
}
