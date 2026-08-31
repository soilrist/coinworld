import Link from "next/link";
import { FieldWaves } from "@/components/art/FieldWaves";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-soil-900 py-28 text-ivory-50 md:py-36">
      <FieldWaves tone="dark" className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 bg-soil-900/50" />
      <div className="container-page relative text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-tight text-balance md:text-5xl">
          오늘 수확한 농산물이
          <br />
          당신의 식탁으로 갑니다.
        </h2>
        <Link href="/products" className="btn-primary mt-10 inline-flex">
          담이농장 고구마 만나보기
        </Link>
      </div>
    </section>
  );
}
