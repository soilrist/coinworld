import { prisma } from "@/lib/prisma";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { formatKRW } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">상품 관리</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {products.map((p) => (
          <div key={p.id}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-soil-700">{p.name}</p>
              <p className="text-xs text-charcoal-400">현재가 {formatKRW(p.price)}</p>
            </div>
            <ProductEditForm product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
