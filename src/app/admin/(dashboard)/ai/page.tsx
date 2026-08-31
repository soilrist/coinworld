import { AiQueryConsole } from "@/components/admin/AiQueryConsole";

export default function AdminAiPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">DAM-I AI</h1>
      <p className="mt-1 text-sm text-charcoal-500">
        자연어로 매출, 재고, 주문 현황을 물어보세요. 현재 조회 전용(Read Only)으로 동작하며, 어떤 데이터도 변경하지 않습니다.
      </p>
      <div className="mt-6">
        <AiQueryConsole />
      </div>
    </div>
  );
}
