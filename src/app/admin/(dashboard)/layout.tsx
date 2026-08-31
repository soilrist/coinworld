import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = { title: "DAM-E FARM OS", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-ivory-100 md:grid-cols-[240px,1fr]">
      <aside className="hidden md:block">
        <Sidebar />
      </aside>
      <div className="flex min-h-dvh flex-col">
        <header className="flex h-16 items-center justify-between border-b border-soil-100 bg-ivory-50 px-6">
          <p className="text-sm text-charcoal-500">{session.email}</p>
          <LogoutButton />
        </header>
        <div className="border-b border-soil-100 bg-ivory-50 px-4 py-2 md:hidden">
          <p className="text-xs text-charcoal-400">관리자 화면은 데스크톱 환경에 최적화되어 있습니다.</p>
        </div>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
