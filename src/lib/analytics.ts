import { prisma } from "@/lib/prisma";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getDashboardStats() {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [todayOrders, yesterdayOrders, preparing, shipping, cancelled, openInquiries, allProducts] = await Promise.all([
    prisma.unifiedOrder.findMany({ where: { createdAt: { gte: today }, paymentStatus: "PAID" } }),
    prisma.unifiedOrder.findMany({ where: { createdAt: { gte: yesterday, lt: today }, paymentStatus: "PAID" } }),
    prisma.unifiedOrder.count({ where: { status: "PAID" } }),
    prisma.unifiedOrder.count({ where: { status: "SHIPPING" } }),
    prisma.unifiedOrder.count({ where: { status: "CANCELLED" } }),
    prisma.inquiry.count({ where: { status: "OPEN" } }),
    prisma.product.findMany(),
  ]);
  const lowStockProducts = allProducts.filter((p) => p.stock <= p.lowStockAt);

  const todayRevenue = todayOrders.reduce((s, o) => s + o.totalAmount, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + o.totalAmount, 0);

  return {
    todayRevenue,
    yesterdayRevenue,
    todayOrderCount: todayOrders.length,
    preparingCount: preparing,
    shippingCount: shipping,
    cancelledCount: cancelled,
    openInquiries,
    lowStockProducts,
  };
}

export async function getRecentOrders(take = 8) {
  return prisma.unifiedOrder.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { items: true },
  });
}

export async function getSalesByProduct(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: since }, paymentStatus: "PAID" } },
    include: { product: true },
  });
  const map = new Map<string, { name: string; qty: number; amount: number }>();
  for (const item of items) {
    const key = item.productId;
    const prev = map.get(key) ?? { name: item.nameSnapshot, qty: 0, amount: 0 };
    prev.qty += item.quantity;
    prev.amount += item.unitPrice * item.quantity;
    map.set(key, prev);
  }
  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

export async function getDailyRevenue(days = 14) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);
  const orders = await prisma.unifiedOrder.findMany({
    where: { createdAt: { gte: since }, paymentStatus: "PAID" },
    select: { createdAt: true, totalAmount: true },
  });
  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + o.totalAmount);
  }
  return Array.from(buckets.entries()).map(([date, amount]) => ({ date, amount }));
}
