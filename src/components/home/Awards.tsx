import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { awards, certifications, meisterQuote } from "@/content/facts";
import { formatDate } from "@/lib/format";

export function Awards() {
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow="Certification & Award" title="확인된 신뢰, 인증과 수상" align="center" />
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="card-editorial p-8">
          <p className="eyebrow">유기농 인증</p>
          <p className="mt-3 font-serif text-2xl font-bold text-soil-700">
            제 {certifications.organic.number}호
          </p>
          <p className="mt-2 text-sm text-charcoal-500">
            최초 인증일 {formatDate(certifications.organic.firstCertifiedDate)} · 대표 품목 고구마
          </p>
          <p className="mt-4 text-xs text-charcoal-400">저탄소 농축산물 인증 제{certifications.lowCarbon.number}호 동시 보유</p>
        </div>
        <div className="card-editorial p-8">
          <p className="eyebrow">
            {meisterQuote.organization} · {meisterQuote.program}
          </p>
          <p className="mt-3 font-serif text-2xl font-bold text-soil-700">올가 마이스터 선정</p>
          <p className="mt-2 text-sm text-charcoal-500">{formatDate(meisterQuote.announcedDate)} 발표 · 대표 강여상</p>
          <p className="mt-4 text-xs text-charcoal-400">2대에 걸친 18년 전업농, 자가 제조 발효 액비 재배 방식 소개</p>
        </div>
        {awards.map((a) => (
          <div key={a.title} className="card-editorial p-8">
            <p className="eyebrow">수상 {a.year}</p>
            <p className="mt-3 font-serif text-xl font-bold leading-snug text-soil-700">{a.title}</p>
            <p className="mt-2 text-sm text-charcoal-500">{a.detail}</p>
          </div>
        ))}
      </div>
      <Link href="/certification" className="mt-10 inline-flex btn-outline">
        인증서 전체 보기
      </Link>
    </section>
  );
}
