import { PageHeading } from "@/components/layout/PageHeading";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <PageHeading
        eyebrow="404"
        title="Эта страница затерялась между строк"
        description="Возможно, набор был снят с полки или ссылка устарела."
      />
      <ButtonLink href="/catalog" size="lg" className="mt-10">
        Перейти в каталог
      </ButtonLink>
    </section>
  );
}
