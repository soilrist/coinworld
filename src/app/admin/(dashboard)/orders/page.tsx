import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatKRW, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, CHANNEL_LABEL } from "@/lib/order-labels";
import type { OrderStatus } from "@prisma/client";

const TABS: { key: OrderStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "PAID", label: "발송대기" },
  { key: "PREPARING", label: "상품준비중" },
  { key: "SHIPPING", label: "배송중" },
  { key: "DELIVERED", label: "완료" },
  { key: "CANCELLED", label: "취소" },
  { key: "RETURNED", label: "반품" },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const activeTab = (status as OrderStatus | undefined) ?? "ALL";

  const orders = await prisma.unifiedOrder.findMany({
    where: activeTab === "ALL" ? {} : { status: activeTab },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">주문 관리</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "ALL" ? "/admin/orders" : `/admin/orders?status=${tab.key}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeTab === tab.key ? "bg-soil-700 text-ivory-50" : "bg-ivory-200 text-charcoal-600"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-soil-100 bg-ivory-50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soil-100 text-left text-charcoal-400">
              <th className="px-4 py-3 font-medium">주문일시</th>
              <th className="px-4 py-3 font-medium">채널</th>
              <th className="px-4 py-3 font-medium">받는 분</th>
              <th className="px-4 py-3 font-medium">상품</th>
              <th className="px-4 py-3 font-medium">금액</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-soil-50 last:border-0 hover:bg-ivory-100">
                <td className="px-4 py-3 whitespace-nowrap text-charcoal-500">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">{CHANNEL_LABEL[o.channel]}</td>
                <td className="px-4 py-3">{o.recipientName} · {o.recipientPhone}</td>
                <td className="px-4 py-3">{o.items[0]?.nameSnapshot}{o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ""}</td>
                <td className="px-4 py-3">{formatKRW(o.totalAmount)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="rounded-full bg-ivory-200 px-3 py-1 text-xs font-medium text-soil-700 hover:bg-ivory-300">
                    {ORDER_STATUS_LABEL[o.status]}
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-charcoal-400">해당 조건의 주문이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
