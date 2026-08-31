import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const answerSchema = z.object({ answer: z.string().trim().min(1).max(2000) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "답변 내용을 입력해주세요." }, { status: 400 });

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: { answer: parsed.data.answer, status: "ANSWERED", answeredAt: new Date() },
  });
  return NextResponse.json({ inquiry });
}
