import { Header } from "@/components/landing/Header";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { Portfolio } from "@/components/landing/Portfolio";
import { Services } from "@/components/landing/Services";
import { Consultation } from "@/components/landing/Consultation";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <Portfolio />
        <Services />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
