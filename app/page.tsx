import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Products from "@/components/sections/Products";
import Timeline from "@/components/sections/Timeline";
import Certifications from "@/components/sections/Certifications";
import Blog from "@/components/sections/Blog";
import Footer from "@/components/sections/Footer";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <Philosophy />
        <Products />
        <Timeline />
        <Certifications />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
