import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, ArrowRight, Phone } from "lucide-react";
import { services, projects } from "@/lib/data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const service = services.find((s) => s.slug === slug);
    if (!service) return {};
    return {
      title: `${service.title} 인테리어 | 타일마트`,
      description: service.description,
    };
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const categoryMap: Record<string, string> = {
    office: "사무실",
    academy: "학원",
    fitness: "체육시설",
    residential: "주거",
    renovation: "환경개선",
    retail: "매장",
    fnb: "카페/음식점",
  };
  const relatedProjects = projects.filter(
    (p) => p.category === categoryMap[slug] || p.category === service.title
  );

  const currentIndex = services.findIndex((s) => s.slug === slug);
  const otherServices = services.filter((_, i) => i !== currentIndex);

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Link
            href="/#services"
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            하는일
          </Link>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: service.color }}
          >
            {service.subtitle}
          </span>
        </div>
      </div>

      {/* 히어로 */}
      <div className="relative h-[50vh] w-full md:h-[60vh]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
          <div className="mx-auto max-w-[1400px]">
            <span
              className="mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: `${service.color}CC` }}
            >
              {service.subtitle}
            </span>
            <h1 className="text-3xl font-extrabold text-white md:text-5xl">
              {service.title} 인테리어
            </h1>
            <p className="mt-2 text-lg text-white/70">{service.tagline}</p>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
        {/* 설명 */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{service.tagline}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {service.description}
          </p>
        </div>

        {/* 특징 리스트 */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2">
          {service.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-muted-light p-5 ring-1 ring-border/30"
            >
              <div
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${service.color}1A` }}
              >
                <Check className="size-3.5" style={{ color: service.color }} />
              </div>
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* 갤러리 */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">시공 갤러리</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {service.gallery.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={img}
                  alt={`${service.title} 갤러리 ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 관련 시공사례 */}
        {relatedProjects.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-bold">
              {service.title} 시공사례
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.id}`}
                  className="group overflow-hidden rounded-2xl ring-1 ring-border/50 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {project.location} · {project.area}
                    </p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {project.cost}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          className="mt-20 rounded-3xl p-10 text-center md:p-16"
          style={{ backgroundColor: `${service.color}0D` }}
        >
          <h2 className="text-2xl font-bold md:text-3xl">
            {service.title} 인테리어, 타일마트와 함께하세요
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            무료 현장 방문 상담부터 3D 견적, 시공, 사후관리까지 원스톱으로
            진행합니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#consultation"
              className="flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: service.color }}
            >
              무료 상담 신청
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="tel:0507-1497-0485"
              className="flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-semibold transition-colors hover:bg-muted-light"
            >
              <Phone className="size-4" />
              전화 상담
            </a>
          </div>
        </div>

        {/* 다른 서비스 */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">다른 서비스</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:-translate-y-1 hover:bg-muted-light"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: s.color }}
                >
                  {s.subtitle.slice(0, 2)}
                </div>
                <span className="text-sm font-semibold">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
