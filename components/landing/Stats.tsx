import { CountUp } from "@/components/effects/CountUp";
import { questions } from "@/data/questions";
import { sets } from "@/data/sets";
import { pluralize } from "@/lib/pluralize";

// Запах, звук, касание и слово — столько чувств в каждом наборе
const SENSES_PER_SET = 4;

const stats = [
  {
    value: questions.length,
    title: `${pluralize(questions.length, ["вопрос", "вопроса", "вопросов"])} в тесте`,
    text: "Меньше минуты на подбор",
  },
  {
    value: sets.length,
    title: pluralize(sets.length, ["атмосфера", "атмосферы", "атмосфер"]),
    text: "От пустого пляжа до снега за стеклом",
  },
  { value: SENSES_PER_SET, title: "чувства в наборе", text: "Запах, звук, касание и слово" },
];

export function Stats() {
  return (
    <section className="wrap grid gap-5 pb-[clamp(96px,12vw,160px)] lg:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.title} className="flex items-center gap-5 border border-ink/15 bg-sand p-7">
          <CountUp to={stat.value} className="display min-w-[1.1ch] text-[clamp(64px,6.4vw,96px)] text-ink" />
          <div>
            <p className="text-lg font-medium uppercase text-ink">{stat.title}</p>
            <p className="text-ink-muted">{stat.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
