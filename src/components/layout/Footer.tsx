"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, customerService } from "@/content/facts";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-soil-800 text-ivory-300">
      <div className="container-page py-14 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl font-bold text-ivory-50">{brand.name}</p>
          <p className="mt-3 text-sm leading-relaxed max-w-sm text-ivory-400">
            {brand.address} · 대표 {brand.founder}
            <br />
            무안 황토밭에서 유기농으로 키운 고구마를 산지에서 바로 보내드립니다.
          </p>
          <p className="mt-4 text-xs text-ivory-400">
            <span className="font-semibold text-ivory-100">고객센터 상담시간</span> {customerService.hours}
            {customerService.phone && <> · {customerService.phone}</>}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-ivory-100 uppercase mb-4">Shop</p>
          <ul className="space-y-2.5 text-sm text-ivory-400">
            <li><Link href="/products" className="hover:text-ivory-100">전체 상품</Link></li>
            <li><Link href="/cart" className="hover:text-ivory-100">장바구니</Link></li>
            <li><Link href="/faq" className="hover:text-ivory-100">배송/교환/환불</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-ivory-100 uppercase mb-4">Farm</p>
          <ul className="space-y-2.5 text-sm text-ivory-400">
            <li><Link href="/story" className="hover:text-ivory-100">브랜드 스토리</Link></li>
            <li><Link href="/broadcast" className="hover:text-ivory-100">방송</Link></li>
            <li><Link href="/certification" className="hover:text-ivory-100">인증/수상</Link></li>
            <li><Link href="/journal" className="hover:text-ivory-100">농장저널</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-soil-700">
        <div className="container-page py-6 flex flex-col md:flex-row gap-2 justify-between text-xs text-ivory-400">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p>사업자 정보 및 통신판매업 신고번호는 회사 소개 페이지에서 확인하실 수 있습니다.</p>
        </div>
      </div>
    </footer>
  );
}
