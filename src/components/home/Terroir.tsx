import { TerroirDiagram } from "@/components/art/TerroirDiagram";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { terroir } from "@/content/facts";

export function Terroir() {
  return (
    <section className="bg-ivory-200/60 py-20 md:py-28">
      <div className="container-page grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <TerroirDiagram className="w-full rounded-sm shadow-card" />
        <div>
          <SectionHeading eyebrow="Muan Terroir" title="왜 무안 고구마인가" />
          <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {terroir.map((t) => (
              <div key={t.title}>
                <dt className="font-serif text-lg font-semibold text-soil-700">{t.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-charcoal-500">{t.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
