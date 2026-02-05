import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "타일마트 | 상업공간 인테리어 전문",
  description:
    "사무실, 학원, 체육시설, 주거공간 등 상업공간 인테리어 설계 및 시공 전문 기업. 2,000건+ 시공실적, 투명한 견적 시스템.",
  keywords: [
    "인테리어",
    "사무실 인테리어",
    "상업공간",
    "타일마트",
  ],
  openGraph: {
    title: "타일마트",
    description: "상업공간 인테리어 설계 및 시공 전문",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
