import { RootMotif } from "@/components/art/RootMotif";
import { tasteGuide } from "@/content/facts";

export function TasteGuide() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.1fr,1fr] md:items-center">
        <div>
          <p className="eyebrow mb-3">Taste Guide</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-soil-700 md:text-4xl text-balance">
            {tasteGuide.headline}
          </h2>
          <dl className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2">
            {tasteGuide.points.map((p) => (
              <div key={p.title}>
                <dt className="font-semibold text-soil-700">{p.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-charcoal-500">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto hidden md:block">
          <RootMotif className="h-[420px] w-[320px]" stroke="#A9835F" />
        </div>
      </div>
    </section>
  );
}
