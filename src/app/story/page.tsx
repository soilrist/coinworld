import type { Metadata } from "next";
import { FounderPortraitArt } from "@/components/art/FounderPortraitArt";
import { TerroirDiagram } from "@/components/art/TerroirDiagram";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { communityContribution, meisterQuote, terroir } from "@/content/facts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "브랜드 스토리",
  description: "무안에서 2대에 걸쳐 18년째 농사를 지어온 담이농장 강여상 대표의 이야기.",
};

export default function StoryPage() {
  return (
    <div className="pb-20">
      <section className="container-page py-14 md:py-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <FounderPortraitArt className="mx-auto w-full max-w-sm rounded-sm shadow-soft md:order-2" />
          <div className="md:order-1">
            <SectionHeading eyebrow="Brand Story" title={"한 철 장사가 아니라\n농사를 업으로 살아온 시간"} />
            <div className="mt-6 space-y-5 text-[15px] leading-[1.9] text-charcoal-500 md:text-base">
              <p>
                전라남도 무안, 담이농장의 강여상 대표는 2대에 걸쳐 이 땅에서 농사를 지어왔습니다.
                아버지의 밭을 이어받아 전업농으로 일한 지 18년, 그 시간 동안 그는 한 가지 원칙을
                지켜왔습니다. 화학비료 대신 직접 만든 발효 액비로 땅의 힘을 유지하는 것입니다.
              </p>
              <p>
                &ldquo;땅이 건강해야 작물이 건강하다&rdquo;는 단순한 원칙 아래, 2012년 유기농 인증을
                처음 받은 뒤로 지금까지 같은 방식을 지켜오고 있습니다. 무안의 붉은 황토와 서해에서
                불어오는 해풍은 좋은 재료였지만, 그 재료를 헛되이 하지 않는 것은 농부의 몫이라고
                그는 말합니다.
              </p>
              <blockquote className="border-l-2 border-burgundy-400 pl-5 font-serif text-lg italic text-soil-600">
                &ldquo;{meisterQuote.quote}&rdquo;
              </blockquote>
              <p className="text-sm text-charcoal-400">— {meisterQuote.source}</p>
              <p>
                {formatDate(`${communityContribution.year}-${communityContribution.month}-01`).replace("1일", "")}, 담이농장은{" "}
                {communityContribution.detail}했습니다. 유기농 농사를 지어온 지 10여 년째, 땅에서 얻은
                것을 다시 지역에 나누는 일도 이어가고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory-200/60 py-16 md:py-24">
        <div className="container-page grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Muan Terroir" title="무안이라는 산지" />
            <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {terroir.map((t) => (
                <div key={t.title}>
                  <dt className="font-serif text-lg font-semibold text-soil-700">{t.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-charcoal-500">{t.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <TerroirDiagram className="w-full rounded-sm shadow-card" />
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <SectionHeading eyebrow="Philosophy" title="재배 철학" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card-editorial p-7">
            <p className="font-serif text-lg font-semibold text-soil-700">자가 제조 발효 액비</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
              합성 화학비료 대신 직접 담근 발효 액비를 사용해 토양의 미생물 환경을 지킵니다.
            </p>
          </div>
          <div className="card-editorial p-7">
            <p className="font-serif text-lg font-semibold text-soil-700">2대에 걸친 전업농</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
              한 철 장사가 아닌, 대를 이어온 농업을 업으로 삼아 18년째 같은 밭을 돌보고 있습니다.
            </p>
          </div>
          <div className="card-editorial p-7">
            <p className="font-serif text-lg font-semibold text-soil-700">지역과 함께</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
              수확한 고구마를 지역사회와 나누며, 산지와 소비자를 잇는 역할을 함께 고민합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
