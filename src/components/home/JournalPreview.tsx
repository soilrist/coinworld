import Link from "next/link";
import type { JournalPost } from "@prisma/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { formatDateShort } from "@/lib/format";

export function JournalPreview({ posts }: { posts: JournalPost[] }) {
  return (
    <section className="bg-ivory-200/60 py-20 md:py-28">
      <div className="container-page">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Farm Journal" title="농장 이야기" />
          <Link href="/journal" className="btn-outline shrink-0">
            저널 전체 보기
          </Link>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <RevealItem key={p.id}>
              <Link href={`/journal/${p.slug}`} className="card-editorial group flex h-full flex-col p-7 hover:shadow-soft">
                <p className="eyebrow">{p.category}</p>
                <h3 className="mt-3 font-serif text-lg font-semibold text-soil-700 group-hover:text-burgundy-600">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-500">{p.excerpt}</p>
                <p className="mt-4 text-xs text-charcoal-300">{formatDateShort(p.publishedAt)}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
