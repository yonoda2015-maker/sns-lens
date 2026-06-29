import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SNS Lens - SNS Content Analyzer",
  description: "AI-powered SNS content analysis for Twitter, YouTube, Instagram, TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className={`min-h-full flex flex-col ${notoSansJP.className}`}>{children}</body>
    </html>
  );
}
