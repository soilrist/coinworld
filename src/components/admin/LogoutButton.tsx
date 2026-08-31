"use client";

import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/csrf-client";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await adminFetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm font-medium text-charcoal-500 hover:text-burgundy-600"
    >
      로그아웃
    </button>
  );
}
