"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/csrf-client";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import type { OrderStatus } from "@prisma/client";

const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];

export function OrderStatusForm({
  orderId,
  currentStatus,
  trackingCarrier,
  trackingNumber,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  trackingCarrier: string | null;
  trackingNumber: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [carrier, setCarrier] = useState(trackingCarrier ?? "");
  const [tracking, setTracking] = useState(trackingNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await adminFetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, trackingCarrier: carrier, trackingNumber: tracking }),
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
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-charcoal-600">주문 상태</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-sm border border-soil-200 bg-ivory-50 px-3 py-2.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="carrier" className="mb-1.5 block text-sm font-medium text-charcoal-600">택배사</label>
          <input id="carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="tracking" className="mb-1.5 block text-sm font-medium text-charcoal-600">송장번호</label>
          <input id="tracking" value={tracking} onChange={(e) => setTracking(e.target.value)} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-sm" />
        </div>
      </div>
      {error && <p className="text-sm font-medium text-burgundy-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-secondary !min-h-0 !py-2.5">
        {saving ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
