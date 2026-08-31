import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { formatKRW, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, CHANNEL_LABEL } from "@/lib/order-labels";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.unifiedOrder.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
  if (!order) notFound();

  const pastOrders = await prisma.unifiedOrder.count({ where: { customerId: order.customerId, NOT: { id: order.id } } });

  return (
    <div>
      <nav className="mb-4 text-sm text-charcoal-400">
        <Link href="/admin/orders" className="hover:text-burgundy-600">주문 관리</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal-600">{order.id}</span>
      </nav>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">주문 상세</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
        <div className="space-y-6">
          <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
            <p className="text-xs font-semibold tracking-widest text-charcoal-400">
              {CHANNEL_LABEL[order.channel]} · {formatDate(order.createdAt)}
            </p>
            <ul className="mt-4 divide-y divide-soil-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-2.5 text-sm">
                  <span>{item.nameSnapshot} ({item.weightLabelSnapshot}) x{item.quantity}</span>
                  <span>{formatKRW(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-soil-100 pt-3 text-sm">
              <span className="text-charcoal-500">배송비</span>
              <span>{order.shippingAmount === 0 ? "무료" : formatKRW(order.shippingAmount)}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold text-soil-700">
              <span>총 결제금액</span>
              <span>{formatKRW(order.totalAmount)}</span>
            </div>
          </div>

          <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
            <p className="font-semibold text-soil-700">배송 정보</p>
            <dl className="mt-3 space-y-1.5 text-sm text-charcoal-600">
              <div className="flex justify-between"><dt className="text-charcoal-400">받는 분</dt><dd>{order.recipientName} · {order.recipientPhone}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">주소</dt><dd className="text-right">{order.address} {order.addressDetail}</dd></div>
              {order.deliveryMemo && <div className="flex justify-between"><dt className="text-charcoal-400">배송 메모</dt><dd>{order.deliveryMemo}</dd></div>}
            </dl>
          </div>

          <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
            <p className="font-semibold text-soil-700">고객 정보</p>
            <dl className="mt-3 space-y-1.5 text-sm text-charcoal-600">
              <div className="flex justify-between"><dt className="text-charcoal-400">결제 상태</dt><dd>{PAYMENT_STATUS_LABEL[order.paymentStatus]} ({order.paymentMethod})</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-400">이전 주문 횟수</dt><dd>{pastOrders}건</dd></div>
            </dl>
          </div>
        </div>

        <div>
          <OrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            trackingCarrier={order.trackingCarrier}
            trackingNumber={order.trackingNumber}
          />
          <p className="mt-3 text-center text-xs text-charcoal-400">
            현재 상태: <strong>{ORDER_STATUS_LABEL[order.status]}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
