"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotals } from "@/lib/cart-store";
import { formatKRW } from "@/lib/format";

const PAYMENT_METHODS = [
  { value: "card", label: "신용/체크카드" },
  { value: "bank_transfer", label: "무통장입금" },
  { value: "naverpay", label: "네이버페이" },
  { value: "kakaopay", label: "카카오페이" },
] as const;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    address: "",
    addressDetail: "",
    deliveryMemo: "",
    paymentMethod: "card" as (typeof PAYMENT_METHODS)[number]["value"],
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/cart");
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return <div className="container-page py-20" />;

  const totals = cartTotals(items);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "주문 처리 중 오류가 발생했습니다.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/checkout/complete?orderId=${data.orderId}`);
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-serif text-2xl font-semibold text-soil-700 md:text-3xl">주문/결제</h1>

      <form onSubmit={submit} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr,360px]">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-serif text-lg font-semibold text-soil-700">배송 정보</legend>
            <div>
              <label htmlFor="recipientName" className="mb-1.5 block text-sm font-medium text-charcoal-600">받는 분 이름</label>
              <input
                id="recipientName"
                required
                value={form.recipientName}
                onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))}
                className="w-full rounded-sm border border-soil-200 bg-ivory-50 px-4 py-3 text-[16px]"
              />
            </div>
            <div>
              <label htmlFor="recipientPhone" className="mb-1.5 block text-sm font-medium text-charcoal-600">휴대폰 번호</label>
              <input
                id="recipientPhone"
                required
                type="tel"
                placeholder="010-0000-0000"
                value={form.recipientPhone}
                onChange={(e) => setForm((f) => ({ ...f, recipientPhone: e.target.value }))}
                className="w-full rounded-sm border border-soil-200 bg-ivory-50 px-4 py-3 text-[16px]"
              />
            </div>
            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-charcoal-600">배송 주소</label>
              <input
                id="address"
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full rounded-sm border border-soil-200 bg-ivory-50 px-4 py-3 text-[16px]"
              />
            </div>
            <div>
              <label htmlFor="addressDetail" className="mb-1.5 block text-sm font-medium text-charcoal-600">상세 주소 (선택)</label>
              <input
                id="addressDetail"
                value={form.addressDetail}
                onChange={(e) => setForm((f) => ({ ...f, addressDetail: e.target.value }))}
                className="w-full rounded-sm border border-soil-200 bg-ivory-50 px-4 py-3 text-[16px]"
              />
            </div>
            <div>
              <label htmlFor="deliveryMemo" className="mb-1.5 block text-sm font-medium text-charcoal-600">배송 메모 (선택)</label>
              <input
                id="deliveryMemo"
                placeholder="예: 부재 시 경비실에 맡겨주세요"
                value={form.deliveryMemo}
                onChange={(e) => setForm((f) => ({ ...f, deliveryMemo: e.target.value }))}
                className="w-full rounded-sm border border-soil-200 bg-ivory-50 px-4 py-3 text-[16px]"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-serif text-lg font-semibold text-soil-700 mb-4">결제 수단</legend>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex min-h-[52px] cursor-pointer items-center justify-center rounded-sm border text-sm font-medium ${
                    form.paymentMethod === m.value ? "border-burgundy-500 bg-burgundy-50 text-burgundy-700" : "border-soil-200 text-charcoal-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={form.paymentMethod === m.value}
                    onChange={() => setForm((f) => ({ ...f, paymentMethod: m.value }))}
                    className="sr-only"
                  />
                  {m.label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-charcoal-400">현재 테스트 결제(Mock Payment) 환경입니다. 실제 결제가 청구되지 않습니다.</p>
          </fieldset>
        </div>

        <aside className="h-fit rounded-sm border border-soil-100 bg-ivory-50 p-6">
          <h2 className="font-serif text-lg font-semibold text-soil-700">주문 요약</h2>
          <ul className="mt-4 space-y-2 text-sm text-charcoal-500">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>{i.name} x{i.quantity}</span>
                <span>{formatKRW(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-soil-100 pt-4">
            <span className="font-semibold text-soil-700">총 결제금액</span>
            <span className="font-serif text-xl font-bold text-soil-700">{formatKRW(totals.totalAmount)}</span>
          </div>
          {error && <p className="mt-3 text-sm font-medium text-burgundy-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? "결제 처리 중..." : `${formatKRW(totals.totalAmount)} 결제하기`}
          </button>
        </aside>
      </form>
    </div>
  );
}
