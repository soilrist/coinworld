import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { BrandStory } from "@/components/home/BrandStory";
import { Terroir } from "@/components/home/Terroir";
import { Broadcast } from "@/components/home/Broadcast";
import { Awards } from "@/components/home/Awards";
import { ProductsSection } from "@/components/home/ProductsSection";
import { FarmToTable } from "@/components/home/FarmToTable";
import { TasteGuide } from "@/components/home/TasteGuide";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FaqPreview } from "@/components/home/FaqPreview";
import { JournalPreview } from "@/components/home/JournalPreview";
import { FinalCta } from "@/components/home/FinalCta";
import { getPublishedProducts, getRecentReviews } from "@/lib/products";
import { getPublishedJournalPosts } from "@/lib/journal";

export const revalidate = 60;

export default async function HomePage() {
  const [products, reviews, posts] = await Promise.all([
    getPublishedProducts(),
    getRecentReviews(3),
    getPublishedJournalPosts(3),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <BrandStory />
      <Terroir />
      <Broadcast />
      <Awards />
      <ProductsSection products={products.slice(0, 3)} />
      <FarmToTable />
      <TasteGuide />
      <ReviewsSection reviews={reviews} />
      <FaqPreview />
      <JournalPreview posts={posts} />
      <FinalCta />
    </>
  );
}
