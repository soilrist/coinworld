import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedJournalPosts } from "@/lib/journal";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "농장저널",
  description: "담이농장의 수확, 밭 관리, 출하 소식을 전하는 농장 저널.",
};

export const revalidate = 60;

export default async function JournalPage() {
  const posts = await getPublishedJournalPosts();

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="Farm Journal" title="농장 이야기" description="수확, 밭 관리, 출하 소식을 기록합니다." />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/journal/${p.slug}`} className="card-editorial group flex flex-col p-7 hover:shadow-soft">
            <p className="eyebrow">{p.category}</p>
            <h2 className="mt-3 font-serif text-lg font-semibold text-soil-700 group-hover:text-burgundy-600">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-500">{p.excerpt}</p>
            <p className="mt-4 text-xs text-charcoal-300">{formatDateShort(p.publishedAt)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
