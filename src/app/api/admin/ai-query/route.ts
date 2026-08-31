import { NextResponse } from "next/server";
import { answerQuery } from "@/lib/ai/query";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "ai-query", 30, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "요청이 너무 많습니다." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question : "";
  if (!question.trim()) return NextResponse.json({ error: "질문을 입력해주세요." }, { status: 400 });

  const answer = await answerQuery(question);
  return NextResponse.json({ answer });
}
