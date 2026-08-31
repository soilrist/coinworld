import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const STATS = [
  { value: "2012", label: "유기농 첫 인증" },
  { value: "18년", label: "2대째 이어온 전업농" },
  { value: "10만㎡+", label: "인증 재배 면적" },
  { value: "2023", label: "채널A · KBS 방송" },
  { value: "2023", label: "전국 으뜸 농산물 수상" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-soil-100 bg-ivory-100">
      <RevealGroup className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-5 md:py-14">
        {STATS.map((s) => (
          <RevealItem key={s.label} className="text-center md:text-left">
            <p className="font-serif text-3xl font-bold text-burgundy-600 md:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-charcoal-500">{s.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
