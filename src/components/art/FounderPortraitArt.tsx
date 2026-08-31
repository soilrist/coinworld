import { GrainFilterDefs } from "./GrainFilter";

/**
 * 대표 강여상의 실제 촬영 사진이 아직 없는 상태를 위한 에디토리얼 플레이스홀더.
 * 실물 인물 사진처럼 보이도록 가장하지 않고, 의도적으로 타이포그래픽/추상 초상 프레임으로 디자인한다.
 * → docs/SHOT_LIST.md 항목 1(대표 인물 사진) 촬영 후 교체 필요.
 */
export function FounderPortraitArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 600" className={className} role="img" aria-label="담이농장 대표 강여상 초상 플레이스홀더">
      <defs>
        <GrainFilterDefs />
        <linearGradient id="fp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3D2C1F" />
          <stop offset="100%" stopColor="#18110C" />
        </linearGradient>
      </defs>
      <rect width="480" height="600" fill="url(#fp-bg)" />
      <circle cx="240" cy="240" r="150" fill="none" stroke="#C9AC8E" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="240" cy="240" r="118" fill="none" stroke="#C9AC8E" strokeOpacity="0.25" strokeWidth="1" />
      <text
        x="240"
        y="290"
        textAnchor="middle"
        fill="#E8DBC0"
        fontSize="180"
        fontFamily="serif"
        fontWeight="600"
      >
        姜
      </text>
      <text x="240" y="470" textAnchor="middle" fill="#F2EAD9" fontSize="26" fontFamily="serif" letterSpacing="4">
        강여상
      </text>
      <text x="240" y="504" textAnchor="middle" fill="#C9AC8E" fontSize="13" letterSpacing="3">
        DAMI FARM · 대표
      </text>
      <rect width="480" height="600" filter="url(#grain)" opacity="0.4" />
    </svg>
  );
}
