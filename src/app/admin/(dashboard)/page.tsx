import Link from "next/link";
import { getDashboardStats, getRecentOrders } from "@/lib/analytics";
import { formatKRW, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import { naverCommerceClient } from "@/lib/integrations/naver/client";

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders()]);
  const naverConnected = naverCommerceClient.isConfigured();
  const diff = stats.yesterdayRevenue === 0 ? null : Math.round(((stats.todayRevenue - stats.yesterdayRevenue) / stats.yesterdayRevenue) * 100);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">대시보드</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="오늘 매출" value={formatKRW(stats.todayRevenue)} sub={diff !== null ? `전일 대비 ${diff >= 0 ? "+" : ""}${diff}%` : "전일 데이터 없음"} />
        <StatCard label="오늘 주문" value={`${stats.todayOrderCount}건`} />
        <StatCard label="발송대기" value={`${stats.preparingCount}건`} highlight={stats.preparingCount > 0} />
        <StatCard label="배송중" value={`${stats.shippingCount}건`} />
        <StatCard label="취소" value={`${stats.cancelledCount}건`} />
        <StatCard label="미답변 문의" value={`${stats.openInquiries}건`} highlight={stats.openInquiries > 0} />
        <StatCard label="재고부족 상품" value={`${stats.lowStockProducts.length}개`} highlight={stats.lowStockProducts.length > 0} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-sm border border-soil-100 bg-ivory-50 p-5">
        <div>
          <p className="text-sm font-medium text-charcoal-600">채널 연동 · 스마트스토어(네이버 커머스API)</p>
          <p className="mt-1 text-xs text-charcoal-400">
            {naverConnected ? "연동 활성화됨 — 주문/재고 동기화가 가능합니다." : "미연동 — .env에 NAVER_COMMERCE_CLIENT_ID/SECRET을 설정하면 활성화됩니다."}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${naverConnected ? "bg-olive-100 text-olive-700" : "bg-ivory-200 text-charcoal-500"}`}>
          {naverConnected ? "연동됨" : "미연동"}
        </span>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="mt-6 rounded-sm border border-burgundy-200 bg-burgundy-50 p-5">
          <p className="font-semibold text-burgundy-700">재고 부족 알림</p>
          <ul className="mt-2 space-y-1 text-sm text-burgundy-700">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id}>{p.name} — 재고 {p.stock}개</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-soil-700">최근 주문</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-burgundy-600">전체보기</Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-sm border border-soil-100 bg-ivory-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soil-100 text-left text-charcoal-400">
                <th className="px-4 py-3 font-medium">주문일시</th>
                <th className="px-4 py-3 font-medium">채널</th>
                <th className="px-4 py-3 font-medium">받는 분</th>
                <th className="px-4 py-3 font-medium">금액</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-soil-50 last:border-0">
                  <td className="px-4 py-3 text-charcoal-500">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">{o.channel}</td>
                  <td className="px-4 py-3">{o.recipientName}</td>
                  <td className="px-4 py-3">{formatKRW(o.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-burgundy-600 hover:underline">
                      {ORDER_STATUS_LABEL[o.status]}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-sm border p-5 ${highlight ? "border-burgundy-300 bg-burgundy-50" : "border-soil-100 bg-ivory-50"}`}>
      <p className="text-xs font-medium text-charcoal-400">{label}</p>
      <p className="mt-1.5 font-serif text-xl font-bold text-soil-700">{value}</p>
      {sub && <p className="mt-1 text-xs text-charcoal-400">{sub}</p>}
    </div>
  );
}
