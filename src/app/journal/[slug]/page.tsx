import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalPostBySlug } from "@/lib/journal";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-2xl py-14 md:py-20">
      <nav className="mb-6 text-sm text-charcoal-400">
        <Link href="/journal" className="hover:text-burgundy-600">농장저널</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal-600">{post.title}</span>
      </nav>
      <p className="eyebrow">{post.category}</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-soil-700">{post.title}</h1>
      <p className="mt-3 text-sm text-charcoal-400">{formatDate(post.publishedAt)}</p>
      <div className="mt-8 space-y-5 text-[15px] leading-[1.9] text-charcoal-600 md:text-base">
        {post.content.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
