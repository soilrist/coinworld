import type { Review } from "@prisma/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { formatDateShort } from "@/lib/format";

/**
 * 가짜 리뷰/평점을 생성하지 않는다(docs/CONTENT.md §10).
 * 실제 리뷰가 쌓이기 전까지는 정직한 빈 상태를 보여준다 — 이는 "미완성"이 아니라
 * 신규 리뷰 시스템의 정상적인 초기 상태다.
 */
export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="bg-ivory-200/60 py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="Review" title="담이농장을 먼저 만난 분들" align="center" />
        </Reveal>
        {reviews.length === 0 ? (
          <Reveal className="mx-auto mt-12 max-w-lg rounded-sm border border-dashed border-soil-300 bg-ivory-50 p-10 text-center">
            <p className="font-serif text-lg font-semibold text-soil-700">첫 리뷰를 기다리고 있습니다</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
              상품을 받아보신 분들의 사진과 후기가 이곳에 그대로 쌓입니다. 실제 구매 고객의 리뷰만
              투명하게 게시합니다.
            </p>
          </Reveal>
        ) : (
          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <RevealItem key={r.id} as="article" className="card-editorial p-6">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-soil-700">{r.authorName}</p>
                  <p className="text-sm text-burgundy-500">{"★".repeat(r.rating)}<span className="text-soil-100">{"★".repeat(5 - r.rating)}</span></p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{r.content}</p>
                <p className="mt-4 text-xs text-charcoal-300">{formatDateShort(r.createdAt)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
