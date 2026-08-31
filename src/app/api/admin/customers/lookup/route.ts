import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone")?.trim();
  if (!phone) return NextResponse.json({ error: "전화번호를 입력해주세요." }, { status: 400 });

  const customer = await prisma.customer.findUnique({
    where: { phone },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      },
    },
  });

  return NextResponse.json({ customer });
}
