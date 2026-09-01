import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getJournalPostBySlug } from "@/lib/journal";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/json-ld";

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

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "홈", path: "/" },
    { name: "농장저널", path: "/journal" },
    { name: post.title, path: `/journal/${post.slug}` },
  ]);

  return (
    <article className="container-page max-w-2xl py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="mb-6 text-sm text-charcoal-400">
        <Link href="/journal" className="hover:text-burgundy-600">농장저널</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal-600">{post.title}</span>
      </nav>
      <p className="eyebrow">{post.category}</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-soil-700">{post.title}</h1>
      <p className="mt-3 text-sm text-charcoal-400">{formatDate(post.publishedAt)}</p>
      {post.image && (
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-sm bg-ivory-200">
          <Image src={post.image} alt={post.title} fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" priority />
        </div>
      )}
      <div className="mt-8 space-y-5 text-[15px] leading-[1.9] text-charcoal-600 md:text-base">
        {post.content.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
