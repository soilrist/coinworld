import Link from "next/link";
import type { Product } from "@prisma/client";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="Product" title="지금 주문할 수 있는 무안 고구마" />
        <Link href="/products" className="btn-outline shrink-0">
          전체 상품 보기
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
