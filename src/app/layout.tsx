import type { Metadata } from "next";
import { pretendard, notoSerifKr } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://damifarm.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "담이농장 — 무안 유기농 고구마 산지직송",
    template: "%s | 담이농장",
  },
  description:
    "전라남도 무안, 2012년부터 유기농 인증을 이어온 담이농장 강여상 대표의 고구마를 만나보세요. 황토밭에서 자란 무안 고구마를 산지에서 바로 보내드립니다.",
  keywords: ["무안 고구마", "무안 유기농 고구마", "담이농장", "강여상 고구마", "산지직송 고구마", "유기농 고구마", "꿀고구마"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "담이농장",
    title: "담이농장 — 무안 유기농 고구마 산지직송",
    description: "황토가 키우고, 농부가 지킨 무안의 맛. 2012년부터 이어온 유기농 고구마.",
    url: siteUrl,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "담이농장",
    alternateName: "Dami Farm",
    url: siteUrl,
    founder: { "@type": "Person", name: "강여상" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "석북길 91-2",
      addressLocality: "무안군 현경면",
      addressRegion: "전라남도",
      addressCountry: "KR",
    },
    description: "전라남도 무안에서 유기농 고구마를 재배하는 산지직송 농장 브랜드",
  };

  return (
    <html lang="ko" className={`${pretendard.variable} ${notoSerifKr.variable}`}>
      <body className="min-h-dvh flex flex-col font-sans text-[16px] md:text-[17px]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
