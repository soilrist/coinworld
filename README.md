# 담이농장 — 프리미엄 커머스 & 통합 운영 시스템

전라남도 무안 담이농장(대표 강여상)의 브랜드 쇼핑몰 + 관리자 운영 시스템(DAM-E FARM OS).

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion (설치됨, 각 섹션에서 점진적 적용 가능)
- **DB/ORM**: Prisma + SQLite(개발) — 운영 전환 시 PostgreSQL로 교체 가능
- **Auth**: 자체 JWT 세션(httpOnly 쿠키) + TOTP 2FA (otplib)
- **State**: Zustand (장바구니, localStorage 영속)
- **Validation**: Zod

## 시작하기

```bash
npm install
cp .env.example .env   # SESSION_SECRET 등 값 채우기
npm run db:push        # SQLite DB 생성 + 스키마 반영
npm run db:seed        # 상품/저널/관리자 계정 시드
npm run dev            # http://localhost:3000
```

관리자 화면: `http://localhost:3000/admin/login`
(seed 실행 시 콘솔에 출력되는 이메일/비밀번호로 최초 로그인 → 최초 1회 2FA 설정 필수)

## 폴더 구조

```
src/
  app/                고객 화면 + 관리자 화면 (App Router)
    admin/(dashboard)/  인증 필요한 관리자 페이지 (로그인/2FA 설정 페이지는 그룹 밖에 위치)
    api/                Route Handlers (체크아웃, 관리자 API 등)
  components/
    home/ product/ cart/ layout/ ui/ admin/  화면별 컴포넌트
    art/                실사 이미지 대체용 SVG 아트 컴포넌트 (아래 "이미지" 참고)
  content/              브랜드 카피/상품/FAQ/저널 시드 데이터 (docs/CONTENT.md과 1:1 대응)
  lib/                  인증, 결제 추상화, 네이버 연동 추상화, 레이트리밋, DB 쿼리 등
prisma/                 schema.prisma, seed.ts
docs/
  CONTENT.md            모든 브랜드 카피의 출처/검증 상태 기록
  SHOT_LIST.md           실제 촬영 필요 목록
scripts/qa.mts          Playwright 기반 실 브라우저 QA 스크립트
```

## 콘텐츠와 사실 검증

이 사이트의 모든 브랜드 카피(연혁, 인증, 방송, 수상)는 `docs/CONTENT.md`에
출처와 함께 기록되어 있다. 공개 웹 검색으로 독립 확인된 사실과, 의뢰 자료에는
명시되었으나 아직 교차 확인하지 못한 사실을 구분해두었으니 **실제 오픈 전
`docs/CONTENT.md`의 "제공정보" 항목을 원본 자료(인증서, 방송 다시보기 등)로
재확인**할 것을 권장한다. 가짜 리뷰·고객수는 절대 생성하지 않았으며, 리뷰
시스템은 실제 데이터가 쌓이기 전까지 정직한 빈 상태로 노출된다.

## 이미지

현재 실사 촬영본이 없어, `src/components/art/`에 브랜드 컬러 시스템 기반의
디자인된 대체 비주얼(등고선 그래픽, 상품 라벨 일러스트, 보태니컬 라인아트 등)을
직접 제작해 사용했다. "IMAGE" 텍스트가 들어간 빈 박스는 어디에도 없다.
실제 촬영이 필요한 항목은 `docs/SHOT_LIST.md`에 우선순위별로 정리했다 —
촬영본이 확보되면 해당 아트 컴포넌트를 `next/image`로 교체하면 된다.

## 결제 / 채널 연동 (Mock ↔ 실 연동 전환 지점)

- **결제**: `src/lib/payment/` — `PaymentProvider` 인터페이스 + `MockPaymentProvider`.
  실 PG(토스페이먼츠/카카오페이/네이버페이) 연동 시 동일 인터페이스를 구현하는
  Provider를 추가하고 `mock-provider.ts`의 export만 교체하면 나머지 코드는 무수정.
