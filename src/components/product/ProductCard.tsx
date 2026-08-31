import Link from "next/link";
import type { Product } from "@prisma/client";
import { ProductLabelArt } from "@/components/art/ProductLabelArt";
import { formatKRW } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.isSoldOut || product.stock <= 0;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-soil-100 bg-ivory-50 transition-shadow hover:shadow-soft"
    >
      <div className="relative aspect-square overflow-hidden bg-ivory-200">
        <ProductLabelArt
          weightLabel={product.weightLabel}
          variety={product.variety}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal-600/90 px-3 py-1 text-xs font-semibold text-ivory-50">
            일시 품절
          </span>
        )}
        {!soldOut && product.compareAt && (
          <span className="absolute left-3 top-3 rounded-full bg-burgundy-500 px-3 py-1 text-xs font-semibold text-ivory-50">
            {Math.round((1 - product.price / product.compareAt) * 100)}% 할인
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium tracking-wide text-olive-600">{product.variety}</p>
        <h3 className="font-serif text-lg font-semibold text-soil-700 leading-snug">{product.name}</h3>
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            {product.compareAt && (
              <p className="text-xs text-charcoal-300 line-through">{formatKRW(product.compareAt)}</p>
            )}
            <p className="text-xl font-bold text-soil-700">{formatKRW(product.price)}</p>
            <p className="text-xs text-charcoal-400">
              {product.shippingFee === 0 ? "무료배송" : `배송비 ${formatKRW(product.shippingFee)}`}
            </p>
          </div>
          <span className="btn-outline !min-h-0 !py-2 !px-4 text-sm">담기</span>
        </div>
      </div>
    </Link>
  );
}
