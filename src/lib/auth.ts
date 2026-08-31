import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "damifarm_admin_session";
const PENDING_COOKIE = "damifarm_admin_pending";

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET 환경변수가 설정되지 않았거나 너무 짧습니다.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface PendingPayload {
  sub: string;
  email: string;
  [key: string]: unknown;
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function signPendingToken(payload: PendingPayload) {
  return new SignJWT({ ...payload, purpose: "2fa-pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secretKey());
}

export async function verifyPendingToken(token: string): Promise<PendingPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "2fa-pending") return null;
    return payload as unknown as PendingPayload;
  } catch {
    return null;
  }
}

export const COOKIES = { SESSION: SESSION_COOKIE, PENDING: PENDING_COOKIE } as const;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 12,
};

export const pendingCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 5,
};
