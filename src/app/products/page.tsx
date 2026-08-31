import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "전체 상품",
  description: "담이농장 무안 유기농 고구마 전체 상품. 3kg, 5kg, 10kg 및 품종별 구성을 만나보세요.",
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading
        eyebrow="Product"
        title="담이농장 무안 유기농 고구마"
        description="무안 황토밭에서 자란 고구마를 산지에서 바로 보내드립니다. 필요한 중량과 품종을 골라보세요."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
