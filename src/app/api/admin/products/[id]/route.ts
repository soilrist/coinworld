import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  price: z.number().int().min(0).optional(),
  compareAt: z.number().int().min(0).nullable().optional(),
  stock: z.number().int().min(0).optional(),
  shippingFee: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });

  const product = await prisma.product.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ product });
}
