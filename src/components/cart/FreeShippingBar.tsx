import { formatKRW } from "@/lib/format";

export function FreeShippingBar({ remaining, threshold }: { remaining: number; threshold: number }) {
  const progress = Math.min(100, Math.round(((threshold - remaining) / threshold) * 100));
  return (
    <div className="rounded-sm border border-soil-100 bg-ivory-100 p-4">
      <p className="text-sm font-medium text-soil-700">
        {remaining > 0 ? (
          <>{formatKRW(remaining)} 더 담으면 무료배송!</>
        ) : (
          <>무료배송 조건을 충족했습니다.</>
        )}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ivory-300">
        <div className="h-full rounded-full bg-burgundy-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
