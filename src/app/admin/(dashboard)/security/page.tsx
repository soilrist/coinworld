import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export default async function AdminSecurityPage() {
  const [loginLogs, auditLogs] = await Promise.all([
    prisma.loginLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">보안 / 로그</h1>

      <div className="mt-6">
        <h2 className="font-serif text-lg font-semibold text-soil-700">로그인 기록</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-soil-100 bg-ivory-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soil-100 text-left text-charcoal-400">
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium">계정</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">결과</th>
                <th className="px-4 py-3 font-medium">비고</th>
              </tr>
            </thead>
            <tbody>
              {loginLogs.map((l) => (
                <tr key={l.id} className="border-b border-soil-50 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-charcoal-500">{formatDate(l.createdAt)}</td>
                  <td className="px-4 py-3">{l.email}</td>
                  <td className="px-4 py-3 text-charcoal-400">{l.ip ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={l.success ? "text-olive-700" : "text-burgundy-600"}>{l.success ? "성공" : "실패"}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-400">{l.reason ?? "-"}</td>
                </tr>
              ))}
              {loginLogs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-charcoal-400">기록이 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-soil-700">관리자 작업 기록 (감사 로그)</h2>
        <p className="mt-1 text-xs text-charcoal-400">환불, 고객 삭제, 가격 변경 등 민감한 작업은 승인 필요 항목으로 별도 표시됩니다.</p>
        <div className="mt-3 overflow-x-auto rounded-sm border border-soil-100 bg-ivory-50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soil-100 text-left text-charcoal-400">
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium">작업</th>
                <th className="px-4 py-3 font-medium">대상</th>
                <th className="px-4 py-3 font-medium">승인필요</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((a) => (
                <tr key={a.id} className="border-b border-soil-50 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-charcoal-500">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3">{a.action}</td>
                  <td className="px-4 py-3 text-charcoal-400">{a.target}</td>
                  <td className="px-4 py-3">{a.requiresApproval ? (a.approved ? "승인됨" : "대기중") : "-"}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-charcoal-400">기록이 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
