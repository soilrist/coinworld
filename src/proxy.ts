import { NextResponse, type NextRequest } from "next/server";
import { COOKIES, verifySessionToken } from "@/lib/auth";
import { verifyCsrf, CSRF_COOKIE, generateCsrfToken } from "@/lib/csrf";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const PUBLIC_ADMIN_API = ["/api/admin/login", "/api/admin/verify-2fa"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- /admin/* 페이지 보호 ----
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get(COOKIES.SESSION)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (session.totpEnabled !== true && pathname !== "/admin/setup-2fa") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/setup-2fa";
      return NextResponse.redirect(url);
    }
  }

  // ---- /api/admin/* 뮤테이션 보호 (세션 + CSRF) ----
  if (pathname.startsWith("/api/admin") && !PUBLIC_ADMIN_API.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get(COOKIES.SESSION)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !verifyCsrf(req)) {
      return NextResponse.json({ error: "CSRF 토큰이 유효하지 않습니다." }, { status: 403 });
    }
  }

  const res = NextResponse.next();

  // /admin 페이지 진입 시 CSRF 쿠키가 없다면 발급 (클라이언트 fetch에서 헤더로 되돌려 보냄)
  if (pathname.startsWith("/admin") && !req.cookies.get(CSRF_COOKIE)?.value) {
    res.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
