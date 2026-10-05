import type { ComponentType, SVGProps } from "react";
import { BoxIcon, BookIcon, MemoryIcon, SparkIcon } from "@/components/ui/icons";

interface Step {
  title: string;
  text: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const steps: Step[] = [
  { title: "Вспомните", text: "Ответьте на 5 вопросов о месте, запахе, звуке и ощущении.", Icon: MemoryIcon },
  { title: "Получите подбор", text: "Мы найдём 3 атмосферы, которые совпадают с вашим воспоминанием.", Icon: SparkIcon },
  { title: "Откройте набор", text: "Книга, аромат, плейлист, тактильный предмет и карточка-ритуал.", Icon: BoxIcon },
  { title: "Читайте всем телом", text: "Следуйте карточке и проживайте историю всеми чувствами.", Icon: BookIcon },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="text-center font-serif text-3xl text-ink sm:text-4xl">Как это работает</h2>
      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ title, text, Icon }, index) => (
          <li key={title} className="rounded-card bg-linen p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-control bg-terracotta-light text-terracotta-dark">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-serif text-3xl text-ink/10">0{index + 1}</span>
            </div>
            <h3 className="mt-5 font-serif text-xl text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
