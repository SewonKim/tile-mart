import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Ruler, Clock, Banknote, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicPortfolioById, getAdjacentPortfolios } from "@/lib/actions/public";
import { PortfolioGallery } from "./gallery";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPublicPortfolioById(Number(id));
  if (!result) return {};
  return {
    title: `${result.portfolio.title} | 타일마트 시공사례`,
    description: result.portfolio.description,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolioId = Number(id);
  const result = await getPublicPortfolioById(portfolioId);
  if (!result) notFound();

  const { portfolio, images, tags } = result;
  const { prev, next } = await getAdjacentPortfolios(portfolioId);

  const imageUrls = images.map((img) => img.image_url);
  // 썸네일이 있고, 이미지 목록에 없으면 맨 앞에 추가
  if (portfolio.thumbnail_url && !imageUrls.includes(portfolio.thumbnail_url)) {
    imageUrls.unshift(portfolio.thumbnail_url);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Link
            href="/#portfolio"
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            시공사례 목록
          </Link>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {portfolio.service_name || (tags[0]?.name ?? "")}
          </span>
        </div>
      </div>

      {/* 히어로 이미지 */}
      <div className="relative h-[50vh] w-full md:h-[60vh]">
        <Image
          src={imageUrls[0] || portfolio.thumbnail_url || ""}
          alt={portfolio.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
          <div className="mx-auto max-w-[1400px]">
            <h1 className="text-3xl font-extrabold text-white md:text-5xl">
              {portfolio.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* 왼쪽: 상세 정보 */}
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-muted">
              {portfolio.description}
            </p>

            {/* 갤러리 */}
            {imageUrls.length > 0 && (
              <>
                <h2 className="mb-4 mt-12 text-xl font-bold">시공 사진</h2>
                <PortfolioGallery images={imageUrls} title={portfolio.title} />
              </>
            )}
          </div>

          {/* 오른쪽: 정보 카드 */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-muted-light p-6 ring-1 ring-border/50">
              <h3 className="mb-5 text-lg font-bold">프로젝트 정보</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">위치</p>
                    <p className="font-semibold">{portfolio.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Ruler className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">면적</p>
                    <p className="font-semibold">{portfolio.area}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Banknote className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">시공비</p>
                    <p className="font-semibold text-primary">{portfolio.cost}</p>
                  </div>
                </div>
                {portfolio.duration && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <Clock className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">시공 기간</p>
                      <p className="font-semibold">{portfolio.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.tag_id}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href="/#consultation"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                이런 공간 상담받기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 이전/다음 프로젝트 */}
      <div className="border-t border-border">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          {prev ? (
            <Link
              href={`/portfolio/${prev.portfolio_id}`}
              className="group flex items-center gap-4 border-b border-border px-6 py-8 transition-colors hover:bg-muted-light md:border-b-0 md:border-r lg:px-10"
            >
              <ChevronLeft className="size-5 text-muted transition-transform group-hover:-translate-x-1" />
              <div>
                <p className="text-xs text-muted">이전 프로젝트</p>
                <p className="mt-1 font-semibold">{prev.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/portfolio/${next.portfolio_id}`}
              className="group flex items-center justify-end gap-4 px-6 py-8 text-right transition-colors hover:bg-muted-light lg:px-10"
            >
              <div>
                <p className="text-xs text-muted">다음 프로젝트</p>
                <p className="mt-1 font-semibold">{next.title}</p>
              </div>
              <ChevronRight className="size-5 text-muted transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
