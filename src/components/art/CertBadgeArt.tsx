import { GrainFilterDefs } from "./GrainFilter";

/** 인증 정보 갤러리 슬라이드. viewBox 기반이라 썸네일(64px)에서도 큰 이미지와 동일하게 정렬된다. */
export function CertBadgeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="유기농산물 인증 제15100525호, 무안">
      <defs>
        <GrainFilterDefs />
        <linearGradient id="cba-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3D2C1F" />
          <stop offset="100%" stopColor="#18110C" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#cba-bg)" />
      <circle cx="200" cy="170" r="80" fill="none" stroke="#C9AC8E" strokeWidth="2" opacity="0.6" />
      <circle cx="200" cy="170" r="64" fill="none" stroke="#C9AC8E" strokeWidth="1.4" opacity="0.4" />
      <text x="200" y="162" textAnchor="middle" fill="#F2EAD9" fontSize="34" fontWeight="700" fontFamily="serif">
        유기농
      </text>
      <text x="200" y="196" textAnchor="middle" fill="#F2EAD9" fontSize="30" fontWeight="700" fontFamily="serif">
        인증
      </text>
      <text x="200" y="290" textAnchor="middle" fill="#E8DBC0" fontSize="20" fontWeight="600">
        제 15100525호
      </text>
      <text x="200" y="320" textAnchor="middle" fill="#C9AC8E" fontSize="15" letterSpacing="1">
        무안 · 담이농장
      </text>
      <rect width="400" height="400" filter="url(#grain)" opacity="0.35" />
    </svg>
  );
}
