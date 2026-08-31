import { chromium, type ConsoleMessage } from "playwright";
import { TOTP, NobleCryptoPlugin, ScureBase32Plugin } from "otplib";
import fs from "node:fs";
import path from "node:path";

process.loadEnvFile(new URL("../.env", import.meta.url));

// 반복 실행 시에도 매번 "최초 로그인" 2FA 설정 플로우를 그대로 재현하도록
// 관리자 계정의 2FA 상태를 리셋한다 (QA 스크립트 자체의 멱등성 확보 목적).
async function resetAdminTotpState() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  await prisma.adminUser.updateMany({
    data: { totpSecret: null, totpEnabled: false, failedLoginCount: 0, lockedUntil: null },
  });
  await prisma.$disconnect();
}

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3100";
const OUT_DIR = path.join(process.cwd(), "qa-output");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "pc-1920", width: 1920, height: 1080 },
  { name: "pc-2560", width: 2560, height: 1440 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
];

const PAGES = [
  "/",
  "/products",
  "/story",
  "/broadcast",
  "/certification",
  "/journal",
  "/faq",
  "/cart",
];

interface Issue {
  page: string;
  viewport: string;
  type: string;
  message: string;
}

const issues: Issue[] = [];

/**
 * 실제 사용자의 스크롤을 흉내내 페이지 끝까지 점진적으로 스크롤한다.
 * Framer Motion의 whileInView(IntersectionObserver 기반) 리빌 애니메이션은 실제
 * 스크롤이 있어야 트리거되므로, 이 과정 없이 fullPage 스크린샷만 찍으면 뷰포트 밖
 * 콘텐츠가 opacity:0 상태로 캡처될 수 있다(실사용자 경험과는 무관한 캡처 아티팩트).
 */
async function scrollThroughPage(page: import("playwright").Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const step = 400;
      const maxTicks = 300; // 안전장치: 최대 300틱(약 18초) 후 강제 종료
      let ticks = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        ticks += 1;
        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (atBottom || ticks >= maxTicks) {
          clearInterval(timer);
          resolve();
        }
      }, 60);
    });
  });
  await page.waitForTimeout(400);
  // whileInView(once:true) 애니메이션은 트리거된 뒤 상태가 유지되므로, sticky 헤더가
  // fullPage 캡처 시 중간에 중복 렌더링되는 것을 막기 위해 캡처 전 맨 위로 되돌린다.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
}

function attachListeners(page: import("playwright").Page, pageName: string, viewportName: string) {
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") {
      issues.push({ page: pageName, viewport: viewportName, type: "console.error", message: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    issues.push({ page: pageName, viewport: viewportName, type: "pageerror", message: err.message });
  });
  page.on("requestfailed", (req) => {
    const failure = req.failure()?.errorText ?? "unknown";
    // ERR_ABORTED는 대부분 Next.js Link prefetch가 다음 네비게이션으로 취소된 것으로, 실제 장애가 아니다.
    if (!req.url().includes("favicon") && failure !== "net::ERR_ABORTED") {
      issues.push({ page: pageName, viewport: viewportName, type: "requestfailed", message: `${req.url()} :: ${failure}` });
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().includes("/api/") && !res.url().includes("favicon")) {
      issues.push({ page: pageName, viewport: viewportName, type: "http-error", message: `${res.status()} ${res.url()}` });
    }
  });
}

