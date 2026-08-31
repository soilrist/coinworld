import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/InquiryForm";
import { faqItems, type FaqItem } from "@/content/faq";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "배송, 숙성/보관, 상품, 교환/환불 관련 자주 묻는 질문 모음.",
};

const CATEGORIES: FaqItem["category"][] = ["배송", "숙성/보관", "상품", "교환/환불"];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" />
      <div className="mt-10 space-y-10">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <h2 className="font-serif text-xl font-semibold text-soil-700">{category}</h2>
            <div className="mt-4 divide-y divide-soil-100 border-y border-soil-100">
              {faqItems
                .filter((f) => f.category === category)
                .map((f) => (
                  <details key={f.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-soil-700 md:text-base">
                      {f.question}
                      <span className="shrink-0 text-xl text-soil-300 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{f.answer}</p>
                  </details>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className="font-serif text-xl font-semibold text-soil-700">궁금한 점이 해결되지 않았나요?</h2>
        <p className="mt-2 text-sm text-charcoal-500">아래로 문의를 남겨주시면 순차적으로 답변드립니다.</p>
        <div className="mt-5">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
