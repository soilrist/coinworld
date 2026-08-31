import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { createOrder, OrderError } from "@/lib/orders";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "checkout", 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }, { status: 400 });
  }

  try {
    const { order } = await createOrder({ channel: "WEB", ...parsed.data });
    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[checkout] unexpected error", err);
    return NextResponse.json({ error: "결제 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
