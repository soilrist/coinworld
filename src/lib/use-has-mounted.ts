"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * 서버 렌더(및 최초 hydration)에서는 false, 클라이언트 hydration 완료 후 true를 반환한다.
 * localStorage 기반 zustand persist 스토어처럼 서버에 없는 상태를 읽기 전 대기할 때 사용.
 * (useEffect 안에서 setState하는 방식은 불필요한 추가 렌더를 유발해 지양한다.)
 */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
