import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

const navLinks = [
  { label: "홈", href: "#home" },
  { label: "시공사례", href: "#portfolio" },
  { label: "하는일", href: "#services" },
  { label: "상담신청", href: "#consultation" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* 회사 정보 */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/images/logos/tilemart-concept1-horizontal.svg"
                alt="타일마트"
                width={160}
                height={40}
                className="h-9 w-auto brightness-0 invert"
              />
            </div>
            <div className="space-y-1 text-sm leading-relaxed text-white/40">
              <p>경기 고양시 일산서구 경의로 826 전면상가좌측칸</p>
              <p>
                대표전화:{" "}
                <a href="tel:0507-1497-0485" className="text-white/60 hover:text-primary">
                  0507-1497-0485
                </a>
              </p>
              <p>
                영업시간: 매일 08:00-18:30
              </p>
            </div>

            {/* SNS */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-primary hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-primary hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-primary hover:text-white"
                aria-label="Naver Blog"
              >
                <span className="text-xs font-bold">N</span>
              </a>
            </div>
          </div>

          {/* 네비게이션 */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white/80">바로가기</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} 타일마트. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
