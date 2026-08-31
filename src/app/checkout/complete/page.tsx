import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatKRW, formatDate } from "@/lib/format";

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await prisma.unifiedOrder.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="container-page py-20 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-100 text-olive-700">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-serif text-2xl font-semibold text-soil-700 md:text-3xl">주문이 완료되었습니다</h1>
        <p className="mt-2 text-sm text-charcoal-500">주문번호 {order.id}</p>
      </div>

      <div className="mx-auto mt-10 max-w-xl rounded-sm border border-soil-100 bg-ivory-50 p-6">
        <ul className="space-y-2 text-sm text-charcoal-500">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.nameSnapshot} ({item.weightLabelSnapshot}) x{item.quantity}</span>
              <span>{formatKRW(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-soil-100 pt-4">
          <span className="font-semibold text-soil-700">총 결제금액</span>
          <span className="font-serif text-xl font-bold text-soil-700">{formatKRW(order.totalAmount)}</span>
        </div>
        <dl className="mt-4 space-y-1 text-xs text-charcoal-400">
          <div className="flex justify-between"><dt>주문일시</dt><dd>{formatDate(order.createdAt)}</dd></div>
          <div className="flex justify-between"><dt>받는 분</dt><dd>{order.recipientName}</dd></div>
          <div className="flex justify-between"><dt>배송지</dt><dd className="text-right">{order.address}</dd></div>
        </dl>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <Link href="/products" className="btn-outline flex-1">쇼핑 계속하기</Link>
        <Link href="/" className="btn-primary flex-1">홈으로</Link>
      </div>
    </div>
  );
}
