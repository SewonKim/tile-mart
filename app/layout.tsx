import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "타일마트 | 상업공간 인테리어 전문",
    template: "%s | 타일마트",
  },
  description:
    "사무실, 학원, 체육시설, 카페, 매장, 주거공간 등 상업공간 인테리어 설계 및 시공 전문 기업. 2,000건+ 시공실적, 무료 현장 상담, 투명한 견적 시스템.",
  keywords: [
    "인테리어",
    "사무실 인테리어",
    "학원 인테리어",
    "체육시설 인테리어",
    "카페 인테리어",
    "매장 인테리어",
    "상업공간 인테리어",
    "타일마트",
    "시공",
    "리모델링",
  ],
  openGraph: {
    title: "타일마트 | 상업공간 인테리어 전문",
    description:
      "공간 디자인부터 시공, 사후관리까지. 2,000건+ 시공실적의 원스톱 인테리어 솔루션.",
    locale: "ko_KR",
    type: "website",
    siteName: "타일마트",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
