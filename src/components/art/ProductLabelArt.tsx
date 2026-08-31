import { GrainFilterDefs } from "./GrainFilter";

const VARIANTS = {
  "3kg": { fill: "#E8DBC0", accent: "#7A2A2E", ring: 44 },
  "5kg": { fill: "#DCC9A3", accent: "#4A3626", ring: 58 },
  "10kg": { fill: "#C9AC8E", accent: "#6B6B45", ring: 72 },
  default: { fill: "#E8DBC0", accent: "#4A3626", ring: 50 },
} as const;

/**
 * 실사 상품 사진이 없는 상태의 대체 비주얼.
 * 크래프트지 라벨 일러스트 형태로, 프리미엄 식품 패키지 디자인처럼 보이도록 구성한다.
 * (빈 박스/"IMAGE" placeholder 대신 의도적으로 디자인된 대체 그래픽)
 */
export function ProductLabelArt({
  weightLabel,
  variety,
  className,
}: {
  weightLabel: string;
  variety: string;
  className?: string;
}) {
  const v = VARIANTS[weightLabel as keyof typeof VARIANTS] ?? VARIANTS.default;

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${variety} ${weightLabel} 패키지 아트`}>
      <defs>
        <GrainFilterDefs />
        <radialGradient id={`plg-${weightLabel}`} cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#FAF6EE" />
          <stop offset="100%" stopColor={v.fill} />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#plg-${weightLabel})`} />
      <rect x="16" y="16" width="368" height="368" fill="none" stroke={v.accent} strokeOpacity="0.35" strokeWidth="1.5" />

      {/* 뿌리 라인아트 */}
      <g transform="translate(140,90) scale(0.62)" opacity="0.9">
        <path d="M120 20 C150 55 140 80 120 100 C160 110 190 140 185 175" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M120 100 C100 120 60 130 55 165 C50 195 70 215 65 245" stroke={v.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="185" rx="50" ry="72" fill={v.accent} fillOpacity="0.08" stroke={v.accent} strokeWidth="3.4" />
      </g>

      {/* 중량 원형 배지 */}
      <circle cx="300" cy="300" r={v.ring} fill={v.accent} />
      <text x="300" y="296" textAnchor="middle" fill="#FAF6EE" fontSize="30" fontWeight="700" fontFamily="serif">
        {weightLabel}
      </text>
      <text x="300" y="318" textAnchor="middle" fill="#FAF6EE" fontSize="11" letterSpacing="1">
        DAMI FARM
      </text>

      <text x="36" y="368" fill={v.accent} fontSize="14" fontWeight="600" letterSpacing="0.5">
        {variety}
      </text>
      <text x="36" y="46" fill={v.accent} fontSize="11" letterSpacing="3" opacity="0.75">
        무안 · MUAN
      </text>

      <rect width="400" height="400" filter="url(#grain)" opacity="0.35" />
    </svg>
  );
}
