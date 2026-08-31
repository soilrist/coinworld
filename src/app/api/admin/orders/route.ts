import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { createOrder, OrderError } from "@/lib/orders";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }, { status: 400 });
  }

  try {
    const { order } = await createOrder({ channel: "PHONE", ...parsed.data });
    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[admin/orders] unexpected error", err);
    return NextResponse.json({ error: "주문 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
