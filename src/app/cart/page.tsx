"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotals } from "@/lib/cart-store";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { formatKRW } from "@/lib/format";
import { useHasMounted } from "@/lib/use-has-mounted";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const mounted = useHasMounted();
  const router = useRouter();

  if (!mounted) return <div className="container-page py-20" />;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-2xl font-semibold text-soil-700">장바구니가 비어 있습니다</h1>
        <p className="mt-2 text-sm text-charcoal-500">담이농장 고구마를 담아보세요.</p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          상품 보러가기
        </Link>
      </div>
    );
  }

  const totals = cartTotals(items);

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-serif text-2xl font-semibold text-soil-700 md:text-3xl">장바구니</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr,360px]">
        <div>
          <div className="mb-6">
            <FreeShippingBar remaining={totals.remainingForFreeShipping} threshold={totals.freeShippingThreshold} />
          </div>
          <ul className="divide-y divide-soil-100 border-y border-soil-100">
            {items.map((item) => (
              <li key={item.productId} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-olive-600">{item.variety}</p>
                  <Link href={`/products/${item.slug}`} className="font-serif text-lg font-semibold text-soil-700 hover:text-burgundy-600">
                    {item.name}
                  </Link>
                  <p className="text-sm text-charcoal-400">{item.weightLabel} · {formatKRW(item.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-soil-200">
                    <button
                      type="button"
                      aria-label="수량 감소"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center text-lg text-soil-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="수량 증가"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center text-lg text-soil-600"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-24 text-right font-semibold text-soil-700">{formatKRW(item.price * item.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`${item.name} 삭제`}
                    className="text-charcoal-300 hover:text-burgundy-600"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-sm border border-soil-100 bg-ivory-50 p-6">
          <h2 className="font-serif text-lg font-semibold text-soil-700">결제 예정 금액</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-charcoal-500">상품금액</dt><dd>{formatKRW(totals.itemsAmount)}</dd></div>
            <div className="flex justify-between"><dt className="text-charcoal-500">배송비</dt><dd>{totals.shippingAmount === 0 ? "무료" : formatKRW(totals.shippingAmount)}</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-soil-100 pt-4">
            <span className="font-semibold text-soil-700">총 결제금액</span>
            <span className="font-serif text-xl font-bold text-soil-700">{formatKRW(totals.totalAmount)}</span>
          </div>
          <button type="button" onClick={() => router.push("/checkout")} className="btn-primary mt-6 w-full">
            주문하기
          </button>
        </aside>
      </div>
    </div>
  );
}