async function main() {
  await resetAdminTotpState();
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  // ---- 1) 정적 페이지 x 전 뷰포트 스크린샷 + 콘솔 에러 체크 ----
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    for (const pagePath of PAGES) {
      const page = await context.newPage();
      attachListeners(page, pagePath, vp.name);
      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: "networkidle" });
      await scrollThroughPage(page);
      const safeName = pagePath === "/" ? "home" : pagePath.replace(/\//g, "_").slice(1);
      await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}__${safeName}.png`), fullPage: true });

      // 가로 스크롤(overflow) 체크
      const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (hasHorizontalOverflow) {
        issues.push({ page: pagePath, viewport: vp.name, type: "layout", message: "가로 스크롤(overflow-x) 발생" });
      }
      await page.close();
    }
    await context.close();
  }

  // ---- 2) 모바일 헤더 햄버거 메뉴 상호작용 ----
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    attachListeners(page, "/ (mobile menu)", "mobile-390");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.getByLabel("메뉴 열기").click();
    await page.getByRole("navigation").getByText("FAQ").waitFor({ state: "visible" });
    await page.waitForTimeout(300); // 메뉴 fade-in 애니메이션 완료 대기
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390__menu-open.png") });
    await page.getByLabel("메뉴 닫기").click();
    await context.close();
  }

  // ---- 3) 상품 상세 -> 장바구니 담기 -> 장바구니 -> 체크아웃 폼 노출 (실 상호작용) ----
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    attachListeners(page, "product-flow", "pc-1440");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
    const firstProductHref = await page.locator('a[href^="/products/"]').first().getAttribute("href");
    if (!firstProductHref) throw new Error("상품 목록에서 상품 링크를 찾지 못했습니다.");

    await page.goto(`${BASE_URL}${firstProductHref}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__product-detail.png"), fullPage: true });

    // 이미지 확대(라이트박스) 상호작용
    await page.getByLabel("이미지 확대 보기").click();
    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__product-zoom.png") });
    await page.keyboard.press("Escape").catch(() => {});
    await page.locator('[role="dialog"]').click({ position: { x: 5, y: 5 } }).catch(() => {});

    // 수량 증가 후 장바구니 담기
    await page.getByLabel("수량 증가").first().click();
    await page.getByRole("button", { name: "장바구니" }).first().click();

    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__cart-with-item.png"), fullPage: true });

    const cartHasItem = await page.getByText("장바구니가 비어").count();
    if (cartHasItem > 0) issues.push({ page: "/cart", viewport: "pc-1440", type: "flow", message: "장바구니 담기 후에도 빈 장바구니로 표시됨" });

    await page.getByRole("button", { name: "주문하기" }).click();
    await page.waitForURL(/\/checkout/, { timeout: 5000 });
    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__checkout-form.png"), fullPage: true });

    await context.close();
  }

  // ---- 4) 모바일 상품 상세: sticky buy bar 노출 확인 ----
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    attachListeners(page, "product-detail-mobile", "mobile-390");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
    const href = await page.locator('a[href^="/products/"]').first().getAttribute("href");
    await page.goto(`${BASE_URL}${href}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT_DIR, "mobile-390__product-detail-stickybar.png"), fullPage: false });
    await context.close();
  }

  // ---- 5) 관리자: 로그인 -> 2FA 설정 -> 대시보드 -> 주요 서브페이지 ----
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    attachListeners(page, "admin-flow", "pc-1440");

    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__admin-login.png") });

    await page.getByLabel("이메일").fill(process.env.ADMIN_EMAIL ?? "admin@damifarm.kr");
    await page.getByLabel("비밀번호").fill(process.env.ADMIN_INITIAL_PASSWORD ?? "ChangeMe!2026");
    await page.getByRole("button", { name: "로그인" }).click();

    // 계정 상태에 따라 (a) 최초 로그인 -> /admin/setup-2fa로 리다이렉트,
    // (b) 이미 2FA 활성화됨 -> 같은 화면에서 인라인 코드 입력창 노출, 둘 중 하나로 분기.
    await Promise.race([
      page.waitForURL(/\/admin\/setup-2fa/, { timeout: 10_000 }),
      page.getByLabel(/6자리 코드/).waitFor({ state: "visible", timeout: 10_000 }),
    ]);

    const totp = new TOTP({ crypto: new NobleCryptoPlugin(), base32: new ScureBase32Plugin() });

    if (page.url().includes("setup-2fa")) {
      await page.waitForSelector("img[alt='2FA QR 코드']", { timeout: 5000 });
      const secretText = await page.locator("p.font-mono").innerText();
      const code = await totp.generate({ secret: secretText.trim() });

      await page.getByPlaceholder("6자리 코드 입력").fill(code);
      await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__admin-2fa-setup.png") });
      await page.getByRole("button", { name: "인증 완료" }).click();
      await page.waitForURL(/\/admin$/, { timeout: 5000 });
    } else {
      // 이미 2FA가 활성화된 계정 — 시크릿을 알 수 없으므로 이 QA 실행 전 리셋이
      // 정상 동작했다는 전제가 깨진 경우다. 명확한 에러로 남긴다.
      throw new Error("관리자 계정에 2FA가 이미 활성화되어 있어 QA에서 코드 생성이 불가합니다. resetAdminTotpState()가 실행되었는지 확인하세요.");
    }

    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__admin-dashboard.png"), fullPage: true });

    for (const sub of ["/admin/orders", "/admin/products", "/admin/inventory", "/admin/customers", "/admin/inquiries", "/admin/analytics", "/admin/ai", "/admin/orders/phone", "/admin/security"]) {
      await page.goto(`${BASE_URL}${sub}`, { waitUntil: "networkidle" });
      const safeName = sub.replace(/\//g, "_").slice(1);
      await page.screenshot({ path: path.join(OUT_DIR, `pc-1440__${safeName}.png`), fullPage: true });
    }

    // DAM-I AI 질의 상호작용
    await page.goto(`${BASE_URL}/admin/ai`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "오늘 얼마 팔았어?" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, "pc-1440__admin-ai-query.png") });

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(OUT_DIR, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));

  console.log(`\n=== QA 완료 ===`);
  console.log(`스크린샷/리포트 저장 위치: ${OUT_DIR}`);
  console.log(`발견된 이슈: ${issues.length}건`);
  for (const issue of issues) {
    console.log(`- [${issue.viewport}] ${issue.page} :: ${issue.type} :: ${issue.message}`);
  }
  if (issues.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("QA 스크립트 실행 중 오류:", err);
  process.exitCode = 1;
});
