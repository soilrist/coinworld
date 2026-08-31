import Link from "next/link";
import { FounderPortraitArt } from "@/components/art/FounderPortraitArt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { meisterQuote } from "@/content/facts";

export function BrandStory() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="order-2 md:order-1">
          <SectionHeading
            eyebrow="Brand Story"
            title={"한 철 장사가 아니라\n농사를 업으로 살아온 시간"}
          />
          <div className="mt-6 space-y-5 text-[15px] md:text-base leading-[1.9] text-charcoal-500">
            <p>
              담이농장 강여상 대표는 2대에 걸쳐 무안에서 농사를 지어왔습니다. 전업농으로 18년,
              그 시간 동안 한 가지 원칙은 바뀌지 않았습니다 — 화학비료 대신 직접 담근 발효
              액비로 땅을 살리는 것.
            </p>
            <p>
              무안의 황토와 서해 해풍이 좋은 재료라면, 그 재료를 헛되이 하지 않는 것은 농부의
              몫이라고 그는 말합니다. 2012년 유기농 인증을 처음 받은 뒤로, 담이농장은 매해
              같은 밭에서 같은 방식으로 고구마를 키워왔습니다.
            </p>
            <blockquote className="border-l-2 border-burgundy-400 pl-5 font-serif text-lg italic text-soil-600">
              &ldquo;{meisterQuote.quote}&rdquo;
            </blockquote>
            <p className="text-sm text-charcoal-400">— {meisterQuote.source}</p>
          </div>
          <Link href="/story" className="btn-outline mt-8 inline-flex">
            담이농장 이야기 더 보기
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="order-1 md:order-2">
          <FounderPortraitArt className="mx-auto w-full max-w-sm rounded-sm shadow-soft" />
        </Reveal>
      </div>
    </section>
  );
}
