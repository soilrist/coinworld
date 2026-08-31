"use client";

import { useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/csrf-client";
import { formatKRW, formatDate } from "@/lib/format";
import type { Product } from "@prisma/client";

interface LookupResult {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  orders: { id: string; createdAt: string; totalAmount: number; items: { nameSnapshot: string; quantity: number }[] }[];
}

interface LineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export function PhoneOrderForm({ products }: { products: Product[] }) {
  const [phone, setPhone] = useState("");
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [looked, setLooked] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [items, setItems] = useState<LineItem[]>([]);
  const [result, setResult] = useState<{ orderId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const doLookup = async () => {
    const res = await fetch(`/api/admin/customers/lookup?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setLooked(true);
    setLookup(data.customer);
    if (data.customer) {
      setName(data.customer.name);
      setAddress(data.customer.address ?? "");
    }
  };

  const addItem = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: qty }];
    });
  };

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const res = await adminFetch("/api/admin/orders", {
      method: "POST",
      body: JSON.stringify({
        recipientName: name,
        recipientPhone: phone,
        address,
        addressDetail,
        deliveryMemo: memo,
        paymentMethod: "bank_transfer",
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "주문 생성에 실패했습니다.");
      return;
    }
    setResult({ orderId: data.orderId });
    setItems([]);
  };

  if (result) {
    return (
      <div className="rounded-sm border border-olive-200 bg-olive-50 p-6">
        <p className="font-semibold text-olive-800">전화주문이 등록되었습니다.</p>
        <Link href={`/admin/orders/${result.orderId}`} className="mt-2 inline-block text-sm text-burgundy-600 hover:underline">
          주문 상세 보기 →
        </Link>
        <button type="button" onClick={() => setResult(null)} className="btn-outline mt-4 !py-2 !text-sm">
          새 주문 등록
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal-600">전화번호로 고객 조회</label>
          <div className="flex gap-2">
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" className="flex-1 rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
            <button type="button" onClick={doLookup} className="btn-secondary !min-h-0 !py-2.5 !px-4 text-sm">조회</button>
          </div>
          {looked && (
            <p className="mt-2 text-xs text-charcoal-400">
              {lookup ? `기존 고객 (주문 ${lookup.orders.length}건 표시)` : "신규 고객입니다."}
            </p>
          )}
          {lookup && lookup.orders.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-sm bg-ivory-100 p-3 text-xs text-charcoal-500">
              {lookup.orders.map((o) => (
                <li key={o.id}>
                  {formatDate(o.createdAt)} · {o.items.map((i) => i.nameSnapshot).join(", ")} · {formatKRW(o.totalAmount)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 rounded-sm border border-soil-100 bg-ivory-50 p-6">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal-600">이름</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-charcoal-600">주소</label>
            <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="addressDetail" className="mb-1.5 block text-sm font-medium text-charcoal-600">상세주소</label>
            <input id="addressDetail" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="memo" className="mb-1.5 block text-sm font-medium text-charcoal-600">메모</label>
            <input id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
          <p className="mb-3 font-semibold text-soil-700">상품 추가</p>
          <div className="flex gap-2">
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="flex-1 rounded-sm border border-soil-200 px-3 py-2.5 text-sm">
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {formatKRW(p.price)}</option>
              ))}
            </select>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-20 rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
            <button type="button" onClick={addItem} className="btn-outline !min-h-0 !py-2.5 !px-4 text-sm">담기</button>
          </div>

          <ul className="mt-4 divide-y divide-soil-100">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between py-2 text-sm">
                <span>{i.name} x{i.quantity}</span>
                <span>{formatKRW(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className="mt-2 flex justify-between border-t border-soil-100 pt-2 font-semibold text-soil-700">
              <span>합계</span>
              <span>{formatKRW(total)}</span>
            </div>
          )}
        </div>

        {error && <p className="text-sm font-medium text-burgundy-600">{error}</p>}
        <button
          type="button"
          disabled={submitting || items.length === 0 || !name || !phone || !address}
          onClick={submit}
          className="btn-primary w-full"
        >
          {submitting ? "등록 중..." : "전화주문 등록"}
        </button>
      </div>
    </div>
  );
}
