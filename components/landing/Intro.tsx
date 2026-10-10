import { RevealText } from "@/components/effects/RevealText";
import { Tag } from "@/components/ui/Tag";

export function Intro() {
  return (
    <section className="wrap grid gap-12 pb-[clamp(64px,8vw,110px)] pt-[clamp(96px,14vw,180px)] lg:grid-cols-[5fr_7fr]">
      <div>
        <Tag>Что внутри</Tag>
        <h2 className="display mt-5 text-[clamp(38px,5.8vw,88px)] text-ink">
          Что такое <em>сенсорный</em> набор?
        </h2>
      </div>
      <RevealText className="font-serif text-[clamp(28px,3.3vw,50px)] leading-[1.16] text-ink">
        Это книга, подобранная не по жанру, а по ощущению. Аромат, плейлист и предмет, который можно держать в руках,
        возвращают вас туда, где вы читали лучшую книгу в жизни. Остаётся открыть первую страницу.
      </RevealText>
    </section>
  );
}
