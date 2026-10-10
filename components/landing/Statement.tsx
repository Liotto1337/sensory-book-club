import { Parallax } from "@/components/effects/Parallax";

export function Statement() {
  return (
    <section className="relative flex h-[86vh] min-h-[520px] items-center justify-center overflow-hidden bg-[#111] text-white">
      <Parallax src="/sets/set-2.jpg" alt="" sizes="100vw" strength={0.2} className="absolute inset-0" />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <p className="display relative z-10 px-4 text-center text-[clamp(48px,9vw,150px)]">
        Запах. Звук. <em>Страница.</em>
      </p>
    </section>
  );
}
