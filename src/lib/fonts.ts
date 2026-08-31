import localFont from "next/font/local";
import { Noto_Serif_KR } from "next/font/google";

export const pretendard = localFont({
  src: "../app/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-serif-kr",
});
