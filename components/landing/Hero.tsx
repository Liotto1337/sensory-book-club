import { Parallax } from "@/components/effects/Parallax";
import { SplitHeading } from "@/components/effects/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/Tag";
import { questions } from "@/data/questions";
import { pluralize } from "@/lib/pluralize";

export function Hero() {
  const questionCount = `${questions.length} ${pluralize(questions.length, ["вопрос", "вопроса", "вопросов"])}`;

  return (
    <section
      id="hero"
      className="relative flex h-[calc(100svh-68px)] max-h-[980px] min-h-[600px] items-end overflow-hidden bg-[#111] text-white"
    >
      <Parallax
        src="/sets/set-3.jpg"
        alt="Свечи, открытые книги и вязаный плед у окна"
        sizes="100vw"
        priority
        strength={0.12}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_50%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />
      <div className="wrap relative z-10 w-full pb-[clamp(36px,7vh,80px)]">
        <Eyebrow onPhoto>Сенсорный тест · {questionCount} · меньше минуты</Eyebrow>
        <SplitHeading as="h1" className="display mt-6 max-w-[7.2em] text-[clamp(36px,13vw,46px)] sm:text-[clamp(46px,8.4vw,132px)]">
          Книга, которая <em>пахнет</em> твоим воспоминанием
        </SplitHeading>
        <div className="mt-8 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[460px] text-white/85 sm:text-lg">
            Подбираем книги не по жанру, а по ощущениям. Книга, аромат, плейлист и вещь, которую можно держать в
            руках, — в одном наборе.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/test" size="lg">
              Пройти тест
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/catalog" size="lg" variant="inverse">
              Смотреть каталог
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
