import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIES, verifySessionToken } from "@/lib/auth";

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIES.SESSION)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
