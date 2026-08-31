import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { broadcasts } from "@/content/facts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "방송",
  description: "KBS 6시 내고향, 채널A 산지직송 프로젝트 등 담이농장이 소개된 방송 이력.",
};

export default function BroadcastPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="TV Media" title="방송이 찾아온 농장" description="담이농장과 강여상 대표가 소개된 방송입니다." />

      <div className="mt-12 space-y-6">
        {broadcasts.map((b) => (
          <article key={`${b.network}-${b.airDate}`} className="card-editorial flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">{b.network}</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-soil-700">{b.program}</h2>
              {b.segment && <p className="mt-1 text-sm text-charcoal-500">{b.segment}</p>}
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-500">{b.description}</p>
              <p className="mt-3 text-xs text-charcoal-400">{formatDate(b.airDate)} · {b.region}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-dashed border-soil-300 bg-ivory-100 p-6 text-sm leading-relaxed text-charcoal-500">
        <p className="font-semibold text-soil-700">안내</p>
        <p className="mt-2">
          방송사 저작권 정책에 따라 방송 화면을 직접 게시하지 않으며, 프로그램명·방영일·소개 내용을
          텍스트로만 안내합니다. 다시보기가 필요하신 경우 각 방송사 공식 채널에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
