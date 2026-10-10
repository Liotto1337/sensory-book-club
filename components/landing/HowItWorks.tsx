import { FadeUp } from "@/components/effects/FadeUp";
import { Tag } from "@/components/ui/Tag";

const steps = [
  { label: "01 / Тест", title: "Вспомните", text: "Ответьте на 5 вопросов о месте, запахе, звуке и ощущении." },
  { label: "02 / Подбор", title: "Получите подбор", text: "Мы найдём 3 атмосферы, которые совпадают с вашим воспоминанием." },
  { label: "03 / Набор", title: "Откройте набор", text: "Книга, аромат, плейлист, тактильный предмет и карточка-ритуал." },
  { label: "04 / Чтение", title: "Читайте всем телом", text: "Следуйте карточке и проживайте историю всеми чувствами." },
];

export function HowItWorks() {
  return (
    // scroll-mt: при переходе по якорю /#how заголовок не прячется под липкой шапкой
    <section id="how" className="wrap scroll-mt-[68px] pb-[clamp(96px,12vw,160px)]">
      <div className="mb-[clamp(40px,5vw,64px)] flex flex-col items-center text-center">
        <Tag>Как это работает</Tag>
        <h2 className="display mt-5 text-[clamp(38px,5.8vw,88px)] text-ink">
          От воспоминания <em>до книги</em>
        </h2>
      </div>
      <FadeUp as="ol" className="grid border-l border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li
            key={step.label}
            className="flex min-h-[260px] flex-col border-b border-r border-ink/15 p-7 transition-colors duration-300 hover:bg-sand"
          >
            <span className="label text-ink-muted">{step.label}</span>
            <h3 className="mt-16 text-[26px] font-medium leading-tight tracking-tight text-ink">{step.title}</h3>
            <p className="mt-2.5 text-ink-muted">{step.text}</p>
          </li>
        ))}
      </FadeUp>
    </section>
  );
}
