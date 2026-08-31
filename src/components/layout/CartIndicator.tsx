"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";

export function CartIndicator({ className }: { className?: string }) {
  const items = useCartStore((s) => s.items);
  const mounted = useHasMounted();
  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <Link href="/cart" aria-label={`장바구니, 담긴 상품 ${count}개`} className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 6h2l1.6 10.4A2 2 0 0 0 9.58 18h7.84a2 2 0 0 0 1.98-1.6L21 8H7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="21" r="1.4" />
        <circle cx="18" cy="21" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy-500 px-1 text-[10px] font-bold text-ivory-50">
          {count}
        </span>
      )}
    </Link>
  );
}
