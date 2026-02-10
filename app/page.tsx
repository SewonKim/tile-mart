import { Header } from "@/components/landing/Header";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { Portfolio } from "@/components/landing/Portfolio";
import { Services } from "@/components/landing/Services";
import { Consultation } from "@/components/landing/Consultation";
import { Footer } from "@/components/landing/Footer";
import {
  getFeaturedPortfolios,
  getPublicPortfolios,
  getPublicServices,
  getPublicTags,
} from "@/lib/actions/public";

export default async function Home() {
  const [featured, portfolios, services, tags] = await Promise.all([
    getFeaturedPortfolios(),
    getPublicPortfolios(),
    getPublicServices(),
    getPublicTags(),
  ]);

  // 히어로 슬라이더 데이터 변환
  const slides = featured.map((p) => ({
    id: p.portfolio_id,
    category: p.service_title || "",
    title: p.service_tagline || p.title,
    location: p.location,
    area: p.area,
    cost: p.cost,
    image: p.thumbnail_url || "",
  }));

  // 포트폴리오 목록 변환
  const projects = portfolios.map((p) => ({
    id: p.portfolio_id,
    category: p.service_name || "",
    title: p.title,
    location: p.location,
    area: p.area,
    cost: p.cost,
    image: p.thumbnail_url || "",
  }));

  // 카테고리 목록 (태그 이름)
  const categories = ["전체", ...tags.map((t) => t.name)];

  // 서비스 목록 변환
  const serviceItems = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    subtitle: s.subtitle,
    description: s.tagline,
    image: s.image_url || "",
    color: s.color,
  }));

  return (
    <>
      <Header />
      <main>
        <HeroSlider slides={slides} />
        <Portfolio projects={projects} categories={categories} />
        <Services services={serviceItems} />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
