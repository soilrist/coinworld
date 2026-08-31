import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
  trackingCarrier: z.string().max(50).optional(),
  trackingNumber: z.string().max(50).optional(),
  cancelReason: z.string().max(200).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "SHIPPING") data.shippedAt = new Date();
  if (parsed.data.status === "DELIVERED") data.deliveredAt = new Date();
  if (parsed.data.status === "CANCELLED") data.cancelledAt = new Date();

  const order = await prisma.unifiedOrder.update({ where: { id }, data });
  return NextResponse.json({ order });
}
