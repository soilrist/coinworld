import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { generateTotpSecret, totpKeyUri, verifyTotpCode } from "@/lib/totp";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import { COOKIES, sessionCookieOptions, signSessionToken } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });

  if (admin.totpEnabled) {
    return NextResponse.json({ alreadyEnabled: true });
  }

  const secret = admin.totpSecret ?? generateTotpSecret();
  if (!admin.totpSecret) {
    await prisma.adminUser.update({ where: { id: admin.id }, data: { totpSecret: secret } });
  }

  const otpauth = totpKeyUri(admin.email, secret);
  const qrDataUrl = await QRCode.toDataURL(otpauth);

  return NextResponse.json({ qrDataUrl, secret });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!code) return NextResponse.json({ error: "인증코드를 입력해주세요." }, { status: 400 });

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin?.totpSecret) return NextResponse.json({ error: "2FA 설정을 먼저 시작해주세요." }, { status: 400 });

  const valid = await verifyTotpCode(code, admin.totpSecret);
  if (!valid) return NextResponse.json({ error: "인증코드가 올바르지 않습니다." }, { status: 401 });

  await prisma.adminUser.update({ where: { id: admin.id }, data: { totpEnabled: true } });

  const sessionToken = await signSessionToken({ sub: admin.id, email: admin.email, role: admin.role, totpEnabled: true });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIES.SESSION, sessionToken, sessionCookieOptions);
  return res;
}
