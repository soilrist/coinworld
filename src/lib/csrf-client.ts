"use client";

import { CSRF_COOKIE, CSRF_HEADER } from "@/lib/csrf";

function readCsrfToken(): string {
  const match = document.cookie.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`));
  return match?.[1] ?? "";
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if ((init.method ?? "GET").toUpperCase() !== "GET") {
    headers.set(CSRF_HEADER, readCsrfToken());
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
