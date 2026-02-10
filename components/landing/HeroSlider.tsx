"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  category: string;
  title: string;
  location: string;
  area: string;
  cost: string;
  image: string;
}

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || slides.length === 0) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, slides.length]
  );

  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

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
