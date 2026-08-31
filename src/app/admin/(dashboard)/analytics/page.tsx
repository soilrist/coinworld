import { getDailyRevenue, getSalesByProduct } from "@/lib/analytics";
import { formatKRW } from "@/lib/format";

export default async function AdminAnalyticsPage() {
  const [daily, byProduct] = await Promise.all([getDailyRevenue(14), getSalesByProduct(30)]);
  const max = Math.max(1, ...daily.map((d) => d.amount));

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">분석</h1>

      <div className="mt-6 rounded-sm border border-soil-100 bg-ivory-50 p-6">
        <p className="font-semibold text-soil-700">최근 14일 매출</p>
        <div className="mt-6 flex h-48 items-end gap-2">
          {daily.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5" title={`${d.date}: ${formatKRW(d.amount)}`}>
              <div
                className="w-full rounded-t-sm bg-burgundy-400"
                style={{ height: `${Math.max(4, (d.amount / max) * 160)}px` }}
              />
              <span className="text-[10px] text-charcoal-400">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-soil-100 bg-ivory-50 p-6">
        <p className="font-semibold text-soil-700">상품별 판매 (최근 30일)</p>
        <div className="mt-4 space-y-3">
          {byProduct.length === 0 && <p className="text-sm text-charcoal-400">최근 30일 판매 데이터가 없습니다.</p>}
          {byProduct.map((p) => (
            <div key={p.name} className="flex items-center justify-between border-b border-soil-50 pb-2 text-sm">
              <span>{p.name}</span>
              <span className="text-charcoal-500">{p.qty}개 · {formatKRW(p.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