- **스마트스토어(네이버 커머스API)**: `src/lib/integrations/naver/` — 공식 인증 방식
  (client_secret을 salt로 사용한 bcrypt 서명 기반 OAuth2)까지 구현된 클라이언트.
  `.env`에 `NAVER_COMMERCE_CLIENT_ID`/`NAVER_COMMERCE_CLIENT_SECRET`이 없으면
  자동으로 비활성 상태를 유지하며 앱 동작에는 영향 없음(관리자 대시보드에 연동 상태 표시).
- **UnifiedOrder**: `prisma/schema.prisma`의 `UnifiedOrder` 모델이 자체몰/전화주문/
  향후 스마트스토어·쿠팡 등 채널을 `channel` 필드로 통합 관리한다.

## DAM-I AI (관리자 자연어 질의)

`src/lib/ai/query.ts` — 초기 버전은 규칙 기반(Read Only) 엔진으로, 명시된
예시 질의(오늘 매출/재고/미발송 주문/이번달 매출 비교/재구매 예상 고객)에
DB를 직접 조회해 답한다. 어떤 데이터도 변경하지 않는다. 향후 실제 LLM
연동 시 `answerQuery()` 내부만 교체하면 되도록 DB 조회 함수를 분리해두었다.

## 보안

- 관리자 로그인: bcrypt 해시 + TOTP 2FA(최초 로그인 시 강제 설정) + 5회 실패 시 15분 잠금
- 세션: httpOnly / sameSite=lax / secure(운영) 쿠키, JWT(jose) 서명
- CSRF: 이중 제출 쿠키 패턴 (관리자 API POST/PUT/PATCH/DELETE에 적용)
- Rate limiting: 로그인/체크아웃/문의/AI 질의 등 인메모리 토큰버킷 (다중 인스턴스 배포 시 Redis 등 공유 스토어로 교체 필요)
- 보안 헤더: CSP, X-Frame-Options, X-Content-Type-Options 등 (`next.config.ts`)
- 감사 로그: 가격 변경, 주문 취소/환불 등 민감 작업은 `AuditLog`에 `requiresApproval: true`로 기록
  (현재는 단일 관리자 역할만 존재하여 별도 승인자 워크플로우는 미구현 — Remaining 참고)
- 로그인 기록: 성공/실패, IP, User-Agent를 `LoginLog`에 기록, `/admin/security`에서 조회

## QA

```bash
npm run build && npm run start -- -p 3100
QA_BASE_URL=http://localhost:3100 npx tsx scripts/qa.mts
```

PC(1920×1080, 2560×1440) / 태블릿(768×1024) / 모바일(390×844, 430×932)
전 뷰포트에서 주요 페이지 스크린샷을 `qa-output/`에 저장하고, 콘솔 에러·
페이지 에러·깨진 요청·가로 스크롤을 자동 검사한다. 장바구니 담기→체크아웃,
관리자 로그인→2FA 설정→대시보드→각 서브페이지 이동까지 실제 브라우저
상호작용으로 검증한다.

## 알려진 제한사항 / Remaining

- 실사 이미지 없음 → `docs/SHOT_LIST.md` 참고, 대체 비주얼로 대체 완료
- 일부 방송/수상 사실은 공개 검색으로 미확인(client-provided) → `docs/CONTENT.md` §6,7 참고
- 실 PG/네이버 커머스API/AI(LLM) 연동은 추상화 계층만 구현, 실 자격증명 연동 전까지 비활성
- 민감 작업(환불/가격변경)의 "승인 필요"는 감사 로그 기록까지만 구현, 별도 승인자 워크플로우(2인 승인)는 미구현
- SQLite는 단일 인스턴스 배포 기준. 다중 인스턴스/서버리스 배포 시 PostgreSQL 전환 필요
