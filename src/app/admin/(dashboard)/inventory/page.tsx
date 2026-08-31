import { prisma } from "@/lib/prisma";
import { InventoryAdjustForm } from "@/components/admin/InventoryAdjustForm";
import { formatDate } from "@/lib/format";

export default async function AdminInventoryPage() {
  const [products, logs] = await Promise.all([
    prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.inventoryLog.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { product: true } }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">재고 관리</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {products.map((p) => (
          <div key={p.id} className={`rounded-sm border p-4 ${p.stock <= p.lowStockAt ? "border-burgundy-300 bg-burgundy-50" : "border-soil-100 bg-ivory-50"}`}>
            <p className="text-xs text-charcoal-400">{p.weightLabel}</p>
            <p className="mt-1 text-sm font-semibold text-soil-700">{p.name}</p>
            <p className="mt-2 font-serif text-2xl font-bold text-soil-700">{p.stock}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <InventoryAdjustForm products={products} />
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-soil-700">최근 입출고 이력</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-soil-100 bg-ivory-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soil-100 text-left text-charcoal-400">
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium">상품</th>
                <th className="px-4 py-3 font-medium">사유</th>
                <th className="px-4 py-3 font-medium">변동</th>
                <th className="px-4 py-3 font-medium">메모</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-soil-50 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-charcoal-500">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3">{log.product.name}</td>
                  <td className="px-4 py-3">{log.reason}</td>
                  <td className={`px-4 py-3 font-medium ${log.change > 0 ? "text-olive-700" : "text-burgundy-600"}`}>{log.change > 0 ? `+${log.change}` : log.change}</td>
                  <td className="px-4 py-3 text-charcoal-400">{log.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
