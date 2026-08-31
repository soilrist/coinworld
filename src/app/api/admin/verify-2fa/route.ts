import { NextResponse } from "next/server";
import { verifyTotpCode } from "@/lib/totp";
import { prisma } from "@/lib/prisma";
import { COOKIES, sessionCookieOptions, signSessionToken, verifyPendingToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "admin-2fa", 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "시도가 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ error: "인증코드를 입력해주세요." }, { status: 400 });

  const pendingToken = req.headers
    .get("cookie")
    ?.match(new RegExp(`${COOKIES.PENDING}=([^;]+)`))?.[1];
  const pending = pendingToken ? await verifyPendingToken(pendingToken) : null;
  if (!pending) return NextResponse.json({ error: "인증 세션이 만료되었습니다. 다시 로그인해주세요." }, { status: 401 });

  const admin = await prisma.adminUser.findUnique({ where: { id: pending.sub } });
  if (!admin?.totpSecret) return NextResponse.json({ error: "2FA가 설정되지 않았습니다." }, { status: 400 });

  const valid = await verifyTotpCode(code, admin.totpSecret);
  if (!valid) {
    await prisma.loginLog.create({
      data: { adminId: admin.id, email: admin.email, success: false, reason: "2FA 코드 불일치" },
    });
    return NextResponse.json({ error: "인증코드가 올바르지 않습니다." }, { status: 401 });
  }

  const sessionToken = await signSessionToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
    totpEnabled: true,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIES.SESSION, sessionToken, sessionCookieOptions);
  res.cookies.delete(COOKIES.PENDING);
  return res;
}
