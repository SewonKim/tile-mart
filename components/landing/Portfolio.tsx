"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  category: string;
  title: string;
  location: string;
  area: string;
  cost: string;
  image: string;
}

export function Portfolio({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered =
    activeCategory === "전체"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* 섹션 헤더 */}
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-primary">
              PORTFOLIO
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">시공사례</h2>
            <p className="mt-3 text-muted">
              2,000건 이상의 시공 경험으로 완성한 공간들을 만나보세요
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            전체 보기 <ArrowRight className="size-4" />
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted-light text-muted hover:bg-border hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 프로젝트 그리드 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((project) => (
            <Link
              href={`/portfolio/${project.id}`}
              key={project.id}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/50 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                  <Eye className="size-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  {project.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {project.location} · {project.area}
                </p>
                <p className="mt-2 text-sm font-bold text-primary">
                  {project.cost}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
