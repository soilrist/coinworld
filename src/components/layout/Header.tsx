"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartIndicator } from "./CartIndicator";
import { brand } from "@/content/facts";

const NAV = [
  { href: "/products", label: "상품" },
  { href: "/story", label: "브랜드 스토리" },
  { href: "/broadcast", label: "방송" },
  { href: "/certification", label: "인증" },
  { href: "/journal", label: "농장저널" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-soil-100 bg-ivory-50/95 backdrop-blur supports-[backdrop-filter]:bg-ivory-50/80">
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-soil-700 tracking-tight">
          {brand.name}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[15px] font-medium transition-colors hover:text-burgundy-600 ${
                pathname === item.href ? "text-burgundy-600" : "text-charcoal-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <Link href="/products" className="hidden md:inline-flex btn-primary !py-2.5 !px-5 !min-h-0 text-sm">
            고구마 주문하기
          </Link>
          <CartIndicator />
          <button
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex h-11 w-11 items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-soil-100 bg-ivory-50 px-5 py-4 animate-fadeUp">
          <ul className="flex flex-col divide-y divide-soil-100">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center text-[16px] font-medium text-charcoal-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/products" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
            고구마 주문하기
          </Link>
        </nav>
      )}
    </header>
  );
}
