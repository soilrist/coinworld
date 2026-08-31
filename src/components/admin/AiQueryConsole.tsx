"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/csrf-client";

const EXAMPLES = ["오늘 얼마 팔았어?", "10kg 재고 몇 개야?", "아직 발송 안 한 주문 보여줘", "이번달 매출 어때?", "재구매 예상 고객 보여줘"];

export function AiQueryConsole() {
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const res = await adminFetch("/api/admin/ai-query", { method: "POST", body: JSON.stringify({ question: q }) });
    const data = await res.json();
    setHistory((h) => [...h, { question: q, answer: data.answer ?? data.error }]);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" onClick={() => ask(ex)} className="rounded-full bg-ivory-200 px-3 py-1.5 text-xs text-charcoal-600 hover:bg-ivory-300">
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-5 max-h-96 space-y-4 overflow-y-auto">
        {history.map((h, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-soil-700">Q. {h.question}</p>
            <p className="mt-1 whitespace-pre-line rounded-sm bg-ivory-200/50 p-3 text-sm text-charcoal-600">{h.answer}</p>
          </div>
        ))}
        {history.length === 0 && <p className="text-sm text-charcoal-400">위 예시를 눌러보거나 아래에 직접 질문을 입력해보세요.</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="mt-5 flex gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="예: 오늘 얼마 팔았어?"
          className="flex-1 rounded-sm border border-soil-200 px-3 py-2.5 text-sm"
        />
        <button type="submit" disabled={loading} className="btn-secondary !min-h-0 !py-2.5 !px-5 text-sm">
          {loading ? "확인 중..." : "질문하기"}
        </button>
      </form>
    </div>
  );
}
