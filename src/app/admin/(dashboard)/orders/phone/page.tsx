import { PhoneOrderForm } from "@/components/admin/PhoneOrderForm";
import { getPublishedProducts } from "@/lib/products";

export default async function PhoneOrderPage() {
  const products = await getPublishedProducts();
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">전화주문 등록</h1>
      <p className="mt-1 text-sm text-charcoal-500">전화번호를 조회하면 기존 고객의 이름, 주소, 과거 주문이 표시됩니다.</p>
      <div className="mt-6">
        <PhoneOrderForm products={products} />
      </div>
    </div>
  );
}
