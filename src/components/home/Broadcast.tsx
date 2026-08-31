import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { broadcasts } from "@/content/facts";
import { formatDate } from "@/lib/format";

export function Broadcast() {
  return (
    <section className="bg-soil-800 py-20 text-ivory-50 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="TV Media" title="방송이 찾아온 농장" tone="light" />
        </Reveal>
        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {broadcasts.map((b) => (
            <RevealItem key={`${b.network}-${b.airDate}`} className="rounded-sm border border-ivory-50/15 bg-ivory-50/[0.04] p-7">
              <p className="text-xs font-semibold tracking-widest text-burgundy-300">{b.network}</p>
              <h3 className="mt-3 font-serif text-xl font-semibold">{b.program}</h3>
              {b.segment && <p className="mt-1 text-sm text-ivory-300">{b.segment}</p>}
              <p className="mt-4 text-sm leading-relaxed text-ivory-300">{b.description}</p>
              <p className="mt-5 text-xs text-ivory-400">{formatDate(b.airDate)} · {b.region}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Link href="/broadcast" className="mt-10 inline-flex btn bg-ivory-50/10 text-ivory-50 border border-ivory-50/40 hover:bg-ivory-50/20">
          방송 자세히 보기
        </Link>
      </div>
    </section>
  );
}
