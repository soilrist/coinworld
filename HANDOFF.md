# 인수인계 문서 (HANDOFF)

이 문서는 다른 Claude 세션(또는 사람)이 이 프로젝트를 이어받을 때 가장 먼저 읽어야 하는 문서다.
"무엇을 만들었는지"는 `README.md`에, "카피 출처/검증 상태"는 `docs/CONTENT.md`에 있으니
이 문서는 **지금까지의 진행 경위, 반드시 지켜야 할 판단 기준, 남은 일**만 다룬다.

## 0. 한 줄 요약

전남 무안 담이농장(대표 강여상)의 실제 사업을 위한 프리미엄 커머스 사이트 + 관리자 운영
시스템(DAM-E FARM OS)을 Next.js 16으로 구축했다. 초기 풀 빌드 → 실 브라우저 QA →
반복적인 다듬기(홈페이지 스크롤 애니메이션, 실제 사진/연락처 반영) 단계까지 마쳤고,
현재 `claude/damifarm-premium-commerce-vd5srk` 브랜치에 전부 커밋·푸시되어 있다
(작업 트리 clean, `npm run typecheck` / `npm run lint` / `npm run build` 전부 통과 확인됨).

## 1. 반드시 지켜야 할 것 (가장 중요)

1. **이 프로젝트는 실제 사업체를 위한 사이트다.** 확인되지 않은 사실(방송 출연, 수상, 고객 리뷰,
   고객 수 등)을 지어내거나 과장하지 않는다. 새 카피를 쓸 때는 반드시 `docs/CONTENT.md`에
   출처와 검증 등급(`[검증됨]`/`[제공정보]`)을 함께 남기고, 코드(`src/content/facts.ts` 등)와
   1:1로 맞춘다.
2. **콘텐츠(사진/글) 사용 여부 판단 기준**은 `docs/CONTENT.md` §14에 정리해두었다 — 방송사
   화면 캡처, 일반 스톡 사진, 유상 체험단 블로그 글, 출처 불분명한 자료는 어떤 이유로도
   사용하지 않는다. 애매하면 사용하지 않는 쪽을 택할 것.
3. **아티팩트(미리보기) 제목은 "damefarm"이다. "damifarm"으로 "고쳐서" 고치지 말 것.**
   실제 코드베이스의 영문 브랜드 표기(`src/content/facts.ts`의 `nameEn: "Dami Farm"`,
   npm 패키지명 `damifarm`)와 철자가 다른 것이 맞다 — 사용자가 미리보기 아티팩트의 이름을
   "damefarm"으로 명시적으로 지정했고, 내가 오타로 오인해 "damifarm"으로 되돌렸다가
   사용자에게 두 번이나 정정받은 이력이 있다. 두 표기는 서로 다른 용도이므로 통일하지 말 것.
4. **모든 응답은 한국어로.** 사용자가 "한글로해"라고 명시적으로 요청했다.

## 2. 지금까지 진행 경위 (요약)

1. 초기 스펙(대규모 한국어 브리프)에 따라 풀 커머스 사이트 + 관리자 시스템을 처음부터 구축.
   Next.js 16 / React 19 / TS / Tailwind / Prisma+SQLite / JWT+TOTP 2FA / Naver Commerce API
   연동 추상화 / SEO / 보안 하드닝 / Playwright 실 브라우저 QA까지 전부 포함.
2. "홈페이지 완성시키라고" 요청에 따라, 설치만 되어 있고 실제로는 안 쓰이던 Framer Motion을
   13개 홈페이지 섹션 전체에 스크롤 리빌 애니메이션으로 적용 (`src/components/ui/Reveal.tsx`).
   이 작업 중 실제 버그 2개(인증 배지 썸네일 텍스트 깨짐, 모바일 메뉴 애니메이션 속도)를
   스크린샷 육안 검토로 발견해 수정.
