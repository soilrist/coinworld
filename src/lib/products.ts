import { prisma } from "@/lib/prisma";

export function getPublishedProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export function getVisibleReviewsForProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId, isVisible: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getRecentReviews(take = 6) {
  return prisma.review.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}
