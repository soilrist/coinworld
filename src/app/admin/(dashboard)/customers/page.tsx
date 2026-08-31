import { getCustomersWithStats } from "@/lib/customers";
import { formatKRW, formatDate } from "@/lib/format";

export default async function AdminCustomersPage() {
  const customers = await getCustomersWithStats();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">고객 관리</h1>
      <div className="mt-6 overflow-x-auto rounded-sm border border-soil-100 bg-ivory-50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soil-100 text-left text-charcoal-400">
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">연락처</th>
              <th className="px-4 py-3 font-medium">누적금액</th>
              <th className="px-4 py-3 font-medium">주문횟수</th>
              <th className="px-4 py-3 font-medium">최근주문</th>
              <th className="px-4 py-3 font-medium">재구매주기</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-soil-50 last:border-0">
                <td className="px-4 py-3 font-medium text-soil-700">{c.name}</td>
                <td className="px-4 py-3 text-charcoal-500">{c.phone}</td>
                <td className="px-4 py-3">{formatKRW(c.totalSpent)}</td>
                <td className="px-4 py-3">{c.orderCount}회</td>
                <td className="px-4 py-3 text-charcoal-500">{c.lastOrderAt ? formatDate(c.lastOrderAt) : "-"}</td>
                <td className="px-4 py-3 text-charcoal-500">{c.avgCycleDays ? `약 ${c.avgCycleDays}일` : "-"}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-charcoal-400">등록된 고객이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