3. 사용자가 실제 폰으로 사이트를 보고 싶어했으나, 이 환경에는 실제 Next.js 앱을 배포할 자격
   증명/도구가 없다 — 대신 정적 HTML로 디자인/카피를 충실히 재현한 Claude Artifact를 만들어
   제공. **이것은 실제 앱이 아니라 정적 스냅샷이며, DB/장바구니/관리자 기능은 없다.**
4. 실제 사진/사실 자료 확보를 놓고 여러 차례 소스를 검토:
   - 사용자가 준 각종 링크(유튜브 검색결과/채널, 특정 블로그 포스트)를 하나씩 확인.
   - 방송사 화면 캡처, 일반 스톡 사진, 유상 체험단 블로그 글, 참고용으로 전달된 타 업체
     이미지는 모두 사용 거부 — 이유는 매번 사용자에게 설명하고 `docs/CONTENT.md`에 기록.
   - 최종적으로 사용자가 제공한 진짜 가족 블로그(`blog.naver.com/runway2000`, 삼촌 운영,
     "담이농장이야기")에서 얼굴 노출 없는 실제 사진 3장 + 실제 일지 내용을 가져와 농장저널
     3편(`src/content/journal.ts`)을 실제 자료 기반으로 전면 교체.
   - 사용자가 준 실제 연락처(고객센터 010-9972-4525, 상담시간 06:00~22:00, 대표 문의
     010-4619-0802)를 `src/content/facts.ts`의 `customerService` + Footer + 아티팩트
     미리보기에 반영.
5. 방금 전: 아티팩트 미리보기가 로그인 없이는 안 보인다는 질문에 답변 — 공개 전환은 아티팩트
   페이지 자체의 "공유" 메뉴에서 사용자가 직접 눌러야 하는 기능이고, 도구로 대신 켜줄 방법이
   없다고 안내함 (코드/커밋 변경 없음).
6. 지금: 이 시점까지 내용을 커밋하고 인수인계 문서(이 파일)를 작성 중.

## 3. 현재 상태 (스냅샷 — 2026-09-01 기준)

- 브랜치: `claude/damifarm-premium-commerce-vd5srk` (origin과 동일 커밋, fast-forward 상태)
- `git status`: clean, 커밋 안 된 변경사항 없음
- `npm run typecheck` / `npm run lint` / `npm run build`: 마지막 확인 시 전부 통과
- 관리자 최초 로그인 계정: `npm run db:seed` 실행 시 콘솔에 이메일/비밀번호 출력 (최초
  로그인 시 2FA 강제 설정)
- 아티팩트 미리보기(정적 HTML, 실제 앱 아님): **https://claude.ai/code/artifact/a1e1f821-95f0-495a-b844-642ee488f102**
  (제목 "damefarm"). 원본 파일은 이 세션의 스크래치패드
  (`/tmp/claude-0/.../scratchpad/damifarm-preview.html`)에 있었는데, **스크래치패드는
  세션 전용이라 다른 세션에서는 그 경로에 파일이 없다.** 이 미리보기를 다시 갱신해야 한다면,
  새 세션에서 `Artifact` 도구로 `action: "read"` + 위 URL로 현재 게시본을 먼저 읽어온 뒤,
  그 내용을 베이스로 수정해서 **같은 URL로 재게시**할 것 (새 아티팩트를 만들면 링크가 바뀐다).

## 4. 남은 일 (Remaining)

`README.md`의 "알려진 제한사항 / Remaining" 섹션과 동일하되, 우선순위 관점에서 정리:

1. **실사 이미지 확보** — `docs/SHOT_LIST.md` 우선순위 1~4 참고. 현재는 브랜드 컬러 기반
   SVG 대체 비주얼(`src/components/art/`)로 채워져 있고, 확보되는 대로 해당 컴포넌트를
   `next/image`로 교체하면 된다. 농장저널 3장은 이미 실사(가족 블로그 출처, 365×365
   저해상도)로 교체됨 — 더 큰 원본이 필요하면 블로그 운영자(사용자의 삼촌)에게 직접 요청 필요.
