import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";

const updateSchema = z.object({
  price: z.number().int().min(0).optional(),
  compareAt: z.number().int().min(0).nullable().optional(),
  stock: z.number().int().min(0).optional(),
  shippingFee: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });

  const product = await prisma.product.update({ where: { id }, data: parsed.data });

  if (parsed.data.price !== undefined && parsed.data.price !== existing.price) {
    await prisma.auditLog.create({
      data: {
        adminId: session.sub,
        action: "PRICE_CHANGE",
        target: `product:${id}`,
        detail: `${existing.name}: ${existing.price}원 → ${parsed.data.price}원`,
        requiresApproval: true,
        approved: false,
      },
    });
  }

  return NextResponse.json({ product });
}
