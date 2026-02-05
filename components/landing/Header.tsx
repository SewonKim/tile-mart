"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "홈", href: "#home" },
  { label: "시공사례", href: "#portfolio" },
  { label: "하는일", href: "#services" },
  { label: "상담신청", href: "#consultation" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        {/* 로고 */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/tilemart-concept1-horizontal.svg"
            alt="타일마트"
            width={160}
            height={40}
            className={cn(
              "h-9 w-auto transition-all",
              isScrolled ? "" : "brightness-0 invert"
            )}
            priority
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#consultation"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Phone className="size-4" />
            상담신청
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={cn(
            "flex size-10 items-center justify-center rounded-lg transition-colors md:hidden",
            isScrolled
              ? "text-foreground hover:bg-muted-light"
              : "text-white hover:bg-white/10"
          )}
        >
          {isMobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="border-b border-border/50 py-4 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#consultation"
              onClick={() => setIsMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              <Phone className="size-4" />
              무료 상담신청
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
