import { GrainFilterDefs } from "./GrainFilter";

/**
 * 실제 측량 지도가 아닌, 무안의 재배 환경 4요소(황토·해풍·일조량·배수)를 보여주는
 * 에디토리얼 인포그래픽 다이어그램. 정확한 지리 정보 전달용이 아님을 명시.
 */
export function TerroirDiagram({ className }: { className?: string }) {
  const points = [
    { x: 160, y: 150, label: "황토" },
    { x: 380, y: 120, label: "해풍" },
    { x: 300, y: 300, label: "일조량" },
    { x: 120, y: 330, label: "배수" },
  ];

  return (
    <svg viewBox="0 0 480 420" className={className} role="img" aria-label="무안 재배 환경 개념도 (황토, 해풍, 일조량, 배수)">
      <defs>
        <GrainFilterDefs />
        <radialGradient id="td-bg" cx="30%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F2EAD9" />
          <stop offset="100%" stopColor="#DCC9A3" />
        </radialGradient>
      </defs>
      <rect width="480" height="420" fill="url(#td-bg)" />
      <path
        d="M40 250 C90 210 140 260 190 230 C250 195 270 150 330 140 C380 132 410 160 450 150"
        fill="none"
        stroke="#4A3626"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="2 6"
      />
      <path
        d="M20 320 C100 300 160 340 230 310 C300 280 340 320 420 300"
        fill="none"
        stroke="#6B6B45"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="2 6"
      />
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="7" fill="#7A2A2E" />
          <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#7A2A2E" strokeOpacity="0.4" />
          <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#3D2C1F" fontSize="16" fontWeight="700" fontFamily="serif">
            {p.label}
          </text>
        </g>
      ))}
      <text x="240" y="400" textAnchor="middle" fill="#7C5C3E" fontSize="11" letterSpacing="2">
        MUAN GROWING CONDITIONS — 개념도
      </text>
      <rect width="480" height="420" filter="url(#grain)" opacity="0.3" />
    </svg>
  );
}
