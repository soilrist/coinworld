import { prisma } from "@/lib/prisma";
import { paymentProvider } from "@/lib/payment/mock-provider";
import { OrderChannel, type Prisma } from "@prisma/client";

export interface CreateOrderInput {
  channel: OrderChannel;
  recipientName: string;
  recipientPhone: string;
  address: string;
  addressDetail?: string;
  deliveryMemo?: string;
  paymentMethod: "card" | "bank_transfer" | "naverpay" | "kakaopay";
  items: { productId: string; quantity: number }[];
}

export class OrderError extends Error {}

/**
 * 채널 무관 공통 주문 생성 로직 (자체몰 체크아웃 / 관리자 전화주문 공용).
 * 가격은 절대 클라이언트 입력을 신뢰하지 않고 DB 상품 가격을 서버에서 다시 조회해 계산한다.
 */
export async function createOrder(input: CreateOrderInput) {
  if (input.items.length === 0) throw new OrderError("주문할 상품이 없습니다.");

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let itemsAmount = 0;
  let shippingAmount = 0;
  const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

  for (const line of input.items) {
    const product = productMap.get(line.productId);
    if (!product) throw new OrderError("존재하지 않는 상품이 포함되어 있습니다.");
    if (!product.isPublished || product.isSoldOut || product.stock < line.quantity) {
      throw new OrderError(`${product.name}의 재고가 부족합니다.`);
    }
    itemsAmount += product.price * line.quantity;
    shippingAmount = product.shippingFee === 0 ? shippingAmount : Math.max(shippingAmount, product.shippingFee);
    orderItemsData.push({
      productId: product.id,
      nameSnapshot: product.name,
      weightLabelSnapshot: product.weightLabel,
      unitPrice: product.price,
      quantity: line.quantity,
    });
  }
  if (products.some((p) => p.shippingFee === 0)) shippingAmount = 0;

  const totalAmount = itemsAmount + shippingAmount;

  const customer = await prisma.customer.upsert({
    where: { phone: input.recipientPhone },
    update: { name: input.recipientName, address: input.address },
    create: { name: input.recipientName, phone: input.recipientPhone, address: input.address },
  });

  const order = await prisma.unifiedOrder.create({
    data: {
      channel: input.channel,
      customerId: customer.id,
      recipientName: input.recipientName,
      recipientPhone: input.recipientPhone,
      address: input.address,
      addressDetail: input.addressDetail,
      deliveryMemo: input.deliveryMemo,
      itemsAmount,
      shippingAmount,
      totalAmount,
      paymentMethod: input.paymentMethod,
      paymentProvider: paymentProvider.name,
      items: { createMany: { data: orderItemsData } },
    },
    include: { items: true },
  });

  try {
    const result = await paymentProvider.charge({
      orderId: order.id,
      amount: totalAmount,
      method: input.paymentMethod,
      customerName: input.recipientName,
    });

    await prisma.$transaction([
      prisma.unifiedOrder.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", status: "PAID" },
      }),
      ...input.items.map((line) =>
        prisma.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        })
      ),
      ...input.items.map((line) =>
        prisma.inventoryLog.create({
          data: { productId: line.productId, change: -line.quantity, reason: "판매", memo: `주문 ${order.id}` },
        })
      ),
    ]);

    return { order, payment: result };
  } catch (err) {
    await prisma.unifiedOrder.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    throw err;
  }
}
