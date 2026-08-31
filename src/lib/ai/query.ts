import { prisma } from "@/lib/prisma";
import { formatKRW } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

/**
 * DAM-I AI — 규칙 기반 자연어 질의 엔진 (초기 버전, Read Only).
 * 조회/분석/리포트/재고예측만 수행하며, 어떤 데이터도 변경하지 않는다.
 * 향후 실제 LLM 연동 시 이 파일의 answerQuery()를 프롬프트 기반 구현으로 교체하고,
 * 아래 각 인텐트가 사용하는 DB 조회 함수는 그대로 재사용할 수 있다.
 */

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

async function todaysSales() {
  const today = startOfDay();
  const orders = await prisma.unifiedOrder.findMany({ where: { createdAt: { gte: today }, paymentStatus: "PAID" } });
  const total = orders.reduce((s, o) => s + o.totalAmount, 0);
  return `오늘 매출은 ${formatKRW(total)}이며, 결제 완료된 주문은 ${orders.length}건입니다.`;
}

async function stockFor(keyword: string) {
  const products = await prisma.product.findMany({ where: { OR: [{ weightLabel: { contains: keyword } }, { name: { contains: keyword } }] } });
  if (products.length === 0) return `"${keyword}"에 해당하는 상품을 찾지 못했습니다.`;
  return products.map((p) => `${p.name}: 현재 재고 ${p.stock}개`).join("\n");
}

async function unshippedOrders() {
  const orders = await prisma.unifiedOrder.findMany({
    where: { status: { in: ["PAID", "PREPARING"] } },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  if (orders.length === 0) return "아직 발송하지 않은 주문이 없습니다. 모두 처리되었습니다.";
  const lines = orders.map((o) => `- ${o.recipientName} · ${formatKRW(o.totalAmount)} · ${ORDER_STATUS_LABEL[o.status]}`);
  return `아직 발송하지 않은 주문 ${orders.length}건입니다.\n${lines.join("\n")}`;
}

async function monthComparison() {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonth, lastMonth] = await Promise.all([
    prisma.unifiedOrder.findMany({ where: { createdAt: { gte: thisMonthStart }, paymentStatus: "PAID" } }),
    prisma.unifiedOrder.findMany({ where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart }, paymentStatus: "PAID" } }),
  ]);
  const thisTotal = thisMonth.reduce((s, o) => s + o.totalAmount, 0);
  const lastTotal = lastMonth.reduce((s, o) => s + o.totalAmount, 0);
  const diff = thisTotal - lastTotal;

  if (lastTotal === 0) return `이번달 매출은 ${formatKRW(thisTotal)}입니다. 지난달 비교 데이터가 없습니다.`;
  const pct = Math.round((diff / lastTotal) * 100);
  return `이번달 매출은 ${formatKRW(thisTotal)}로, 지난달(${formatKRW(lastTotal)}) 대비 ${pct >= 0 ? "+" : ""}${pct}% 입니다.${
    pct < 0 ? " 매출 감소의 정확한 원인은 채널/상품별 데이터를 함께 확인해보시길 권장합니다." : ""
  }`;
}

async function repurchaseCandidates() {
  const customers = await prisma.customer.findMany({
    include: { orders: { where: { paymentStatus: "PAID" }, orderBy: { createdAt: "desc" } } },
  });

  const now = Date.now();
  const candidates = customers
    .map((c) => {
      if (c.orders.length < 2) return null;
      const dates = c.orders.map((o) => o.createdAt.getTime()).sort((a, b) => a - b);
      const gaps = dates.slice(1).map((d, i) => d - dates[i]!);
      const avgGapMs = gaps.reduce((s, g) => s + g, 0) / gaps.length;
      const lastOrderMs = dates[dates.length - 1]!;
      const daysSinceLast = (now - lastOrderMs) / (1000 * 60 * 60 * 24);
      const avgGapDays = avgGapMs / (1000 * 60 * 60 * 24);
      const dueSoon = daysSinceLast >= avgGapDays * 0.8;
      return dueSoon ? { name: c.name, phone: c.phone, avgGapDays: Math.round(avgGapDays), daysSinceLast: Math.round(daysSinceLast) } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  if (candidates.length === 0) return "현재 재구매 임박으로 예상되는 고객이 없습니다.";
  const lines = candidates.map((c) => `- ${c.name} (${c.phone}) · 평균 주기 약 ${c.avgGapDays}일, 마지막 주문 후 ${c.daysSinceLast}일 경과`);
  return `재구매가 예상되는 고객 ${candidates.length}명입니다.\n${lines.join("\n")}`;
}

export async function answerQuery(question: string): Promise<string> {
  const q = question.trim();

  if (/오늘.*(얼마|매출)/.test(q)) return todaysSales();
  if (/(발송|출고).*안|미발송|발송대기/.test(q)) return unshippedOrders();
  if (/이번\s?달.*매출/.test(q)) return monthComparison();
  if (/재구매/.test(q)) return repurchaseCandidates();

  const weightMatch = q.match(/(\d+kg)/i);
  if (weightMatch) return stockFor(weightMatch[1]!);

  if (/재고/.test(q)) {
    const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
    return products.map((p) => `${p.name}: ${p.stock}개`).join("\n");
  }

  return "죄송합니다, 아직 이해하지 못한 질문입니다. 예시: '오늘 얼마 팔았어?', '10kg 재고 몇 개야?', '아직 발송 안 한 주문 보여줘', '이번달 매출 어때?', '재구매 예상 고객 보여줘'";
}
