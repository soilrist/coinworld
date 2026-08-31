import { GrainFilterDefs } from "./GrainFilter";

/**
 * 무안 황토밭을 추상화한 등고선풍 레이어드 웨이브 아트.
 * 실제 항공사진이 없는 상태의 대체 비주얼 — 히어로/최종 CTA 전면 배경으로 사용.
 */
export function FieldWaves({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const stops =
    tone === "dark"
      ? { a: "#18110C", b: "#3D2C1F", c: "#4A3626", d: "#6B6B45", e: "#7A2A2E" }
      : { a: "#FAF6EE", b: "#F2EAD9", c: "#E8DBC0", d: "#C9AC8E", e: "#A9835F" };

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="무안 황토밭을 형상화한 등고선 그래픽"
    >
      <defs>
        <GrainFilterDefs />
        <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stops.a} />
          <stop offset="100%" stopColor={stops.b} />
        </linearGradient>
        <linearGradient id="fw-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={stops.c} />
          <stop offset="100%" stopColor={stops.d} />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#fw-sky)" />
      <path
        d="M0,560 C220,500 340,620 560,580 C780,540 860,460 1080,500 C1240,530 1340,480 1440,500 L1440,900 L0,900 Z"
        fill={stops.c}
        opacity="0.55"
      />
      <path
        d="M0,640 C200,600 380,700 620,660 C820,630 900,560 1120,610 C1260,640 1360,600 1440,620 L1440,900 L0,900 Z"
        fill={stops.d}
        opacity="0.6"
      />
      <path
        d="M0,740 C240,700 420,780 660,750 C860,725 960,680 1160,720 C1280,745 1360,715 1440,730 L1440,900 L0,900 Z"
        fill={stops.e}
        opacity="0.5"
      />
      <path
        d="M0,820 C260,800 460,850 700,830 C900,815 1000,795 1200,815 C1300,825 1380,810 1440,818 L1440,900 L0,900 Z"
        fill={stops.a}
        opacity="0.35"
      />
      <rect width="1440" height="900" filter="url(#grain)" opacity="0.5" />
    </svg>
  );
}
