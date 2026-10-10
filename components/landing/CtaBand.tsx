import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Полоса-призыв перед подвалом: чёрная в светлой теме, терракотовая в тёмной. */
export function CtaBand() {
  return (
    <section id="cta-band" className="bg-band text-on-band">
      <div className="wrap flex flex-wrap items-start justify-between gap-10 py-[clamp(72px,9vw,120px)]">
        <h2 className="display text-[clamp(52px,8vw,120px)]">
          Готовы
          <br />
          <em>вспомнить?</em>
        </h2>
        <div className="flex w-full max-w-[380px] flex-col gap-5">
          <p className="text-lg text-on-band/85">Пять вопросов — и три атмосферы, которые совпадут с вашим воспоминанием.</p>
          <ButtonLink href="/test" variant="band" size="lg" className="w-full">
            Пройти сенсорный тест
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
          <Link
            href="/catalog"
            className="label self-start underline underline-offset-4 hover:no-underline focus-visible:outline-on-band"
          >
            или выбрать в каталоге
          </Link>
        </div>
      </div>
    </section>
  );
}
