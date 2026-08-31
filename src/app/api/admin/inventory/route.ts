import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const adjustSchema = z.object({
  productId: z.string().min(1),
  change: z.number().int().refine((n) => n !== 0, "변동 수량을 입력해주세요."),
  reason: z.enum(["입고", "조정", "반품"]),
  memo: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = adjustSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }, { status: 400 });
  }
  const { productId, change, reason, memo } = parsed.data;

  const [, log] = await prisma.$transaction([
    prisma.product.update({ where: { id: productId }, data: { stock: { increment: change } } }),
    prisma.inventoryLog.create({ data: { productId, change, reason, memo } }),
  ]);

  return NextResponse.json({ log });
}
