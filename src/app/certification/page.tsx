import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { awards, certifications, meisterQuote, corporate } from "@/content/facts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "인증 · 수상",
  description: "담이농장의 유기농 인증, 저탄소 인증, 올가 마이스터 선정, 수상 이력.",
};

export default function CertificationPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="Certification & Award" title="확인된 신뢰, 인증과 수상" />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card-editorial p-8">
          <p className="eyebrow">국가 인증 · 유기농산물</p>
          <p className="mt-3 font-serif text-3xl font-bold text-soil-700">제 {certifications.organic.number}호</p>
          <dl className="mt-5 space-y-2 text-sm text-charcoal-500">
            <div className="flex justify-between"><dt>최초 인증일</dt><dd>{formatDate(certifications.organic.firstCertifiedDate)}</dd></div>
            <div className="flex justify-between"><dt>대표 인증 품목</dt><dd>{certifications.organic.itemLabel}</dd></div>
            <div className="flex justify-between items-center">
              <dt>인증 면적</dt>
              <dd>약 {certifications.areaClaims.totalCertifiedAreaSqm.toLocaleString("ko-KR")}㎡</dd>
            </div>
            <div className="flex justify-between"><dt>고구마 재배 인증면적</dt><dd>약 {certifications.areaClaims.sweetPotatoAreaSqm.toLocaleString("ko-KR")}㎡</dd></div>
            <div className="flex justify-between"><dt>고구마 생산계획량</dt><dd>약 {certifications.areaClaims.productionPlanKg.toLocaleString("ko-KR")}kg</dd></div>
          </dl>
        </div>

        <div className="card-editorial p-8">
          <p className="eyebrow">저탄소 농축산물 인증</p>
          <p className="mt-3 font-serif text-3xl font-bold text-soil-700">제 {certifications.lowCarbon.number}호</p>
          <p className="mt-5 text-sm leading-relaxed text-charcoal-500">
            생산 과정에서의 온실가스 배출을 줄이는 저탄소 농업 방식에 대해 국가 인증을 받았습니다.
          </p>
        </div>

        <div className="card-editorial p-8 md:col-span-2">
          <p className="eyebrow">{meisterQuote.organization} · {meisterQuote.program}</p>
          <p className="mt-3 font-serif text-2xl font-bold text-soil-700">올가 마이스터 선정 — 강여상</p>
          <p className="mt-3 text-sm text-charcoal-400">{formatDate(meisterQuote.announcedDate)} 발표</p>
          <blockquote className="mt-4 border-l-2 border-burgundy-400 pl-5 font-serif text-lg italic text-soil-600">
            &ldquo;{meisterQuote.quote}&rdquo;
          </blockquote>
          <p className="mt-3 text-xs text-charcoal-400">— {meisterQuote.source}</p>
        </div>

        {awards.map((a) => (
          <div key={a.title} className="card-editorial p-8 md:col-span-2">
            <p className="eyebrow">수상 {a.year}</p>
            <p className="mt-3 font-serif text-2xl font-bold text-soil-700">{a.title}</p>
            <p className="mt-2 text-sm text-charcoal-500">{a.detail}</p>
          </div>
        ))}

        <div className="card-editorial p-8 md:col-span-2">
          <p className="eyebrow">법인 정보</p>
          <p className="mt-3 font-serif text-xl font-bold text-soil-700">{corporate.companyType}</p>
          <p className="mt-2 text-sm text-charcoal-500">설립일 {formatDate(corporate.establishedDate)} · 대표 {corporate.representativeName}</p>
        </div>
      </div>

      <div className="mt-10 rounded-sm border border-soil-200 bg-ivory-100 p-6 text-sm leading-relaxed text-charcoal-500">
        <p className="font-semibold text-soil-700">인증서 원본 안내</p>
        <p className="mt-2">
          인증서·상장 실물 이미지는 확보되는 대로 이 페이지에 스캔본을 게시할 예정입니다. 인증번호로
          국립농산물품질관리원 친환경인증관리정보시스템에서 직접 조회하실 수도 있습니다.
        </p>
      </div>
    </div>
  );
}
