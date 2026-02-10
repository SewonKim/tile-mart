"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Dumbbell,
  Home,
  Wrench,
  Store,
  Coffee,
  Users,
  Award,
  Clock,
  Palette,
  Shield,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  office: Building2,
  academy: GraduationCap,
  fitness: Dumbbell,
  residential: Home,
  renovation: Wrench,
  retail: Store,
  fnb: Coffee,
};

const stats = [
  { icon: Award, value: "2,000+", label: "시공 실적", suffix: "건" },
  { icon: Users, value: "269", label: "A등급 협력업체", suffix: "개" },
  { icon: Clock, value: "20+", label: "현장소장 평균경력", suffix: "년" },
  { icon: Palette, value: "7", label: "공간 디자이너", suffix: "명" },
  { icon: Shield, value: "14", label: "전담 PM", suffix: "명" },
];

interface ServiceItem {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
}

function AnimatedNumber({ value, suffix }: { value: string; suffix: string }) {
  const [displayed, setDisplayed] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const numericPart = parseInt(value.replace(/[^0-9]/g, ""));
    const hasPlus = value.includes("+");
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numericPart * eased);
      setDisplayed(
        current.toLocaleString() + (hasPlus && step === steps ? "+" : "")
      );
      if (step >= steps) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref}>
      <span className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
        {displayed}
      </span>
      <span className="ml-1 text-sm font-medium text-primary">{suffix}</span>
    </div>
  );
}

export function Services({ services }: { services: ServiceItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services">
      {/* 상단: 서비스 카드 벤토 그리드 */}
      <div className="bg-foreground py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {/* 섹션 헤더 */}
          <div className="mb-16 md:mb-20">
            <span className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              What we do
            </span>
            <h2 className="text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
              우리가
              <br />
              <span className="text-primary">하는일</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/40">
              공간 디자인부터 시공, 사후관리까지.
              <br />
              타일마트가 만드는 원스톱 인테리어 솔루션.
            </p>
          </div>

          {/* 벤토 그리드 */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoRows: "minmax(180px, auto)" }}>
            {services.map((service, i) => {
              const Icon = iconMap[service.slug] || Building2;
              return (
                <Link
                  href={`/services/${service.slug}`}
                  key={service.slug}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500",
                    i === 0 && "sm:col-span-2 sm:row-span-2"
                  )}
                  style={i === 0 ? { gridRow: "span 2" } : undefined}
                >
                  {/* 배경 이미지 */}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className={cn(
                      "object-cover transition-all duration-700",
                      hoveredIndex === i ? "scale-110" : "scale-100"
                    )}
                  />

                  {/* 오버레이 그라데이션 */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-500",
                      hoveredIndex === i
                        ? "bg-gradient-to-t from-black/90 via-black/50 to-black/10"
                        : "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    )}
                  />

                  {/* 카테고리 뱃지 */}
                  <div className="absolute left-4 top-4 z-10">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md"
                      style={{ backgroundColor: `${service.color}CC` }}
                    >
                      {service.subtitle}
                    </span>
                  </div>

                  {/* 화살표 */}
                  <div
                    className={cn(
                      "absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-300",
                      hoveredIndex === i
                        ? "translate-x-0 translate-y-0 opacity-100"
                        : "translate-x-2 -translate-y-2 opacity-0"
                    )}
                  >
                    <ArrowUpRight className="size-4" />
                  </div>

                  {/* 콘텐츠 */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3
                          className={cn(
                            "font-bold text-white",
                            i === 0 ? "text-2xl md:text-3xl" : "text-lg"
                          )}
                        >
                          {service.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-1 font-medium text-white/60 transition-all duration-300",
                            hoveredIndex === i
                              ? "translate-y-0 opacity-100"
                              : "translate-y-2 opacity-0",
                            i === 0 ? "text-base" : "text-sm"
                          )}
                        >
                          {service.description}
                        </p>
                      </div>
                      <Icon
                        className={cn(
                          "shrink-0 text-white/20 transition-colors duration-300",
                          hoveredIndex === i && "text-white/50",
                          i === 0 ? "size-10" : "size-7"
                        )}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단: 핵심 수치 */}
      <div className="relative overflow-hidden bg-dark-bg py-20 md:py-24">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-12 text-center">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Track Record
            </h3>
            <p className="mt-2 text-2xl font-bold text-white md:text-3xl">
              숫자로 보는 타일마트
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-12 md:grid-cols-5 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06] transition-all group-hover:bg-primary/10 group-hover:ring-primary/20">
                  <stat.icon className="size-6 text-primary" />
                </div>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
