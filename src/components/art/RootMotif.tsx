/** 고구마 뿌리·줄기를 한 획으로 그린 보태니컬 라인아트. 브랜드 전반의 장식 모티프. */
export function RootMotif({ className, stroke = "#4A3626" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 240 320" fill="none" className={className} role="presentation" aria-hidden="true">
      <path
        d="M120 20 C 150 55, 140 80, 120 100 C 160 110, 190 140, 185 175"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M120 100 C 100 120, 60 130, 55 165 C 50 195, 70 215, 65 245"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="120" cy="185" rx="46" ry="68" stroke={stroke} strokeWidth="2.5" />
      <path d="M92 150 C 100 175, 100 200, 90 222" stroke={stroke} strokeWidth="1.4" opacity="0.6" />
      <path d="M148 155 C 142 180, 144 205, 152 224" stroke={stroke} strokeWidth="1.4" opacity="0.6" />
      <path
        d="M185 175 C 210 178, 222 195, 218 215 C 214 232, 196 236, 190 250"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M65 245 C 60 262, 44 268, 40 285"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <ellipse cx="128" cy="34" rx="18" ry="12" stroke={stroke} strokeWidth="1.6" transform="rotate(18 128 34)" />
      <ellipse cx="150" cy="20" rx="14" ry="9" stroke={stroke} strokeWidth="1.4" transform="rotate(-10 150 20)" opacity="0.8" />
    </svg>
  );
}
