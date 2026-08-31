import { prisma } from "@/lib/prisma";

export async function getCustomersWithStats() {
  const customers = await prisma.customer.findMany({
    include: { orders: { where: { paymentStatus: "PAID" }, orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return customers.map((c) => {
    const totalSpent = c.orders.reduce((s, o) => s + o.totalAmount, 0);
    const orderCount = c.orders.length;
    const lastOrderAt = c.orders[0]?.createdAt ?? null;

    let avgCycleDays: number | null = null;
    if (c.orders.length >= 2) {
      const dates = c.orders.map((o) => o.createdAt.getTime()).sort((a, b) => a - b);
      const gaps = dates.slice(1).map((d, i) => (d - dates[i]!) / (1000 * 60 * 60 * 24));
      avgCycleDays = Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length);
    }

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      totalSpent,
      orderCount,
      lastOrderAt,
      avgCycleDays,
    };
  });
}
