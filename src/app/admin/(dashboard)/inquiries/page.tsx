import { prisma } from "@/lib/prisma";
import { InquiryAnswerForm } from "@/components/admin/InquiryAnswerForm";
import { formatDate } from "@/lib/format";
import { INQUIRY_STATUS_LABEL } from "@/lib/order-labels";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-soil-700">문의 관리</h1>
      <div className="mt-6 space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="rounded-sm border border-soil-100 bg-ivory-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-soil-700">{inq.title}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${inq.status === "OPEN" ? "bg-burgundy-100 text-burgundy-700" : "bg-olive-100 text-olive-700"}`}>
                {INQUIRY_STATUS_LABEL[inq.status]}
              </span>
            </div>
            <p className="mt-1 text-xs text-charcoal-400">{inq.name} · {inq.phone ?? "연락처 미기재"} · {formatDate(inq.createdAt)} · {inq.channel}</p>
            <p className="mt-3 text-sm text-charcoal-600">{inq.message}</p>
            {inq.answer && (
              <div className="mt-3 rounded-sm bg-ivory-200/60 p-3 text-sm text-charcoal-600">
                <p className="mb-1 text-xs font-semibold text-olive-700">답변</p>
                {inq.answer}
              </div>
            )}
            <InquiryAnswerForm inquiryId={inq.id} initialAnswer={inq.answer} />
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-charcoal-400">접수된 문의가 없습니다.</p>}
      </div>
    </div>
  );
}
