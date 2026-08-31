"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/csrf-client";

export function InquiryAnswerForm({ inquiryId, initialAnswer }: { inquiryId: string; initialAnswer: string | null }) {
  const router = useRouter();
  const [answer, setAnswer] = useState(initialAnswer ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await adminFetch(`/api/admin/inquiries/${inquiryId}`, { method: "PATCH", body: JSON.stringify({ answer }) });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "저장에 실패했습니다.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        placeholder="답변을 입력하세요"
        className="w-full rounded-sm border border-soil-200 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm font-medium text-burgundy-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-secondary !min-h-0 !py-2 !text-sm">
        {saving ? "저장 중..." : "답변 저장"}
      </button>
    </form>
  );
}
