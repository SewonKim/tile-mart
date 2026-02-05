"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    category: "사무실",
    title: "공간이 바뀌면,\n일이 달라집니다",
    location: "대구 수성구",
    area: "52평",
    cost: "4,200만원",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
  },
  {
    id: 2,
    category: "학원",
    title: "아이들의 집중력을\n높이는 공간 설계",
    location: "대구 달서구",
    area: "38평",
    cost: "3,100만원",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=1080&fit=crop",
  },
  {
    id: 3,
    category: "체육시설",
    title: "운동에 몰입할 수 있는\n최적의 환경",
    location: "대구 북구",
    area: "65평",
    cost: "5,800만원",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop",
  },
  {
    id: 4,
    category: "카페",
    title: "브랜드를 담은\n감각적인 공간",
    location: "대구 중구",
    area: "28평",
    cost: "2,600만원",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=1080&fit=crop",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* 배경 이미지 */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={s.image}
            alt={s.title.replace("\n", " ")}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      ))}

      {/* 콘텐츠 */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white/90">
              {slide.category}
            </span>
            <h1
              key={current}
              className="animate-fade-in-up whitespace-pre-line text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              {slide.title}
            </h1>
            <div
              key={`info-${current}`}
              className="animate-fade-in-up mt-8 flex flex-wrap items-center gap-4 text-white/80"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {slide.location}
              </span>
              <span className="text-white/40">|</span>
              <span>{slide.area}</span>
              <span className="text-white/40">|</span>
              <span className="font-semibold text-primary">
                {slide.cost}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 슬라이더 컨트롤 */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10">
          {/* 인디케이터 */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "h-[3px] rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-primary" : "w-4 bg-white/40"
                )}
              />
            ))}
            <span className="ml-3 text-sm text-white/60">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* 화살표 */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <div className="h-12 w-[1px] animate-pulse bg-white/30" />
      </div>
    </section>
  );
}
