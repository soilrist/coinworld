import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "inquiry", 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }, { status: 400 });
  }

  await prisma.inquiry.create({ data: { channel: "WEB", ...parsed.data } });
  return NextResponse.json({ ok: true });
}
