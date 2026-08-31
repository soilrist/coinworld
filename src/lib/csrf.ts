export const CSRF_COOKIE = "damifarm_csrf";
export const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

export function verifyCsrf(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookieMatch = cookieHeader.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`));
  const cookieToken = cookieMatch?.[1];
  const headerToken = req.headers.get(CSRF_HEADER);
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}
