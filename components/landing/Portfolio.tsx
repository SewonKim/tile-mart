"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["전체", "사무실", "학원", "체육시설", "카페/음식점", "매장", "주거"];

const projects = [
  {
    id: 1,
    category: "사무실",
    title: "IT 스타트업 오피스",
    location: "대구 수성구",
    area: "52평",
    cost: "4,200만원",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    category: "학원",
    title: "영어 전문 학원",
    location: "대구 달서구",
    area: "38평",
    cost: "3,100만원",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    category: "체육시설",
    title: "크로스핏 전문 센터",
    location: "대구 북구",
    area: "65평",
    cost: "5,800만원",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    category: "카페/음식점",
    title: "디저트 카페 브랜딩",
    location: "대구 중구",
    area: "28평",
    cost: "2,600만원",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    category: "매장",
    title: "패션 편집숍 리뉴얼",
    location: "대구 동구",
    area: "34평",
    cost: "2,900만원",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    category: "사무실",
    title: "법률사무소 인테리어",
    location: "대구 수성구",
    area: "45평",
    cost: "3,800만원",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop",
  },
  {
    id: 7,
    category: "주거",
    title: "신축 아파트 리모델링",
    location: "대구 달서구",
    area: "32평",
    cost: "3,500만원",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
  },
  {
    id: 8,
    category: "학원",
    title: "코딩 교육센터",
    location: "대구 수성구",
    area: "42평",
    cost: "3,400만원",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
  },
];

export function Portfolio() {
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
