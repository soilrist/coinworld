"use client";

import { useState } from "react";

export function InquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", title: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", phone: "", title: "", message: "" });
    } else {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-olive-200 bg-olive-50 p-6 text-sm text-olive-800">
        문의가 접수되었습니다. 확인 후 순차적으로 답변드리겠습니다.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-sm border border-soil-100 bg-ivory-50 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className="mb-1.5 block text-sm font-medium text-charcoal-600">이름</label>
          <input id="inq-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-[16px]" />
        </div>
        <div>
          <label htmlFor="inq-phone" className="mb-1.5 block text-sm font-medium text-charcoal-600">연락처 (선택)</label>
          <input id="inq-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-[16px]" />
        </div>
      </div>
      <div>
        <label htmlFor="inq-title" className="mb-1.5 block text-sm font-medium text-charcoal-600">제목</label>
        <input id="inq-title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-[16px]" />
      </div>
      <div>
        <label htmlFor="inq-message" className="mb-1.5 block text-sm font-medium text-charcoal-600">문의 내용</label>
        <textarea id="inq-message" required rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full rounded-sm border border-soil-200 px-3 py-2.5 text-[16px]" />
      </div>
      {status === "error" && <p className="text-sm font-medium text-burgundy-600">전송에 실패했습니다. 다시 시도해주세요.</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary">
        {status === "sending" ? "전송 중..." : "문의 남기기"}
      </button>
    </form>
  );
}
