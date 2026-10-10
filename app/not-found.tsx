import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center">
      <p className="display text-[clamp(120px,20vw,200px)] text-terracotta" aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-2xl font-medium text-ink">Эта страница затерялась между строк</h1>
      <p className="mt-3 max-w-md text-ink-soft">Возможно, набор был снят с полки или ссылка устарела.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/catalog" size="lg">
          В каталог
        </ButtonLink>
        <ButtonLink href="/test" size="lg" variant="secondary">
          Пройти тест
        </ButtonLink>
      </div>
    </section>
  );
}
