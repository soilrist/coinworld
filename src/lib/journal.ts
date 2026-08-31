import { prisma } from "@/lib/prisma";

export function getPublishedJournalPosts(take?: number) {
  return prisma.journalPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export function getJournalPostBySlug(slug: string) {
  return prisma.journalPost.findUnique({ where: { slug } });
}
