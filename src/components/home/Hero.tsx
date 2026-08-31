import Link from "next/link";
import { FieldWaves } from "@/components/art/FieldWaves";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/content/facts";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-soil-800 text-ivory-50">
      <FieldWaves tone="dark" className="absolute inset-0 h-full w-full opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-soil-900/70 via-soil-900/10 to-soil-900/40" />
      <div className="container-page relative flex min-h-[88vh] flex-col justify-end gap-8 pb-16 pt-32 md:pb-24">
        <Reveal>
          <p className="eyebrow !text-ivory-200">전라남도 무안 · 담이농장</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[2.4rem] leading-[1.2] font-bold text-balance md:text-6xl md:leading-[1.15]">
            {brand.tagline}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-ivory-200 md:text-xl">{brand.subTagline}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="btn-primary">
              고구마 주문하기
            </Link>
            <Link href="/story" className="btn bg-ivory-50/10 text-ivory-50 border border-ivory-50/40 hover:bg-ivory-50/20">
              담이농장 이야기
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-ivory-50/20 pt-6 text-sm text-ivory-200">
            <li>2012 유기농 인증</li>
            <li>KBS 6시 내고향</li>
            <li>채널A 방송</li>
            <li>풀무원 올가 마이스터</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
