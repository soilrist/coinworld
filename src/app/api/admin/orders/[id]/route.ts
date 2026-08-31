import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";

const updateSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
  trackingCarrier: z.string().max(50).optional(),
  trackingNumber: z.string().max(50).optional(),
  cancelReason: z.string().max(200).optional(),
});

const SENSITIVE_STATUSES = new Set(["CANCELLED", "RETURNED"]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });

  const existing = await prisma.unifiedOrder.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "SHIPPING") data.shippedAt = new Date();
  if (parsed.data.status === "DELIVERED") data.deliveredAt = new Date();
  if (parsed.data.status === "CANCELLED") data.cancelledAt = new Date();
  const isCancelLike = parsed.data.status === "RETURNED" || parsed.data.status === "CANCELLED";
  if (isCancelLike && existing.paymentStatus === "PAID") data.paymentStatus = "REFUNDED";

  const order = await prisma.unifiedOrder.update({ where: { id }, data });

  if (parsed.data.status && SENSITIVE_STATUSES.has(parsed.data.status) && existing.status !== parsed.data.status) {
    await prisma.auditLog.create({
      data: {
        adminId: session.sub,
        action: "ORDER_CANCEL_REFUND",
        target: `order:${id}`,
        detail: `${existing.status} → ${parsed.data.status}${parsed.data.cancelReason ? ` (사유: ${parsed.data.cancelReason})` : ""}`,
        requiresApproval: true,
        approved: false,
      },
    });
  }

  return NextResponse.json({ order });
}
