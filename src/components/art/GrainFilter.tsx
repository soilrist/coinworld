/** 전역에서 재사용하는 필름 그레인 필터 정의. 각 SVG 아트에서 filter="url(#grain)"로 참조한다. */
export function GrainFilterDefs() {
  return (
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" />
    </filter>
  );
}
