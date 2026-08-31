"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatKRW } from "@/lib/format";
import type { Product } from "@prisma/client";

export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const soldOut = product.isSoldOut || product.stock <= 0;

  const addToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variety: product.variety,
      weightLabel: product.weightLabel,
      price: product.price,
      shippingFee: product.shippingFee,
      quantity: qty,
    });
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  return (
    <>
      <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal-500">수량</span>
          <div className="flex items-center rounded-full border border-soil-200">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-lg text-soil-600"
              aria-label="수량 감소"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="flex h-11 w-11 items-center justify-center text-lg text-soil-600"
              aria-label="수량 증가"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-soil-100 pt-5">
          <span className="text-sm text-charcoal-500">총 상품금액</span>
          <span className="font-serif text-2xl font-bold text-soil-700">{formatKRW(product.price * qty)}</span>
        </div>

        {!soldOut && product.stock <= product.lowStockAt && (
          <p className="mt-3 text-sm font-medium text-burgundy-600">품절 임박 · 재고 {product.stock}개 남음</p>
        )}

        <div className="mt-5 hidden gap-3 md:flex">
          <button type="button" disabled={soldOut} onClick={addToCart} className="btn-outline flex-1">
            장바구니
          </button>
          <button type="button" disabled={soldOut} onClick={buyNow} className="btn-primary flex-1">
            {soldOut ? "일시 품절" : "바로구매"}
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-soil-100 bg-ivory-50/95 p-3 backdrop-blur md:hidden [padding-bottom:calc(env(safe-area-inset-bottom)+0.75rem)]">
        <button type="button" disabled={soldOut} onClick={addToCart} className="btn-outline flex-1 !text-sm">
          장바구니
        </button>
        <button type="button" disabled={soldOut} onClick={buyNow} className="btn-primary flex-[1.4] !text-sm">
          {soldOut ? "일시 품절" : `바로구매 · ${formatKRW(product.price * qty)}`}
        </button>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
