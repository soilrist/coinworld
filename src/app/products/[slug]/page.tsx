import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductBySlug, getPublishedProducts, getVisibleReviewsForProduct } from "@/lib/products";
import { formatKRW, formatDateShort } from "@/lib/format";
import { brand, tasteGuide, broadcasts, certifications } from "@/content/facts";
import { faqItems } from "@/content/faq";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 120),
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [allProducts, reviews] = await Promise.all([
    getPublishedProducts(),
    getVisibleReviewsForProduct(product.id),
  ]);
  const siblings = allProducts.filter((p) => p.id !== product.id).slice(0, 3);
  const deliveryFaq = faqItems.filter((f) => f.category === "배송" || f.category === "교환/환불");

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "KRW",
      availability: product.isSoldOut || product.stock <= 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div className="container-page py-10 md:py-14">
        <nav className="mb-6 text-sm text-charcoal-400">
          <Link href="/products" className="hover:text-burgundy-600">전체 상품</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <ProductGallery weightLabel={product.weightLabel} variety={product.variety} />

          <div>
            <p className="text-sm font-medium text-olive-600">{product.variety} · 무안</p>
            <h1 className="mt-2 font-serif text-2xl font-bold leading-snug text-soil-700 md:text-3xl">{product.name}</h1>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{product.shortDescription}</p>

            <div className="mt-5 flex items-baseline gap-3">
              {product.compareAt && <span className="text-base text-charcoal-300 line-through">{formatKRW(product.compareAt)}</span>}
              <span className="font-serif text-3xl font-bold text-soil-700">{formatKRW(product.price)}</span>
            </div>
            <p className="mt-1 text-sm text-charcoal-400">
              {product.shippingFee === 0 ? "무료배송" : `배송비 ${formatKRW(product.shippingFee)}`} · 결제 후 영업일 2~3일 내 출고
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-3 text-xs text-charcoal-500">
              <li className="rounded-sm border border-soil-100 px-3 py-2">유기농산물 인증 제{certifications.organic.number}호</li>
              <li className="rounded-sm border border-soil-100 px-3 py-2">무안 황토밭 산지직송</li>
              <li className="rounded-sm border border-soil-100 px-3 py-2">생산자 강여상 담이농장</li>
              <li className="rounded-sm border border-soil-100 px-3 py-2">저탄소 인증 제{certifications.lowCarbon.number}호</li>
            </ul>

            <div className="mt-6">
              <BuyBox product={product} />
            </div>

            <div className="mt-6 rounded-sm bg-ivory-200/60 p-5 text-sm text-charcoal-500">
              <p className="font-semibold text-soil-700">크기 가이드</p>
              <p className="mt-1 leading-relaxed">
                자연 재배 특성상 개체 크기에 편차가 있을 수 있습니다. {product.weightLabel} 박스 기준 총 중량을 보장하며,
                개별 크기가 아닌 총 중량 기준으로 구성됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-soil-100 bg-ivory-200/40 py-16">
        <div className="container-page grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-soil-700">{tasteGuide.headline}</h2>
            <dl className="mt-6 space-y-5">
              {tasteGuide.points.map((p) => (
                <div key={p.title}>
                  <dt className="font-semibold text-soil-700">{p.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-charcoal-500">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-soil-700">생산자와 산지</h2>
            <p className="mt-6 text-sm leading-relaxed text-charcoal-500">
              담이농장 강여상 대표는 무안에서 2대에 걸쳐 18년째 농사를 지어온 전업농입니다. 합성 화학비료 대신
              자가 제조 발효 액비만을 사용하며, 2012년부터 유기농 인증을 이어오고 있습니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {broadcasts.slice(0, 2).map((b) => (
                <span key={b.program} className="rounded-full border border-soil-200 px-3 py-1.5 text-xs text-soil-600">
                  {b.network} · {b.program}
                </span>
              ))}
            </div>
            <Link href="/story" className="btn-outline mt-6 inline-flex !text-sm">
              생산자 이야기 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="font-serif text-2xl font-semibold text-soil-700">배송 · 교환/환불</h2>
          <div className="mt-6 divide-y divide-soil-100 border-y border-soil-100">
            {deliveryFaq.map((f) => (
              <details key={f.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-soil-700">
                  {f.question}
                  <span className="text-xl text-soil-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-soil-100 py-16">
        <div className="container-page">
          <h2 className="font-serif text-2xl font-semibold text-soil-700">상품 리뷰</h2>
          {reviews.length === 0 ? (
            <div className="mt-6 rounded-sm border border-dashed border-soil-300 bg-ivory-100 p-8 text-sm text-charcoal-500">
              아직 등록된 리뷰가 없습니다. 이 상품을 가장 먼저 경험하고 후기를 남겨주세요.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {reviews.map((r) => (
                <article key={r.id} className="card-editorial p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-soil-700">{r.authorName}</p>
                    <p className="text-sm text-burgundy-500">{"★".repeat(r.rating)}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{r.content}</p>
                  <p className="mt-3 text-xs text-charcoal-300">{formatDateShort(r.createdAt)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="border-t border-soil-100 py-16">
          <div className="container-page">
            <h2 className="font-serif text-2xl font-semibold text-soil-700">함께 보면 좋은 상품</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
