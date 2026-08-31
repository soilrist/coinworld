"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/csrf-client";
import type { Product } from "@prisma/client";

export function InventoryAdjustForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [change, setChange] = useState(0);
  const [reason, setReason] = useState<"입고" | "조정" | "반품">("입고");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await adminFetch("/api/admin/inventory", {
      method: "POST",
      body: JSON.stringify({ productId, change, reason, memo }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "처리에 실패했습니다.");
      return;
    }
    setChange(0);
    setMemo("");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 rounded-sm border border-soil-100 bg-ivory-50 p-6 sm:grid-cols-5 sm:items-end">
      <div className="sm:col-span-2">
        <label htmlFor="inv-product" className="mb-1.5 block text-sm font-medium text-charcoal-600">상품</label>
        <select id="inv-product" value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm">
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} (현재 {p.stock})</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inv-change" className="mb-1.5 block text-sm font-medium text-charcoal-600">변동수량</label>
        <input id="inv-change" type="number" value={change} onChange={(e) => setChange(Number(e.target.value))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="inv-reason" className="mb-1.5 block text-sm font-medium text-charcoal-600">사유</label>
        <select id="inv-reason" value={reason} onChange={(e) => setReason(e.target.value as typeof reason)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm">
          <option value="입고">입고</option>
          <option value="조정">조정</option>
          <option value="반품">반품</option>
        </select>
      </div>
      <div>
        <label htmlFor="inv-memo" className="mb-1.5 block text-sm font-medium text-charcoal-600">메모</label>
        <input id="inv-memo" value={memo} onChange={(e) => setMemo(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
      </div>
      <div className="sm:col-span-5">
        {error && <p className="mb-2 text-sm font-medium text-burgundy-600">{error}</p>}
        <button type="submit" disabled={saving} className="btn-secondary !min-h-0 !py-2.5">{saving ? "처리 중..." : "재고 반영"}</button>
      </div>
    </form>
  );
}
