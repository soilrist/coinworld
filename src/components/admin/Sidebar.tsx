"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/orders", label: "주문" },
  { href: "/admin/orders/phone", label: "전화주문" },
  { href: "/admin/products", label: "상품" },
  { href: "/admin/inventory", label: "재고" },
  { href: "/admin/customers", label: "고객" },
  { href: "/admin/inquiries", label: "문의" },
  { href: "/admin/analytics", label: "분석" },
  { href: "/admin/ai", label: "DAM-I AI" },
  { href: "/admin/security", label: "보안/로그" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-full flex-col gap-1 bg-soil-900 p-4 text-ivory-300">
      <p className="px-3 py-4 font-serif text-lg font-bold text-ivory-50">DAM-E FARM OS</p>
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`min-h-[44px] rounded-sm px-3 py-2.5 text-sm font-medium flex items-center ${
              active ? "bg-ivory-50/10 text-ivory-50" : "hover:bg-ivory-50/5"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
