import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { faqItems } from "@/content/faq";

export function FaqPreview() {
  const preview = faqItems.slice(0, 5);
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" />
      </Reveal>
      <RevealGroup className="mt-10 divide-y divide-soil-100 border-y border-soil-100">
        {preview.map((f) => (
          <RevealItem key={f.question}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-soil-700 md:text-base">
                <span>
                  <span className="mr-3 text-xs font-semibold text-burgundy-500">{f.category}</span>
                  {f.question}
                </span>
                <span className="shrink-0 text-xl text-soil-300 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{f.answer}</p>
            </details>
          </RevealItem>
        ))}
      </RevealGroup>
      <Link href="/faq" className="btn-outline mt-8 inline-flex">
        FAQ 전체 보기
      </Link>
    </section>
  );
}
