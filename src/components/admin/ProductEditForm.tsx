"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/csrf-client";
import type { Product } from "@prisma/client";

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [shippingFee, setShippingFee] = useState(product.shippingFee);
  const [isPublished, setIsPublished] = useState(product.isPublished);
  const [isSoldOut, setIsSoldOut] = useState(product.isSoldOut);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await adminFetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify({ price, stock, shippingFee, isPublished, isSoldOut }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "저장에 실패했습니다.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-sm border border-soil-100 bg-ivory-50 p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`price-${product.id}`} className="mb-1.5 block text-sm font-medium text-charcoal-600">판매가</label>
          <input id={`price-${product.id}`} type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor={`stock-${product.id}`} className="mb-1.5 block text-sm font-medium text-charcoal-600">재고</label>
          <input id={`stock-${product.id}`} type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor={`shipping-${product.id}`} className="mb-1.5 block text-sm font-medium text-charcoal-600">배송비</label>
          <input id={`shipping-${product.id}`} type="number" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          노출
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isSoldOut} onChange={(e) => setIsSoldOut(e.target.checked)} />
          품절 처리
        </label>
      </div>
      {error && <p className="text-sm font-medium text-burgundy-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-secondary !min-h-0 !py-2.5">
        {saving ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
