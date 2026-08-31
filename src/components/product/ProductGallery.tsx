"use client";

import { useState } from "react";
import { ProductLabelArt } from "@/components/art/ProductLabelArt";
import { RootMotif } from "@/components/art/RootMotif";
import { CertBadgeArt } from "@/components/art/CertBadgeArt";

interface Props {
  weightLabel: string;
  variety: string;
}

export function ProductGallery({ weightLabel, variety }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const slides = [
    { key: "label", node: <ProductLabelArt weightLabel={weightLabel} variety={variety} className="h-full w-full" /> },
    {
      key: "detail",
      node: (
        <div className="flex h-full w-full items-center justify-center bg-ivory-200">
          <RootMotif className="h-2/3 w-2/3" stroke="#4A3626" />
        </div>
      ),
    },
    { key: "badge", node: <CertBadgeArt className="h-full w-full" /> },
  ];

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoom(true)}
        className="relative block aspect-square w-full overflow-hidden rounded-sm bg-ivory-200"
        aria-label="이미지 확대 보기"
      >
        {slides[active]?.node}
        <span className="absolute bottom-3 right-3 rounded-full bg-charcoal-900/60 px-3 py-1 text-xs text-ivory-50">
          확대보기
        </span>
      </button>

      <div
        className="mt-3 flex gap-2 overflow-x-auto pb-1"
        onTouchStart={(e) => {
          const startX = e.touches[0]?.clientX ?? 0;
          const handler = (ev: TouchEvent) => {
            const endX = ev.changedTouches[0]?.clientX ?? 0;
            if (startX - endX > 40) setActive((a) => Math.min(a + 1, slides.length - 1));
            if (endX - startX > 40) setActive((a) => Math.max(a - 1, 0));
            document.removeEventListener("touchend", handler);
          };
          document.addEventListener("touchend", handler, { once: true });
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            aria-label={`${i + 1}번째 이미지 보기`}
            aria-current={active === i}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 ${
              active === i ? "border-burgundy-500" : "border-transparent"
            }`}
          >
            {s.node}
          </button>
        ))}
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal-900/90 p-6"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label="이미지 확대 보기 닫기"
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-sm">{slides[active]?.node}</div>
        </div>
      )}
    </div>
  );
}
