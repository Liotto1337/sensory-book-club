import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

const floatingScents = ["соль и кедр", "хвоя после дождя", "кофе и старая бумага", "клубника и трава"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-terracotta-light blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-16 h-72 w-72 rounded-full bg-sand blur-3xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-terracotta">
          Сенсорный книжный клуб
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
          Книга, которая пахнет твоим воспоминанием
        </h1>
        <p className="mt-6 max-w-2xl text-base text-ink-soft sm:text-lg">
          Мы подбираем книги не по жанру, а по ощущениям: запаху моря, шуму дождя, теплу пледа.
          Расскажите, где и как вы читали свою лучшую книгу, и получите сенсорный набор:
          книгу, аромат, плейлист и предмет, который можно держать в руках.
        </p>
        <ButtonLink href="/test" size="lg" className="mt-10">
          Пройти сенсорный тест
          <ArrowRightIcon className="h-4 w-4" />
        </ButtonLink>
        <p className="mt-3 text-xs text-ink-muted">5 вопросов · меньше минуты</p>
        <ul className="mt-12 flex flex-wrap justify-center gap-2">
          {floatingScents.map((scent) => (
            <li
              key={scent}
              className="rounded-full border border-ink/10 bg-linen/70 px-4 py-1.5 text-sm text-ink-soft"
            >
              {scent}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