2. **방송(KBS 6시 내고향, 채널A)·2023년 수상 사실의 독립 검증** — 현재 `[제공정보]` 등급.
   방송 다시보기 링크나 상장 실물 사진을 확보해 `docs/CONTENT.md` §6, §7 및
   `src/content/facts.ts`의 `verified` 플래그를 갱신할 것. 확보 전까지는 현재처럼 "확인 필요"
   상태 유지 — 함부로 `verified: true`로 바꾸지 말 것.
3. **사업자등록번호/통신판매업 신고번호 등 법적 고지 정보** — 현재 §3 법인 정보도 미확인
   상태. 실제 사업자등록증 확보 후 갱신.
4. **실 PG/네이버 커머스 API 자격증명 연동** — 추상화 계층(`src/lib/payment/`,
   `src/lib/integrations/naver/`)까지만 구현되어 있고 Mock 상태. `.env`에 자격증명만
   채우면 되는 구조.
5. **민감 작업(환불/가격변경) 2인 승인 워크플로우** — 현재는 감사 로그(`AuditLog`,
   `requiresApproval: true`)만 기록되고 실제 승인 게이트는 없음. 필요 시 구현.
6. **SQLite → PostgreSQL 전환** — 다중 인스턴스/서버리스 배포 시 필요.
7. **실제 Next.js 앱의 공개 배포** — 현재 이 환경에는 배포 자격증명/도구가 없어 실앱을 실제
   공개 도메인에 올리지 못했다. 아티팩트 미리보기(정적 스냅샷)만 존재. 사용자가 원하면 Vercel
   등 배포처를 정하고 자격증명을 받아 진행할 것.

## 5. 겪었던 함정 (다시 겪지 않도록)

- `pkill`로 기존 서버를 죽이고 같은 Bash 호출 안에서 바로 `nohup ... &`로 새 서버를 띄우면
  원인불명의 exit code 144로 새 서버까지 같이 죽는다. **항상 `pkill`과 `nohup` 시작을
  서로 다른 Bash 호출로 분리할 것.**
- Next.js 16은 `next lint` 명령이 제거됨 — `eslint .`를 직접 호출해야 한다(`package.json`에
  이미 반영됨).
- Prisma는 `8.0.0-rc`가 아니라 안정 버전 `6.19.3`을 쓴다 — rc는 CLI 구조가 완전히 다르다.
- otplib v13은 `authenticator` 싱글턴이 없다 — `TOTP` 클래스 + `NobleCryptoPlugin` +
  `ScureBase32Plugin` 조합으로 `src/lib/totp.ts`에 이미 구현되어 있다.
- Playwright 풀페이지 스크린샷에서 스크롤 리빌 애니메이션을 제대로 트리거하려면
  `document.body.scrollHeight`가 아니라 `document.documentElement.scrollHeight` 기준으로
  실제 스크롤을 진행해야 한다 (`scripts/qa.mts`의 `scrollThroughPage()` 참고).
- `prisma/seed.ts`에서 `upsert`의 `update: {}`처럼 빈 객체를 넣으면 이미 있는 row는
  절대 갱신되지 않는다 — 재시딩으로 내용을 갱신하려면 `update: <실제 데이터>`여야 한다.

## 6. 시작하는 법

```bash
npm install
cp .env.example .env   # SESSION_SECRET 등 채우기
npm run db:push
npm run db:seed        # 콘솔에 출력되는 관리자 계정으로 최초 로그인 → 2FA 설정
npm run dev            # http://localhost:3000
```

QA 재실행:
```bash
npm run build && npm run start -- -p 3100
QA_BASE_URL=http://localhost:3100 npx tsx scripts/qa.mts
```

나머지 세부 구조/폴더 안내는 `README.md`를 참고할 것.
