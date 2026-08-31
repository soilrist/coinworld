import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validation";
import { signSessionToken, signPendingToken, sessionCookieOptions, pendingCookieOptions, COOKIES } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const LOCK_THRESHOLD = 5;
const LOCK_MINUTES = 15;

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "admin-login", 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "이메일과 비밀번호를 확인해주세요." }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  const fail = async (reason: string) => {
    await prisma.loginLog.create({ data: { adminId: admin?.id, email, ip, userAgent, success: false, reason } });
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  };

  if (!admin) return fail("존재하지 않는 계정");

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return fail("계정 잠금 상태");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    const failedCount = admin.failedLoginCount + 1;
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        failedLoginCount: failedCount,
        lockedUntil: failedCount >= LOCK_THRESHOLD ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
      },
    });
    return fail("비밀번호 불일치");
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date(), lastLoginIp: ip },
  });
  await prisma.loginLog.create({ data: { adminId: admin.id, email, ip, userAgent, success: true } });

  const res = NextResponse.json({ requires2FA: admin.totpEnabled });

  if (admin.totpEnabled) {
    const pendingToken = await signPendingToken({ sub: admin.id, email: admin.email });
    res.cookies.set(COOKIES.PENDING, pendingToken, pendingCookieOptions);
  } else {
    const sessionToken = await signSessionToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      totpEnabled: admin.totpEnabled,
    });
    res.cookies.set(COOKIES.SESSION, sessionToken, sessionCookieOptions);
  }

  return res;
}
