import { StepIcon } from "@/components/art/StepIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { farmToTable } from "@/content/facts";

export function FarmToTable() {
  return (
    <section className="bg-ivory-200/60 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Farm to Table" title="수확부터 배송까지" align="center" />
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-5">
          {farmToTable.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-soil-200 bg-ivory-50 text-soil-600">
                <StepIcon name={s.icon} className="h-9 w-9" />
              </div>
              <p className="mt-4 font-serif text-sm text-burgundy-500">Step {s.step}</p>
              <p className="mt-1 font-serif text-lg font-semibold text-soil-700">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
